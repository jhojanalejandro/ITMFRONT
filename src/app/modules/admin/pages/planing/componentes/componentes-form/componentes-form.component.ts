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
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Componente } from '../../models/planing-model';
import { PlaningService } from '../../service/planing.service';
import { FuseAlertType } from '@fuse/components/alert';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { AuthService } from 'app/core/auth/auth.service';


@Component({
    selector: 'app-componentes-form',
    templateUrl: './componentes-form.component.html',
    styleUrls: ['./componentes-form.component.scss'],
})
export class ComponentesFormComponent implements OnInit {
    update: boolean;
    id: string = null;
    componentForm: FormGroup;
    permission: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'warn',
        message: ''
      };
    constructor(
        public matDialogRef: MatDialogRef<ComponentesFormComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _planingService: PlaningService,
        private authService: AuthService

    ) {

    }

    ngOnInit(): void {
        this.permission = this.authService.validateRoll(CodeUser.PLANEACION, null);
        if (!this.permission) {
          Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');
        }
        this.componentForm = this._formBuilder.group({
            componentName: new FormControl(null, Validators.required)
        });
        if (this._data.componente != null) {
            this.id = this._data.componente.id;
            this.componentForm.patchValue({
                componentName: this._data.componente.nombreComponente
            });   
        }
    }

    addComponent() {

        if (this.componentForm.invalid) {
            this.componentForm.enable();
            this.alert = {
              type: 'error',
              message: 'ERROR EN LA INFORMACION'
            };
      
            // Show the alert
            this.showAlert = true;
            return
        }
        let model: Componente = {
            contractId: this._data.contractId,
            nombreComponente: this.componentForm.value.componentName,
            id: this.id,
            elementos: [],
            activities: [],
        };
        this._planingService.addComponent(model)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response) => {
            if (response) {
                
                Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        html: 'Información Registrada Exitosamente!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                this.matDialogRef.close(true);
            }
        }, (error => {
            console.log(error);
            Swal.fire(
                'EI!',
                'Ha sucedido un error!, vuelve a intentarlo',
                'error'
            );
        }));
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
