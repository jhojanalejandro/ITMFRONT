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
import { NominaService } from '../../nomina/service/nomina.service';



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
    cpcId: string = null;
    disableField: boolean = true;
    resources: any= null;
    totalValue: any = null;
    exactTotal: number = 0;
    isAddition: boolean = false;
    elementData: any;
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
    economicData: any;

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
        private _nominaService: NominaService,
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
            contractorCant: new FormControl(null, Validators.required),
            cantDay: new FormControl({value: null, disabled: true }, Validators.required),
            unitValue: new FormControl({value: null, disabled: true }, Validators.required),
            totalValue: new FormControl({value: null, disabled: true }, Validators.required),
            unitValueDay: new FormControl({value: null, disabled: true }, Validators.required),
            calculateValue: new FormControl(null, Validators.required),
            additionValue: new FormControl(null, Validators.required),
            elementType: new FormControl(null, Validators.required),
            elementName: new FormControl({value: null, disabled: true }, Validators.required),
            modification: new FormControl(null, Validators.required),
            resources: new FormControl({value: null, disabled: true }, Validators.required),
            initialAdditionDate: new FormControl(null),
            finalAdditionDate: new FormControl(null),
            modificationType: new FormControl(null, Validators.required),
            elementObject: new FormControl({value: null, disabled: true }, Validators.required),
            specificObligations: new FormControl(null, Validators.required),
            generalObligations: new FormControl(null, Validators.required),
            initialDateContract: new FormControl({value: null, disabled: true }, Validators.required),
            finalDateContract: new FormControl({value: null, disabled: true }, Validators.required),
            academicProfile: new FormControl(null, Validators.required),
            profesionalProfile: new FormControl(null, Validators.required),
            noAddition: new FormControl(null, Validators.required)
        });
        this.filteredOptions =
            this.modifyForm.controls.elementName.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
        this.getDocumentType();
        this.getDateContract();
        this.subscribeToValueChanges('additionValue');
        this.getEconomicData();
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
        if(this.exactTotal == 0){
            this.exactTotal = this.totalValue;
        }
        let changeContractModel: ModifyContractor = {
            elementName: this.elementData.nombreElemento,
            cantidadContratistas: this.modifyForm.value.contractorCant,
            cantDays: this.modifyForm.value.cantDay == null ? this.elementData.cantidadDias : this.modifyForm.value.cantDay,
            unitValue:this.modifyForm.value.unitValue != null ? Number(this.modifyForm.value.unitValue.toString().replace(/\./g, '')) : this.elementData.valorUnidad,
            totalValue:  this.exactTotal,
            valueDay: this.modifyForm.value.unitValueDay != null ? Number(this.modifyForm.value.unitValueDay.toString().replace(/\./g, '')) : this.elementData.valorPorDia,
            valorPorDiaContratista: 0,
            valorTotalContratista: 0,
            cpcId: this.cpcId,
            isModify: modificacion,
            resources: 0,
            consecutive: '1',
            specificObligations: this.modifyForm.value.specificObligations,
            generalObligations: this.modifyForm.value.generalObligations,
            elementObject: this.modifyForm.value.elementObject == null ? this.elementData.objetoElemento : this.modifyForm.value.elementObject,
            perfilRequeridoAcademico: this.modifyForm.value.academicProfile,
            perfilRequeridoExperiencia: this.modifyForm.value.profesionalProfile,
            noAddition: this.modifyForm.value.noAddition,
            contractorId: this._data.data.id,
            contractId: this._data.contractId,
            minuteType: this.modifyForm.value.modificationType,
            initialAdditionDate: this.modifyForm.value.initialAdditionDate,
            finalAdditionDate: this.modifyForm.value.finalAdditionDate,
            isAddition: this.isAddition,
            registerDate: new Date(),
            debt: this.modifyForm.value.unitValueDay
        };
        this._contractorService
            .saveMinuteModify(changeContractModel)
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
        let unitValue = Number(
            (this.modifyForm.value.unitValue / 30) *
            this.modifyForm.value.contractorCant
        );

        let totalVlue = Number(
            Number(this.modifyForm.value.unitValueDay) * this.modifyForm.value.cantDay
        );
        let paymentDayContractor =
            this.modifyForm.value.unitValueDay / Number(this.modifyForm.value.cantDay);
            this.modifyForm.patchValue({
                unitValue: this._genericService.addCommasToNumber(unitValue),
                unitValueDay: this._genericService.addCommasToNumber(paymentDayContractor),
                totalValue: this._genericService.addCommasToNumber(totalVlue),
            });
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
                this.cpcId = resp.cpcId;
                this.elementData = resp;
                this.modifyForm.patchValue({
                    elementName: resp.nombreElemento,
                    resources: this._genericService.addCommasToNumber(resp.recursos),
                    cantDay: resp.cantidadDias,
                    elementObject: resp.objetoElemento,
                    academicProfile: resp.perfilRequeridoAcademico,
                    profesionalProfile: resp.perfilRequeridoExperiencia,
                    specificObligations: resp.obligacionesEspecificas,
                    generalObligations: resp.obligacionesGenerales
                });
            })
    }

    private getEconomicData() {
        let contractorId: string[] = [this._data.data.id]
        let filterData = {
            contractors: contractorId,
            contractId: this._data.contractId
        }
        this._nominaService.getByIdEconomicDataContractor(filterData)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp) => {
                this.totalValue = resp[0].totalValue;
                this.economicData = resp[0]
                this.modifyForm.patchValue({
                    cantDay: resp.cantidadDias,
                    unitValue: this._genericService.addCommasToNumber(resp[0].unitValue),
                    unitValueDay: this._genericService.addCommasToNumber(resp[0].debt),
                    totalValue: this._genericService.addCommasToNumber(resp[0].totalValue)
                });
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


    onChangeTotalValue(event) {
        if (this.modifyForm.value.additionValue != null ) {
            // if (this.totalValue != this.elementForm.value.totalValue) {
            //     if (this.totalValue < Number(this.elementForm.value.totalValue.toString().replace(/\./g, ''))) {
            //         this.recursos = Math.round(Number(this.elementForm.value.totalValue.toString().replace(/\./g, '')) - Number(this.totalValue));
            //     } else if (this.totalValue > Number(this.elementForm.value.totalValue.toString().replace(/\./g, ''))) {
            //         this.recursos = Math.round(Number(this.totalValue) - Number(this.elementForm.value.totalValue.toString().replace(/\./g, '')));
            //     }
            // }
            this.exactTotal = Math.round(this.totalValue+ Number(this.modifyForm.value.additionValue.toString().replace(/\./g, '')))
            this.modifyForm.patchValue({
                calculateValue: this._genericService.addCommasToNumber(this.exactTotal),
            });

        } else {
            swal.fire('', 'Valores no validos!', 'warning');

        }
    }

    subscribeToValueChanges(controlName: string): void {
        this.modifyForm.get(controlName).valueChanges.subscribe(value => {
            this.formatNumberWithCommas(controlName, value);
            if(Number(value.toString().replace(/\./g, '')) > this.resources){
                swal.fire('', 'El valor no puede ser mayor a los recursos disponibles!', 'warning');

                this.modifyForm.patchValue({
                    additionValue: this._genericService.addCommasToNumber(this.resources),
                });
            }else{
                this.formatNumberWithCommas(controlName, value);
                let porcentaje = (this.totalValue * 30) / 100;
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
