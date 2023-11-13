import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ElementCardComponent } from '../element/element.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentesFormComponent } from './componentes-form/componentes-form.component';
import Swal from 'sweetalert2';
import { DialogChangePercentajeComponent } from './DialogChangePercentaje/DialogChangePercentaje.component';
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/service/upload-data.service';
import { ActividadFormComponent } from './actividad-form/actividad-form.component';
import { PlaningService } from '../service/planing.service';
import { ButtonsExportService } from 'app/layout/common/buttons-export/buttons-export.service';
import { Subject, takeUntil } from 'rxjs';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { AuthService } from 'app/core/auth/auth.service';
import { UploadFileContractComponent } from 'app/modules/admin/apps/file-manager/components/upload-file-contract/upload-file-contract.component';
import { ShareService } from 'app/layout/common/share-service/share-service.service';
import { RouteImageEnum } from 'app/layout/common/enums/route-image/route-image';

@Component({
    selector: 'components-card',
    styleUrls: ['./components.component.scss'],
    templateUrl: './components.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponentsComponent implements OnInit {
    tittle = 'Información';
    dataComponente: any = null;
    dataElemento: any;
    dataActividad: any = null;;
    abrirDivComponente: boolean = false;
    abrirDivElemento: boolean = false;
    abrirDivActivity: boolean = false;
    itmImageBase64: string = null;
    data: any;
    contractId: string = null;
    configForm: FormGroup;
    subTotal: number = 0;
    total: number = 0;
    resource: number = 0;
    contractorCant: number = 0;
    elementosCant: number = 0;
    componentCant: number = 0;
    activitiesCant: number = 0;
    permission: boolean = false;
    gastosOperativos: any = 0;
    porcentajeCalculo: number = 8;
    nuevoPorcentage: number = 0;
    totalCalculado: number = 0;
    projectName: string = '';
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _planingService: PlaningService,
        private _matDialog: MatDialog,
        private _contrtactService: UploadDataService,
        private _loadrouter: Router,
        private _formBuilder: FormBuilder,
        private _service: ButtonsExportService,
        private _authService: AuthService,
        private _shareService: ShareService
    ) {
        this.contractId = this.route.snapshot.params.id;
        if (this.contractId) {
            this.chargeData();
        }
    }
    ngOnInit(): void {
        this.projectName = this.route.snapshot.params.projectName;
        this.permission = this._authService.validateRoll(CodeUser.PLANEACION);
        if (!this.permission) {
            this.messagePermission()
        }
        this.getBase64Image();
    }


    abrirDivComponent(e: any) {
        this.tittle = 'Información Componente';
        this.abrirDivElemento = false;
        this.dataComponente = e;
        this.abrirDivComponente = true;
        this.abrirDivActivity = false;

        this.getActivity(e);
    }

    abrirDivElement(e: any) {
        this.tittle = 'Información Elemento';
        this.abrirDivComponente = false;
        this.dataElemento = e;
        this.abrirDivElemento = true;
        this.abrirDivActivity = false;

    }


    abrirDivActividad(e: any) {
        this.tittle = 'Información Actividad';
        this.abrirDivComponente = false;
        this.abrirDivElemento = false;
        this.dataActividad = e;
        this.abrirDivActivity = true;
    }

    chargeData() {
        this._planingService.getComponent(this.contractId).subscribe((response) => {
            if (response.length != 0) {
                this.data = response;
                this.totalesPlaneacion();
                this._changeDetectorRef.detectChanges();
            } else {
                Swal.fire(
                    '',
                    'Sin Información para mostrar',
                    'question'
                );
                // this._router.navigateByUrl('docs/ecommerce/cuadroEconomico');
            }
        });


    }

    totalesPlaneacion() {
        this.subTotal = 0;
        this.elementosCant = 0;
        this.componentCant = this.data.length;
        this.contractorCant = 0;
        this.activitiesCant = 0;
        this.elementosCant = 0;
        this.data.forEach((element) => {
            if (element.elementos.length >= 1) {
                element.elementos.forEach((item) => {
                    this.elementosCant++;
                    this.subTotal += item.valorTotal;
                    this.resource += element.recursos
                    this.contractorCant += item.cantidadContratistas
                });
            }
            if (element.activities.length >= 1) {
                element.activities.forEach((item) => {
                    this.activitiesCant++;
                    if (item.elementos.length >= 1) {
                        item.elementos.forEach((element) => {
                            this.resource += element.recursos
                            this.elementosCant++;
                            this.subTotal += element.valorTotal;
                            this.contractorCant += element.cantidadContratistas
                        })
                    }


                });
            }
        });
        this.gastosOperativos = this.subTotal * 0.08;
        this.total = this.gastosOperativos + this.subTotal;
        // this.gastosOperativos = (+this.gastosOperativos.toFixed(0)).toLocaleString();
        // this.total = (+this.total.toFixed(0)).toLocaleString()
        // this.subTotal = (+this.subTotal.toFixed(0)).toLocaleString();

    }

    changeCalculo(): void {
        const dialogRef = this._matDialog.open(DialogChangePercentajeComponent, {
            disableClose: true,
            autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((result) => {
            const newLocal = result === undefined || +result === 0;
            if (!newLocal) {
                this.porcentajeCalculo = +result;
                this.changePorcentaje();
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    changePorcentaje() {
        this.gastosOperativos = this.subTotal * this.porcentajeCalculo;
        this.total = this.gastosOperativos + this.subTotal;
    }

    addComponent() {
        if (!this.permission) {
            this.messagePermission();
        } else {
            const dialogRef = this._matDialog.open(ComponentesFormComponent, {
                disableClose: true,
                autoFocus: false,
                data: {
                    contractId: this.contractId,
                    show: true,
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this._planingService
                        .getComponent(this.contractId)
                        .subscribe((response) => {
                            this.data = response;
                            this._changeDetectorRef.detectChanges();
                        });
                    this.chargeData();
                }
            });
        }
    }

    addActividad() {
        if (!this.permission) {
            this.messagePermission();
        } else {
            if (this.dataComponente === null) {

                Swal.fire(
                    'Ei',
                    'Debes seleccionar un componente',
                    'question'
                );
            } else {
                const dialogRef = this._matDialog.open(ActividadFormComponent, {
                    disableClose: true,
                    autoFocus: false,
                    data: {
                        contractId: this.contractId,
                        idComponente: this.dataComponente.id,
                        show: true,
                    },
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        this._planingService
                            .getActivityById(this.contractId)
                            .subscribe((response) => {
                                this.data = response;
                                this._changeDetectorRef.detectChanges();
                            });
                        this.chargeData();
                    }
                });
            }
        }


    }

    addElements(e: string) {
        if (!this.permission) {
            this.messagePermission();
        } else {
            let componentId = null;
            let activityId = null;
            if (e === 'activity') {
                activityId = this.dataActividad.id;
                componentId = this.dataActividad.componentId
            } else {
                componentId = this.dataComponente.id
            }
            let elemento = { valorTotal: 0 }
            const dialogRef = this._matDialog.open(ElementCardComponent, {
                disableClose: true,
                autoFocus: false,
                data: {
                    elemento,
                    componentId: componentId,
                    activityId: activityId,
                    idElemento: null,
                    contractId: this.contractId,
                    edit: false
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                this._changeDetectorRef.detectChanges();
                if (result) {
                    this.chargeData();
                }
            });
        }

    }
    editElemento(elemento: any) {
        if (!this.permission) {
            this.messagePermission();
        } else {
            const dialogRef = this._matDialog.open(ElementCardComponent, {
                disableClose: true,
                autoFocus: false,
                data: {
                    elemento,
                    componentId: elemento.componentId,
                    activityId: elemento.activityId,
                    contractId: this.contractId,
                    edit: true
                }
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.chargeData();
                }
            });
        }

    }
    editComponent(componente: any) {
        if (!this.permission) {
            this.messagePermission();
        } else {
            const dialogRef = this._matDialog.open(ComponentesFormComponent, {
                disableClose: true,
                autoFocus: false,
                data: {
                    componente,
                    contractId: this.contractId
                }
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.chargeData();
                }
            });
        }

    }


    editActivity(activity: any) {
        if (!this.permission) {
            this.messagePermission();
        } else {
            const dialogRef = this._matDialog.open(ActividadFormComponent, {
                disableClose: true,
                autoFocus: false,
                data: {
                    activity,
                    contractId: this.contractId
                }
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.chargeData();
                }
            });
        }

    }

    openConfirmationDialog(): void {

        const dialogRef = this._fuseConfirmationService.open(
            this.configForm.value
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
            }
        });
    }
    guardarCalculo() {
        const saveCalculo: any = {
            id: this.contractId,
            contractorsCant: this.contractorCant,
            valorContrato: this.total,
            valorSubTotal: this.subTotal,
            gastosOperativos: this.gastosOperativos,
            recursos: this.resource
        };

        this._contrtactService.UpdateCostContractFolder(saveCalculo)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((res) => {
                if (res.success) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        html: 'Información Registrada Exitosamente!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

            }, (response) => {
                console.log(response);

                Swal.fire('Error', 'Error al Registrar la informacion', 'error');
            });

    }

    private getActivity(e: any) {
        this._planingService.getAllActivity(e.id)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((response) => {
                if (response.length != 0) {
                    this.dataActividad = response;
                    this._changeDetectorRef.detectChanges();
                }
            });
    }
    reloadResolve() {
        const currentUrl: any = this._loadrouter.url;
        this._loadrouter.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this._loadrouter.navigateByUrl(currentUrl);
        });
    }

    deleteComponent(componente: any) {
        if (!this.permission) {
            this.messagePermission();
        } else {
            this._planingService.deleteComponent(componente.id)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((response) => {
                    if (response.success) {
                        Swal.fire(
                            {
                                position: 'center',
                                icon: 'success',
                                title: '',
                                html: 'Información Elimina Exitosamente!',
                                showConfirmButton: false,
                                timer: 1500
                            }
                        );
                        this.reloadResolve();
                    } else {
                        Swal.fire(
                            'Error!',
                            'Algo sucedio, vuelve a intentarlo!',
                            'error'
                        );
                    }
                });
        }

    }

    deleteActivity(activity: any) {
        if (!this.permission) {
            this.messagePermission();
        } else {
            this._planingService.deleteActivity(activity.id)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((response) => {
                    if (response.success) {
                        Swal.fire(
                            {
                                position: 'center',
                                icon: 'success',
                                title: '',
                                html: 'Información Elimina Exitosamente!',
                                showConfirmButton: false,
                                timer: 1500
                            }
                        );
                        this.reloadResolve();
                    }
                });
        }

    }

    deleteConfirmationDialog(component: any,typeDelete: string): void {
        this.configForm = this._formBuilder.group({
            title: 'Eliminar '+typeDelete,
            message: '¿Está seguro de que deseas eliminar el componente?  <span class="font-medium">¡Esta acción no se puede deshacer!</span>',
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
                    label: 'Cancelar'
                })
            }),
            dismissible: true
        });
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                if(typeDelete == 'Componente'){
                    this.deleteComponent(component);
                }else{
                    this.deleteActivity(component);
                }
            }
        });
    }

    exportarElementos() {
        this._service.getElementsContract(this.contractId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(
                (res) => {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "EXPORTAR ELEMENTOS";
                    link.click();
                    if (res) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Elementos descargado.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                },
                (response) => {
                    console.log(response);

                    Swal.fire('', 'error al exportar los elementos', 'error');
                }
            );
    }


    uploadExcel() {
        if (!this.permission) {
            this.messagePermission();
        } else {
            const dialogUpload = this._matDialog.open(UploadFileContractComponent, {
                disableClose: true,
                autoFocus: false,
                data: {
                    origin: 'element',
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

    private messagePermission() {
        Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
    }

    generateEconomicTable() {
        this._service.generateEconomicTable(this.contractId, this.itmImageBase64)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(
                (res) => {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "Reporte";
                    link.click();
                    if (res) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Documento descargado.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                },
                (response) => {
                    console.log(response);
                    Swal.fire('', 'Error al descargar la informacion!', 'error');
                }
            );
    }

    private getBase64Image() {
        this._shareService.loadAndConvertImageToBase64(RouteImageEnum.LOGOITM)
            .then(base64Data => {
                this.itmImageBase64 = base64Data;
                
            })
            .catch(error => {
                console.error('Error al cargar y convertir la imagen:', error);
            });
    }


    ngOnDestroy(): void {
        this._unsubscribe$.next(null);
        this._unsubscribe$.complete();
    }

}
