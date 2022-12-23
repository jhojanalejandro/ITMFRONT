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
    Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import * as moment from 'moment';
import { map, Observable, startWith, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { EconomicChartService } from '../../economic-chart.service';
import { ElementCardComponent } from '../../element/element.component';
import { IComponente } from '../../../models/componente';

@Component({
    selector: 'app-componentes-form',
    templateUrl: './componentes-form.component.html',
    styleUrls: ['./componentes-form.component.scss'],
})
export class ComponentesFormComponent implements OnInit {
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl('');
    filteredFruits: Observable<string[]>;
    fruits: string[] = [];
    allFruits: string[] = ['Profesional En Sistemas'];
    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    abrirDiv: boolean = false;
    numberOfTicks = 0;
    data: any;
    componentName: string = null;
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
        public matDialogRef: MatDialogRef<ComponentesFormComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _fuseConfirmationService: FuseConfirmationService,
        private _Economicservice: EconomicChartService,
        private _matDialog: MatDialog
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

    abrirDivHtml() {
        this.abrirDiv = true;
    }
    /**
     * On init
     */
    ngOnInit(): void {
        // Get the board
        this.componentForm = this._formBuilder.group({
            componentName: new FormControl(
                this.componentName,
                Validators.required
            ),
            consecutivo: new FormControl(
                this.componentName,
                Validators.required
            ),
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
            idContrato: this._data.e,
            nombreComponente: this.componentForm.value.componentName,
            id: 0,
            elementos: [],
        };
        this._Economicservice.addComponent(model).subscribe((response) => {
            if (response) {
                Swal.fire(
                    'Buen Trabajo!',
                    'Se guardó la información!',
                    'success'
                );
            }
        });
        this.matDialogRef.close(this.data);
    }

    addElements(e: any) {
        const dialogRef = this._matDialog.open(ElementCardComponent, {
            autoFocus: false,
            data: {
                e,
                show: true,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
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
