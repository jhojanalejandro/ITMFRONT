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
import * as moment from 'moment';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { DetalleContrato, ElementComponent, Elements } from 'app/modules/admin/pages/planing/models/planing-model';
import { PlaningService } from 'app/modules/admin/pages/planing/service/planing.service';
import { DocumentTypeFileCodes } from 'app/layout/common/enums/document-type/document-type';
import { UploadFileDataService } from '../../../service/upload-file.service';


@Component({
    selector: 'app-modificacion-form',
    templateUrl: './modificacion-form.component.html',
    styleUrls: ['./modificacion-form.component.scss'],
})
export class ModificacionFormComponent implements OnInit {
    @ViewChild('signInNgForm') elementInNgForm: NgForm;
    filteredOptions: Observable<string[]>;
    modificaciones: any = GlobalConst.requierePoliza;
    tipoModificacion: any;
    showDate: boolean = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    elementoCtrl = new FormControl('');
    elemento: ElementComponent = { nombreElemento: null, componentId: null, cantidadContratistas: null, cantidadDias: null, valorUnidad: null, valorTotal: null, valorPorDia: null, cpc: null, nombreCpc: null, modificacion: false, tipoElemento: null, recursos: 0, consecutivo: null, obligacionesGenerales: null, obligacionesEspecificas: null, valorPorDiaContratista: null, valorTotalContratista: null, objetoElemento: null, activityId: null }
    disableField: boolean = true;
    dateAdiction: DetalleContrato = {
        contractId: null,
        fechaContrato: null,
        fechaFinalizacion: null,
        tipoContrato: null,
    };
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
    showPayment: boolean = true;
    showModify: boolean = true;
    configForm: FormGroup;
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    modifyForm: FormGroup;
    minDate: Date;
    maxdate: Date;
    minDateFinal: Date;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public matDialogRef: MatDialogRef<ModificacionFormComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private _data: { data: any, contractId: string },
        private _fuseConfirmationService: FuseConfirmationService,
        private _planingService: PlaningService,
        private _router: Router,
        private _genericService: GenericService,
        private _uploadFileDataService: UploadFileDataService,
    ) {
        setInterval(() => {
            this.numberOfTicks++;
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
        }, 1000);

    }

    ngOnInit(): void {
        console.log(this._data.data.elementId);
        if (this._data.data.elementId != 0) {
            this.getDataElemento();
            this.getDateAdiction();
        } else {
            swal.fire(
                'precaución',
                'El contratista debe tener un elemento asignado', 'warning'
            );
            this._router.navigateByUrl('dashboards/lista-contratistas/' + this._data.contractId);
            this.matDialogRef.close();
        }


        this.modifyForm = this._formBuilder.group({
            contractorCant: new FormControl(this.elemento.cantidadContratistas, Validators.required),
            cantDay: new FormControl(this.elemento.cantidadDias, Validators.required),
            unitValue: new FormControl(null, Validators.required),
            totalValue: new FormControl(null, Validators.required),
            unitValueDay: new FormControl(null, Validators.required),
            calculateValue: new FormControl(null, Validators.required),
            cpc: new FormControl(this.elemento.cpc, Validators.required),
            nombreCpc: new FormControl(this.elemento.nombreCpc, Validators.required),
            tipoElemento: new FormControl(null, Validators.required),
            nombreElemento: new FormControl(null, Validators.required),
            modificacion: new FormControl(null, Validators.required),
            recursos: new FormControl(null, Validators.required),
            fechaInicioAmpliacion: new FormControl(null),
            fechaFinalAmpliacion: new FormControl(null),
            tipoModificacion: new FormControl(null, Validators.required),
            objetoElemento: new FormControl(null, Validators.required),
            obligacionesEspecificas: new FormControl(null, Validators.required),
            obligacionesGenerales: new FormControl(null, Validators.required),
        });
        this.filteredOptions =
            this.modifyForm.controls.nombreElemento.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
            this.getDocumentType();
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

    addModify() {
        let modificacion: any;
        if (this.modifyForm.value.modificacion === 'Si') {
            modificacion = true;
        } else {
            modificacion = true;
        }
        let item: Elements = {
            nombreElemento: this.modifyForm.value.nombreElemento,
            componentId: this._data.data.idComponente,
            cantidadContratistas: this.modifyForm.value.contractorCant,
            cantidadDias: this.modifyForm.value.cantDay,
            valorUnidad: this.modifyForm.value.unitValue,
            valorTotal: this.modifyForm.value.totalValue,
            valorPorDia: this.modifyForm.value.unitValueDay,
            valorPorDiaContratista: this.modifyForm.value.valorDiaContratista,
            valorTotalContratista: 0,
            cpcId: this.modifyForm.value.cpc,
            modificacion: modificacion,
            tipoElemento: this.modifyForm.value.tipoElemento,
            recursos: this.modifyForm.value.recursos,
            consecutivo: this.modifyForm.value.consecutivo,
            obligacionesEspecificas: this.modifyForm.value.obligacionesEspecificas,
            obligacionesGenerales: this.modifyForm.value.obligacionesGenerales,
            objetoElemento: this.modifyForm.value.objetoElemento,
            activityId: this._data.data.activityId

        };

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
                }
                this._changeDetectorRef.detectChanges();
            }, (response) => {
                // Set the alert
                swal.fire('Error', 'Error al registrar la información!', 'error');
            });
        this.matDialogRef.close();
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
        let codeMinute = this.tipoModificacion.find(f =>f.id == event.value).code;
        
        switch (codeMinute) {
            case DocumentTypeFileCodes.MC:
                this.showDate = false;
                this.showPayment = false;
                this.showModify = true;
                break;
            case DocumentTypeFileCodes.APC:
                this.showDate = true;
                this.showPayment = false;
                this.showModify = false;
                break;
            case DocumentTypeFileCodes.ADC:
                this.showDate = false;
                this.showPayment = true;
                this.showModify = false;
                break;
            case DocumentTypeFileCodes.AAM:
                this.showDate = true;
                this.showPayment = true;
                this.showModify = true;
                break;
            case DocumentTypeFileCodes.AM:
                this.showDate = false;
                this.showPayment = false;
                this.showModify = true;
                break;
            case DocumentTypeFileCodes.AA:
                this.showDate = true;
                this.showPayment = true;
                this.showModify = false;
                break;
            case DocumentTypeFileCodes.ADMC:
                this.showDate = false;
                this.showPayment = true;
                this.showModify = true;
                break;
            default:
                this.showDate = true;
                this.showPayment = true;
                this.showModify = true;
                break;
        }
        if (event.value === 'Modificación' || event.value === 'Adición, Ampliación, Modificacion' || event.value === 'Ampliación y Modificacion' || event.value === 'Adición y Modificacion') {
            this.showDate = true;
        } else if (event.value === 'Ampliación' || event.value === 'Adición y Ampliación' || event.value === 'Adición, Ampliación, Modificacion') {
            this.showPayment = true;
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
    getDateAdiction() {
        this._genericService.getDetalleContractById(this._data.contractId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (resp) => {

                    this.dateAdiction = resp;
                }
            );
    }
    getDataElemento() {
        this._planingService.getElementoById(this._data.data.elementId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp) => {
                if (resp !=  null) {
                    this.elemento = resp;
                    if(this.elemento.cpc == undefined){
                        this.elemento.cpc = null;
                    }
                    if(this.elemento.nombreCpc == undefined){
                        this.elemento.nombreCpc = null;
                    }
                    this.elemento.valorUnidad = this.elemento.valorUnidad;
                    this.elemento.valorPorDia = this.elemento.valorPorDia;
                    this.elemento.valorTotal = this.elemento.valorTotal;
                    this.elemento.recursos = this.elemento.recursos;
                }
            })
    }

    dateChange(event) {
        this.minDate = event.value;
        var date2: any = new Date(this.minDate);
        let day = 1 * 24;
        var numberOfMlSeconds = date2.getTime();
        var addMlSeconds = (1000 * 60 * 60 * day);
        this.maxdate = new Date(numberOfMlSeconds + addMlSeconds);
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
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
