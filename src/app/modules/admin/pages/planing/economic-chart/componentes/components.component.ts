import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { EconomicChartService } from '../economic-chart.service';
import { ElementCardComponent } from '../element/element.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentesFormComponent } from './componentes-form/componentes-form.component';
import Swal from 'sweetalert2';
import { DialogChangePercentajeComponent } from './DialogChangePercentaje/DialogChangePercentaje.component';

@Component({
    selector: 'components-card',
    styleUrls: ['./components.component.scss'],
    templateUrl: './components.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponentsComponent implements OnInit {
    tittle = 'Información';
    dataComponente: any;
    dataElemento: any;
    abrirDivComponente: boolean = false;
    abrirDivElemento: boolean = false;
    data: any;
    id: string = null;
    configForm: FormGroup;
    subTotal: number = 0;
    total: number = 0;
    gastosOperativos: number = 0;
    porcentajeCalculo: number = 8;
    nuevoPorcentage: number = 0;
    constructor(
        private route: ActivatedRoute,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _Economicservice: EconomicChartService,
        private _matDialog: MatDialog,
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
    }

    abrirDivElement(e: any) {
        this.tittle = 'Información Elemento';
        this.abrirDivComponente = false;
        this.dataElemento = e;
        console.log(this.dataElemento);
        this.abrirDivElemento = true;
    }

    ngOnInit(): void {}

    chargeData() {
        this._Economicservice.getComponent(this.id).subscribe((response) => {
            if (response.length != 0) {
                this.data = response;
                this.totalesPlaneacion();
                this._changeDetectorRef.detectChanges();
            } else {
                Swal.fire(
                    'Sin Información para mostrar',
                    'Primero Agregue componentes para poder visualizar información',
                    'question'
                );
                // this._router.navigateByUrl('docs/ecommerce/cuadroEconomico');
            }
        });
    }

    totalesPlaneacion() {
        this.data.forEach((element) => {
            if (element.elementos.length >= 1) {
                element.elementos.forEach((item) => {
                    this.subTotal = this.subTotal + item.valorTotal;
                });
            }
        });
        this.gastosOperativos = this.subTotal * 0.08;
        this.total = this.gastosOperativos + this.subTotal;
    }

    openDialog(): void {
        const dialogRef = this._matDialog.open(DialogChangePercentajeComponent);
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
        this.subTotal = (this.subTotal * 0.0+this.porcentajeCalculo);
    }

    addComponent() {
        let e = this.id;
        const dialogRef = this._matDialog.open(ComponentesFormComponent, {
            autoFocus: false,
            data: {
                e,
                show: true,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if(result){
                this._Economicservice
                .getComponent(this.id)
                .subscribe((response) => {
                    this.data = response;
                });
            }

        });
    }

    addElements() {
        let ids : any = {'idComponente': this.dataComponente.id, 'idContrato': this.id}
        const dialogRef = this._matDialog.open(ElementCardComponent, {
            autoFocus: false,
            data: ids,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    editElemento(elemento: any){
        const dialogRef = this._matDialog.open(ElementCardComponent, {
            data: {elemento,
                idContrato: this.id}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                
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
}
