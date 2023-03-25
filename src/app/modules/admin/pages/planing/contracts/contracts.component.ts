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
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/service/upload-data.service';
import { RegisterProjectFolderComponent } from '../components/register-project-folder/register-project-folder.component';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import swal from 'sweetalert2';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { EconomicChartService } from '../service/economic-chart.service';

@Component({
  selector: 'contracts',
  styleUrls: ['./contracts.component.css'],
  templateUrl: './contracts.component.html'
})
export class ContrtactsComponent implements OnInit, OnDestroy {
  selectContract: any;
  data: any;
  userName: any;
  configForm: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  contracts: any;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['numberProject', 'companyName', 'projectName', 'valorContrato', 'contractorsCant', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _uploadData: UploadDataService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _genericService: GenericService,
    private _economicService: EconomicChartService,
    private _matDialog: MatDialog,
    private auth: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private _formBuilder: FormBuilder,

  ) {
    this.contracts = this._economicService._economicsChart$;
    this.dataSource = new MatTableDataSource(
        this.contracts.source._value
    );
    this.dataSource.sort = this.sort;
  }
  columnas = [
    { title: 'NÚMERO CONTRATO', name: 'numberProject' },
    { title: 'NOMBRE EMPRESA', name: 'companyName' },
    { title: 'NOMBRE PROYECTO', name: 'projectName' },
    { title: 'VALOR CONTRATO', name: 'valorContrato' },
    { title: 'CANTIDAD CONTRATISTA', name: 'contractorsCant' },
    { title: '', name: 'action' },
  ]
  ngOnInit(): void {
    this.userName = this.auth.accessName.toUpperCase();
    this.configForm = this._formBuilder.group({
      title: 'Remove contact',
      message: 'Are you sure you want to remove this contact permanently? <span class="font-medium">This action cannot be undone!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel'
        })
      }),
      dismissible: true
    });
    this.getContractsData();

  }

  openDialog(route: any, data: any) {
    //this.validateDinamycKey();
    switch (route) {
      case 'registerFolder':
        const dialogRefProject = this._matDialog.open(RegisterProjectFolderComponent,  { 
          disableClose: true,
          autoFocus: false,
         });
        dialogRefProject.afterClosed().subscribe(datos => {
          if (datos) {
            this.getContractsData();
          }
        });
        break
      case 'editData':
        const dialogRef = this._matDialog.open(RegisterProjectFolderComponent, {
          disableClose: true,
          autoFocus: false,
          data: {
            data
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.getContractsData();
          }
        });
        break
    }
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
    for (let index = 0; index < this.contracts.source._value.length; index++) {
      if (this.contracts.source._value[index].valorContrato === 0 || this.contracts.source._value[index].valorContrato === null) {
        this.contracts.source._value[index].valorContrato = 0;
      }
      if (this.contracts.source._value[index].contractorsCant === 0 || this.contracts.source._value[index].contractorsCant === null) {
        this.contracts.source._value[index].contractorsCant = 0;
      }
      this._genericService.getDetalleContrato(this.contracts.source._value[index].id, false).subscribe((response: any) => {
        if (response) {
          this.contracts.source._value[index].fechaContrato = response.fechaContrato;
          this.contracts.source._value[index].fechaFinalizacion = response.fechaFinalizacion
        }
      });

    }
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

  openConfirmationDelete(element: any): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._uploadData.DeleteContract(element.id).subscribe((res) => {
          if (res) {
            swal.fire({
              position: 'center',
              icon: 'success',
              title: '',
              html: 'Información Eliminada Exitosamente!',
              showConfirmButton: false,
              timer: 1500
            });
          }
          this.getContractsData();
        },
          (response) => {
            console.log(response);
            swal.fire('Error', 'Error al Eliminar la informacion!', 'error');
          });
      }
    });
  }

} 