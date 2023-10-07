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
import { Activity } from '../../models/planing-model';
import { PlaningService } from '../../service/planing.service';

@Component({
    selector: 'app-componentes-form',
    templateUrl: './actividad-form.component.html',
    styleUrls: ['./actividad-form.component.scss'],
})

export class ActividadFormComponent implements OnInit {
    update: boolean;
    id: string = null;
    componentForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public matDialogRef: MatDialogRef<ActividadFormComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _planingService: PlaningService,
    ) { }

    ngOnInit(): void { 
        this.componentForm = this._formBuilder.group({
            activityName: new FormControl(null,Validators.required)
        });
        if(this._data.activity != null){
            this.update = true;
            this.id = this._data.activity.id;         
            this.componentForm.patchValue({
                activityName: this._data.activity.nombreActividad
            });   
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    addActivity() {
        if (!this.componentForm.invalid) {
            let model: Activity = {
                contractId: this._data.contractId,
                componentId: this.update ? this._data.activity.componentId : this._data.idComponente,
                nombreActividad: this.componentForm.value.activityName,
                id: this.id,
                elementos: [],
            };
            this._planingService.addActivity(model).subscribe((response) => {
                if (response.success) {
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
                }
            },(error => {
                console.log(error);
                Swal.fire(
                    '',
                    'Error '+error,
                    'error'
                );
            }));
            this.matDialogRef.close(true);
        }
    }

}
