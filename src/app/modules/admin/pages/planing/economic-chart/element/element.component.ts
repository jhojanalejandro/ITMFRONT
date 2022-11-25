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
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { IElements } from '../models/element';
import { ListElements } from '../models/list-elements';
import Swal from 'sweetalert2';
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
            contractorCant: new FormControl(
                this.contractorCant,
                Validators.required
            ),
            cantDay: new FormControl(this.cantDay),
            unitValue: new FormControl(this.unitValue, Validators.required),
            totalValue: new FormControl(this.totalValue),
            id: new FormControl(this.id),
            unitValueDay: new FormControl(this.unitValueDay),
            calculateValue: new FormControl(this.totalCost),
            cpc: new FormControl(this.cpc),
            nombreCpc: new FormControl(this.nombreCpc),
            tipoElemento: new FormControl(null, Validators.required),
            nombreElemento: new FormControl(null, Validators.required),
        });
        this.filteredOptions =
            this.elementForm.controls.nombreElemento.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
    }
  
    ngOnInit(): void {}

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
        let model: IElements[] = [];
        let item: IElements = {
            id: 0,
            idComponente: this._data.data.id,
            cantidadContratistas: 0,
            cantidadDias: 0,
            valorUnidad: 0,
            valorTotal: 0,
            valorPorDia: 0,
            cpc: null,
            nombreCpc: null,
        };
        this.elementos.forEach((e) => {
            (item.cantidadContratistas = e.cantidadContratistas),
                (item.cantidadDias = e.cantidadDias),
                (item.valorTotal = e.valorTotal),
                (item.valorUnidad = e.valorUnidad),
                (item.valorPorDia = e.valorPorDia),
                (item.cpc = e.cpc),
                (item.nombreCpc = e.nombreCpc),
                (item.id = e.id),
                model.push(item);
        });
        this._service.addElementoComponente(model).subscribe((response) => {
            this._changeDetectorRef.detectChanges();
        });
        this.matDialogRef.close(this.listElements);
    }

    calculate = () => {
        const findEl = this.elementos.find((e) => e.nombreCpc == this.element);
        this.totalCalculate = false;
        this.unitValueDay = Number(
            (this.elementForm.value.unitValue / 30) *
                this.elementForm.value.contractorCant
        );
        this.totalValue = Number(
            this.unitValueDay * this.elementForm.value.cantDay
        );
        let paymentDayContractor =
            this.unitValueDay / Number(this.elementForm.value.cantDay);
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
