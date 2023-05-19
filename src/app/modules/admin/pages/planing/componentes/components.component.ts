import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
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
import { Activity } from '../models/planing-model';
import { PlaningService } from '../service/planing.service';

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

    data: any;
    id: string = null;
    configForm: FormGroup;
    subTotal: number = 0;
    total: number = 0;
    contractorCant: number = 0;
    elementosCant: number = 0;
    gastosOperativos: any = 0;
    porcentajeCalculo: number = 8;
    nuevoPorcentage: number = 0;
    totalCalculado: number = 0;
    projectName: string = '';

    constructor(
        private route: ActivatedRoute,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _planingService: PlaningService,
        private _matDialog: MatDialog,
        private _contrtactService: UploadDataService,
    ) {
        this.id = this.route.snapshot.params.id;
        if (this.id) {
            this.chargeData();
        }
    }
    ngOnInit(): void { 
        this.projectName = this.route.snapshot.params.projectName;
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
        this._planingService.getComponent(this.id).subscribe((response) => {
            if (response.length != 0) {
                this.data = response;
                this.totalesPlaneacion();
                this._changeDetectorRef.detectChanges();
            } else {
                Swal.fire(
                    'Ei',
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
        this.data.forEach((element) => {
            if (element.elementos.length >= 1) {
                element.elementos.forEach((item) => {
                    this.elementosCant++;
                    this.subTotal += item.valorTotal;
                    this.contractorCant += item.cantidadContratistas
                });
            }
        });
        this.data.forEach((element) => {
            if (element.activities.length >= 1) {
                element.activities.forEach((item) => {
                    if(item.elementos.length >= 1){
                        item.elementos.forEach((element) =>{
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

    openDialog(): void {
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
        const dialogRef = this._matDialog.open(ComponentesFormComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                idContrato: this.id,
                show: true,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._planingService
                    .getComponent(this.id)
                    .subscribe((response) => {
                        this.data = response;
                        this._changeDetectorRef.detectChanges();
                    });
                this.chargeData();
            }
        });
    }

    addActividad() {
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
                    idContrato: this.id,
                    idComponente: this.dataComponente.id,
                    show: true,
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this._planingService
                        .getActivityById(this.id)
                        .subscribe((response) => {
                            this.data = response;
                            this._changeDetectorRef.detectChanges();
                        });
                    this.chargeData();
                }
            });
        }

    }

    addElements(e: string) {
        let componentId = null;
        let activityId = null;
        if(e === 'activity'){
            activityId = this.dataActividad.id;
            componentId = this.dataActividad.componentId
        }else{
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
                idContrato: this.id,
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
    editElemento(elemento: any) {
        const dialogRef = this._matDialog.open(ElementCardComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                elemento,
                idComponente: elemento.idComponente,
                idElemento: elemento.id,
                idContrato: this.id,
                edit: true
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.chargeData();
            }
        });
    }
    editComponent(componente: any) {
        const dialogRef = this._matDialog.open(ComponentesFormComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                componente,
                idContrato: this.id
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.chargeData();
            }
        });
    }

    editActivity(activity: any) {
        const dialogRef = this._matDialog.open(ActividadFormComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                activity,
                idContrato: this.id
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.chargeData();
            }
        });
    }

    openConfirmationDialog(): void {
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(
            this.configForm.value
        );

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
            }
        });
    }
    guardarCalculo() {
        const registerProject: any = {
            id: this.id,
            contractorsCant: this.contractorCant,
            valorContrato: this.total,
            valorSubTotal: this.subTotal,
            gastosOperativos: this.gastosOperativos,
        };

        this._contrtactService.UpdateCostContractFolder(registerProject).subscribe((res) => {
            if (res) {
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
        this._planingService.getActivity(e.id).subscribe((response) => {
            if (response.length != 0) {
                this.dataActividad = response;
                this._changeDetectorRef.detectChanges();
            }
        });
    }
}
