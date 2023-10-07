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
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import * as moment from 'moment';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import swal from 'sweetalert2';
import { GenericService } from 'app/modules/admin/generic/generic.service';
import { DetalleContrato, ElementComponent, Elements, ModifyContractor } from 'app/modules/admin/pages/planing/models/planing-model';
import { PlaningService } from 'app/modules/admin/pages/planing/service/planing.service';
import { DocumentTypeFileCodes } from 'app/layout/common/enums/document-type/document-type';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/service/upload-file.service';
import { ContractorService } from 'app/modules/admin/dashboards/contractual/service/contractor.service';
import { CpcType } from 'app/modules/admin/generic/model/generic.model';



@Component({
    selector: 'app-modificacion-form',
    templateUrl: './modificacion-form.component.html',
    styleUrls: ['./modificacion-form.component.scss'],
})
export class ModificacionFormComponent implements OnInit {
    @ViewChild('signInNgForm') elementInNgForm: NgForm;
    filteredOptions: Observable<string[]>;
    tipoModificacion: any;
    showDate: boolean = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    elementoCtrl = new FormControl('');
    minDateAdiction:Date = new Date();
    cpcNumber: string = null; 
    elemento: ElementComponent = { nombreElemento: null, componentId: null, cantidadContratistas: null, cantidadDias: null, valorUnidad: null, valorTotal: null, valorPorDia: null, cpc: null, nombreCpc: null, modificacion: false, tipoElemento: null, recursos: 0, consecutivo: null, obligacionesGenerales: null, obligacionesEspecificas: null, valorPorDiaContratista: null, valorTotalContratista: null, objetoElemento: null, activityId: null }
    disableField: boolean = true;
    resources: any= null;
    cpcType: CpcType[];
    exactTotal: number = 0;
    isAddition: boolean = false;
    dateAdiction: DetalleContrato = {
        contractId: null,
        fechaContrato: null,
        fechaFinalizacion: null,
        tipoContrato: null,
    };
    dateContract: any;
    elementos: Elements[] = [];
    allelementos: string[] = [
        'Profesional En Sistemas',
        'Profesional en areas de derecho',
        'Profesional Especializad',
        'Tecnologo',
    ];
    @ViewChild('elementoInput') elementoInput: ElementRef<HTMLInputElement>;
    numberOfTicks = 0;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    elementselectId: any;
    showModify: boolean = true;
    configForm: FormGroup;
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    modifyForm: FormGroup;
    minDate: Date;
    maxdate: Date;
    minDateFinal: Date;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public matDialogRef: MatDialogRef<ModificacionFormComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private _data,
        private _fuseConfirmationService: FuseConfirmationService,
        private _planingService: PlaningService,
        private _genericService: GenericService,
        private _uploadFileDataService: UploadFileDataService,
        private _contractorService: ContractorService,
    ) {
        setInterval(() => {
            this.numberOfTicks++;
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
        }, 1000);

    }

    ngOnInit(): void {
        if (this._data.data.elementId != null) {
            this.getDataElemento();
            this.getDateAdiction();
        } else {
            swal.fire(
                'precaución',
                'El contratista debe tener un elemento asignado', 'warning'
            );
            this.matDialogRef.close();
        }


        this.modifyForm = this._formBuilder.group({
            contractorCant: new FormControl(this.elemento.cantidadContratistas, Validators.required),
            cantDay: new FormControl(this.elemento.cantidadDias, Validators.required),
            unitValue: new FormControl(null, Validators.required),
            totalValue: new FormControl(null, Validators.required),
            unitValueDay: new FormControl(null, Validators.required),
            calculateValue: new FormControl(null, Validators.required),
            additionValue: new FormControl(null, Validators.required),
            cpc: new FormControl(this.elemento.cpc, Validators.required),
            cpcName: new FormControl(this.elemento.nombreCpc, Validators.required),
            elementType: new FormControl(null, Validators.required),
            elementName: new FormControl(null, Validators.required),
            modification: new FormControl(null, Validators.required),
            resources: new FormControl(null, Validators.required),
            initialAdditionDate: new FormControl(null),
            finalAdditionDate: new FormControl(null),
            modificationType: new FormControl(null, Validators.required),
            elementObject: new FormControl(null, Validators.required),
            specificObligations: new FormControl(null, Validators.required),
            generalObligations: new FormControl(null, Validators.required),
            initialDateContract: new FormControl({value: null, disabled: true }, Validators.required),
            finalDateContract: new FormControl({value: null, disabled: true }, Validators.required),
            academicProfile: new FormControl(null, Validators.required),
            profesionalProfile: new FormControl(null, Validators.required),
            noAddition: new FormControl(null, Validators.required),
        });
        this.filteredOptions =
            this.modifyForm.controls.elementName.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
        this.getDocumentType();
        this.getDateContract();
        this.getCdp();
        this.subscribeToValueChanges('additionValue');

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

    addModify() {
        let modificacion: any;
        if (this.modifyForm.value.modification   === 'Si') {
            modificacion = true;
        } else {
            modificacion = true;
        }
        debugger
        if(this.exactTotal == 0){
            this.exactTotal = Number(this.modifyForm.value.totalValue.toString().replace(/\./g, ''))
        }
        let item: ModifyContractor = {
            elementName: this.modifyForm.value.elementName,
            cantidadContratistas: this.modifyForm.value.contractorCant,
            cantDays: this.modifyForm.value.cantDay,
            unitValue: Number(this.modifyForm.value.unitValue.toString().replace(/\./g, '')),
            totalValue:  this.exactTotal,
            valueDay: Number(this.modifyForm.value.unitValueDay.toString().replace(/\./g, '')),
            valorPorDiaContratista: this.modifyForm.value.valorDiaContratista,
            valorTotalContratista: 0,
            cpcId: this.modifyForm.value.cpcName,
            isModify: modificacion,
            tipoElemento: this.modifyForm.value.elementType,
            resources: this.modifyForm.value.resources,
            consecutive: '1',
            specificObligations: this.modifyForm.value.specificObligations,
            generalObligations: this.modifyForm.value.generalObligations,
            elementObject: this.modifyForm.value.elementObject,
            perfilRequeridoAcademico: this.modifyForm.value.academicProfile,
            perfilRequeridoExperiencia: this.modifyForm.value.profesionalProfile,
            noAddition: this.modifyForm.value.noAddition,
            contractorId: this._data.data.id,
            contractId: this._data.contractId,
            minuteType: this.modifyForm.value.modificationType,
            initialAdditionDate: this.modifyForm.value.initialAdditionDate,
            finalAdditionDate: this.modifyForm.value.finalAdditionDate,
            isAddition: this.isAddition,
        };
        this._contractorService
            .saveMinuteModify(item)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if (response.success) {
                    swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        html: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.matDialogRef.close();
                }
                this._changeDetectorRef.detectChanges();
            });
    }

    calculate = () => {
        this.totalCalculate = false;
        this.modifyForm.value.unitValueDay = Number(
            (this.modifyForm.value.unitValue / 30) *
            this.modifyForm.value.contractorCant
        );
        this.elemento.valorPorDia = this.modifyForm.value.unitValueDay;
        this.elemento.valorTotal = this.modifyForm.value.totalValue;
        this.elemento.valorTotal = Number(
            this.elemento.valorPorDia * this.modifyForm.value.cantDay
        );
        let paymentDayContractor =
            this.modifyForm.value.unitValueDay / Number(this.modifyForm.value.cantDay);
        if (this.modifyForm.value.cantDay >= '30') {
            //   Swal.fire(
            //     'Advertencia!',
            //     'La cantidad de días!',
            //     'info'
            // );
        }
    };

    selectmodificacion(event) {
        let codeMinute = this.tipoModificacion.find(f => f.id == event.value).code;

        switch (codeMinute) {
            case DocumentTypeFileCodes.MC:
                this.showDate = false;
                this.isAddition = false;
                this.showModify = true;
                break;
            case DocumentTypeFileCodes.APC:
                this.showDate = true;
                this.isAddition = false;
                this.showModify = false;
                break;
            case DocumentTypeFileCodes.ADC:
                if(this.resources != null && Number(this.resources.toString().replace(/\./g, '')) > 0){
                    this.isAddition = true;
                    this.showDate = false;
                    this.showModify = false;
                }else{
                    swal.fire(
                        '',
                        'No hay recursos disponibles para adicionar', 'warning'
                    );
                }
                break;
            case DocumentTypeFileCodes.AAM:
                this.isAddition = true;
                this.showDate = true;
                this.showModify = true;
                break;
            case DocumentTypeFileCodes.AM:
                this.showDate = false;
                this.isAddition = false;
                this.showModify = true;
                break;
            case DocumentTypeFileCodes.AA:
                this.isAddition = true;
                this.showDate = true;
                this.showModify = false;
                break;
            case DocumentTypeFileCodes.ADMC:
                this.isAddition = true;
                this.showDate = false;
                this.showModify = true;
                break;
            default:
                this.showDate = true;
                this.showModify = true;
                this.isAddition = true;
                break;
        }
        if (event.value === 'Modificación' || event.value === 'Adición, Ampliación, Modificacion' || event.value === 'Ampliación y Modificacion' || event.value === 'Adición y Modificacion') {
            this.showDate = true;
        } else if (event.value === 'Ampliación' || event.value === 'Adición y Ampliación' || event.value === 'Adición, Ampliación, Modificacion') {
            this.showDate = true;
        }

    }
    openConfirmationDialog(): void {
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(
            this.configForm.value
        );
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result == 'confirmed') {
                }
            });
    }

    private getDateAdiction() {
        this._genericService.getDetalleContractById(this._data.contractId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (resp) => {
                    this.dateAdiction = resp;
                    this.modifyForm.patchValue({
                        finalDateContract: resp.fechaFinalizacion,
                        initialDateContract: resp.fechaContrato
                    })
                }
            );
    }

    private getDateContract() {
        this._genericService.getDateContract(this._data.data.id,this._data.contractId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (resp) => {
                    this.dateContract = resp;
                }
            );
    }

    private getDataElemento() {
        this._planingService.getElementoById(this._data.data.elementId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp) => {
                this.resources = resp.recursos;
                this.modifyForm.patchValue({
                    elementName: resp.nombreElemento,
                    resources: resp.recursos,
                    cantDay: resp.cantidadDias,
                    cpcName: resp.cpcId,
                    cpc: resp.nombreCpc,
                    unitValue: this._genericService.addCommasToNumber(resp.valorUnidad),
                    unitValueDay: this._genericService.addCommasToNumber(resp.valorPorDia),
                    totalValue: this._genericService.addCommasToNumber(resp.valorTotal),
                    elementObject: resp.objetoElemento,
                    academicProfile: resp.perfilRequeridoExperiencia,
                    profesionalProfile: resp.perfilRequeridoExperiencia,
                    specificObligations: resp.obligacionesEspecificas,
                    generalObligations: resp.obligacionesGenerales
                })
                if (resp != null) {
                    this.elemento = resp;
                    if (this.elemento.cpc == undefined) {
                        this.elemento.cpc = null;
                    }
                    if (this.elemento.nombreCpc == undefined) {
                        this.elemento.nombreCpc = null;
                    }
                    this.elemento.valorUnidad = this.elemento.valorUnidad;
                    this.elemento.valorPorDia = this.elemento.valorPorDia;
                    this.elemento.valorTotal = this.elemento.valorTotal;
                    this.elemento.recursos = this.elemento.recursos;
                }
            })
    }

    dateChangeInitial(event) {
        this.minDateFinal = event.value;
        var date2: any = new Date(this.minDate);
        let day = 1 * 24;
        var numberOfMlSeconds = date2.getTime();
        var addMlSeconds = (1000 * 60 * 60 * day);
        this.maxdate = new Date(numberOfMlSeconds + addMlSeconds);
    }

    dateChange(event) {
        var date2: any = new Date(this.minDate);
        let day = 1 * 24;
        var numberOfMlSeconds = date2.getTime();
        var addMlSeconds = (1000 * 60 * 60 * day);
        this.maxdate = new Date(numberOfMlSeconds + addMlSeconds);
    }

    private getDocumentType() {
        this._uploadFileDataService
            .getMinuteType()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res != null) {
                    this.tipoModificacion = res;
                }
            });
    }

    
    private getCdp() {
        this._genericService.getCpcType()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                this.cpcType = response;
            }, (response) => {
                // Set the alert
                console.log(response);

                swal.fire('', 'Error al registrar la información!', 'error');
            });
    }

    changecpcType(e: any) {
        let cpcN: CpcType = this.cpcType.find(f => f.id == e.value);
        this.modifyForm.patchValue({
            cpc: cpcN.cpcName,
        })
        this.elemento.nombreCpc = cpcN.cpcName;
    }

    onChangeTotalValue(event) {
        debugger
        if (this.modifyForm.value.additionValue != null ) {
            // if (this.totalValue != this.elementForm.value.totalValue) {
            //     if (this.totalValue < Number(this.elementForm.value.totalValue.toString().replace(/\./g, ''))) {
            //         this.recursos = Math.round(Number(this.elementForm.value.totalValue.toString().replace(/\./g, '')) - Number(this.totalValue));
            //     } else if (this.totalValue > Number(this.elementForm.value.totalValue.toString().replace(/\./g, ''))) {
            //         this.recursos = Math.round(Number(this.totalValue) - Number(this.elementForm.value.totalValue.toString().replace(/\./g, '')));
            //     }
            // }
            this.exactTotal = Math.round(Number(this.modifyForm.value.totalValue.toString().replace(/\./g, '')) + Number(this.modifyForm.value.additionValue.toString().replace(/\./g, '')))
            this.modifyForm.patchValue({
                calculateValue: this._genericService.addCommasToNumber(this.exactTotal),
            })
            
        } else {
            swal.fire('', 'Valores no validos!', 'warning');

        }
    }

    subscribeToValueChanges(controlName: string): void {
        this.modifyForm.get(controlName).valueChanges.subscribe(value => {
            this.formatNumberWithCommas(controlName, value);
            if(Number(value.toString().replace(/\./g, '')) > Number(this.modifyForm.value.resources.toString().replace(/\./g, ''))){
                swal.fire('', 'El valor no puede ser mayor a los recursos disponibles!', 'warning');

                this.modifyForm.patchValue({
                    additionValue: this._genericService.addCommasToNumber(this.modifyForm.value.resources),
                });
            }else{
                this.formatNumberWithCommas(controlName, value);
                let porcentaje = (Number(this.modifyForm.value.totalValue.toString().replace(/\./g, '')) * 30) / 100;
                if(Number(value.toString().replace(/\./g, '')) >(porcentaje)){
                    swal.fire('', 'El valor no puede ser mayor al 30% del valor del contrato!', 'warning');
                }
            }

        });
    }

    formatNumberWithCommas(controlName: string, value: number): void {
        if(value > 0 && value != null){
            const control = this.modifyForm.get(controlName);
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

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
