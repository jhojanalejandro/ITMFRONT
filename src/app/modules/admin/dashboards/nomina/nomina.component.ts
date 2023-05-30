import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {  Router } from '@angular/router';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { UploadDataService } from '../contractual/service/upload-data.service';
import { GenericService } from '../../generic/generic.services';
@Component({
  selector: 'nomina',
  styleUrls: ['./nomina.component.css'],
  templateUrl: './nomina.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NominaComponent implements OnInit, OnDestroy {
  selectContract: any;
  data: any;
  userName: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['numberProject','companyName', 'projectName','contractorCant', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  constructor(
    private _genericService: GenericService,
    private auth: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private _router: Router
  ) {
  }
  columnas = [
    { title: 'NUMERO CONTRATO', name: 'numberProject' },
    { title: 'NOMBRE EMPRESA', name: 'companyName' },
    { title: 'NOMBRE PROYECTO', name: 'projectName' },
    { title: 'CANTIDAD CONTRATISTAS', name: 'contractorCant' },
    // {title: 'REVISADO', name: 'done'},
    { title: 'ACCIONES', name: 'action' },
  ]
  ngOnInit(): void {
    this.getContractsData();
    this.userName = this.auth.accessName.toUpperCase();
  }

  showFiles(data: any) {
    return this._router.navigate(['/dashboards/nomina/documentos/'+ data.id]);
  }
  contractorList( data: any){
    return  this._router.navigate(['/dashboards/nomina/lista/contratistas/' + data.id]);

  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  //metodo para animmación de columnas, para que se puedan mover de manera horizontal 
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnsToDisplay, event.previousIndex, event.currentIndex);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  //metodo de filtrar los datos de las columnas
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.dataSource.sort = this.recentTransactionsTableMatSort;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  selectRowFull(data: any, type: any) {
    if (type === 'register') {
    }
  }

  getContractsData() {
    // Get the data
    this._genericService.getAllContract(true, 'Nomina').pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource(Response);
        Response.forEach(element => {
          element.contractorCant =0;
        });
        this.dataSource.sort = this.sort;
        this.dataSource.data = Response;
      });
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



}
