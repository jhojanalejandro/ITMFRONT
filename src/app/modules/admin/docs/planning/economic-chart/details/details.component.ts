import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';
import * as moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector       : 'scrumboard-card-details',
    styleUrls: ['./details.component.scss'],
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCardComponent implements OnInit, OnDestroy
{
    numberOfTicks = 0;
    data: any;
    componentName: string = null;
    contractorCant: any = null;
    cantDay: number = 0;
    unitValue: any= null;
    unitValueDay: number= null;
    update: boolean;
    calculo: boolean = true;
    totalCalculate: boolean = true;
    totalValue: any = null;
    unitValueMonth: any = null;
    totalCost: any= null;
    id: string= null;
    configForm: FormGroup;
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    componentForm: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<AddCardComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: { data: any, show: boolean },
        private _fuseConfirmationService: FuseConfirmationService,

    )
    {
        setInterval(() => {
            this.numberOfTicks++;
            // require view to be updated
            this._changeDetectorRef.detectChanges();
            this._changeDetectorRef.markForCheck();
          }, 1000);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {        
        if(this._data.show){
            this.componentName = this._data.data.componentName;
            this.contractorCant = this._data.data.contractorCant;
            this.cantDay = this._data.data.cantDay;
            this.unitValue = this._data.data.unitValue;
            this.cantDay = this._data.data.cantDay;
            this.totalValue = this._data.data.totalValue;
            this.id = this._data.data.id;
        }
        this.update = this._data.show;
        // Get the board
        this.componentForm = this._formBuilder.group({
            componentName: new FormControl(this.componentName, Validators.required),
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

    close(){
        this.data = this.componentForm.value;
        this.matDialogRef.close(this.data);   
    }
    calculate =() => {
        debugger
        this.totalCalculate= false;
        // this.unitValueDay =  this.componentForm.value.totalValue / this.componentForm.value.cantDay;
        this.unitValueDay =  Number(this.componentForm.value.unitValue * this.componentForm.value.contractorCant);
        this.unitValueDay = Number(this.unitValueDay /30);
        this.totalCost = Number(this.unitValueDay * this.componentForm.value.cantDay);
        let totalValueMonth = this.componentForm.value.unitValue * this.componentForm.value.contractorCant;
        let paymentDayContractor = this.unitValueDay/Number(this.componentForm.value.contractorCant);

        // this.unitValueMonth = paymentMonth/this.componentForm.value.cantDay;

        if(this.componentForm.value.cantDay >= '30'){
            // let paymentMonth = paymentDay/Number(this.componentForm.value.contractorCant);

        }else{

        }
        let paymentMonth =  this.componentForm.value.unitValue * this.componentForm.value.contractorCant;

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
}
