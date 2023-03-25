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
import { EconomicChartService } from '../../service/economic-chart.service';
import { ElementCardComponent } from '../element/element.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentesFormComponent } from './componentes-form/componentes-form.component';
import Swal from 'sweetalert2';
import { DialogChangePercentajeComponent } from './DialogChangePercentaje/DialogChangePercentaje.component';
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/service/upload-data.service';
import { ActividadFormComponent } from './actividad-form/actividad-form.component';
import { Activity } from '../../models/activity';

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
    abrirDivComponente: boolean = false;
    abrirDivElemento: boolean = false;
    data: any;
    activities: Activity[] = [];
    id: string = null;
    configForm: FormGroup;
    subTotal: number = 0;
    total: number = 0;
    contractorCant: number = 0;
    elementosCant: number = 0;
    gastosOperativos: number = 0;
    porcentajeCalculo: number = 8;
    nuevoPorcentage: number = 0;
    totalCalculado: number = 0;
    constructor(
        private route: ActivatedRoute,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _Economicservice: EconomicChartService,
        private _matDialog: MatDialog,
        private _contrtactService: UploadDataService,
    ) {
        this.id = this.route.snapshot.params.id;
        if (this.id) {
            this.chargeData();
        }
    }

    abrirDivComponent(e: any) {
        this.tittle = 'Información Componente';
        this.abrirDivElemento = false;
        this.dataComponente = e;
        this.abrirDivComponente = true;
        this.getActivity();
    }

    abrirDivElement(e: any) {
        this.tittle = 'Información Elemento';
        this.abrirDivComponente = false;
        this.dataElemento = e;
        this.abrirDivElemento = true;
    }

    ngOnInit(): void { }

    chargeData() {
        this._Economicservice.getComponent(this.id).subscribe((response) => {
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
        this.gastosOperativos = this.subTotal * 0.08;
        this.total = this.gastosOperativos + this.subTotal;
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
                this._Economicservice
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
                    this._Economicservice
                        .getComponent(this.id)
                        .subscribe((response) => {
                            this.data = response;
                            this._changeDetectorRef.detectChanges();
                        });
                    this.chargeData();
                }
            });
        }

    }

    addElements() {
        let elemento = { valorTotal: 0 }
        const dialogRef = this._matDialog.open(ElementCardComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                elemento,
                idComponente: this.dataComponente.id,
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
        this._contrtactService.UpdateCostProjectFolder(registerProject).subscribe((res) => {
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
            Swal.fire('Error', 'Error al Registrar la informacion', 'error');
        });
    }

    private getActivity() {
        this._Economicservice.getActivity(this.dataComponente.id).subscribe((response) => {
            if (response.length != 0) {
                this.activities = response;
                this._changeDetectorRef.detectChanges();
            }
        });
    }
}
