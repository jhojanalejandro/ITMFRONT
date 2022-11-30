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
import { MatSort } from '@angular/material/sort';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { EconomicChartService } from '../economic-chart.service';
import {
    InventoryCategory,
    InventoryPagination,
    EconomicChart,
    Components,
} from '../economic-chart.types';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'economic-chart-list',
    templateUrl: './economic-chart-list.component.html',
    styleUrls: ['./economic-chart-list.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class EconomicChartListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    registerDate = new Date();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    projectData$: any;
    displayedColumns: string[] = [
        'actions',
        'companyName',
        'projectName',
        'descriptionProject',
        'fechaContrato',
        'fechaFinalizacion',
    ];
    dataSource: MatTableDataSource<any>;

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
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _economicService: EconomicChartService,
        private authService: AuthService,
        private _router: Router,
    ) {
        this.projectData$ = this._economicService._economicsChart$;
        this.dataSource = new MatTableDataSource(
            this.projectData$.source._value
        );
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
    }

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

    private calculateCost() {
        this.SubTotal = 0;
        this.TotalCost = 0;
        this.operatingExpenses = 0;
        for (var i = 0; i < this.componentList.length; i++) {
            let subt = this.componentList[i].totalValue + this.SubTotal;
            this.SubTotal = subt;
        }
        let porcentaje = 0;
        switch (this.economicChartForm.value.percentage) {
            case '1':
                porcentaje = 0.01;
                break;
            case '2':
                porcentaje = 0.02;
                break;
            case '3':
                porcentaje = 0.03;
                break;
            case '4':
                porcentaje = 0.04;
                break;
            case '5':
                porcentaje = 0.05;
                break;
            case '6':
                porcentaje = 0.06;
                break;
            case '7':
                porcentaje = 0.07;
                break;
            case '8':
                porcentaje = 0.08;
                break;
            case '9':
                porcentaje = 0.09;
                break;
        }
        this.operatingExpenses = porcentaje * this.SubTotal;

        this.TotalCost = this.SubTotal + this.operatingExpenses;
        this._changeDetectorRef.markForCheck();
    }
    async addProjectFolder() {
        if (this.economicChartForm.value.ejecucion == 'Ejecutar Contrato') {
            this.economicChartForm.value.ejecucion = true;
        } else {
            this.economicChartForm.value.ejecucion = false;
        }
        const registerProject: any = {
            userId: this.authService.accessId,
            companyName: this.economicChartForm.value.companyName,
            projectName: this.economicChartForm.value.projectName,
            descriptionProject: this.economicChartForm.value.description,
            registerDate: this.registerDate,
            modifyDate: this.registerDate,
            execution: this.economicChartForm.value.ejecucion,
            budget: 0,
            contractCant: 0,
            cpc: '',
            nombreCpc: '',
            activate: false,
        };
        this._economicService.addEconomicChart(registerProject).subscribe(
            (res) => {
                if (res) {
                    swal.fire(
                        'informacion Registrada Exitosamente!',
                        '',
                        'success'
                    );
                    //this.matDialogRef.close();
                    this._changeDetectorRef.detectChanges();
                    this._changeDetectorRef.markForCheck();
                }
            },
            (response) => {
                this.economicChartForm.enable();
                // Set the alert
                swal.fire('Error al Registrar la informacion!', '', 'error');
                // Show the alert
            }
        );
    }

    deleteComponent(componente: any) {
        debugger;
        this._economicService.DeleteComponent(componente.id).subscribe(
            (res) => {
                if (res) {
                    swal.fire(
                        'informacion Eliminada Exitosamente!',
                        '',
                        'success'
                    );
                }
                this._changeDetectorRef.detectChanges();
            },
            (response) => {
                // Set the alert
                swal.fire('Error al Eliminar la informacion!', '', 'error');
            }
        );
    }
}
