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
import { IElements } from '../../../../dashboards/contractual/models/element';
import { ListElements } from '../models/list-elements';
import swal from 'sweetalert2';
import { EconomicChartService } from '../economic-chart.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { DetalleContrato } from '../models/detalle-contrato';

@Component({
    selector: 'app-alement',
    styleUrls: ['./element.component.scss'],
    templateUrl: './element.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementCardComponent implements OnInit, OnDestroy {
    @ViewChild('signInNgForm') elementInNgForm: NgForm;
    filteredOptions: Observable<string[]>;
    adiciones: any = GlobalConst.requierePoliza;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    elementoCtrl = new FormControl('');
    dateAdiction$: Observable<DetalleContrato[]>;
    filteredelementos: Observable<string[]>;
    elementos: IElements[] = [];
    allelementos: string[] = [
        'Profesional En Sistemas',
        'Profesional en areas de derecho',
        'Profesional Especializad',
        'Tecnologo',
    ];
    tipoElementos: any = GlobalConst.tipoElemento;
    @ViewChild('elementoInput') elementoInput: ElementRef<HTMLInputElement>;
    numberOfTicks = 0;
    elemento: IElements = { nombreElemento: null, idComponente: null, cantidadContratistas: null, cantidadDias: null, valorUnidad: null, valorTotal: null, valorPorDia: null, cpc: null, nombreCpc: null, adicion: false, tipoElemento: null, recursos: null }
    recursos: number;
    totalExacto: number;
    update: boolean;
    showDate: boolean = true;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalValue: any = null;
    unitValueMonth: any = null;
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
        if(this._data != null){
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
            contractorCant: new FormControl(this.elemento.cantidadContratistas, Validators.required),
            cantDay: new FormControl(this.elemento.cantidadDias, Validators.required),
            unitValue: new FormControl(this.elemento.valorUnidad, Validators.required),
            totalValue: new FormControl(this.totalValue, Validators.required),
            id: new FormControl(this.id),
            unitValueDay: new FormControl(this.elemento.valorPorDia, Validators.required),
            totalExacto: new FormControl(this.totalExacto, Validators.required),
            cpc: new FormControl(this.elemento.cpc, Validators.required),
            nombreCpc: new FormControl(this.elemento.nombreCpc, Validators.required),
            tipoElemento: new FormControl(this.elemento.tipoElemento, Validators.required),
            nombreElemento: new FormControl(this.elemento.nombreElemento, Validators.required),
            adicion: new FormControl(null, Validators.required),
            recursos: new FormControl(this.elemento.recursos, Validators.required),
            fechaAdicion: new FormControl(null, Validators.required),

        });
        this.filteredOptions =
            this.elementForm.controls.nombreElemento.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
    }

    ngOnInit(): void {
        debugger;
        console.log(this._data);

        this.getDateAdiction();

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
        let adicion: any;
        if (this.elementForm.value.adicion === 'Si') {
            adicion = true;
        } else {
            adicion = true;
        }
        debugger
        let item: IElements = {
            id: 0,
            nombreElemento: this.elementForm.value.nombreElemento,
            idComponente: this._data.idComponente,
            cantidadContratistas: this.elementForm.value.contractorCant,
            cantidadDias: this.elementForm.value.cantDay,
            valorUnidad: this.elementForm.value.unitValue,
            valorTotal: this.elementForm.value.totalValue,
            valorPorDia: this.elementForm.value.unitValueDay,
            cpc: this.elementForm.value.cpc,
            nombreCpc: this.elementForm.value.nombreCpc,
            adicion: adicion,
            tipoElemento: this.elementForm.value.tipoElemento,
            recursos: this.elementForm.value.recursos
        };

        this._economicService.addElementoComponente(item).subscribe((response) => {
            if (response) {
                swal.fire('Registrado Exitoso!', '', 'success');
            }
            this._changeDetectorRef.detectChanges();
        }, (response) => {
            // Set the alert
            swal.fire('Error en el registro!', '', 'error');
        });
        this.matDialogRef.close(this.listElements);
    }

    calculate = () => {
        this.totalCalculate = false;
        this.elementForm.value.unitValueDay = Number(
            (this.elementForm.value.unitValue / 30) *
            this.elementForm.value.contractorCant
        );
        this.elemento.valorPorDia = this.elementForm.value.unitValueDay;
        debugger
        if (this.elementForm.value.totalValue == null) {
            this.totalValue = this.elementForm.value.totalValue;
            this.totalValue = Number(
                this.elemento.valorPorDia * this.elementForm.value.cantDay
            );
        } else {
            this.totalExacto = this.elementForm.value.totalValue;
            this.totalExacto = Number(
                this.elemento.valorPorDia * this.elementForm.value.cantDay
            );
            this.recursos = this.totalExacto - this.elementForm.value.totalValue;
        }

    };

    selectAdicion() {
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
}
