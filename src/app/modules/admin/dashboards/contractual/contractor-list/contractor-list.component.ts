import { AfterContentChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModificacionFormComponent } from './components/modificacion-form/modificacion-form.component';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { ContractorService } from '../service/contractor.service';
import { MatPaginator } from '@angular/material/paginator';
import { ContractContractors, Contractor } from '../models/contractor';
import { NewnessContractorComponent } from './components/newness-contractor/newness-contractor.component';
import { Componente, Elements } from 'app/modules/admin/pages/planing/models/planing-model';
import { DatePipe } from '@angular/common';
import { ContractorDataHiringComponent } from './components/data-hiring-contractor/data-hiring-contractor.component';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { TermFileContractComponent } from './components/term-file-contract/term-file-contract.component';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { UploadFileContractComponent } from 'app/modules/admin/apps/file-manager/components/upload-file-contract/upload-file-contract.component';
import { DocumentTypeFileCodes } from 'app/layout/common/enums/document-type/document-type';
import { FileListManagerService } from 'app/modules/admin/apps/file-manager/services/list-file.service';
import JSZip from "jszip";
import { saveAs } from "file-saver";

@Component({
  selector: 'contractor-list',
  styleUrls: ['./contractor-list.component.scss'],
  templateUrl: './contractor-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorListComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  contractId: string;
  data: any;
  userName: any;
  value: any;
  generatePdfMinute: boolean;
  generatePdf: boolean;
  pdfType: string;
  disableElement: boolean = true;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  elements: Elements[];
  componentes: Componente[];
  contractorListId: any[] = [];
  contractorsList: Contractor[] = [];
  configForm: FormGroup;
  componentselectId: any;
  elementselectId: any;
  contractContractors: ContractContractors = { contractId: null, contractors: [], typeMinute: null };
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  idSelected: string[] = [];
  contractName: string;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'identificacion', 'nombre', 'correo', 'telefono', 'statusContractor', 'legalProccess', 'hiringStatus', 'comiteGenerated', 'previusStudy', 'minuteGnenerated', 'all','additional', 'acciones'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  visibleOption: boolean = false;
  datePipe: DatePipe;
  generateType: string;
  permission: boolean = false;
  statusContractor: any = GlobalConst.StatusContractor;
  typeStatusContractor: any = GlobalConst.TypeStatusContractor;
  statusSelected: any = GlobalConst.StatusContractor;
  statusContractorSelected: any = GlobalConst.StatusContractor;
  contractorSelected: Contractor | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private readonly _unsubscribe$ = new Subject<void>();
  selectedContracttorForm: FormGroup;
  showDetail: boolean = false;
  isRowSelected = (row: any) => row === this.contractorSelected;
  defaultRowIndex: number = 0; // Por ejemplo, asumamos que quieres que la primera fila sea la predeterminada

  constructor(
    private _contractorListService: ContractorService,
    private _genericService: GenericService,
    private _matDialog: MatDialog,
    private _authService: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private router: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _loadrouter: Router,
    private _fileService: FileListManagerService,
  ) {
    this.datePipe = new DatePipe('es');
  }
  columnas = [
    { title: 'NOMBRE', name: 'nombre' },
    { title: 'CEDULA', name: 'identificacion' },
    { title: 'CORREO', name: 'correo' },
    { title: 'TELEFONO', name: 'telefono' },
    { title: 'ESTADO', name: 'proccess' },
    { title: 'REGISTRO', name: 'statusContractor' },
    { title: 'JURIDICO', name: 'legalProccess' },
    { title: 'CONTRACTUAL', name: 'hiringStatus' },
    { title: 'MINUTA', name: 'minuteGnenerated' },
    { title: 'COMITE', name: 'comiteGenerated' },
    { title: 'ESTUDIO PREVIO', name: 'previusStudy' },
    { title: 'DETALLE', name: 'detail' },
    { title: '', name: 'all' },
    { title: 'OPCIONES', name: 'acciones' },
    { title: 'DETALLE', name: 'additional' }

  ]

  ngOnInit(): void {

    this.userName = this._authService.accessName
    this.contractId = this.router.snapshot.paramMap.get('id') || 'null';
    this.contractName = this.router.snapshot.paramMap.get('contractname') || 'null';

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

    this.getDataContractor(false);

    this.selectedContracttorForm = this._formBuilder.group({
      nombre: [''],
      identificacion: [''],
      lugarExpedicion: ['', [Validators.required]],
      fechaNacimiento: [''],
      direccion: [''],
      telefono: [''],
      celular: [''],
      correo: [''],
      proccess: [''],
      habilitado: ['']
    });

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
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }


  getDataContractor(origin: boolean) {
    this._contractorListService.getContractorByIdProject(this.contractId, origin).subscribe(contractorsListResponse => {
      if (contractorsListResponse.success) {
        this.contractorsList = contractorsListResponse.data.map(contractor => ({
          ...contractor,
          all: 'TODOS',
          additional: false
        }));
        this.dataSource = new MatTableDataSource(this.contractorsList);
        this.cdref.detectChanges();
      } else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: '',
          html: contractorsListResponse.message,
          showConfirmButton: false,
          timer: 2000
        });
      }
    });

  }
  isAllSelected() {
    if (this.selection.selected.length >= 1) {
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
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractorsList[0].assignmentUser);
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
            this.getDataContractor(false);
          }
          this.selection.clear();
        });
    }

  }

  SendMailsAccounts() {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractorsList[0].assignmentUser);
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
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractorsList[0].assignmentUser);
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
        this.contractorListId.push(element.id);
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
        idContractors: this.contractorListId,
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
        this.contractorListId = [];
      });

  }

  generarMinuta(data: any = null) {
    this.generateType = DocumentTypeFileCodes.MNT;
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
  generatedPdfContractor(data: any = null, type: string) {
    if (data != null) {
      this.contractContractors.contractors = [data.id];
    } else {
      this.selection.selected.forEach(element => {
        this.contractorListId.push(element.id);
      });
      this.contractContractors.contractors = this.contractorListId;
    }
    this.contractContractors.contractId = this.contractId
    this.generatePdf = true;
    this.generateType = type;

  }

  activateContarct() {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractorsList[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      this._genericService.UpdateStateContractFolder(this.contractId)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((resp) => {
          if (resp.success) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '',
              html: resp.message,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire('Error', 'Error al activar el contrato! a falta de información', 'error');
          }
        })
    }

  }

  uploadExcel() {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractorsList[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      const dialogUpload = this._matDialog.open(UploadFileContractComponent, {
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
    this.reloadResolve();
  }

  reloadResolve() {
    const currentUrl: any = this._loadrouter.url;
    this._loadrouter.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._loadrouter.navigateByUrl(currentUrl);
    });
  }

  historicalPayment(item: any) {
    this._loadrouter.navigate(['/dashboards/nomina/payment-contractor/' + this.contractId + '/' + item.id]);
  }

  addTermFileContract(contractor: any | null): void {
    this.permission = this._authService.validateRoll(CodeUser.RECRUITER, this.contractorsList[0].assignmentUser);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    } else {
      const dialogRef = this._matDialog.open(TermFileContractComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          onlyContractor: contractor != null ? true : false,
          contractor: contractor != null ? contractor.id : null,
          contractId: this.contractId,
        }
      });
      dialogRef.afterClosed()
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((result) => {
          if (result) {
            this.getDataContractor(false);
          }
          this.selection.clear();
        });
    }

  }

  changeTypeStatus(e: any) {
    this.statusContractorSelected = this.statusContractor.filter(f => f.value == e.value);
    this.statusSelected = this.typeStatusContractor.find(f => f.value == e.value);
    if (e.value == 5) {
      this.applyFilterByStatusSpecific('TODOS')
    }
  }
  applyFilterByStatus(filterValue: any) {
    this.dataSource.filter = filterValue.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterByStatusSpecific(filterValue: any) {
    filterValue = filterValue.value;
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (this.statusSelected.viewValue === 'JURIDICO') {
        return data.legalProccess.includes(filter);
      }
      if (this.statusSelected.viewValue === 'CONTRACTUAL') {
        return data.hiringStatus.includes(filter);
      }
      if (this.statusSelected.viewValue === 'REGISTRO') {
        return data.statusContractor.includes(filter);
      }
      if (this.statusSelected.viewValue === 'MINUTA') {
        return data.minuteGnenerated.includes(filter);
      }
      if (this.statusSelected.viewValue == 'COMITE') {
        return data.comiteGenerated.includes(filter);
      }
      if (this.statusSelected.viewValue == 'TODOS') {
        return data.comiteGenerated.includes(filter);
      }
    };
  }

  toggleDetails(contractor: any): void {
    // If the product is already selected...
    if (this.contractorSelected && this.contractorSelected.id === contractor.id) {
      // Close the details
      this.closeDetail();
      return;
    }
    this.contractorSelected = contractor;
    this.showDetail = true;

    this.selectedContracttorForm.patchValue(contractor);

    // Mark for check
    this.cdref.markForCheck();
  }

  closeDetail(): void {
    this.contractorSelected = null;
    this.showDetail = false;
  }

  getFilesFolder(typeFile: any) {
    this.selection.selected.forEach(element => {
      this.contractorListId.push(element.id);
    });
    this.contractContractors.contractors = this.contractorListId;
    this.contractContractors.contractId = this.contractId;
    this.contractContractors.typeMinute = typeFile;
    this._fileService.getFileDownload(this.contractContractors)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((Response: any) => {
        const jszip = new JSZip();
        for (let i = 0; i < Response.length; i++) {
          Response[i].filedata = 'data:application/pdf;base64,' + Response[i].filedata
          var binary = atob(Response[i].filedata.split(',')[1]);
          var array = [];
          for (let j = 0; j < binary.length; j++) {
            array.push(binary.charCodeAt(j));
          }
          let pdf = new Blob([new Uint8Array(array)], {
            type: 'application/pdf'
          });
          let contract = this.contractName;
          jszip.folder(typeFile).file(`${Response[i].filesName}.pdf`, pdf);
          if (i === (Response.length - 1)) {
            jszip.generateAsync({ type: 'blob' }).then(function (content) {
              // see FileSaver.js
              saveAs(content, typeFile + contract + '.zip');
            });
          }
        }
      })
  }

  toggleAdditionalRow(row: any) {
    // Cambiar el estado de showAdditionalRow para la fila específica
    row.additional = !row.additional;
  }
  isDefaultRow = (_: any, rowIndex: number) => {
    debugger
    // Lógica para determinar si esta es la fila predeterminada
    return rowIndex === this.defaultRowIndex;
  }
  

  isAdditionalRow = (_: any,row: any) => {
    debugger
    return row.additional; // Debe devolver true o false según corresponda
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }

}
