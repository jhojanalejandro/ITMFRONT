import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { DocumentTypeFile, Files } from 'app/layout/common/models/file-contractor';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/service/upload-file.service';
import { DocumentTypeCodes } from 'app/layout/common/enums/document-type/document-type';

@Component({
  selector: 'app-upload-file-contract',
  templateUrl: './upload-file-contract.component.html',
  styleUrls: ['./upload-file-contract.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UploadFileContractComponent implements OnInit, OnDestroy {
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  isSelectContract: boolean = false;
  registerDate = new Date();
  selectContract: any;
  contratos: any;
  fileName: string;
  fileType: string;
  base64Output: any;
  disableButton: boolean = true;
  mostrarContrato = false;
  numberOfTicks = 0;
  documentType: string;
  formFile: FormGroup;
  typeDocs: DocumentTypeFile[] = [];
  aceptFile: string;
  aceptExcel: string = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  aceptfile: string = 'image/jpeg, image/png, application/pdf';
  permission: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ref: ChangeDetectorRef,
    private _upload: UploadFileDataService,
    private _gerenicService: GenericService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<UploadFileContractComponent>,
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

    if (this._data.show) {
      this.mostrarContrato = true;
      this.aceptFile = this.aceptExcel;
    }
    if (this._data.show && this._data.contractId != null) {
      this.mostrarContrato = false;
      this.isSelectContract = true;
      this.aceptFile = this.aceptFile;
    }

    this.formFile = this._formBuilder.group({
      file: new FormControl(null, Validators.required),
      IdProject: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
    this.getContractsData();
    this.GetFileType();
    this.getDocumentType();

  }

  onChange(event) {
    this.disableButton = false;
    this.file = event.target.files[0];
    this.fileName = this.file.name.split('.')[0].toUpperCase();
    this.fileType = this.file.type.split('/')[1].toUpperCase();
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    this.convertFile(this.file).subscribe(base64 => {
      this.base64Output = base64;
    });
    // reader.onload = () => {
    //     this.file = reader.result;
    // };
  }


  addFileContract(event) {
    const uploadFile: Files = {
      userId: this._auth.accessId,
      folderId: this._data.folderId,
      contractId: this._data.contractId,
      filesName: this.fileName,
      fileType: this.fileType,
      descriptionFile: this.formFile.value.description,
      registerDate: this.registerDate,
      filedata: event,
      documentType: this.documentType
    };
    this._upload.UploadFileContract(uploadFile).subscribe((res) => {
      if (res) {
        swal.fire({
          position: 'center',
          icon: 'success',
          title: '',
          html: 'Información Registrada Exitosamente!',
          showConfirmButton: false,
          timer: 1500
        });
        //this.matDialogRef.close();  
        this.ref.detectChanges();
        this.ref.markForCheck();
        this.closeModal();
      }

    },
      (response) => {
        this.formFile.enable();
        // Set the alert
        console.log(response);
        swal.fire('Error', 'Error al Registrar la informacion!', 'error');
        // Show the alert
        this.showAlert = true;
      });
  }
  getContractsData() {
    // Get the data
    this._gerenicService.getAllContract(true, 'Contractual')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.contratos = data;

      });
  }

  uploadTypeFile() {
    
    if (this.isSelectContract == true) {
      if(this._data.origin === 'cdp'){
        this.uploadCdpFile();
      }else{
        this.uploadElementFile();
      }
    } else {
      this.uploadPdfFile();
    }
  }

  uploadCdpFile() {
    let fileToUpload = <File>this.file;
    const formData = new FormData();
    formData.append('excel', fileToUpload, fileToUpload.name);
    formData.append('userId', this._auth.accessId.toString());
    formData.append('contractId', this._data.contractId);
    if (this._data.show) {
      // Should match the parameter name in backend
      this._upload.UploadCdpFileExcel(formData).subscribe(res => {
        if (res) {
          swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: 'Información Registrada Exitosamente!',
            showConfirmButton: false,
            timer: 1500
          });
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();
          this.closeModal();
        }

      },
        (response) => {
          console.log(response);

          this.formFile.enable();
          // Set the alert
          swal.fire('Error', 'Error al Registrar la informacion!', 'error');
          // Show the alert
          this.showAlert = true;
        });
    } else {
      this.addFileContract(this.base64Output);
    }

  }

  uploadPdfFile() {
    let fileToUpload = <File>this.file;
    const formData = new FormData();
    formData.append('excel', fileToUpload, fileToUpload.name);
    formData.append('userId', this._auth.accessId.toString());
    formData.append('contractId', this.formFile.value.IdProject);
    if (this._data.show) {
      // Should match the parameter name in backend
      this._upload.UploadFileExcel(formData).subscribe((res) => {
        if (res) {
          swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: 'Información Registrada Exitosamente!',
            showConfirmButton: false,
            timer: 1500
          });
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();
          this.closeModal();
        }

      },
        (response) => {
          console.log(response);

          this.formFile.enable();
          // Set the alert
          swal.fire('Error', 'Error al Registrar la informacion!', 'error');
          // Show the alert
          this.showAlert = true;
        });
    } else {
      this.addFileContract(this.base64Output);
    }
  }

  selectionChageContract(contract: any) {
    contract.value;
    this.permission = this._auth.validateRoll(CodeUser.RECRUITER,this._data.assignmentUser);
    if(!this.permission){

    }
  }
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  private GetFileType() {
    this._upload.getDocumentType()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((type: DocumentTypeFile[]) => {
        this.documentType = type.find(f => f.code ===  DocumentTypeCodes.ANEXO).id;
      });
  }


  uploadElementFile() {
    let fileToUpload = <File>this.file;
    const formData = new FormData();
    formData.append('excel', fileToUpload, fileToUpload.name);
    formData.append('userId', this._auth.accessId.toString());
    formData.append('contractId', this._data.contractId);
    if (this._data.show) {
      // Should match the parameter name in backend
      this._upload.UploadElementFileExcel(formData).subscribe(res => {
        if (res) {
          swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: 'Información Registrada Exitosamente!',
            showConfirmButton: false,
            timer: 1500
          });
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();
          this.closeModal();
        }

      },
        (response) => {
          console.log(response);

          this.formFile.enable();
          // Set the alert
          swal.fire('Error', 'Error al Registrar la informacion!', 'error');
          // Show the alert
          this.showAlert = true;
        });
    } else if (this._data.contractorId != null) {
      this.addFileContract(this.base64Output);
    }

  }

  closeModal(): void {
    this.matDialogRef.close(true);
  }

  private getDocumentType() {
    this._upload
      .getDocumentType()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res != null) {
          this.typeDocs = res;
        }
      }
      );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
