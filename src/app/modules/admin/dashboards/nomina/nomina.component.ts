import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {  Router } from '@angular/router';
import { GenericService } from '../../generic/generic.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'nomina',
  styleUrls: ['./nomina.component.css'],
  templateUrl: './nomina.component.html',
})
export class NominaComponent implements OnInit, OnDestroy {
  selectContract: any;
  data: any;
  userName: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['numberProject','companyName', 'projectName','contractorsCant', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _genericService: GenericService,
    private auth: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private _router: Router
  ) {
  }
  columnas = [
    { title: 'NÚMERO CONTRATO', name: 'numberProject' },
    { title: 'NOMBRE EMPRESA', name: 'companyName' },
    { title: 'NOMBRE PROYECTO', name: 'projectName' },
    { title: 'CANTIDAD CONTRATISTAS', name: 'contractorsCant' },
    // {title: 'REVISADO', name: 'done'},
    { title: 'ACCIONES', name: 'action' },
  ]
  ngOnInit(): void {
    this.getContractsData();
    this.userName = this.auth.accessName.toUpperCase();
  }

  showFiles(data: any) {
    return this._router.navigate(['/dashboards/nomina/documentos/'+data.id]);
  }
  navigateToContractorListPayroll(data: any){
    return  this._router.navigate(['/dashboards/nomina/lista-contratistas/' + data.id +'/' +data.projectName]);

  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  //metodo de filtrar los datos de las columnas
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  getContractsData() {
    // Get the data
    this._genericService.getAllContract(true, 'NOMINA').pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource(Response);
        Response.forEach(element => {
          element.contractorCant =0;
        });
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
