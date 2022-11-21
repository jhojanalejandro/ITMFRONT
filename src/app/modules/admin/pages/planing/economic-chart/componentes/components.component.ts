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
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    debounceTime,
    map,
    Observable,
    startWith,
    Subject,
    takeUntil,
    tap,
} from 'rxjs';
import * as moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { EconomicChartService } from '../economic-chart.service';
import { IComponente } from '../models/componente';
import swal from 'sweetalert2';

@Component({
    selector: 'components-card',
    styleUrls: ['./components.component.scss'],
    templateUrl: './components.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponentsComponent implements OnInit, OnDestroy {
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl('');
    filteredFruits: Observable<string[]>;
    fruits: string[] = [];
    allFruits: string[] = ['Profesional En Sistemas'];
    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

    numberOfTicks = 0;
    data: any;
    componentName: string = null;
    rubro: string = null;
    nombreRubro: string = null;
    update: boolean;
    id: string = null;
    configForm: FormGroup;
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    componentForm: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<AddComponentsComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: { data: any; show: boolean },
        private _fuseConfirmationService: FuseConfirmationService,
        private _Economicservice: EconomicChartService
    ) {
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
        if (this._data.show) {
            this.componentName = this._data.data.componentName;
        }
        this.update = this._data.show;
        // Get the board
        this.componentForm = this._formBuilder.group({
            componentName: new FormControl(
                this.componentName,
                Validators.required
            ),
            rubro: new FormControl(
                this.rubro,
                Validators.required
            ),
            nombreRubro: new FormControl(
                this.nombreRubro,
                Validators.required
            ),
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

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Check if the given date is overdue
     */
    isOverdue(date: string): boolean {
        return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    addComponent() {
        this.data = this.componentForm.value;
        let model: IComponente = {
            idContrato: this._data.data.id,
            nombreComponente: this.componentForm.value.componentName,
            id: 0,
            rubro: this.componentForm.value.rubro,
            nombreRubro: this.componentForm.value.nombreRubro,
        };
        this._Economicservice.addComponent(model).subscribe((response) => {
            if (response) {
                swal.fire('informacion Eliminada Exitosamente!', '', 'success');
            }
        });
        this.matDialogRef.close(this.data);
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

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our fruit
        if (value) {
            this.fruits.push(value);
        }

        // Clear the input value
        event.chipInput!.clear();

        this.fruitCtrl.setValue(null);
    }

    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.fruits.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allFruits.filter((fruit) =>
            fruit.toLowerCase().includes(filterValue)
        );
    }
}
