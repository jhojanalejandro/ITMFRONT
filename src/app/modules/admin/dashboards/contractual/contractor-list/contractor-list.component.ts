import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.service';
import { ContractorService } from '../service/contractor.service';
import { MatPaginator } from '@angular/material/paginator';
import { ContractContractors, Contractor } from '../models/contractor';
import { NewnessContractorComponent } from '../../share-components/newness-contractor/newness-contractor.component';
import {
    Componente,
    Elements,
} from 'app/modules/admin/pages/planing/models/planing-model';
import { DatePipe } from '@angular/common';
import { ContractorDataHiringComponent } from './components/data-hiring-contractor/data-hiring-contractor.component';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { TermFileContractComponent } from '../../share-components/term-file-contract/term-file-contract.component';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { UploadFileContractComponent } from 'app/modules/admin/apps/file-manager/components/upload-file-contract/upload-file-contract.component';
import { DocumentTypeFileCodes } from 'app/layout/common/enums/document-type/document-type';
import { FileListManagerService } from 'app/modules/admin/apps/file-manager/services/list-file.service';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { EntityHealth } from 'app/modules/admin/apps/home-contractor/models/mater.model';
import { ModificacionFormComponent } from '../../share-components/modificacion-form/modificacion-form.component';
import { HistoryInnabilityComponent } from './components/history-innability/history-innability.component';

@Component({
    selector: 'contractor-list',
    styleUrls: ['./contractor-list.component.scss'],
    templateUrl: './contractor-list.component.html',
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('dexpanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
})
export class ContractorListComponent
    implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked
{
    contractId: string;
    data: any;
    userName: any;
    generatePdfMinute: boolean;
    generatePdf: boolean;
    pdfType: string;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    elements: Elements[];
    componentes: Componente[];
    contractorListId: any[] = [];
    contractorsList: Contractor[] = [];
    configForm: FormGroup;
    componentselectId: any;
    elementselectId: any;
    contractContractors: ContractContractors = {
        contractId: null,
        contractors: [],
        typeMinute: null,
    };
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    accountBalanceOptions: ApexOptions;
    dataSource = new MatTableDataSource<any>();
    idSelected: string[] = [];
    contractName: string;
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = [
        'select',
        'identificacion',
        'nombre',
        'statusContractor',
        'legalProccess',
        'hiringStatus',
        'comiteGenerated',
        'previusStudy',
        'minuteGnenerated',
        'acciones',
        'all',
    ];
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
    expandedRow: any | null = null;
    columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    expandedEmpty = {
        nombre: null,
        correo: null,
        telefono: null,
        fechaNacimiento: null,
        direccion: null,
        celular: null,
        gender: null,
        nacionality: null,
        expeditionPlace: null,
        contractValue: null,
        habilitado: null,
        identificacion: null,
        lugarExpedicion: null,
        elementId: null,
        componentId: null,
        legalProccess: null,
        hiringStatus: null,
        initialDateContract: null,
        finalDateContract: null,
        cantDays: 0,
        bankEntity: null,
        cdp: null,
        level: null,
        eps: null,
        arl: null,
        afp: null,
        contract: null
    };
    eps: EntityHealth[] = [];
    arl: EntityHealth[] = [];
    afp: EntityHealth[] = [];
    expandedElement: Contractor = this.expandedEmpty;
    isButtonClicked: boolean = false;

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
        private _fileService: FileListManagerService
    ) {
        this.datePipe = new DatePipe('es');
    }
    columnas = [
        { title: 'NOMBRE', name: 'nombre' },
        { title: 'CEDULA', name: 'identificacion' },
        { title: 'REGISTRO', name: 'statusContractor' },
        { title: 'JURIDICO', name: 'legalProccess' },
        { title: 'CONTRACTUAL', name: 'hiringStatus' },
        { title: 'MINUTA', name: 'minuteGnenerated' },
        { title: 'COMITE', name: 'comiteGenerated' },
        { title: 'ESTUDIO PREVIO', name: 'previusStudy' },
        { title: '', name: 'all' },
        { title: 'OPCIONES', name: 'acciones' },
    ];

    ngOnInit(): void {
        this.getentityHealth();
        this.userName = this._authService.accessName;
        this.contractId = this.router.snapshot.paramMap.get('id') || 'null';
        this.contractName =
            this.router.snapshot.paramMap.get('contractname') || 'null';
        // Create the selected product form

        this.selectedContracttorForm = this._formBuilder.group({
            expeditionPlace: new FormControl(null),
            correo: new FormControl(null),
            telefono: new FormControl(null),
            direccion: new FormControl(null),
            fechaNacimiento: new FormControl(null),
            cdp: new FormControl(null),
            level: new FormControl(null),
            reserved: new FormControl(null),
            contractValue: new FormControl(null),
            cantDays: new FormControl(null),
            bankEntity: new FormControl(null),
            nacionality: new FormControl(null, Validators.required),
            arl: new FormControl(null, Validators.required),
            eps: new FormControl(null, Validators.required),
            afp: new FormControl(null),
            contract: new FormControl(null),
          });

        this.configForm = this._formBuilder.group({
            title: 'Eliminar Registro',
            message:
                '¿Estás seguro de que desea eliminar este contacto de forma permanente? <span class="font-medium">Esta acción no se puede deshace!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Eliminar',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancelar',
                }),
            }),
            dismissible: true,
        });

        this.getDataContractor();
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

    getDataContractor() {
        this._contractorListService
            .getContractorsByIdProject(this.contractId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((contractorsListResponse) => {
                if (contractorsListResponse.success) {
                    this.contractorsList = contractorsListResponse.data.map(
                        (contractor) => ({
                            ...contractor,
                            all: 'TODOS',
                            expanded: false,
                        })
                    );

                    this.dataSource = new MatTableDataSource(
                        this.contractorsList
                    );
                    this.cdref.detectChanges();
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: contractorsListResponse.message,
                        showConfirmButton: false,
                        timer: 2000,
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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.Id + 1
        }`;
    }

    openConfirmationDelete(element: any): void {
        this.permission = this._authService.validateRoll(
            CodeUser.RECRUITER,
            this.contractorsList[0].assignmentUser
        );
        if (!this.permission) {
            Swal.fire(
                '',
                'No tienes permisos de modificar Información!',
                'warning'
            );
        } else {
            const dialogRef = this._matDialog.open(NewnessContractorComponent, {
                disableClose: true,
                autoFocus: false,
                data: {
                    id: null,
                    contractId: this.contractId,
                    contractorId: element.id,
                },
            });
            dialogRef
                .afterClosed()
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
        this.permission = this._authService.validateRoll(
            CodeUser.RECRUITER,
            this.contractorsList[0].assignmentUser
        );
        if (!this.permission) {
            Swal.fire(
                '',
                'No tienes permisos de modificar Información!',
                'warning'
            );
        } else {
            for (
                let index = 0;
                index < this.selection.selected.length;
                index++
            ) {
                this.idSelected[index] = this.selection.selected[index].id;
            }
            let ids: any = {
                contractId: this.contractId,
                contractorsId: this.idSelected,
                userId: this._authService.accessId,
            };
            this._contractorListService
                .sendmailsAccounts(ids)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((Response) => {
                    if (Response) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Invitaciones enviadas exitosamente!',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                    this.reloadResolve();
                });
        }
    }

    modificacionContrato(data: any) {
        this.permission = this._authService.validateRoll(
            CodeUser.RECRUITER,
            this.contractorsList[0].assignmentUser
        );
        if (!this.permission) {
            Swal.fire(
                '',
                'No tienes permisos de modificar Información!',
                'warning'
            );
        } else {
            const dialogModificacion = this._matDialog.open(
                ModificacionFormComponent,
                {
                    width: '900px',
                    disableClose: true,
                    autoFocus: false,
                    data: {
                        idUser: this._authService.accessId,
                        data,
                        contractId: this.contractId,
                    },
                }
            );
            dialogModificacion
                .afterClosed()
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
            data = {
                id: null,
                contractId: null,
                componentId: null,
                elementId: null,
            };
            this.selection.selected.forEach((element) => {
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
                assignmentUser: data.assignmentUser,
            },
        });
        dialogRef
            .afterClosed()
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
            this.selection.selected.forEach((element) => {
                this.contractContractors.contractors.push(element.id);
            });
        }
        this.contractContractors.contractId = this.contractId;
        this.generatePdfMinute = true;
    }
    generatedPdfContractor(data: any = null, type: string) {
        if (data != null) {
            this.contractContractors.contractors = [data.id];
        } else {
            this.selection.selected.forEach((element) => {
                this.contractorListId.push(element.id);
            });
            this.contractContractors.contractors = this.contractorListId;
        }
        this.contractContractors.contractId = this.contractId;
        this.generatePdf = true;
        this.generateType = type;
    }

    activateContarct() {
        this.permission = this._authService.validateRoll(
            CodeUser.RECRUITER,
            this.contractorsList[0].assignmentUser
        );
        if (!this.permission) {
            Swal.fire(
                '',
                'No tienes permisos de modificar Información!',
                'warning'
            );
        } else {
            this._genericService
                .UpdateStateContractFolder(this.contractId)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((resp) => {
                    if (resp.success) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: resp.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        Swal.fire(
                            'Error',
                            'Error al activar el contrato! a falta de información',
                            'error'
                        );
                    }
                });
        }
    }

    uploadExcel() {
        this.permission = this._authService.validateRoll(
            CodeUser.RECRUITER,
            this.contractorsList[0].assignmentUser
        );
        if (!this.permission) {
            Swal.fire(
                '',
                'No tienes permisos de modificar Información!',
                'warning'
            );
        } else {
            const dialogUpload = this._matDialog.open(
                UploadFileContractComponent,
                {
                    disableClose: true,
                    autoFocus: false,
                    data: {
                        origin: 'cdp',
                        contractId: this.contractId,
                        show: true,
                    },
                }
            );
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
        this._loadrouter
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this._loadrouter.navigateByUrl(currentUrl);
            });
    }

    historicalPayment(item: any) {
        this._loadrouter.navigate([
            '/dashboards/nomina/payment-contractor/' +
                this.contractId +
                '/' +
                item.id,
        ]);
    }

    addTermFileContract(contractor: any | null): void {
        this.permission = this._authService.validateRoll(
            CodeUser.RECRUITER,
            this.contractorsList[0].assignmentUser
        );
        if (!this.permission) {
            Swal.fire(
                '',
                'No tienes permisos de modificar Información!',
                'warning'
            );
        } else {
            const dialogRef = this._matDialog.open(TermFileContractComponent, {
                disableClose: true,
                autoFocus: false,
                data: {
                    type: 'DCCT',
                    onlyContractor: contractor != null ? true : false,
                    contractor: contractor != null ? contractor.id : null,
                    contractId: this.contractId,
                },
            });
            dialogRef
                .afterClosed()
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((result) => {
                    if (result) {
                        this.getDataContractor();
                    }
                    this.selection.clear();
                });
        }
    }

    changeTypeStatus(e: any) {
        this.statusContractorSelected = this.statusContractor.filter(
            (f) => f.value == e.value
        );
        this.statusSelected = this.typeStatusContractor.find(
            (f) => f.value == e.value
        );
        if (e.value == 5) {
            this.applyFilterByStatusSpecific('TODOS');
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
        if (this.expandedRow === contractor) {
            // Si ya está expandida, ocultarla
            this.expandedRow = null;
        } else {
            // Mostrar la fila de formulario para la fila actual
            this.expandedRow = contractor;
        }
    }

    closeDetail(): void {
        this.contractorSelected = null;
        this.showDetail = false;
    }

    getFilesFolder(typeFile: any) {
        this.selection.selected.forEach((element) => {
            this.contractorListId.push(element.id);
        });
        this.contractContractors.contractors = this.contractorListId;
        this.contractContractors.contractId = this.contractId;
        this.contractContractors.typeMinute = typeFile;
        this._fileService
            .getFileDownload(this.contractContractors)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((Response: any) => {
                const jszip = new JSZip();
                for (let i = 0; i < Response.length; i++) {
                    Response[i].filedata =
                        'data:application/pdf;base64,' + Response[i].filedata;
                    var binary = atob(Response[i].filedata.split(',')[1]);
                    var array = [];
                    for (let j = 0; j < binary.length; j++) {
                        array.push(binary.charCodeAt(j));
                    }
                    let pdf = new Blob([new Uint8Array(array)], {
                        type: 'application/pdf',
                    });
                    let contract = this.contractName;
                    jszip
                        .folder(typeFile)
                        .file(`${Response[i].filesName}.pdf`, pdf);
                    if (i === Response.length - 1) {
                        jszip
                            .generateAsync({ type: 'blob' })
                            .then(function (content) {
                                // see FileSaver.js
                                saveAs(content, typeFile + contract + '.zip');
                            });
                    }
                }
            });
    }

    isDefaultRow = (_: any, rowIndex: any) => {
        console.log(rowIndex);
        // Lógica para determinar si esta es la fila predeterminada
        return rowIndex.expanded; // Debe devolver true o false según corresponda
    };
    isFormRow = (index: number, item: any) => {
        console.log('isFormRow called:', item.showForm);
        return item.showForm;
    };

    toggleRowExpansion(element: any): void {
        if (!this.isButtonClicked) {
            this.expandedElement =
                this.expandedElement === element ? this.expandedEmpty : element;
            if (this.expandedElement.fechaNacimiento != null) {
                this.expandedElement.fechaNacimiento =
                this._genericService.getTransformDate(
                    this.expandedElement.fechaNacimiento
                );
            }
            if(this.expandedElement != null){
                this.selectedContracttorForm.patchValue({
                    expeditionPlace: this.expandedElement.expeditionPlace,
                    correo: this.expandedElement.correo,
                    telefono: this.expandedElement.telefono,
                    direccion: this.expandedElement.direccion,
                    fechaNacimiento: this.expandedElement.fechaNacimiento,
                    cdp: this.expandedElement.cdp,
                    level: this.expandedElement.level,
                    reserved: null,
                    contractValue: this.expandedElement.contractValue,
                    cantDays: this.expandedElement.cantDays,
                    bankEntity: this.expandedElement.bankEntity,
                    nacionality: this.expandedElement.nacionality,
                    arl:this.expandedElement.arl,
                    eps: this.expandedElement.eps,
                    afp: this.expandedElement.afp,
                    contract: this.expandedElement.contract
                  });

            }

            if (this.expandedElement.contractValue != null) {
                this.expandedElement.contractValue =
                    this._genericService.addCommasToNumber(
                        this.expandedElement.contractValue
                    );
                // Convierte las cadenas en objetos de fecha
                const date1 = new Date(
                    this.expandedElement.initialContractDate
                );
                const date2 = new Date(this.expandedElement.finalContractDate);
                if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
                    // Calcula la diferencia en milisegundos
                    const diferenciaEnMilisegundos =
                        date2.getTime() - date1.getTime();
                    // Convierte la diferencia en días
                    this.expandedElement.cantDays = Math.floor(
                        diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)
                    );
                }
            }
        }
        this.isButtonClicked = false; // Restablece la variable después de cada clic en la fila
    }

    private getentityHealth() {
        this._genericService
            .getEmptityHealthList()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((response: EntityHealth[]) => {
                if (response != null) {
                    this.afp = response.filter((f) => f.code === 'AFP');
                    this.eps = response.filter((f) => f.code === 'EPS');
                    this.arl = response.filter((f) => f.code === 'ARL');
                }
            });
    }

    // private getCdp() {
    //     this._genericService.getCpcType()
    //         .pipe(takeUntil(this._unsubscribe$))
    //         .subscribe((response) => {
    //             this.cpcType = response;
    //         }, (response) => {
    //             // Set the alert
    //             console.log(response);

    //             swal.fire('', 'Error al registrar la información!', 'error');
    //         });
    // }

    histtoryInnability(data: any) {

        const dialogRef = this._matDialog.open(HistoryInnabilityComponent, {
            width: '100%',
            disableClose: true,
            autoFocus: false,
            data: {
                idUser: this._authService.accessId,
                contractId: this.contractId,
                id: data.id,
                statusContractor: data.statusContractor,
                assignmentUser: data.assignmentUser,
            },
        });
        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((result) => {
                if (result) {
                    this.reloadResolve();
                }
                this.selection.clear();
                this.contractorListId = [];
            });
    }
    ngOnDestroy(): void {
        this._unsubscribe$.next(null);
        this._unsubscribe$.complete();
    }
}
