import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { UserFile } from '../../models/setting.model';
import { TypeFileUserCode } from 'app/layout/common/enums/document-type/document-type';

const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-upload-firm',
  templateUrl: './upload-firm.component.html',
  styleUrls: ['./upload-firm.component.scss'],

})
export class UploadFirmComponent implements OnInit, OnDestroy {
  shortLink: string = "";
  isOwner: boolean = false;
  loading: boolean = false;
  userId: string = null;
  file: any = null;
  indeterminate = false;
  showAlert: boolean = false;
  base64Output: any;
  numberOfTicks = 0;
  formFile: FormGroup;
  members: any[];
  typeImageUpload: boolean = false;
  propietario: any = GlobalConst.requierePoliza;
  typeUserFile: any[];
  acceptImage: string = '.jpg, .jpeg, .png';
  acceptPdf: string = '.pdf, .docx';
  acceptExt: string = '.pdf, .docx';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  disableButton: boolean = true;
  fileName: string;
  typeFile: string;
  constructor(
    private ref: ChangeDetectorRef,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<UploadFirmComponent>,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
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
      ownerValidate: new FormControl(null),
      ownerFirm: new FormControl(null),
      typeUserFile: new FormControl(null),
      userCharge: new FormControl(null),

    });
    this.getRolls();
    this.getTypeUserFile();

  }

 
  onChange(event) {
    
    this.disableButton = false;
    this.file = event.target.files[0];
    this.fileName = this.file.name.split('.')[0].toUpperCase();
    this.typeFile = this.file.name.split('.')[1].toUpperCase();
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    this.convertFile(this.file).subscribe(base64 => {
      this.base64Output = base64;
    });
    // reader.onload = () => {
    //     this.file = reader.result;
    // };
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
    const registerFile: UserFile = {
      userId: this.userId,
      fileData: this.base64Output,
      userCharge: this.formFile.value.userCharge,
      ownerFirm: this.formFile.value.ownerFirm,
      isOwner: this.isOwner,
      userFileType: this.formFile.value.typeUserFile,
      fileType: this.typeFile,
      fileNameC: this.fileName
    };
    this._auth.UploadFileFirm(registerFile)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res.success) {
          swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: res.message,
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

  owner(event: any) {
    if (event.value === 'Si') {
      this.isOwner = false;
    } else {
      this.isOwner = true;
    }
    this.userId = this._auth.accessId;
  }

  
  typeUploadFile(event: any) {
    let typeId = this.typeUserFile.find(f => f.code == TypeFileUserCode.FIRMA).id;
    if (event.value === typeId) {
      this.typeImageUpload = true;
      this.acceptExt = this.acceptImage
    } else{
      this.typeImageUpload = false;
      this.acceptExt = this.acceptPdf
    }
    this.userId = this._auth.accessId;
  }

  private getRolls(){
    this._authService.getRolls()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((teams: any) => {
        // Mark for check
        this.members = teams;
    });
  }
  private getTypeUserFile() {
    this._auth
      .getTypeUserFile()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.typeUserFile = response;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.next(true);
  }

}
