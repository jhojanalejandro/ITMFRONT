import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.service';
import { ResetPassword } from 'app/layout/common/models/reset-password';
import * as CryptoJS from 'crypto-js';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    userId: string;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    contractId: string;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private router: ActivatedRoute,
        private _genericService: GenericService,
    ) {
    }


    ngOnInit(): void {

        this.userId = this.router.snapshot.paramMap.get('userId') || 'null';
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required]
        },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }


        // Disable the form
        // this.resetPasswordForm.disable();

        // // Hide the alert
        // this.showAlert = false;
        let reset: ResetPassword = {
            id: this.userId,
            password: this.resetPasswordForm.get('password').value
        }
        // // Send the request to the server
        this._authService.resetPassword(reset)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    debugger
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'contraseña restaurada.'
                    };
                },
                (response) => {
                    debugger
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: response.error.message
                    };
                }
            );
    }
}
