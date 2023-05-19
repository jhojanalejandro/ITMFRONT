import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { UserFirm } from '../../models/setting.model';

const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-upload-firm',
  templateUrl: './upload-firm.component.html',
  styleUrls: ['./upload-firm.component.scss'],

})
export class UploadFirmComponent implements OnInit, OnDestroy {
  shortLink: string = "";
  isOwner: boolean = true;
  loading: boolean = false;
  userId: string = null;
  file: any = null;
  indeterminate = false;
  showAlert: boolean = false;
  propietario: any = GlobalConst.requierePoliza;
  base64Output: any;
  numberOfTicks = 0;
  formFile: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ref: ChangeDetectorRef,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<UploadFirmComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data
  ) {

    setInterval(() => {
      this.numberOfTicks++;
      // require view to be updated
      this.ref.detectChanges();
      this.ref.markForCheck();
    }, 1000);
  }


  ngOnInit(): void {

    this.formFile = this._formBuilder.group({
      file: new FormControl(null, Validators.required),
      ownerValidate: new FormControl(null, Validators.required),
      ownerFirm: new FormControl(null),
      typeFile: new FormControl(null),
      userCharge: new FormControl(null),

    });

  }

  onChange(event) {
    this.file = event.target.files[0];
    this.file = event.target.files[0];
    // this.typeFile = this.file.type.split('/')[1].toUpperCase();
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    this.convertFile(this.file).subscribe(base64 => {
      this.base64Output = base64;
    });
  }


  cerrar(): void {
    this.matDialogRef.close();
  }
  onUpload() {
    this.loading = !this.loading;
  }

  uploadFirm(event) {
    if (!this.formFile.valid) {
      return
    }
    const registerFile: UserFirm = {
      userId: this.userId,
      firmData: this.base64Output,
      userCharge: this.formFile.value.userCharge,
      ownerFirm: this.formFile.value.ownerFirm,
      isOwner: this.isOwner,
    };
    console.log(registerFile);

    this._auth.UploadFileFirm(registerFile)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res) {
          swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: 'Información Registrada Exitosamente!',
            showConfirmButton: false,
            timer: 1500
          });
          this.ref.detectChanges();
          this.ref.markForCheck();
          this.matDialogRef.close();
        }
      },
        (response) => {
          this.formFile.enable();
          console.log(response);
          // Set the alert
          swal.fire('Error', 'Error al Registrar la informacion!', 'error');
          // Show the alert
          this.showAlert = true;
        });
  }


  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  owner(event) {
    if (event.value === 'Si') {
      this.isOwner = false;
      this.userId = this._auth.accessId;
    } else {
      this.isOwner = true;
      this.userId = this._auth.accessId;

    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.next(true);
  }

}
