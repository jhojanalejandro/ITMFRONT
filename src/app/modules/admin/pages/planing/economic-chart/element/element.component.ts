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
    element: string = null;
    numberOfTicks = 0;
    contractorCant: any = null;
    nombreCpc = '';
    cantDay: number = null;
    nombreElemento: string;
    unitValue: any = null;
    unitValueDay: any = null;
    update: boolean;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalValue: any = null;
    unitValueMonth: any = null;
    totalCost: any = null;
    cpc = '';
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
        private _data: any,
        private _fuseConfirmationService: FuseConfirmationService,
        private _service: EconomicChartService
    ) {
        setInterval(() => {
            this.numberOfTicks++;
            // require view to be updated
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
        }, 1000);

        this.elementForm = this._formBuilder.group({
            contractorCant: new FormControl(this.contractorCant,Validators.required),
            cantDay: new FormControl(this.cantDay, Validators.required),
            unitValue: new FormControl(this.unitValue, Validators.required),
            totalValue: new FormControl(this.totalValue, Validators.required),
            id: new FormControl(this.id),
            unitValueDay: new FormControl(this.unitValueDay, Validators.required),
            calculateValue: new FormControl(this.totalCost, Validators.required),
            cpc: new FormControl(this.cpc, Validators.required),
            nombreCpc: new FormControl(this.nombreCpc, Validators.required),
            tipoElemento: new FormControl(null, Validators.required),
            nombreElemento: new FormControl(null, Validators.required),
            adicion: new FormControl(null, Validators.required),

        });
        this.filteredOptions =
            this.elementForm.controls.nombreElemento.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
    }
  
    ngOnInit(): void {
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
        this._service
            .getElementoComponente(this._data)
            .subscribe((response) => {
                this.elementos = response;
            });
    }

    addElement() {
        let adicion: any;
        if(this.elementForm.value.adicion === 'Si'){
            adicion = true;
        }else{
            adicion = true;
        }
        debugger
        let item: IElements = {
            id: 0,
            nombreElemento: this.elementForm.value.nombreElemento,
            idComponente: this._data,
            cantidadContratistas: this.elementForm.value.contractorCant,
            cantidadDias: this.elementForm.value.cantDay,
            valorUnidad: this.elementForm.value.unitValue,
            valorTotal: this.elementForm.value.totalValue,
            valorPorDia: this.elementForm.value.unitValueDay,
            cpc: this.elementForm.value.cpc,
            nombreCpc: this.elementForm.value.nombreCpc,
            adicion: adicion,
            tipoElemento: this.elementForm.value.tipoElemento
        };

        this._service.addElementoComponente(item).subscribe((response) => {
            if(response){
                swal.fire('Registrado Exitoso!', '', 'success');
            }
            this._changeDetectorRef.detectChanges();
        },      (response) => {
            // Set the alert
            swal.fire('Error en el registro!', '', 'error');
        });
        this.matDialogRef.close(this.listElements);
    }

    calculate = () => {
        const findEl = this.elementos.find((e) => e.nombreCpc == this.element);
        this.totalCalculate = false;
        this.elementForm.value.unitValueDay = Number(
            (this.elementForm.value.unitValue / 30) *
                this.elementForm.value.contractorCant
        );
        this.totalValue = this.elementForm.value.totalValue;
        this.unitValueDay = this.elementForm.value.unitValueDay;
        this.elementForm.value.totalValue = Number(
            this.unitValueDay * this.elementForm.value.cantDay
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
