import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Inject,
    OnDestroy,
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subject, takeUntil, tap } from 'rxjs';
import * as moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { GenericService } from 'app/modules/admin/generic/generic.service';
import { DetalleContrato, ElementComponent, Elements, ListElements } from '../models/planing-model';
import { PlaningService } from '../service/planing.service';
import { CpcType, ElementType } from 'app/modules/admin/generic/model/generic.model';
import Swal from 'sweetalert2';
import { ElementTypeCode } from 'app/layout/common/enums/elementType';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'app-alement',
    styleUrls: ['./element.component.scss'],
    templateUrl: './element.component.html',
})


export class ElementCardComponent implements OnInit, OnDestroy {
    filteredOptions: Observable<string[]>;
    alert: { type: FuseAlertType; message: string } = {
        type: 'warn',
        message: ''
    };
    showAlert: boolean = false;

    @ViewChild('elementNgForm') elementNgForm: NgForm;
    modificaciones: any = GlobalConst.requierePoliza;
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
        'Profesional de Apoyo',
        'Tecnologo Profesional',

    ];


    @ViewChild('elementoInput') elementoInput: ElementRef<HTMLInputElement>;
    numberOfTicks = 0;
    recursos: any = 0;
    totalExacto: any;
    update: boolean;
    showDate: boolean = true;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalValue: any = null;
    elementselectId: any;
    valorPorDiaContratista: any;
    valorPorDiaContratistas: any;
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
        private _planingService: PlaningService,
    ) {

        setInterval(() => {
            this.numberOfTicks++;
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
        }, 1000);



    }

    ngOnInit(): void {
        this.elementForm = this._formBuilder.group({
            contractorCant: [null, Validators.required],
            cantDay: [null, Validators.required],
            unitValue: [null, Validators.required],
            totalValue: [this.totalValue, Validators.required],
            id: [this.id],
            unitValueDay: [null, Validators.required],
            totalExacto: [this.totalExacto, Validators.required],
            cpc: [null],
            nombreCpc: [null],
            tipoElemento: [null],
            nombreElemento: [null, Validators.required],
            modificacion: [null],
            recursos: new FormControl({ value: null, disabled: true }),
            fechamodificacion: [null],
            consecutivo: [null, Validators.required],
            valordiaContratista: [null, Validators.required],
            obligacionesEspecificas: [null, [Validators.pattern(/[^\r\n]+/)]],
            obligacionesGenerales: [null, [Validators.pattern(/[^\r\n]+/)]],
            objetoElemento: [null, [Validators.pattern(/[^\r\n]+/)]],
            academicProfile: [null],
            profesionalProfile: [null],
        });
        if (this._data.edit === true) {
            this.elementForm.patchValue({
                contractorCant: this._data.elemento.cantidadContratistas,
                cantDay: this._data.elemento.cantidadDias,
                unitValue: this._genericService.addCommasToNumber(this._data.elemento.valorUnidad),
                totalValue: this._genericService.addCommasToNumber(this._data.elemento.valorTotal),
                id: this._data.elemento.id,
                unitValueDay: this._genericService.addCommasToNumber(this._data.elemento.valorPorDia),
                totalExacto: this._genericService.addCommasToNumber(this._data.elemento.valorTotal),
                cpc: this._data.elemento.cpcId,
                nombreCpc: this._data.elemento.nombreCpc,
                tipoElemento: this._data.elemento.tipoElemento,
                nombreElemento: this._data.elemento.nombreElemento,
                modificacion: [null],
                recursos: this._data.elemento.recursos != null ? this._genericService.addCommasToNumber(this._data.elemento.recursos) : 0,
                fechamodificacion: [null],
                consecutivo: this._data.elemento.consecutivo,
                valordiaContratista: this._genericService.addCommasToNumber(this._data.elemento.valorPorDiaContratista),
                obligacionesEspecificas: this._data.elemento.obligacionesEspecificas,
                obligacionesGenerales: this._data.elemento.obligacionesGenerales,
                objetoElemento: this._data.elemento.objetoElemento,
                academicProfile: this._data.elemento.perfilRequeridoAcademico,
                profesionalProfile: this._data.elemento.perfilRequeridoExperiencia
            });
            this.totalCalculate = false;
            this.btnOpcion = 'Actualizar';
            this.showDate = true;
            this.totalValue = this._genericService.addCommasToNumber(this._data.elemento.valorTotal);
            this.valorPorDiaContratista = this._genericService.addCommasToNumber(this._data.elemento.valorPorDiaContratista);
            this.valorPorDiaContratistas = this._genericService.addCommasToNumber(this._data.elemento.valorPorDia);

        }
        this.filteredOptions =
            this.elementForm.controls.nombreElemento.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
        this.subscribeToValueChanges('totalExacto');
        this.subscribeToValueChanges('unitValueDay');
        this.subscribeToValueChanges('totalValue');
        this.subscribeToValueChanges('recursos');
        this.subscribeToValueChanges('valordiaContratista');
        this.subscribeToValueChanges('unitValue');
        this.getDateAdiction();
        this.getCdp();
        this.getDetailContract();
        this.getElementType();
        this.getTypeMinuteContract();
    }


    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allelementos.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
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
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                this.elementos = response;
            });
    }

    addElement(): void {
        if (this.elementForm.invalid) {
            this.alert = {
                type: 'error',
                message: 'ERROR EN LA INFORMACION'
            };

            // Show the alert
            this.showAlert = true;
            return
        }
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
        if (this.valorPorDiaContratista === null) {
            this.valorPorDiaContratista = this.totalValue / this.elementForm.value.contractorCant;
        }

        let item: Elements = {
            id: this._data.elemento.id,
            nombreElemento: this.elementForm.value.nombreElemento,
            componentId: this._data.componentId,
            cantidadContratistas: this.elementForm.value.contractorCant,
            cantidadDias: this.elementForm.value.cantDay,
            valorUnidad: Math.ceil(Number(this.elementForm.value.unitValue.toString().replace(/\./g, ''))),
            valorTotal: Math.ceil(Number(this.totalValue.toString().replace(/\./g, ''))),
            valorPorDia: Math.ceil(Number(this.valorPorDiaContratistas.toString().replace(/\./g, ''))),
            valorPorDiaContratista: Math.ceil(Number(this.valorPorDiaContratista.toString().replace(/\./g, ''))),
            valorTotalContratista: Math.ceil(Number(this.valorPorDiaContratista.toString().replace(/\./g, ''))),
            cpcId: this.elementForm.value.cpc,
            modificacion: modificacion,
            tipoElemento: this.elementForm.value.tipoElemento,
            consecutivo: this.elementForm.value.consecutivo,
            obligacionesEspecificas: this.elementForm.value.obligacionesEspecificas,
            obligacionesGenerales: this.elementForm.value.obligacionesGenerales,
            objetoElemento: this.elementForm.value.objetoElemento,
            activityId: this._data.activityId,
            perfilRequeridoAcademico: this.elementForm.value.academicProfile,
            perfilRequeridoExperiencia: this.elementForm.value.profesionalProfile
        };
        this.elementForm.disable();

        this._planingService.addElementoComponente(item)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
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
                // Re-enable the form
                this.elementForm.enable();
                // Reset the form
                this.elementNgForm.resetForm();
                swal.fire('', 'response', 'error');
            });
    }

    calculate = (e: string) => {
        if (this.typeContractor) {
            if ((this.elementForm.value.unitValue === null || this.elementForm.value.unitValue === '')) {
                if (e === 'valor' && this.elementForm.value.cantDay != null && this.elementForm.value.cantDay != '') {
                    swal.fire('Precaución', 'El valor unitario debe ser mayor a 0', 'warning');
                }
            } else {
                this.totalCalculate = false;
                this.valorPorDiaContratista = Math.ceil(Number(this.elementForm.value.unitValue.toString().replace(/\./g, '')) / 30);
                this.valorPorDiaContratistas = Math.ceil(this.valorPorDiaContratista * this.elementForm.value.contractorCant);
                if (this.elementForm.value.totalValue === null || this._data.elemento.valorTotal.toString() != this.elementForm.value.totalValue) {
                    this.totalValue = Math.ceil(Number(
                        this.valorPorDiaContratistas * this.elementForm.value.cantDay
                    ));
                    this.totalExacto = Math.ceil(this.totalValue);
                } else if (this._data.elemento.valorTotal.toString() != this.elementForm.value.totalValue || this.elementForm.value.totalValue != null) {

                    this.totalExacto = Math.ceil(Number(
                        this.valorPorDiaContratistas * this.elementForm.value.cantDay
                    ));
                    this.valorPorDiaContratista = Math.ceil(Number(
                        this.valorPorDiaContratista * this.elementForm.value.cantDay
                    ));
                    this.valorPorDiaContratista * this.elementForm.value.cantDay
                    this.valorPorDiaContratista = Math.ceil(Number(
                        this.valorPorDiaContratista * this.elementForm.value.cantDay
                    ));
                    this.recursos += Math.ceil(this.elementForm.value.totalValue - this.totalExacto);
                }
                if (this.elementForm.value.recursos != null && this.elementForm.value.recursos != '') {
                    this.recursos = Number(this.elementForm.value.recursos.toString().replace(/\./g, ''));
                    this.totalExacto = Math.ceil(this.recursos + this.totalExacto);
                    this.totalExacto = this._genericService.addCommasToNumber(this.totalExacto);
                }
            }
        } else {

            this.valorPorDiaContratistas = Math.ceil(this.elementForm.value.unitValue.toString().replace(/\./g, ''));
            this.totalValue = Math.ceil(this.elementForm.value.toString().replace(/\./g, ''));
            this.elementForm.value.totalValue = Math.ceil(this.valorPorDiaContratista);
        }
        if (this.totalValue > 0 || this.totalValue != null) {
            this.totalValue = this._genericService.addCommasToNumber(this.totalValue);
            this.valorPorDiaContratistas = this._genericService.addCommasToNumber(this.valorPorDiaContratistas);
            this.totalExacto = this._genericService.addCommasToNumber(this.totalExacto);
            this.valorPorDiaContratista = this._genericService.addCommasToNumber(this.valorPorDiaContratista);
            if (this.recursos > 0) {
                this.recursos = this._genericService.addCommasToNumber(this.recursos);
            }
        }
        this.elementForm.patchValue({
            totalValue: this.totalValue,
            unitValueDay: this.valorPorDiaContratistas,
            totalExacto: this.totalExacto,
            recursos: this.recursos,
            valordiaContratista: this.valorPorDiaContratista,
        });
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
    onChangeTotalValue(event) {
        if (this._data.elemento.valorTotal === null || this._data.elemento.valorTotal === 0) {
            if (this.totalValue != this.elementForm.value.totalValue) {
                if (this.totalValue < Number(this.elementForm.value.totalValue.toString().replace(/\./g, ''))) {
                    this.recursos = Math.ceil(Number(this.elementForm.value.totalValue.toString().replace(/\./g, '')) - Number(this.totalValue));
                } else if (this.totalValue > Number(this.elementForm.value.totalValue.toString().replace(/\./g, ''))) {
                    this.recursos = Math.ceil(Number(this.totalValue) - Number(this.elementForm.value.totalValue.toString().replace(/\./g, '')));
                }
            }
            this.totalValue = Math.ceil(Number(this.elementForm.value.totalValue.toString().replace(/\./g, '')))
        } else {

            this.totalValue = Math.ceil(Number(this.elementForm.value.totalValue.toString().replace(/\./g, '')))
        }

        this.totalExacto = this.totalValue + this.recursos;
        this.totalExacto = this._genericService.addCommasToNumber(this.totalExacto);
        this.totalValue = this._genericService.addCommasToNumber(this.totalValue);
        if (this.recursos > 0) {
            this.recursos = this._genericService.addCommasToNumber(this.recursos);
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

    private getCdp() {
        this._genericService.getCpcType()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                this.cpcType = response;
            }, (response) => {
                // Set the alert
                console.log(response);

                swal.fire('error', 'Error al registrar la información!', 'error');
            });
    }

    getElementType() {
        this._genericService.getElementType()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                this.elementTypes = response;
            }, (response) => {
                // Set the alert
                console.log(response);

                swal.fire('error', 'Error al registrar la información!', 'error');
            });
    }

    changecpcType(e: any) {
        let cpcN: CpcType = this.cpcType.find(f => f.id == e.value)
        this.elementForm.patchValue({
            nombreCpc: cpcN.cpcName,
        });
    }

    private getDetailContract() {
        this._genericService.getDetalleContractById(this._data.contractId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (resp) => {
                    if (resp != null) {
                        this.detailContract = resp;
                        this.calcularDiasEntreFechas(this.detailContract.fechaContrato, this.detailContract.fechaFinalizacion);
                    } else {
                        Swal.fire(
                            'Ei',
                            'No se encuentran fechas del contrato',
                            'question'
                        );
                    }

                }
            );
    }

    private getTypeMinuteContract() {
        this._genericService.getTypeMinutesContract()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (resp) => {
                    this.modificaciones = resp;
                }
            );
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        // Verificar si la tecla presionada es "Enter" (código 13) y evitar que se ingrese el salto de línea
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    }

    @HostListener('input', ['$event.target'])
    onInput(textarea: HTMLTextAreaElement): void {
        // Limpiar el texto para eliminar los saltos de línea
        const cleanedText = textarea.value.replace(/[\r\n]/g, '');
        textarea.value = cleanedText;
    }

    formatNumberWithCommas(controlName: string, value: number): void {
        if (value > 0 || value != null) {
            const control = this.elementForm.get(controlName);
            const previousValue = control.value;

            // Remover puntos del valor anterior para evitar puntos duplicados
            const numericValue = Number(value.toString().replace(/\./g, ''));
            const formattedValue = this._genericService.addCommasToNumber(numericValue);

            // Si el valor formateado es diferente al valor en el control, actualizar el control
            if (formattedValue !== previousValue) {
                control.patchValue(formattedValue, { emitEvent: false });
            }
        }

    }


    subscribeToValueChanges(controlName: string): void {
        this.elementForm.get(controlName).valueChanges.subscribe(value => {
            this.formatNumberWithCommas(controlName, value);
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
