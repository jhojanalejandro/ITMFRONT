import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { CodeUser } from 'app/core/enums/enumAuth';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { IUser } from 'app/layout/common/models/userAuthenticate';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    tipoUsuario: any = GlobalConst.TipoUsuario
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    constructor(
        private _authService?: AuthService,
        private _formBuilder?: FormBuilder,
        private _router?: Router
    ) {
    }

    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            userType: [null, Validators.required],
            password: [null, Validators.required]
        });
    }

    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }
        if(this.signInForm.value.userType === 'Contratista'){
            this.signInForm.value.userType = CodeUser.CONTRACTOR
        }else{
            this.signInForm.value.userType = CodeUser.RECRUITER
        }
        this.showAlert = false;
        const useraLogin: IUser = {
            userName: this.signInForm.value.email,
            password: this.signInForm.value.password,
            userType: this.signInForm.value.userType
        };
        this.signInForm.disable();
        // Sign in
        this._authService.signIn(useraLogin)
            .subscribe(
                (response) => {
                    if(response.code === CodeUser.CONTRACTOR){
                        this._router.navigate(['inicio/contratista']);

                    }else if(response.code != null && response.code != CodeUser.CONTRACTOR){
                        this._router.navigate(['dashboards/inicio']);
                    }
                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Correo o contraseña equivocada, o el usuario esta inactivo'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );

    }
}
