import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';
import * as moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ThisReceiver } from '@angular/compiler';

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
    cantDay: any = null;
    unitValue: any= null;
    unitValueDay: any;
    update: boolean;
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
        // private _scrumboardService: ScrumboardService
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
            console.log('llega',this._data.data);
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
            unitValueDay: new FormControl(null, Validators.required),
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
     * Return whether the card has the given label
     *
     * @param label
     */
    // hasLabel(label: any): boolean
    // {
    //     return !!this.card.labels.find(cardLabel => cardLabel.id === label.id);
    // }

    /**
     * Filter labels
     *
     * @param event
     */
    filterLabels(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the labels
        // this.filteredLabels = this.labels.filter(label => label.title.toLowerCase().includes(value));
    }

    /**
     * Filter labels input key down event
     *
     * @param event
     */
    filterLabelsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no label available...
        // if ( this.filteredLabels.length === 0 )
        // {
        //     // Return
        //     return;
        // }

        // If there is a label...
        // const label = this.filteredLabels[0];
        // const isLabelApplied = this.card.labels.find(cardLabel => cardLabel.id === label.id);

        // If the found label is already applied to the card...
        // if ( isLabelApplied )
        // {
        //     // Remove the label from the card
        //     this.removeLabelFromCard(label);
        // }
        // else
        // {
        //     // Otherwise add the label to the card
        //     this.addLabelToCard(label);
        // }
    }

    /**
     * Toggle card label
     *
     * @param label
     * @param change
     */
    toggleProductTag(label: any, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.addLabelToCard(label);
        }
        else
        {
            this.removeLabelFromCard(label);
        }
    }

    /**
     * Add label to the card
     *
     * @param label
     */
    addLabelToCard(label: any): void
    {
        // Add the label
        // this.card.labels.unshift(label);

        // // Update the card form data
        // this.cardForm.get('labels').patchValue(this.card.labels);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove label from the card
     *
     * @param label
     */
    removeLabelFromCard(label: any): void
    {
        // Remove the label
        // this.card.labels.splice(this.card.labels.findIndex(cardLabel => cardLabel.id === label.id), 1);

        // // Update the card form data
        // this.cardForm.get('labels').patchValue(this.card.labels);

        // Mark for check
        this._changeDetectorRef.markForCheck();
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Read the given file for demonstration purposes
     *
     * @param file
     */
    private _readAsDataURL(file: File): Promise<any>
    {
        // Return a new promise
        return new Promise((resolve, reject) => {

            // Create a new reader
            const reader = new FileReader();

            // Resolve the promise on success
            reader.onload = (): void => {
                resolve(reader.result);
            };

            // Reject the promise on error
            reader.onerror = (e): void => {
                reject(e);
            };

            // Read the file as the
            reader.readAsDataURL(file);
        });
    }

    async addContractor() {
    //   this._upload
    //   .addContractor(registerContractor)
    //   .subscribe((res) => {   
    //     if(res){
    //       swal.fire('Contratista Registrado Exitosamente!', '', 'success');
    //       this.ref.detectChanges();
    //       this.ref.markForCheck();  
    //     }

    //   },
    //   (response) => {
    //       this.formContractor.enable();
    //       // Set the alert
    //       this.alert = {
    //           type   : 'error',
    //           message: 'ERROR EN LA INFORMACION'
    //       };

    //       // Show the alert
    //       this.showAlert = true;
    //   });
    }
    close(){
        this.data = this.componentForm.value;
        this.matDialogRef.close(this.data);   
    }
    private calculate(){
        this.unitValueDay =  this.componentForm.value.totalValue / this.componentForm.value.cantDay;
        let paymentDayContractor = this.unitValueDay/Number(this.componentForm.value.contractorCant);

        // this.unitValueMonth = paymentMonth/this.componentForm.value.cantDay;

        if(this.componentForm.value.cantDay >= '30'){
            // let paymentMonth = paymentDay/Number(this.componentForm.value.contractorCant);

        }else{

        }
        let paymentMonth =  this.componentForm.value.unitValue * this.componentForm.value.contractorCant;

        this.openConfirmationDialog();


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
