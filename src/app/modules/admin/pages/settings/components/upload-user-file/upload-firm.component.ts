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
  filesSelected: any[] = [];
  indeterminate = false;
  showAlert: boolean = false;
  base64Output: string;
  numberOfTicks = 0;
  fileSelected: any;
  formFile: FormGroup;
  members: any[];
  typeImageUpload: boolean = false;
  typeImageFirmUpload: boolean = false;
  propietario: any = GlobalConst.requierePoliza;
  typeUserFile: any[];
  acceptImage: string = '.jpg, .jpeg, .png';
  acceptPdf: string = '.pdf, .docx';
  acceptExt: string = '.pdf, .docx';
  filesWithCheckbox: any[] = [];
  typeFileSelected: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  disableButton: boolean = true;
  fileName: string;
  typeFile: string;
  anexoFile: UserFile[]=[];
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


  async onChangeFile(event) {
    this.disableButton = false;
    this.filesWithCheckbox = [];
    this.filesSelected = event.target.files;
    this.file = event.target.files[0];

    this.fileName = this.file.name.split('.')[0].toUpperCase();
    this.typeFile = this.file.name.split('.')[1].toUpperCase();
    this.filesWithCheckbox = this.filesSelected;
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    for (let i = 0; i < this.filesSelected.length; i++) {
      await this.convertFile(this.filesSelected[i]).then((resp)=>
      this.assinmentFiles(resp,this.filesSelected[i]));
    }

    // this.convertFile(this.file).subscribe(base64 => {
    //   this.base64Output = base64;
    // });

  }
  private async assinmentFiles(base64: any,getFile: File): Promise<void>{
    return await new Promise((rslv) => {
      this.base64Output = base64;
      let file:UserFile = {
        userId: this.userId,
        fileData: base64,
        userCharge: null,
        ownerFirm: null,
        isOwner: false,
        userFileType: this.formFile.value.typeUserFile,
        fileType: getFile.name.split('.')[1].toUpperCase(),
        fileNameC: getFile.name.split('.')[0].toUpperCase()

      }
      this.fileSelected = file;
      this.anexoFile.push(file);
      return rslv();
    })

  }

  cerrar(): void {
    this.matDialogRef.close();
  }
  onUpload() {
    this.loading = !this.loading;
  }

  uploadFirm() {

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
    this._auth.UploadFileFirm(this.fileSelected)
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


  // async convertFile(file: File): Promise<string> {
  //   return await new Promise(async (rslv) => {
  //     const result = new ReplaySubject<string>(1);
  //     const reader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     reader.onload = (event) => result.next(btoa(event.target.result.toString()));
  //     return rslv(result);
  //   })
  // }

  async convertFile(file: File): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const result = new ReplaySubject<string>(1);
      const reader = new FileReader();

      reader.readAsBinaryString(file);

      reader.onload = (event) => {
        const base64String = btoa(event.target.result.toString());
        result.next(base64String);
        result.complete();
      };

      result.subscribe((base64String) => {
        resolve(base64String);
      });
    });
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
    let typeImageId = this.typeUserFile.find(f => f.code == TypeFileUserCode.IMAGENES).id;

    this.typeFileSelected = event.value;
    if (event.value === typeId) {
        this.typeImageFirmUpload = false;
      this.typeImageUpload = true;
      this.acceptExt = this.acceptImage
    }else if(typeImageId== event.value){
        this.typeImageUpload = false;
        this.typeImageFirmUpload = true;
        this.acceptExt = this.acceptImage
    }else{
        this.typeImageFirmUpload = false;
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

  uploadAnexo() {
    if (!this.formFile.valid) {
      return
    }
    this._auth.UploadFileAttach(this.anexoFile)
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

  saveFile(){
    let typeId = this.typeUserFile.find(f => f.code == TypeFileUserCode.ADJUNTOSMENSAJE).id;
    if(typeId === this.typeFileSelected ){
      this.uploadAnexo();
    }else{
      this.uploadFirm();
    }
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.next(true);
  }

}
