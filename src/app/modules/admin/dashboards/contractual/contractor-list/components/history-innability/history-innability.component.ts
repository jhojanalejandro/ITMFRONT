import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { ContractorPaymentService } from '../../../service/contractorPayment.service';
import { ContractorPayment, NewnessContractor } from '../../../models/contractor';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApexOptions } from 'ng-apexcharts';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-history-innability',
  templateUrl: './history-innability.component.html',
  styleUrls: ['./history-innability.component.scss']
})

export class HistoryInnabilityComponent implements OnInit {
  contractorId: string;
  contractId: string;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  contractorsList: NewnessContractor[] = [];
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
      'consecutive',
      'registerDate',
      'newnessType',
      'newnessDescripcion',
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
      private _contractorPayment: ContractorPaymentService,
      private cdref: ChangeDetectorRef,
      public matDialogRef: MatDialogRef<HistoryInnabilityComponent>,
      @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) {}
  columnas = [
      { title: 'CONSECUTIVO', name: 'consecutive' },
      { title: 'FECHA REGISTRO', name: 'registerDate' },
      { title: 'TIPO', name: 'newnessType' },
      { title: 'DESCRIPCIÓN', name: 'newnessDescripcion' },
  ];

  ngOnInit(): void {
    if (this.datos != null) {
      this.contractorId = this.datos.id;
      this.contractId = this.datos.contractId;

    }  
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
          .GetNewnessContractor(this.contractorId,this.contractId)
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe((contractorsListResponse) => {
              if (contractorsListResponse.length > 0) {
                  this.contractorsList = contractorsListResponse;
                  this.dataSource = new MatTableDataSource(
                      this.contractorsList
                  );
                  this.cdref.detectChanges();
              } else {
                  Swal.fire({
                      position: 'center',
                      icon: 'warning',
                      title: '',
                      html: 'error al obtener la información',
                      showConfirmButton: false,
                      timer: 2000,
                  });
              }
          });
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

}

