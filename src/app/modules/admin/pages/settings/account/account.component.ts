import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { IUserModel } from 'app/modules/auth/sign-up/user-model';
import {  Subject, takeUntil } from 'rxjs';
@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: FormGroup;
    userName: string;
    roll: string;
    permission: string;
    email: string;
    phoneNumber: any;
    alert: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

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
        this.accountForm = this._formBuilder.group({
            name    : [this._authService.accessName],
            email   : [this._authService.accessEmail, Validators.email],
            phone   : [this.phoneNumber],
            title   :[this.roll]
        });
        this._authService.getUser()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data) => {
            // Store the data
            this.phoneNumber = data.phoneNumber
            this.userName = data.userName
            this.email = data.userEmail
            this.roll = data.idRoll;
            this.accountForm = this._formBuilder.group({
                name    : [this.userName],
                email   : [this.email, Validators.email],
                phone   : [this.phoneNumber],
                title   :[this.roll]
            });
        });
        // Create the form

    }

    updateUser(){
        const updateUser: IUserModel={
            id: this._authService.accessId,
            userName: this.accountForm.value.name,
            avatar: 'avatar',
            Professionalposition: 'profesional',
            phoneNumber: this.accountForm.value.phoneNumber,
            rollId: this.roll,
            userEmail: this.accountForm.value.email,
  
            };                  
                // Sign in
                this._authService.updateUser(updateUser)
                .subscribe(
                    (data : any) => {
                        if(data){
                        this.accountForm.enable();                    
                            this.alert = {
                                type   : 'success',
                                message: '¡informacion actualizada'
                            };
                            setTimeout(() => {
                            }, 7000);
                                // Show the alert
                        }
                        },
                    (response) => {      
                            
                        this.alert = {
                            type   : 'warn',
                            message: '¡Error al actualizar la informacion'
                        };
                        setTimeout(() => {
                        }, 7000);                    
                        this.accountForm.enable();        
                    }
                );
    }
}
