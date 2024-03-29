import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { IUserModel } from '../model/user-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    alertPassword: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    code: string = 'DTV';
    profesionales: any = GlobalConst.profesional;
    signUpForm: FormGroup;
    showAlert: boolean = false;
    showAlertPassword: boolean = false;

    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {

    }

    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            userName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            professional: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            identification: ['', Validators.required],
            passwordMail: ['', Validators.required]
        });
        this.validatePassword();
    }

    signUp() {

        const userRegister: IUserModel = {
            userName: this.signUpForm.value.userName,
            userPassword: this.signUpForm.value.password,
            professionalposition: this.signUpForm.value.professional,
            userEmail: this.signUpForm.value.email,
            phoneNumber: this.signUpForm.value.phoneNumber.toString(),
            identification: this.signUpForm.value.identification.toString(),
            passwordMail: this.signUpForm.value.passwordMail

        };
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;
        // Sign up
        this._authService.signUp(userRegister).subscribe(
            (response) => {

                // Navigate to the confirmation required page
                if (response.success) {
                    this._router.navigateByUrl('/confirmation-required');
                };
            },
            (response) => {
                console.log(response);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '',
                    html: response.error.message,
                    showConfirmButton: false,
                    timer: 3000
                });
                // Re-enable the form
                this.signUpForm.enable();
                // Reset the form
                this.signUpNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Algo salió mal. Por favor, vuelva a intentarlo.'
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }
    validatePassword() {
        this.signUpForm.get('confirmPassword').valueChanges.subscribe((newValue) => {
            this.alertPassword = {
                type: 'error',
                message: 'Las contraseñas no coinciden'
            };
            if (newValue != this.signUpForm.value.password) {
                this.showAlertPassword = true;
            } else {
                this.showAlertPassword = false;
            }
        });

    }
}
