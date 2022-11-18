import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subject, takeUntil, tap } from 'rxjs';
import * as moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Elements } from '../models/element';
import { ListElements } from '../models/list-elements';

@Component({
    selector       : 'app-alement',
    styleUrls: ['./element.component.scss'],
    templateUrl    : './element.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementCardComponent implements OnInit, OnDestroy
{
    @ViewChild('signInNgForm') elementInNgForm: NgForm;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl('');
    filteredFruits: Observable<string[]>;
    elementos: Elements[] = [];
    allFruits: string[] = ['Profesional En Sistemas','Profesional en areas de derecho','Profesional Especializado', 'Tecnologo'];
    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    element: string = null; 
    numberOfTicks = 0;
    componentName: string = null;
    contractorCant: any = null;
    cantDay: number = null;
    unitValue: any= null;
    unitValueDay: number= null;
    update: boolean;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalValue: any = null;
    unitValueMonth: any = null;
    totalCost: any= null;
    id: string= null;
    listElements: ListElements = {componentName: this._data.listElement.componentName, listElements: []};
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
        @Inject(MAT_DIALOG_DATA) private _data: { listElement: any, show: boolean },
        private _fuseConfirmationService: FuseConfirmationService,

    )
    {
        setInterval(() => {
            this.numberOfTicks++;
            // require view to be updated
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
          }, 1000);
          this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
          );
    }
    /**
     * On init
     */
    ngOnInit(): void
    {       
        debugger
        console.log(this._data.listElement);
        // this.remove(this.elementos, 0) 
        this.update = this._data.show;
        // Get the board
        this.elementForm = this._formBuilder.group({
            contractorCant: new FormControl(this.contractorCant, Validators.required),
            cantDay: new FormControl(this.cantDay, Validators.required),
            unitValue: new FormControl(this.unitValue, Validators.required),
            totalValue: new FormControl(this.totalValue, Validators.required),
            id: new FormControl(this.id, Validators.required),
            unitValueDay: new FormControl(0, Validators.required),
            calculateValue: new FormControl(this.totalCost, Validators.required),
        });

        this.configForm = this._formBuilder.group({
            title      : 'Error en la información',
            message    : '!Los valores registrados no coinciden  <span class="font-medium">¡Verifica que los valores sean los correctos!</span>',
            icon       : this._formBuilder.group({
                show : true,
                name : 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions    : this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show : true,
                    label: 'Volver',
                    color: 'warn',
                    
                }),
                cancel : this._formBuilder.group({
                    show : true,
                    label: 'Cancelar'
                })
            }),
            dismissible: true
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Check if the given date is overdue
     */
    isOverdue(date: string): boolean
    {
        return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    addContractor(){
        this.listElements.listElements = this.elementos;
        this.matDialogRef.close(this.listElements);   
    }
    calculate =() => {
        debugger
        this.totalCalculate= false;
        // this.unitValueDay =  this.elementForm.value.totalValue / this.elementForm.value.cantDay;
        this.unitValueDay =  Number(this.elementForm.value.unitValue * this.elementForm.value.contractorCant);
        this.unitValueDay = Number(this.unitValueDay /30);
        this.totalCost = Number(this.unitValueDay * this.elementForm.value.cantDay);
        let totalValueMonth = this.elementForm.value.unitValue * this.elementForm.value.contractorCant;
        let paymentDayContractor = this.unitValueDay/Number(this.elementForm.value.contractorCant);

        // this.unitValueMonth = paymentMonth/this.elementForm.value.cantDay;

        if(this.elementForm.value.cantDay >= '30'){
            // let paymentMonth = paymentDay/Number(this.elementForm.value.contractorCant);

        }else{

        }
        let paymentMonth =  this.elementForm.value.unitValue * this.elementForm.value.contractorCant;

        //this.openConfirmationDialog();

    }
    openConfirmationDialog(): void
    {
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if(result == 'confirmed'){
                
            }
        });
    }

    
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    this.element = value;
    let idElement = this.elementos.length;
    debugger
    // Add our fruit
    let elet: Elements= {id: idElement+1, elemento:event.value,contractorCant: 0, cantDay: 0, totalValue: 0, unitValue:0}
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
    const index = this.elementos.indexOf(element);
    debugger
    this.element = element.elemento;
    this.cantDay = this.elementos[index].cantDay;
    this.totalValue = this.elementos[index].totalValue;
    this.contractorCant = this.elementos[index].contractorCant;
    this.unitValue = this.elementos[index].unitValue;
    // if (index >= 0) {
    //   this.elementos.splice(index, 1);
    // }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let idElement = this.elementos.length;
    let elet: Elements= {id: idElement, elemento:event.option.viewValue,contractorCant: 0, cantDay: 0, totalValue: 0, unitValue:0}
    this.element = event.option.viewValue;
    this.elementos.push(elet);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    this.elementForm.reset();
  }
  asign = () =>{
    debugger
    const findEl = this.elementos.find(e => e.elemento = this.element);
    const index = this.elementos.indexOf(findEl);
    let elet: Elements= {id: findEl.id, elemento: this.element,contractorCant: this.elementForm.value.contractorCant, cantDay: this.elementForm.value.totalValue, totalValue: this.elementForm.value.totalValue, unitValue:this.elementForm.value.unitValue}

    this.elementos.splice(index, 1, elet);
    console.log(this.elementos);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}
