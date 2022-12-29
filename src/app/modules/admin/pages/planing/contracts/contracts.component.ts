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
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/contracts-list/upload-data.service';
import { UploadFileComponent } from 'app/modules/admin/dashboards/contractual/upload-file/upload-file.component';
import { RegisterProjectFolderComponent } from '../register-project-folder/register-project-folder.component';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import swal from 'sweetalert2';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['companyName', 'projectName', 'budget', 'contractCant', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  /**
   * Constructor
   */
  constructor(
    private _uploadData: UploadDataService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _genericService: GenericService,
    private _matDialog: MatDialog,
    private auth: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private _router: Router,
    private _formBuilder: FormBuilder,

  ) {
  }
  columnas = [
    { title: 'NOMBRE EMPRESA', name: 'companyName' },
    { title: 'NOMBRE PROYECTO', name: 'projectName' },
    { title: 'PRESUPUESTO', name: 'budget' },
    { title: 'CANTIDAD CONTRATISTA', name: 'contractCant' },
    { title: '', name: 'action' },
  ]
  ngOnInit(): void {
    this.getContractsData();
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

  }

  openDialog(route: any, data: any) {
    //this.validateDinamycKey();
    switch (route) {
      case 'registerFolder':
        const dialogRefPrroject = this._matDialog.open(RegisterProjectFolderComponent);
        dialogRefPrroject.afterClosed().subscribe(datos => {
          if (datos) {
            this.getContractsData();
          }
        });
        break
      case 'editData':
        const dialogRef = this._matDialog.open(RegisterProjectFolderComponent, {
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
      case 'upload':
        const dialogUpload = this._matDialog.open(UploadFileComponent, {
          autoFocus: false,
          data: {
            show: true
          }
        });
        dialogUpload.afterClosed().subscribe((result) => {
          if (result) {

          }
        });
        break
      case 'registerData':
        this._router.navigate(['/dashboards/lista-contratistas/' + data.id]);

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

  /**
   * On init
   */

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
    this._genericService.getAllContract(false).pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Response) => {
        this.dataSource = new MatTableDataSource(Response);
        for (let index = 0; index < Response.length; index++) {
          if (Response[index].budget < 0 || Response[index].budget == null) {
            Response[index].budget = 0;
          }
          if (Response[index].contractCant < 0 || Response[index].contractCant == null) {
            Response[index].contractCant = 0;
          }
          this._genericService.getDetalleContrato(Response[index].id, false).subscribe((response: any) => {
            if (response) {
              Response[index].fechaContrato = response.fechaContrato;
              Response[index].fechaFinalizacion = response.fechaFinalizacion
            }
          });

        }
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

  openConfirmationDelete(element: any): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._uploadData.DeleteContract(element.id).subscribe((res) => {
          if (res) {
            swal.fire('Bien', 'informacion Eliminada Exitosamente!', 'success');
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