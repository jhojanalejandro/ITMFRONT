import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ViewChild,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {
    Componente,
    Elements,
} from 'app/modules/admin/pages/planing/models/planing-model';
import { DatePipe } from '@angular/common';
import { ContractContractors, ContractorPayment, PostContractual } from 'app/modules/admin/dashboards/contractual/models/contractor';
import { HistoryContractorComponent } from '../../history-contractor.component';
import { ContractorPaymentService } from 'app/modules/admin/dashboards/contractual/service/contractorPayment.service';

@Component({
    selector   : 'payment-list',
    styleUrls: ['./payment-list.component.scss'],
    templateUrl: './payment-list.component.html'
})
export class PaymentListComponent
{
    contractorId: string;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    contractorListId: any[] = [];
    contractorsList: ContractorPayment[] = [];
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    accountBalanceOptions: ApexOptions;
    dataSource = new MatTableDataSource<any>();
    idSelected: string[] = [];
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = [
        'fromDate',
        'toDate',
        'paymentCant',
        'consecutive',
        'projectName',
    ];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    datePipe: DatePipe;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
        private _contractorPayment: ContractorPaymentService,
        private router: ActivatedRoute,
        private _loadrouter: Router,
        private _guidesComponent: HistoryContractorComponent
    ) {
        this.datePipe = new DatePipe('es');
    }
    columnas = [
        { title: 'FECHA DESDE', name: 'fromDate' },
        { title: 'FECHA HASTA', name: 'toDate' },
        { title: 'PAGADO', name: 'paymentCant' },
        { title: 'PAGO NÚMERO', name: 'consecutive' },
        { title: 'CONVENIO', name: 'projectName' },
    ];

    ngOnInit(): void {
        this.contractorId = this.router.snapshot.paramMap.get('contractorId') || 'null';
        // Create the selected product form
        this.getDataContractor();
    }

    //metodo de filtrar los datos de las columnas
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    selectRowFull(data: any) {
        console.log(data);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        if (item != null) {
            return item.id || index;
        }
    }

    getDataContractor() {
        this._contractorPayment
            .getContractorPayments(this.contractorId)
            .subscribe((contractorsListResponse) => {
                if (contractorsListResponse.success) {
                    this.contractorsList = contractorsListResponse.data;
                    this.dataSource = new MatTableDataSource(
                        this.contractorsList
                    );
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: contractorsListResponse.message,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            });
    }

    reloadResolve() {
        const currentUrl: any = this._loadrouter.url;
        this._loadrouter
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this._loadrouter.navigateByUrl(currentUrl);
            });
    }

    historicalPayment(item: any) {
        this._loadrouter.navigate([
            '/dashboards/nomina/payment-contractor/' +
                this.contractorId +
                '/' +
                item.id,
        ]);
    }

    applyFilterByStatus(filterValue: any) {
        this.dataSource.filter = filterValue.value.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next(null);
        this._unsubscribe$.complete();
    }

    toggleDrawer(): void
    {
        this._guidesComponent.matDrawer.toggle();
    }
}
