import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import swal from 'sweetalert2';


@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    password: string;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService

    )
    {
    }


    /**
     * On init
     */
    ngOnInit(): void
    {
        this._authService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data) => {
            // Store the data
            this.password = data.userPassword
     
        });
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword  : [this.password],
            newPassword      : [''],
            twoStep          : [true],
            askPasswordChange: [false]
        });
    }

    updateUser(){
        // Return if the form is invalid
        if ( this.securityForm.invalid )
        {
            return;
        }

        const updateUser: any={
            id: this._authService.accessId,
            userPassword: this.securityForm.value.newPassword,
        };          
        // Sign in
        this._authService.updatePasswordUser(updateUser)
            .subscribe(
                (data : any) => {
                    if(data){
                        this.securityForm.enable();
                        // Set the alert
                        swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Información Registrada Exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                          });

                    }
                },
            (response) => {
              this.securityForm.enable();
              // Set the alert
              swal.fire('Error', 'Error al Actualizar la informacion! intente mas tarde', 'error');
              // Show the alert
            });
    }
}
