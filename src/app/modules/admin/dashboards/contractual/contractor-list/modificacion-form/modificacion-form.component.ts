import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { EconomicChartService } from 'app/modules/admin/pages/planing/economic-chart/economic-chart.service';
import { DetalleContrato } from 'app/modules/admin/pages/planing/models/detalle-contrato';
import * as moment from 'moment';
import { map, Observable, startWith, Subject } from 'rxjs';
import { IElements } from '../../../../pages/planing/models/element';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.services';


@Component({
    selector: 'app-modificacion-form',
    templateUrl: './modificacion-form.component.html',
    styleUrls: ['./modificacion-form.component.scss'],
})
export class ModificacionFormComponent implements OnInit {
    @ViewChild('signInNgForm') elementInNgForm: NgForm;
    filteredOptions: Observable<string[]>;
    modificaciones: any = GlobalConst.requierePoliza;
    tipoModificacion: any = GlobalConst.tipoModificacion;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    elementoCtrl = new FormControl('');
    data: IElements = {id: null, nombreElemento: null, idComponente: null, cantidadContratistas: null, cantidadDias: null, valorUnidad: null, valorTotal: null, valorPorDia: null, cpc: null, nombreCpc: null, modificacion: false, tipoElemento: null, recursos: 0,consecutivo:null};
    disableField:boolean = true;
    dateAdiction$: Observable<DetalleContrato[]>;
    elementos: IElements[] = [];
    allelementos: string[] = [
        'Profesional En Sistemas',
        'Profesional en areas de derecho',
        'Profesional Especializad',
        'Tecnologo',
    ];
    tipoElementos: any = GlobalConst.tipoElemento;
    @ViewChild('elementoInput') elementoInput: ElementRef<HTMLInputElement>;
    element: string = null;
    numberOfTicks = 0;
    update: boolean;
    showDate: boolean = true;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalCost: any = null;
    elementselectId: any;
    id: string = null;
    configForm: FormGroup;
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    elementForm: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public matDialogRef: MatDialogRef<ModificacionFormComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private _data: { data: any },
        private _fuseConfirmationService: FuseConfirmationService,
        private _economicService: EconomicChartService,
        private _router: Router,
        private _genericService: GenericService

    ) {
        setInterval(() => {
            this.numberOfTicks++;
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
        }, 1000);

    }

    ngOnInit(): void {
        console.log(this._data.data.elementId);
        if(this._data.data.elementId != 0){
            this.getDataElemento();
            this.getDateAdiction();
        }else{
            swal.fire(
                'error',
                'Debes Asignar un elemento al contratista', 'error'
            );
        this._router.navigateByUrl('dashboards/lista-contratistas/'+this._data.data.contractId);
        this.matDialogRef.close();
    }

        
        this.elementForm = this._formBuilder.group({
            contractorCant: new FormControl(this.data.cantidadContratistas, Validators.required),
            cantDay: new FormControl(this.data.cantidadDias, Validators.required),
            unitValue: new FormControl(this.data.valorUnidad, Validators.required),
            totalValue: new FormControl(this.data.valorTotal, Validators.required),
            id: new FormControl(this.id),
            unitValueDay: new FormControl(this.data.valorPorDia, Validators.required),
            calculateValue: new FormControl(this.totalCost, Validators.required),
            cpc: new FormControl(this.data.cpc, Validators.required),
            nombreCpc: new FormControl(this.data.nombreCpc, Validators.required),
            tipoElemento: new FormControl(null, Validators.required),
            nombreElemento: new FormControl(null, Validators.required),
            modificacion: new FormControl(null, Validators.required),
            recursos: new FormControl(null, Validators.required),
            fechaModificacion: new FormControl(null, Validators.required),
            tipoModificacion: new FormControl(null, Validators.required),
        });
        this.filteredOptions =
            this.elementForm.controls.nombreElemento.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );

    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allelementos.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    isOverdue(date: string): boolean {
        return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    getElements() {
        this._economicService
            .getElementoComponente(this._data)
            .subscribe((response) => {
                this.elementos = response;
            });
    }

    addElement() {
        let modificacion: any;
        if (this.elementForm.value.modificacion === 'Si') {
            modificacion = true;
        } else {
            modificacion = true;
        }
        let item: IElements = {
            id: 0,
            nombreElemento: this.elementForm.value.nombreElemento,
            idComponente: this._data.data.contractId,
            cantidadContratistas: this.elementForm.value.contractorCant,
            cantidadDias: this.elementForm.value.cantDay,
            valorUnidad: this.elementForm.value.unitValue,
            valorTotal: this.elementForm.value.totalValue,
            valorPorDia: this.elementForm.value.unitValueDay,
            cpc: this.elementForm.value.cpc,
            nombreCpc: this.elementForm.value.nombreCpc,
            modificacion: modificacion,
            tipoElemento: this.elementForm.value.tipoElemento,
            recursos: this.elementForm.value.recursos,
            consecutivo: this.elementForm.value.consecutivo
        };

        this._economicService.addElementoComponente(item).subscribe((response) => {
            if (response) {
                swal.fire('Bien!', 'Registrado Exitoso', 'success');
            }
            this._changeDetectorRef.detectChanges();
        }, (response) => {
            // Set the alert
            swal.fire('Error', 'Error en el registro!', 'error');
        });
        this.matDialogRef.close();
    }

    calculate = () => {
        const findEl = this.elementos.find((e) => e.nombreCpc == this.element);
        this.totalCalculate = false;
        this.elementForm.value.unitValueDay = Number(
            (this.elementForm.value.unitValue / 30) *
            this.elementForm.value.contractorCant
        );
        this.data.valorPorDia = this.elementForm.value.unitValueDay;
        this.data.valorTotal = this.elementForm.value.totalValue;
        this.data.valorTotal = Number(
            this.data.valorPorDia * this.elementForm.value.cantDay
        );
        let paymentDayContractor =
            this.elementForm.value.unitValueDay / Number(this.elementForm.value.cantDay);
        if (this.elementForm.value.cantDay >= '30') {
            //   Swal.fire(
            //     'Advertencia!',
            //     'La cantidad de días!',
            //     'info'
            // );
        }
    };

    selectmodificacion() {
        if(this.elementselectId === 'Si'){
            this.showDate = false;
        }else{
            this.showDate = true;
        }

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
    getDateAdiction() {
        this.dateAdiction$ = this._genericService.getDetalleContrato(this._data.data.contractId, true);
    }
    getDataElemento(){
            this._economicService.getElementoById(this._data.data.elementId).subscribe((resp) => {
                if(resp.recursos == 0){
                    swal.fire('Error', 'Error los recursos deben  ser mayores a 0!', 'error');
                    this.matDialogRef.close();
                }else{
                    this.data = resp;
                }
            } )
    }
}
