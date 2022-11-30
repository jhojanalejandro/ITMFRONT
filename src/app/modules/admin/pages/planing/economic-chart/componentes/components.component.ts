import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
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
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import * as moment from 'moment';
import { map, Observable, startWith, Subject } from 'rxjs';
import swal from 'sweetalert2';
import { EconomicChartService } from '../economic-chart.service';
import { ElementCardComponent } from '../element/element.component';
import { IComponente } from '../models/componente';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { ComponentesFormComponent } from './componentes-form/componentes-form.component';

@Component({
    selector: 'components-card',
    styleUrls: ['./components.component.scss'],
    templateUrl: './components.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponentsComponent implements OnInit, OnDestroy {
    separatorKeysCodes: number[] = [ENTER, COMMA];
    dataComponente: any;
    dataElemento: any;
    fruitCtrl = new FormControl('');
    filteredFruits: Observable<string[]>;
    fruits: string[] = [];
    allFruits: string[] = ['Profesional En Sistemas'];
    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    abrirDivComponente: boolean = false;
    abrirDivElemento: boolean = false;
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
        private route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _Economicservice: EconomicChartService,
        private _matDialog: MatDialog
    ) {
        this.id = this.route.snapshot.params.id;
        this._Economicservice.getComponent(this.id).subscribe((response) => {
            this.data = response;
        });
        // this.data = _data.data.componentes;
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

    abrirDivComponent(e: any) {
        debugger;
        this.abrirDivElemento = false;
        this.dataComponente = e;
        this.abrirDivComponente = true;
    }

    abrirDivElement(e: any) {
        this.abrirDivComponente = false;
        this.dataElemento = e;
        console.log(this.dataElemento);
        this.abrirDivElemento = true;
    }

    ngOnInit(): void {
        this.componentForm = this._formBuilder.group({
            componentName: new FormControl(
                this.componentName,
                Validators.required
            ),
            rubro: new FormControl(this.rubro, Validators.required),
            nombreRubro: new FormControl(this.nombreRubro, Validators.required),
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

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
        debugger
        let e = this.id;
        const dialogRef = this._matDialog.open(ComponentesFormComponent, {
            autoFocus: false,
            data: {
                e,
                show: true,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this._Economicservice
                .getComponent(this.id)
                .subscribe((response) => {
                    this.data = response;
                });
        });
    }

    addElements() {
        const dialogRef = this._matDialog.open(ElementCardComponent, {
            autoFocus: false,
            data: this.dataComponente.id,
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
