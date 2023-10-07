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

@Component({
  selector: 'app-cpc-list',
  styleUrls: ['./cpc-list.component.scss'],
  templateUrl: './cpc-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CpcListComponent implements OnInit, OnDestroy {
  data: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['cpcNumber', 'cpcName', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  contracts: any;
  permission: boolean = false;

  constructor(
    private _gerenicService: GenericService,
    private _matDialog: MatDialog,
    private auth: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private _router: Router
  ) {
  }
  columnas = [
    { title: 'NUMERO CPC', name: 'cpcNumber' },
    { title: 'NOMBRE CPC', name: 'cpcName' },
    { title: 'OPCIÓN', name: 'action' },
  ]
  ngOnInit(): void {
    this.getCpcpList();
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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.recentTransactionsTableMatSort;
  }



 private getCpcpList() {
    this._gerenicService.getCpcType()
    .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource(Response);
        this.dataSource.sort = this.sort;
        this.dataSource.data = Response;
        this.contracts = Response;
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

  Addcpc(cpc: any) {
    this.permission = this.auth.validateRoll(CodeUser.SUPERVISORAREAC);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos para asignar contratos!', 'warning');
    }else{
      const dialogUpload = this._matDialog.open(AssignmentUserComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          contracts: this.contracts
        }
      });
      dialogUpload.afterClosed().subscribe((result) => {
        if (result) {
          this.getCpcpList();
        }
      });
    }

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
