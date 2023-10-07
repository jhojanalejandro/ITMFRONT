import { AfterContentChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { MatPaginator } from '@angular/material/paginator';
import { AssignmentUserComponent } from '../contractor-list/components/assigmentUser/assignment-user.component';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import Swal from 'sweetalert2';
import { ContractList } from 'app/modules/admin/pages/planing/models/planing-model';
import { ModuloEnum } from 'app/layout/common/enums/modulo-enum/modulo';
import { UploadFileContractComponent } from 'app/modules/admin/apps/file-manager/components/upload-file-contract/upload-file-contract.component';

@Component({
  selector: 'app-contracts-list-contarctual',
  styleUrls: ['./contracts-list.component.scss'],
  templateUrl: './contracts-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractListComponent implements OnInit, OnDestroy,AfterViewInit, AfterContentChecked {
  userName: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource = new MatTableDataSource<ContractList[]>();
  displayedColumns: string[] = ['numberProject', 'companyName', 'projectName', 'contractorsCant','isAssigmentUser','statusContract', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  contracts: ContractList[];
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
    { title: 'NUMERO CONTRATO', name: 'numberProject' },
    { title: 'NOMBRE EMPRESA', name: 'companyName' },
    { title: 'NOMBRE PROYECTO', name: 'projectName' },
    { title: 'CANTIDAD CONTRATISTAS', name: 'contractorsCant' },
    { title: 'CONVENIO', name: 'isAssigmentUser' },
    { title: 'ESTADO', name: 'statusContract' },
    { title: 'CONTRATISTAS', name: 'action' },
  ]
  ngOnInit(): void {
    this.getContractsData();
    this.userName = this.auth.accessName.toUpperCase();
  }

  navigateToContractors(data: any,origin: string) {
    this._router.navigate(['/dashboards/lista-contratistas/'+ data.id + '/' +data.projectName]);
  }

  uploadExcel() {
    this.permission = this.auth.validateRoll(CodeUser.RECRUITER,null);
    if(!this.permission){
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    }else{
      const dialogUpload = this._matDialog.open(UploadFileContractComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          show: true
        }
      });
      dialogUpload.afterClosed().subscribe((result) => {
        if (result) {
          this.getContractsData();
        }
      });
    }

  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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



 private getContractsData() {
    this._gerenicService.getAllContract(true, ModuloEnum.CONTARCTUAL)
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

  AsssigmentUser() {
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
        this.getContractsData();
      });
    }

  }

  navigateToContractorsPreNomina(data: any) {
    this._router.navigate(['/dashboards/pre-nomina-lista-contratistas/' + data.id + '/' +data.projectName]);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
