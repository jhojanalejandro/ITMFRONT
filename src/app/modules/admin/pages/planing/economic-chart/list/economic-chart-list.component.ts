import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {
    Subject, takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { EconomicChartService } from '../../service/economic-chart.service';
import {
    InventoryCategory,
    InventoryPagination,
    EconomicChart,
    Components,
} from '../economic-chart.types';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { SelectionModel } from '@angular/cdk/collections';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'economic-chart-list',
    templateUrl: './economic-chart-list.component.html',
    styleUrls: ['./economic-chart-list.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class EconomicChartListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    selectContract: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatSort) sort!: MatSort;
    contracts: any;
    @ViewChild(MatTable) table!: MatTable<any>;
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['numberProject', 'companyName', 'projectName', 'contractorsCant', 'fechaContrato', 'fechaFinalizacion', 'action'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    registerDate = new Date();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    componentList: Components[] = [
        {
            id: '0',
            cantDay: 0,
            componentName: '',
            contractorCant: 0,
            totalValue: 0,
            unitValue: 0,
            listElements: [
                {
                    id: 0,
                    elemento: '',
                    contractorCant: 0,
                    cantDay: 0,
                    totalValue: 0,
                    unitValue: 0,
                },
            ],
        },
    ];
    TotalCost: any;
    SubTotal: number;
    operatingExpenses: any;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: EconomicChart | null = null;
    economicChartForm: FormGroup;
    tagsEditMode: boolean = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _economicService: EconomicChartService,
        private _genericService: GenericService,
        private _router: Router,
        private _liveAnnouncer: LiveAnnouncer,
    ) {
        this.contracts = this._economicService._economicsChart$;
        this.dataSource = new MatTableDataSource(
            this.contracts.source._value
        );
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.economicChartForm = this._formBuilder.group({
            id: [''],
            empresa: new FormControl(null, Validators.required),
            requiere: [''],
            operatingExpenses: [''],
            contrctorsCant: [''],
            cost: [''],
            percentage: new FormControl('8', Validators.required),
            price: [''],
            subTotal: [''],
            thumbnail: [''],
            images: [[]],
            active: [false],
        });
        this.getContractsData();

    }
    columnas = [
        { title: 'NRO CONTRATO', name: 'numberProject' },
        { title: 'NOMBRE EMPRESA', name: 'companyName' },
        { title: 'NOMBRE PROYECTO', name: 'projectName' },
        { title: 'CANTIDAD CONTRATISTAS', name: 'contractorsCant' },
        { title: 'FECHA INICIO CONTRATO', name: 'fechaContrato' },
        { title: 'FECHA FIN CONTRATO', name: 'fechaFinalizacion' },
        { title: '', name: 'action' },
    ]
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    addComponent(data: any) {
        this._router.navigateByUrl("/docs/ecommerce/Componentes/" + data.id);
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }
    /**
 * Track by function for ngFor loops
 *
 * @param index
 * @param item
 */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    getContractsData() {
        for (let index = 0; index < this.contracts.source._value.length; index++) {
            this._genericService.getDetalleContrato(this.contracts.source._value[index].id, false).subscribe((resp: any) => {
                this.contracts.source._value[index].fechaContrato = resp.fechaContrato;
                this.contracts.source._value[index].fechaFinalizacion = resp.fechaFinalizacion;
            })
        }
    }
    
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.columnsToDisplay, event.previousIndex, event.currentIndex);
    }
}
