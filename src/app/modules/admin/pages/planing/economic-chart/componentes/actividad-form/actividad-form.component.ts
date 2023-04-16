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
import { EconomicChartService } from '../../../service/economic-chart.service';
import { Activity } from '../../../models/planing-model';

@Component({
    selector: 'app-componentes-form',
    templateUrl: './actividad-form.component.html',
    styleUrls: ['./actividad-form.component.scss'],
})
export class ActividadFormComponent implements OnInit {
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl('');
    filteredFruits: Observable<string[]>;
    fruits: string[] = [];
    allFruits: string[] = ['Profesional En Sistemas'];
    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    abrirDiv: boolean = false;
    numberOfTicks = 0;
    data: any;
    nombreActivivdad: string = null;
    update: boolean;
    id: any = 0;
    configForm: FormGroup;
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    componentForm: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<ActividadFormComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _fuseConfirmationService: FuseConfirmationService,
        private _Economicservice: EconomicChartService,
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
        if(this._data.componente != null){
            this.id = this._data.componente.id;
            this.nombreActivivdad = this._data.componente.nombreComponente;
            
        }
        this.componentForm = this._formBuilder.group({
            activityName: new FormControl(this.nombreActivivdad,Validators.required)
        });
    }

    abrirDivHtml() {
        this.abrirDiv = true;
    }

    ngOnInit(): void { 
        
    }

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

    addActivity() {
        if (!this.componentForm.invalid) {
            if( this.nombreActivivdad === null){
                this.nombreActivivdad = this.componentForm.value.activityName
            }
            this.data = this.componentForm.value;
            let model: Activity = {
                idContrato: this._data.idContrato,
                idComponente: this._data.idComponente,
                nombreActividad: this.nombreActivivdad,
                id: this.id,
            };
            this._Economicservice.addActivity(model).subscribe((response) => {
                if (response) {
                    Swal.fire(
                        {
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Información Registrada Exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                          }
                    );
                }else{
                    Swal.fire(
                        'Ei!',
                        'Algo sucedio, vuelve a intentarlo!',
                        'error'
                    );
                }
            },(error => {
                console.log(error);
                
            }));
            this.matDialogRef.close(true);
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
