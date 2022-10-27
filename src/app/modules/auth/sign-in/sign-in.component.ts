import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { IUser } from 'app/layout/common/models/userAuthenticate';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    tipoUsuario: any =GlobalCont.TipoUsuario
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : [null, [Validators.required, Validators.email]],
            userType     : [null, Validators.required],
            password  : [null, Validators.required]
        });
    }

    signIn(): void
    {
                // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }
        this.showAlert = false;
        const useraLogin: IUser={
            username: this.signInForm.value.email,
            password: this.signInForm.value.password,

          };

        if(this.signInForm.value.userType == 'Contractual'){
            this.signInForm.disable();

            // Hide the alert

            // Sign in
            this._authService.signIn(useraLogin)
                .subscribe(
                    () => {
                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                        // Navigate to the redirect url
                        this._router.navigateByUrl(redirectURL);

                    },
                    (response) => {

                        // Re-enable the form
                        this.signInForm.enable();

                        // Reset the form
                        this.signInNgForm.resetForm();

                        // Set the alert
                        this.alert = {
                            type   : 'error',
                            message: 'Correo o contraseña equivocada, o el usuario esta inactivo'
                        };

                        // Show the alert
                        this.showAlert = true;
                    }
            );
        }else{
                    // Sign in
        this._authService.signInContractor(useraLogin)
        .subscribe(
            () => {
                // Navigate to the redirect url
                this._router.navigate(['inicio/contratista']);

            },
            (response) => {

                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type   : 'error',
                    message: 'Correo o contraseña equivocada, o el usuario esta inactivo'
                };

                // Show the alert
                this.showAlert = true;
            }
    );
        }

 
    }
}
