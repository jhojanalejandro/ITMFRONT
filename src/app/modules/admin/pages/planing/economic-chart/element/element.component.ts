import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
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
    NgForm,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subject, takeUntil, tap } from 'rxjs';
import * as moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { IElements } from '../../models/element';
import { ListElements } from '../../models/list-elements';
import swal from 'sweetalert2';
import { EconomicChartService } from '../../service/economic-chart.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { DetalleContrato } from '../../models/detalle-contrato';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'app-alement',
    styleUrls: ['./element.component.scss'],
    templateUrl: './element.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementCardComponent implements OnInit, OnDestroy {
    filteredOptions: Observable<string[]>;
    modificaciones: any = GlobalConst.requierePoliza;
    tipoModificaciones: any = GlobalConst.tipoModificacion;
    btnOpcion: string = 'Guardar';
    separatorKeysCodes: number[] = [ENTER, COMMA];
    elementoCtrl = new FormControl('');
    valorDiaContratista: number = 0;
    dateAdiction$: Observable<DetalleContrato[]>;
    filteredelementos: Observable<string[]>;
    elementos: IElements[] = [];
    allelementos: string[] = [
        'Profesional En Sistemas',
        'Profesional en areas de derecho',
        'Profesional Especializado',
        'Profesional Docente',
        'Tecnologo',
        'Tecnico',
    ];
    tipoElementos: any = GlobalConst.tipoElemento;
    @ViewChild('elementoInput') elementoInput: ElementRef<HTMLInputElement>;
    numberOfTicks = 0;
    elemento: IElements = { nombreElemento: null, idComponente: null, cantidadContratistas: null, cantidadDias: null, valorUnidad: null, valorTotal: null, valorPorDia: null, cpc: null, nombreCpc: null, modificacion: false, tipoElemento: null, recursos: 0, consecutivo: null, obligacionesGenerales: null, obligacionesEspecificas: null, valorPorDiaContratista: null, valorTotalContratista: null, objetoElemento: null }
    recursos: number = 0;
    totalV: number;
    totalExacto: number;
    update: boolean;
    showDate: boolean = true;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalValue: any = null;
    totalValueContratista: any = null;
    unitValueMonth: any = null;
    unitValueMonthContractor: any = null;

    elementselectId: any;
    id: string = null;
    listElements: ListElements;
    configForm: FormGroup;
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    elementForm: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<ElementCardComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private _data,
        private _fuseConfirmationService: FuseConfirmationService,
        private _genericService: GenericService,
        private _economicService: EconomicChartService
    ) {
        if (this._data.edit === true) {
            this.btnOpcion ='Actualizar';
            this.showDate = false;
            this.elemento = this._data.elemento;
            this.totalValue = this._data.elemento.valorTotal;
        }
        setInterval(() => {
            this.numberOfTicks++;
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
        }, 1000);

        this.elementForm = this._formBuilder.group({
            contractorCant: [this.elemento.cantidadContratistas, Validators.required],
            cantDay: [this.elemento.cantidadDias, Validators.required],
            unitValue: [this.elemento.valorUnidad, Validators.required],
            totalValue: [this.totalValue, Validators.required],
            id: [this.id],
            unitValueDay: [this.elemento.valorPorDia, Validators.required],
            totalExacto: [this.totalExacto, Validators.required],
            cpc: [this.elemento.cpc],
            nombreCpc: [this.elemento.nombreCpc],
            tipoElemento: [this.elemento.tipoElemento],
            nombreElemento: [this.elemento.nombreElemento, Validators.required],
            modificacion: [null],
            recursos: [this.elemento.recursos],
            fechamodificacion: [null],
            consecutivo: [this.elemento.consecutivo, Validators.required],
            valordiaContratista: [this.elemento.valorPorDiaContratista, Validators.required],
            obligacionesEspecificas: [this.elemento.obligacionesEspecificas],
            obligacionesGenerales: [this.elemento.obligacionesGenerales],
            objetoElemento: [this.elemento.objetoElemento]

        });
        this.filteredOptions =
            this.elementForm.controls.nombreElemento.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
    }

    ngOnInit(): void {
        this.getDateAdiction();
        console.log(this._data);

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

    addElement(): void {
        let modificacion: any;
        if (this.elementForm.value.modificacion === 'Si') {
            modificacion = true;
        } else {
            modificacion = true;
        }
        if (this.totalValue === null) {
            this.totalValue = this.elementForm.value.totalValue
        }
        if (this.elementForm.value.tipoElemento === null) {
            this.elementForm.value.tipoElemento = 'corriente'
        }
        if (this.totalValueContratista === null) {
            this.totalValueContratista = this.totalValue / this.elementForm.value.contractorCant;
        }
        let item: IElements = {
            id: this._data.idElemento,
            nombreElemento: this.elementForm.value.nombreElemento,
            idComponente: this._data.idComponente,
            cantidadContratistas: this.elementForm.value.contractorCant,
            cantidadDias: this.elementForm.value.cantDay,
            valorUnidad: this.elementForm.value.unitValue,
            valorTotal: this.totalValue,
            valorPorDia: this.elemento.valorPorDia,
            valorPorDiaContratista: this.elemento.valorPorDiaContratista,
            valorTotalContratista: this.totalValueContratista,
            cpc: this.elementForm.value.cpc,
            nombreCpc: this.elementForm.value.nombreCpc,
            modificacion: modificacion,
            tipoElemento: this.elementForm.value.tipoElemento,
            recursos: this.recursos,
            consecutivo: this.elementForm.value.consecutivo,
            obligacionesEspecificas: this.elementForm.value.obligacionesEspecificas,
            obligacionesGenerales: this.elementForm.value.obligacionesGenerales,
            objetoElemento: this.elementForm.value.objetoElemento
        };
        this._economicService.addElementoComponente(item).subscribe((response) => {
            if (response) {
                swal.fire('Exitoso', 'Registrado Exitosamente!', 'success');
                this.matDialogRef.close(true);
            }
            this._changeDetectorRef.detectChanges();
        }, (response) => {
            // Set the alert
            console.log(response);

            swal.fire('error', 'Error en el registro!', 'error');
        });
    }

    calculate = () => {
        if (this.elementForm.value.unitValue === null || this.elementForm.value.unitValue === '') {
            swal.fire('Precaución', 'El valor unitario debe ser mayor a 0', 'warning');
        } else {
            this.totalCalculate = false;
            this.elemento.valorPorDiaContratista = this.elementForm.value.unitValue / 30;
            this.elementForm.value.unitValueDay = Number(
                (this.elementForm.value.unitValue / 30) *
                this.elementForm.value.contractorCant
            );
            this.elemento.valorPorDia = this.elementForm.value.unitValueDay;

            if (this.elementForm.value.totalValue === null || this.elemento.valorTotal === this.elementForm.value.totalValue) {
                this.totalValue = Number(
                    this.elemento.valorPorDia * this.elementForm.value.cantDay
                );
                this.totalValueContratista = Number(
                    this.elemento.valorPorDiaContratista * this.elementForm.value.cantDay
                );
                this.totalExacto = this.totalValue;
            } else if (this.elemento.valorTotal != this.elementForm.value.totalValue || this.elementForm.value.totalValue != null) {
                this.totalExacto = Number(
                    this.elemento.valorPorDia * this.elementForm.value.cantDay
                );
                this.totalValueContratista = Number(
                    this.elemento.valorPorDiaContratista * this.elementForm.value.cantDay
                );
                this.elemento.valorPorDiaContratista * this.elementForm.value.cantDay
                this.totalValueContratista = Number(
                    this.elemento.valorPorDiaContratista * this.elementForm.value.cantDay
                );
                this.recursos =  this.elementForm.value.totalValue - this.totalExacto;
            }

        }

    };

    selectmodificacion() {
        if (this.elementselectId === 'Si') {
            this.showDate = false;
        } else {
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
        this.dateAdiction$ = this._genericService.getDetalleContrato(this._data.idContrato, true);
    }
    onChange(event) {
        this.totalV = Number(this.elementForm.value.totalValue.replace(/,/g, ""));
        if(this._data.elemento.valorTotal === null || this._data.elemento.valorTotal === 0){
            if(this.totalValue != this.elementForm.value.totalValue){
                if(this.totalValue < this.totalV){
                    this.recursos = this.totalV -Number(this.totalValue);
                }else if(this.totalValue > this.totalV){
                    this.recursos =  Number(this.totalValue) - this.totalV;
                }
            }
            this.totalValue = this.totalV
        } else{
            this.totalValue = this.totalV
        }       

    }
    
}
