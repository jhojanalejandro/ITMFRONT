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
import { Elements } from '../models/element';
import { ListElements } from '../models/list-elements';
import Swal from 'sweetalert2';
import { EconomicChartService } from '../economic-chart.service';

@Component({
    selector: 'app-alement',
    styleUrls: ['./element.component.scss'],
    templateUrl: './element.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementCardComponent implements OnInit, OnDestroy {
    @ViewChild('signInNgForm') elementInNgForm: NgForm;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl('');
    filteredFruits: Observable<string[]>;
    elementos: Elements[] = [];
    allFruits: string[] = [
        'Profesional En Sistemas',
        'Profesional en areas de derecho',
        'Profesional Especializado',
        'Tecnologo',
    ];
    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    element: string = null;
    numberOfTicks = 0;
    componentName: string = null;
    contractorCant: any = null;
    cantDay: number = null;
    unitValue: any = null;
    unitValueDay: number = null;
    update: boolean;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalValue: any = null;
    unitValueMonth: any = null;
    totalCost: any = null;
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
        private _data: { data: any; show: boolean },
        private _fuseConfirmationService: FuseConfirmationService,
        private _service: EconomicChartService
    ) {
        this.getElements();
        setInterval(() => {
            this.numberOfTicks++;
            // require view to be updated
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
        }, 1000);
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) =>
                fruit ? this._filter(fruit) : this.allFruits.slice()
            )
        );
    }
    /**
     * On init
     */
    ngOnInit(): void {
        this.update = this._data.show;
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
        });

        this.configForm = this._formBuilder.group({
            title: 'Error en la información',
            message:
                '!Los valores registrados no coinciden  <span class="font-medium">¡Verifica que los valores sean los correctos!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Volver',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancelar',
                }),
            }),
            dismissible: true,
        });
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
            .getElementoComponente(this._data.data.id)
            .subscribe((response) => {
                this.elementos = response;
            });
    }

    addContractor() {
        let model: any[] = [];
        let item = {
            id: 0,
            idComponenete: this._data.data.id,
            cantidadContratistas: 0,
            cantidadDias: 0,
            valorUnidad: 0,
            valorTotal: 0,
            valorPorDia: 0,
        };
        this.elementos.forEach((e) => {
            (item.cantidadContratistas = e.cantidadContratistas),
                (item.cantidadDias = e.cantidadDias),
                (item.valorTotal = e.valorTotal),
                (item.valorUnidad = e.valorUnidad),
                (item.valorPorDia = e.valorPorDia),
                (item.id = e.id),
                model.push(item);
        });
        this._service.addElementoComponente(model).subscribe((response) => {});
        this.matDialogRef.close(this.listElements);
    }

    calculate = (element: any) => {
        debugger;
        const findEl = this.elementos.find((e) => e.id == element);
        this.totalCalculate = false;
        this.unitValueDay = Number(findEl.valorUnidad / 30);
        this.totalCost = Number(
          findEl.valorUnidad * findEl.cantidadContratistas
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

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        this.element = value;
        let idElement = this.elementos.length;
        let elet: Elements = {
            id: idElement + 1,
            idComponente: event.value,
            cantidadContratistas: 0,
            cantidadDias: 0,
            valorPorDia: 0,
            valorTotal: 0,
            valorUnidad: 0,
        };
        if (value) {
            this.elementos.push(elet);
        }

        // Clear the input value
        event.chipInput!.clear();

        this.fruitCtrl.setValue(null);
        this.elementForm.reset();
    }

    remove(element: Elements, id: any): void {
        const index = this.elementos.indexOf(element);
        if (index >= 0) {
            this.elementos.splice(index, 1);
        }
    }

    showElemewnt = (element: Elements) => {
        this.element = element.id;
        this.cantDay = element.cantidadDias;
        this.totalValue = element.valorTotal;
        this.contractorCant = element.cantidadContratistas;
        this.unitValue = element.valorUnidad;
        this.unitValueDay = element.valorPorDia;
    };

    selected(event: MatAutocompleteSelectedEvent): void {
        let idElement = this.elementos.length;
        let elet: Elements = {
            id: idElement,
            idComponente: event.option.viewValue,
            cantidadContratistas: 0,
            cantidadDias: 0,
            valorTotal: 0,
            valorPorDia: 0,
            valorUnidad: 0,
        };
        this.element = event.option.viewValue;
        this.elementos.push(elet);
        this.fruitInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
        Swal.fire(
            'Buen trabajo!',
            'Recuerda seleccionar el elemento para asignar los valores!',
            'success'
        );
        this.elementForm.reset();
    }
    asign = (item: any) => {
        const findEl = this.elementos.find((e) => e.id == item);
        const index = this.elementos.indexOf(findEl);
        let elet: Elements = {
            id: findEl.id,
            idComponente: this.element,
            cantidadContratistas: this.elementForm.value.contractorCant
                ? this.elementForm.value.contractorCant
                : 0,
            cantidadDias: this.elementForm.value.cantDay
                ? this.elementForm.value.cantDay
                : 0,
            valorTotal: this.elementForm.value.totalValue
                ? this.elementForm.value.totalValue
                : 0,
            valorUnidad: this.elementForm.value.unitValue
                ? this.elementForm.value.unitValue
                : 0,
            valorPorDia: this.elementForm.value.unitValueDay
                ? this.elementForm.value.unitValueDay
                : 0,
        };
        this.elementos.splice(index, 1, elet);
        this.addElementos(this.elementos);
    };

    addElementos(e: any) {
        console.log('datos', e);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allFruits.filter((fruit) =>
            fruit.toLowerCase().includes(filterValue)
        );
    }
}
