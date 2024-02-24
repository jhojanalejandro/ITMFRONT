import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import swal from 'sweetalert2';


@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    password: string;
    passwordMail: string;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService

    ) {
    }


    /**
     * On init
     */
    ngOnInit(): void {
        this._authService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.password = data.userPassword
                this.passwordMail = data.passwordMail

            });
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: [this.password],
            passwordMail: [this.passwordMail],
            newPassword: [''],
            newPasswordMail: [''],
            twoStep: [true],
            askPasswordChange: [false]
        });
    }

    updateUser() {
        // Return if the form is invalid
        if (this.securityForm.invalid) {
            return;
        }

        const updateUser: any = {
            id: this._authService.accessId,
            userPassword: this.securityForm.value.newPassword,
            passwordMail: this.securityForm.value.newPasswordMail,
        };
        // Sign in
        this._authService.updatePasswordUser(updateUser)
            .subscribe(
                (data: any) => {
                    debugger
                    if (data.success) {
                        this.securityForm.enable();
                        // Set the alert
                        swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Información Actualizada Exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                        });

                    }
                },
                (response) => {
                    this.securityForm.enable();
                    // Set the alert
                    swal.fire('Error', 'Error al Actualizar la informacion! recargue la pagina, o intente mas tarde', 'error');
                    // Show the alert
                });
    }
}
