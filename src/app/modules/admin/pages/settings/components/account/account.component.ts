import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { IUserModel } from 'app/modules/auth/model/user-model';
import { Subject, takeUntil } from 'rxjs';
import { UploadFirmComponent } from '../upload-user-file/upload-firm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit,AfterViewInit {
    accountForm: FormGroup;
    permission: string;

    alert: any;
    dataUser: IUserModel = {
        id: null, userName: null, phoneNumber: null, professionalposition: null, userEmail: null,
        identification: null, passwordMail: null
    }
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _matDialog: MatDialog,

    ) {

    }
    /**
     * On init
     */
    ngOnInit(): void {
        this.accountForm = this._formBuilder.group({
            name: [this._authService.accessName],
            email: [this._authService.accessEmail, Validators.email],
            phone: [this.dataUser.phoneNumber],
            profesionalPosistion: [this.dataUser.professionalposition],
            identification: [this.dataUser.identification],
            passwordMail: [this.dataUser.identification],
        });
    }

    updateUser() {
        const updateUser: IUserModel = {
            id: this._authService.accessId,
            userName: this.accountForm.value.name,
            professionalposition: this.accountForm.value.profesionalPosistion,
            phoneNumber: this.accountForm.value.phone,
            userEmail: this.accountForm.value.email,
            identification: this.accountForm.value.identification,
            passwordMail: this.accountForm.value.passwordMail

        };
        // Sign in
        this._authService.accessEmail = updateUser.userEmail;
        this._authService.updateUser(updateUser)
            .subscribe(
                (data: any) => {
                    if (data) {
                        this.accountForm.enable();
                        this.alert = {
                            type: 'success',
                            message: '¡informacion actualizada'
                        };
                        setTimeout(() => {
                        }, 7000);
                        // Show the alert
                    }
                },
                (response) => {

                    this.alert = {
                        type: 'warn',
                        message: '¡Error al actualizar la informacion'
                    };
                    setTimeout(() => {
                    }, 7000);
                    this.accountForm.enable();
                }
            );
    }
    uploadFile() {
        const dialogRef = this._matDialog.open(UploadFirmComponent, {
            disableClose: true,
            autoFocus: false,
        });
        dialogRef.afterClosed()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((result) => {
          if (result) {
            // this.getDataContractor(this.id);
          }
        });
      }
    ngAfterViewInit(): void {
        this._authService.getUser()
        .subscribe((data: IUserModel) => {
            this.dataUser = data;
        });
    }
}
