import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.service';
import { MatPaginator } from '@angular/material/paginator';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import Swal from 'sweetalert2';
import { AssignmentUserComponent } from 'app/modules/admin/dashboards/contractual/contractor-list/components/assigmentUser/assignment-user.component';
import { MaintainerRegisterComponent } from '../maintainer-register/maintainer-register.component';

@Component({
  selector: 'app-banks-list',
  styleUrls: ['./banks-list.component.scss'],
  templateUrl: './banks-list.component.html',
})
export class BanksListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [ 'bankName', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  permission: boolean = false;

  constructor(
    private _gerenicService: GenericService,
    private _matDialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
  ) {
  }
  columnas = [
    // { title: 'IDENTIFICADOR', name: 'id' },
    { title: 'NOMBRE BANCO', name: 'bankName' },
    { title: 'OPCIÓN', name: 'action' },
  ]
  ngOnInit(): void {
    this.getBanksList();
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
    this.dataSource.sort = this.recentTransactionsTableMatSort;
  }



 private getBanksList() {
    this._gerenicService.getBanksContract()
    .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource(Response);
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


  formRegister(cpc: any){
    const dialogRef = this._matDialog.open(MaintainerRegisterComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
          cpc,
          type: 'bank'
      },
  });
  dialogRef
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
          if (result) {

          }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
