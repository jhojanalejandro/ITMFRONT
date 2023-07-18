import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModificacionFormComponent } from './components/modificacion-form/modificacion-form.component';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { ContractorService } from '../service/contractor.service';
import { MatPaginator } from '@angular/material/paginator';
import { ContractContractors } from '../models/contractor';
import { NewnessContractorComponent } from './components/newness-contractor/newness-contractor.component';
import { Componente, Elements } from 'app/modules/admin/pages/planing/models/planing-model';
import { DatePipe } from '@angular/common';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { ContractorDataHiringComponent } from './components/data-hiring-contractor/data-hiring-contractor.component';
import { ContractorPaymentRegisterComponent } from './components/payroll-register/contractor-payment-register.component';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { TermFileContractComponent } from './components/term-file-contract/term-file-contract.component';

@Component({
  selector: 'contractor-list',
  styleUrls: ['./contractor-list.component.scss'],
  templateUrl: './contractor-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorListComponent implements OnInit, OnDestroy {
  contractId: string;
  data: any;
  userName: any;
  value: any;
  generatePdfMinute: boolean;
  generatePdf: boolean;
  pdfType: string;
  disableElement: boolean = true;
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  elements: Elements[];
  componentes: Componente[];
  listId: any[] = [];
  contractors: any;
  configForm: FormGroup;
  componentselectId: any;
  elementselectId: any;
  contractContractors: ContractContractors = { contractId: null, contractors: [] };
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  idSelected: string[] = [];
  contractname: string;
  origin: string;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'nombre', 'identificacion', 'correo', 'telefono', 'fechaNacimiento', 'hiringStatus', 'statusContractor', 'legalProccess', 'acciones'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  enterAnimationDuration: any = '2000ms';
  exitAnimationDuration: string = '1500ms';
  visibleOption: boolean = false;
  datePipe: DatePipe;
  generateType: string;
  permission: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
    private _contractorListService: ContractorService,
    private _genericService: GenericService,
    private _matDialog: MatDialog,
    private _authService: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private router: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _loadrouter: Router
  ) {
    this.getDataContractor();
    this.datePipe = new DatePipe('es');
  }
  columnas = [
    { title: 'NOMBRE', name: 'nombre' },
    { title: 'CEDULA', name: 'identificacion' },
    { title: 'CORREO', name: 'correo' },
    { title: 'TELEFONO', name: 'telefono' },
    { title: 'FECHA NACIMIENTO', name: 'fechaNacimiento' },
    { title: 'ESTADO', name: 'proccess' },
    { title: 'REGISTRO', name: 'statusContractor' },
    { title: 'JURIDICO', name: 'legalProccess' },
    { title: 'CONTRACTUAL', name: 'hiringStatus' },
    { title: 'OPCIONES', name: 'acciones' }
  ]

  ngOnInit(): void {

    this.userName = this._authService.accessName
    this.contractId = this.router.snapshot.paramMap.get('id') || 'null';
    this.contractname = this.router.snapshot.paramMap.get('contractname') || 'null';
    this.origin = this.router.snapshot.paramMap.get('origin') || 'null';

    this.configForm = this._formBuilder.group({
      title: 'Eliminar Registro',
      message: '¿Estás seguro de que desea eliminar este contacto de forma permanente? <span class="font-medium">Esta acción no se puede deshace!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Eliminar',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancelar'
        })
      }),
      dismissible: true
    });
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
    this.contractors = this._contractorListService._contractors$;
    this.dataSource = new MatTableDataSource(
      this.contractors.source._value
    );
  }
  isAllSelected() {
    if (this.selection.selected.length > 1) {
      this.visibleOption = true;
    } else {
      this.visibleOption = false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);

  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
  }

  //metodo que obtiene las columnas seleccionadas de la grid
  selectRow($event: any, dataSource: any) {
    if ($event.checked) {
      this.value = dataSource;
    }
  }

  openConfirmationDelete(element: any): void {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractors.source._value[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      const dialogRef = this._matDialog.open(NewnessContractorComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          id: null,
          contractId: this.contractId,
          contractorId: element.id,
        }
      });
      dialogRef.afterClosed()
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((result) => {
          if (result) {
            this.getDataContractor();
          }
          this.selection.clear();
        });
    }

  }

  SendMailsAccounts() {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractors.source._value[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      for (let index = 0; index < this.selection.selected.length; index++) {
        this.idSelected[index] = this.selection.selected[index].id
      }
      let ids: any = { 'contractId': this.contractId, 'contractorsId': this.idSelected, 'userId': this._authService.accessId }
      this._contractorListService.sendmailsAccounts(ids)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((Response) => {
          if (Response) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '',
              html: 'Invitaciones enviadas exitosamente!',
              showConfirmButton: false,
              timer: 1500
            });
          }
          this.reloadResolve();
        });
    }


  }

  modificacionContrato(data: any) {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractors.source._value[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      const dialogModificacion = this._matDialog.open(ModificacionFormComponent, {
        width: '900px',
        disableClose: true,
        autoFocus: false,
        data: {
          idUser: this._authService.accessId,
          data,
          contractId: this.contractId
        }
      });
      dialogModificacion.afterClosed()
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((result) => {
          if (result) {
            this.reloadResolve();
          }
        });
    }

  }
  registrarDatosContratacion(data: any) {
    if (data == null) {
      data = { id: null, contractId: null, componentId: null, elementId: null }
      this.selection.selected.forEach(element => {
        this.listId.push(element.id);
      });
    }
    const dialogRef = this._matDialog.open(ContractorDataHiringComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        idUser: this._authService.accessId,
        contractId: this.contractId,
        id: data.id,
        componentId: data.componentId,
        elementId: data.elementId,
        activityId: data.activityId,
        idContractors: this.listId,
        statusContractor: data.statusContractor,
        assignmentUser: data.assignmentUser
      }
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.reloadResolve();
        }
        this.selection.clear();
        this.listId = [];
      });

  }

  generarMinuta(data: any = null) {
    if (data != null) {
      this.contractContractors.contractors = [data.id];
    } else {
      this.selection.selected.forEach(element => {
        this.contractContractors.contractors.push(element.id);
      });
    }
    this.contractContractors.contractId = this.contractId
    this.generatePdfMinute = true;

  }
  generarEstudiosPrevios(data: any = null, type: string) {
    this.contractContractors.contractors = [data.id];
    this.contractContractors.contractId = this.contractId
    this.generatePdf = true;
    this.generateType = type;

  }

  activateContarct() {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractors.source._value[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      this._genericService.UpdateStateContractFolder(this.contractId)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((resp) => {
          if (resp) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '',
              html: 'Contrato activado exitosamente!',
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire('Error', 'Error al activar el contrato! a falta de información', 'error');
          }
        },
          (response) => {
            // Set the alert
            console.log(response);

            Swal.fire('Error', 'Error al activar el contrato!', 'error');
          })
    }

  }

  uploadExcel() {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractors[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      const dialogUpload = this._matDialog.open(UploadFileComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          origin: 'cdp',
          contractId: this.contractId,
          show: true,
        }
      });
      dialogUpload.afterClosed().subscribe((result) => {
        if (result) {
          this.reloadResolve();
        }
      });
    }

  }

  pdfGenerated(e: boolean) {
    this.generatePdf = e;
    this.generatePdfMinute = e;

  }

  reloadResolve() {
    const currentUrl: any = this._loadrouter.url;
    this._loadrouter.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._loadrouter.navigateByUrl(currentUrl);
    });
  }

  registerPayment(data: any) {
    if (this.selection.selected.length > 0 || data != null) {
      if (data == null) {
        data = { id: 0, contractId: null, componenteId: null, elementId: null }
        this.selection.selected.forEach(element => {
          this.listId.push(element.id);
        });
      }
      const dialogRefPayment = this._matDialog.open(ContractorPaymentRegisterComponent, {
        width: '900px',
        disableClose: true,
        autoFocus: false,
        data: {
          idUser: this._authService.accessId,
          id: data.id,
          nombre: data.nombre,
          idContractors: this.listId,
          contractId: this.contractId
        }
      });
      dialogRefPayment.afterClosed().subscribe((result) => {
        if (result) {
          this.getDataContractor();
        }
        this.listId = [];
      });
    } else {
      Swal.fire('', 'Debes seleccionar registros!', 'warning');

    }
  }
  historicalPayment(item: any) {
    this._loadrouter.navigate(['/dashboards/nomina/payment/Contractor/' + this.contractId + '/' + item.id]);
  }

  addTermFileContract(): void {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractors.source._value[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      const dialogRef = this._matDialog.open(TermFileContractComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          contractId: this.contractId,
        }
      });
      dialogRef.afterClosed()
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((result) => {
          if (result) {
            this.getDataContractor();
          }
          this.selection.clear();
        });
    }

  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
