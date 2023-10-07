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
    Observable,
    Subject, takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.service';
import { SelectionModel } from '@angular/cdk/collections';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ContractFolders } from '../../planing/models/planing-model';
import { GeneralListService } from '../services/general-list.service';

@Component({
    selector: 'general-list-contract',
    templateUrl: './general-list-contract.component.html',
    styleUrls: ['./general-list-contract.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class GeneralListContractComponent
    implements OnInit, AfterViewInit, OnDestroy {
    selectContract: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['numberProject','project', 'companyName', 'projectName', 'contractorsCant', 'fechaContrato', 'fechaFinalizacion', 'valorContrato'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    registerDate = new Date();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    TotalCost: any;
    SubTotal: number;
    operatingExpenses: any;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: ContractFolders | null = null;
    tagsEditMode: boolean = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _generalService: GeneralListService,
        private _router: Router,
        private _liveAnnouncer: LiveAnnouncer,
    ) {

    }

    ngOnInit(): void {
        this.getContract();
    }
    columnas = [
        { title: 'NRO CONTRATO', name: 'numberProject' },
        { title: 'NRO PROYECTO', name: 'project' },
        { title: 'NOMBRE EMPRESA', name: 'companyName' },
        { title: 'NOMBRE PROYECTO', name: 'projectName' },
        { title: 'CANTIDAD CONTRATISTAS', name: 'contractorsCant' },
        { title: 'FECHA INICIO CONTRATO', name: 'fechaContrato' },
        { title: 'FECHA FIN CONTRATO', name: 'fechaFinalizacion' },
        { title: 'VALOR CONTRATO', name: 'valorContrato' },
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
        this._router.navigateByUrl("/docs/ecommerce/Componentes/" + data.id + '/'+ data.projectName);
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
    
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.columnsToDisplay, event.previousIndex, event.currentIndex);
    }

    private getContract(){
        this._generalService._projectList$
        .subscribe(response => {
            this.dataSource = new MatTableDataSource(
                response
            );
            this.dataSource.sort = this.sort;        
        });
    }
}
