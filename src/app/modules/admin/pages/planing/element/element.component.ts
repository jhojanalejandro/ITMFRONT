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
import swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { DetalleContrato, ElementComponent, Elements, ListElements } from '../models/planing-model';
import { PlaningService } from '../service/planing.service';
import { CpcType, ElementType } from 'app/modules/admin/generic/model/generic.model';
import { ElementTypeCode } from 'app/layout/common/enums/elementType';

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
    maxDayContrac: number = 0;
    cpcType: CpcType[];
    elementTypes: ElementType[];

    cpcName: string = '';
    detailContract: DetalleContrato = {
        contractId: null,
        fechaContrato: null,
        fechaFinalizacion: null,
        tipoContrato: null,
    };
    typeContractor: boolean = true;
    dateAdiction$: Observable<DetalleContrato[]>;
    filteredelementos: Observable<string[]>;
    elementos: Elements[] = [];
    allelementos: string[] = [
        'Profesional En Sistemas',
        'Profesional en areas de derecho',
        'Profesional Especializado',
        'Profesional Docente',
        'Tecnologo',
        'Tecnico',
        'Recurso Humano',
        'Gestion Humana',
        'Apoyo Administrativo',

    ];
    @ViewChild('elementoInput') elementoInput: ElementRef<HTMLInputElement>;
    numberOfTicks = 0;
    elemento: ElementComponent = { nombreElemento: null, componentId: null, cantidadContratistas: null, cantidadDias: null, valorUnidad: null, valorTotal: null, valorPorDia: null, cpc: null, nombreCpc: null, modificacion: false, tipoElemento: null, recursos: 0, consecutivo: null, obligacionesGenerales: null, obligacionesEspecificas: null, valorPorDiaContratista: null, valorTotalContratista: null, objetoElemento: null, activityId: null }
    recursos: number = 0;
    totalV: number;
    totalExacto: number;
    update: boolean;
    showDate: boolean = true;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalValue: any = null;
    obligacionesEspecificas: any = null;
    obligacionesGenerales: any = null;
    totalValueContratista: any = null;
    objetoConvenio: any = null;
    unitValueMonth: any = null;
    unitValueMonthContractor: any = null;

    elementselectId: any;
    id: string = null;
    listElements: ListElements;
    configForm: FormGroup;
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    elementForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public matDialogRef: MatDialogRef<ElementCardComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private _data,
        private _fuseConfirmationService: FuseConfirmationService,
        private _genericService: GenericService,
        private _planingService: PlaningService
    ) {
        if (this._data.edit === true) {
            this.btnOpcion = 'Actualizar';
            this.showDate = false;
            this.elemento = this._data.elemento;
            this.totalValue = this._data.elemento.valorTotal;
            this.obligacionesEspecificas = this._data.elemento.obligacionesEspecificas;
            this.obligacionesGenerales = this._data.elemento.obligacionesGenerales;
            this.objetoConvenio = this._data.elemento.objetoElemento;

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
            obligacionesEspecificas: [this.obligacionesEspecificas],
            obligacionesGenerales: [this.obligacionesGenerales],
            objetoElemento: [this.objetoConvenio]

        });
        this.filteredOptions =
            this.elementForm.controls.nombreElemento.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
    }

    ngOnInit(): void {
        this.getDateAdiction();
        this.getCdp();
        this.getDetailContract();
        this.getElementType();
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
        this._planingService
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
            this.elementForm.value.tipoElemento = 'Contratista'
        }
        if (this.totalValueContratista === null) {
            this.totalValueContratista = this.totalValue / this.elementForm.value.contractorCant;
        }
        let item: Elements = {
            id: this._data.elemento.id,
            nombreElemento: this.elementForm.value.nombreElemento,
            componentId: this._data.componentId,
            cantidadContratistas: this.elementForm.value.contractorCant,
            cantidadDias: this.elementForm.value.cantDay,
            valorUnidad: this.elementForm.value.unitValue,
            valorTotal: this.totalValue,
            valorPorDia: this.elemento.valorPorDia,
            valorPorDiaContratista: this.elemento.valorPorDiaContratista,
            valorTotalContratista: this.totalValueContratista,
            cpcId: this.elementForm.value.cpc,
            modificacion: modificacion,
            tipoElemento: this.elementForm.value.tipoElemento,
            recursos: this.recursos,
            consecutivo: this.elementForm.value.consecutivo,
            obligacionesEspecificas: this.elementForm.value.obligacionesEspecificas,
            obligacionesGenerales: this.elementForm.value.obligacionesGenerales,
            objetoElemento: this.elementForm.value.objetoElemento,
            activityId: this._data.activityId
        };
        this._planingService.addElementoComponente(item).subscribe((response) => {
            if (response) {
                swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '',
                    html: 'Información Registrada Exitosamente!',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.matDialogRef.close(true);
            }
            this._changeDetectorRef.detectChanges();
        }, (response) => {
            // Set the alert
            console.log(response);

            swal.fire('error', 'Error al registrar la información!', 'error');
        });
    }

    calculate = (e: string) => {
        if (this.typeContractor) {
            if ((this.elementForm.value.unitValue === null || this.elementForm.value.unitValue === '')) {
                if (e === 'valor') {
                    swal.fire('Precaución', 'El valor unitario debe ser mayor a 0', 'warning');
                }
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
                    this.recursos = this.elementForm.value.totalValue - this.totalExacto;
                }

            }
        } else {
            this.elemento.valorPorDia = this.elementForm.value.unitValue;
            this.totalValue = this.elementForm.value.unitValue;
            this.elementForm.value.totalValue = this.elementForm.value.unitValue;
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
        this.dateAdiction$ = this._genericService.getDetalleContratoList(this._data.contractId, true);
    }
    onChange(event) {
        this.totalV = Number(this.elementForm.value.totalValue.replace(/,/g, ""));
        if (this._data.elemento.valorTotal === null || this._data.elemento.valorTotal === 0) {
            if (this.totalValue != this.elementForm.value.totalValue) {
                if (this.totalValue < this.totalV) {
                    this.recursos = this.totalV - Number(this.totalValue);
                } else if (this.totalValue > this.totalV) {
                    this.recursos = Number(this.totalValue) - this.totalV;
                }
            }
            this.totalValue = this.totalV
        } else {
            this.totalValue = this.totalV
        }

    }

    changeTypeElement(e: any) {
        let selectCode: ElementType[] = this.elementTypes.filter(f => f.id == e.value)
        let code = selectCode[0].code;
        if (code === ElementTypeCode.SUMINISTRO) {
            this.typeContractor = false;
        } else {
            this.typeContractor = true;
        }

    }

    calcularDiasEntreFechas(fechaInicio: string, fechaFin: string): number {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diferenciaMilisegundos = fin.getTime() - inicio.getTime();
        this.maxDayContrac = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
        return this.maxDayContrac;
    }

    preventExceedingMax(event: KeyboardEvent) {
        const inputElement = event.target as HTMLInputElement;
        const inputValue = parseInt(inputElement.value, 10);
        if (inputValue > this.maxDayContrac) {
            swal.fire('', 'Los días no pueden exceder el tiempo del contrato!', 'warning');

            event.preventDefault();
            inputElement.value = this.maxDayContrac.toString();
        }
    }

    getCdp() {
        this._genericService.getCpcType().subscribe((response) => {
            this.cpcType = response;
        }, (response) => {
            // Set the alert
            console.log(response);

            swal.fire('error', 'Error al registrar la información!', 'error');
        });
    }

    getElementType() {
        this._genericService.getElementType().subscribe((response) => {
            this.elementTypes = response;
        }, (response) => {
            // Set the alert
            console.log(response);

            swal.fire('error', 'Error al registrar la información!', 'error');
        });
    }

    changecpcType(e: any) {
        let cpcN: CpcType[] = this.cpcType.filter(f => f.id == e.value)
        this.elemento.nombreCpc = cpcN[0].cpcName;
    }

    private getDetailContract() {
        this._genericService.getDetalleContratoById(this._data.contractId, true).subscribe(
            (resp) => {
                this.detailContract = resp;
                this.calcularDiasEntreFechas(this.detailContract.fechaContrato, this.detailContract.fechaFinalizacion);
            }
        );
    }

}
