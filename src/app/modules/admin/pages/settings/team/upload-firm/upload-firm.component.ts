import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { UploadFileDataService } from './upload-firm.service';
import { IFileContractor } from 'app/layout/common/models/file-contractor';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { GenericService } from 'app/modules/admin/generic/generic.services';

@Component({
  selector: 'app-upload-firm',
  templateUrl: './upload-firm.component.html',
  styleUrls: ['./upload-firm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UploadFirmComponent implements OnInit {
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  tipoArchivos: any = GlobalConst.tipoArchivo;
  registerDate = new Date();
  selectContract: any;
  contratos: any;
  base64Output: any;
  mostrarContrato = false;
  numberOfTicks = 0;
  formFile: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ref: ChangeDetectorRef,
    private _upload: UploadFileDataService,
    private _gerenicService: GenericService,

    private _auth: AuthService,
    public matDialogRef: MatDialogRef<UploadFirmComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data: { show: any, contractorId: any, contractId: any, split: boolean }
  ) {

    setInterval(() => {
      this.numberOfTicks++;
      // require view to be updated
      this.ref.detectChanges();
      this.ref.markForCheck();
    }, 1000);
  }

  ngOnInit(): void {
    debugger
    if (this._data.show) {
      this.mostrarContrato = true;
    }
    this.formFile = this._formBuilder.group({
      file: new FormControl(null, Validators.required),
      filesName: new FormControl(null, Validators.required),
      IdProject: new FormControl(null, Validators.required),
      typeFile: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
    this.getContractsData();

  }

  onChange(event) {
    this.file = event.target.files[0];
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
    // this.fileUploadService.upload(this.file).subscribe(
    //     (event: any) => {
    //         if (typeof (event) === 'object') {

    //           // Short link via api response
    //           this.shortLink = event.link;
    //           this.loading = false; // Flag variable 
    //         }
    //     }
    // );
  }

  addFileContractor(event) {
    if (this._data.split) {
      let arr = this._data.contractorId.split('/');
      this._data.contractId = arr[1];
      this._data.contractorId = arr[0];
    }

    let contractId = this._data.contractId;
    const registerFile: IFileContractor = {
      userId: this._auth.accessId,
      contractorId: this._data.contractorId,
      folderId: this._data.contractId,
      filesName: this.formFile.value.filesName,
      typeFile: this.formFile.value.typeFile,
      descriptionFile: this.formFile.value.description,
      registerDate: this.registerDate,
      modifyDate: this.registerDate,
      filedata: event,
      passed: true,
      typeFilePayment: 'execel Contratista'
    };
    this._upload.UploadFileContractor(registerFile).subscribe((res) => {
      if (res) {
        swal.fire('informacion Registrada Exitosamente!', '', 'success');
        //this.matDialogRef.close();  
        this.ref.detectChanges();
        this.ref.markForCheck();
      }

    },
      (response) => {
        this.formFile.enable();
        // Set the alert
        swal.fire('Error al Registrar la informacion!', '', 'error');
        // Show the alert
        this.showAlert = true;
      });
  }

  addFileContract(event) {
    const registerProject: any = {
      userId: this._auth.accessId,
      folderId: this._data.contractId,
      filesName: this.formFile.value.filesName,
      typeFile: this.formFile.value.typeFile,
      descriptionFile: this.formFile.value.description,
      registerDate: this.registerDate,
      fildata: event
    };
    this._upload.UploadFileContractor(registerProject).subscribe((res) => {
      if (res) {
        swal.fire('informacion Registrada Exitosamente!', '', 'success');
        //this.matDialogRef.close();  
        this.ref.detectChanges();
        this.ref.markForCheck();
      }

    },
      (response) => {
        this.formFile.enable();
        // Set the alert
        swal.fire('Error al Registrar la informacion!', '', 'error');
        // Show the alert
        this.showAlert = true;
      });
  }
  getContractsData() {
    // Get the data
    this._gerenicService.getAllContract(true)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.contratos = data;

      });
  }

  uploadPdfFile(event) {

    let fileToUpload = <File>this.file;
    const formData = new FormData();
    formData.append('excel', fileToUpload, fileToUpload.name);
    formData.append('userId', this._auth.accessId.toString());
    formData.append('contractId', this.formFile.value.IdProject);
    if (this._data.show) {
      // Should match the parameter name in backend
      this._upload.UploadFileExcel(formData).subscribe((res) => {
        if (res) {
          swal.fire('informacion Registrada Exitosamente!', '', 'success');
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();
        }

      },
        (response) => {
          this.formFile.enable();
          // Set the alert
          swal.fire('Error al Registrar la informacion!', '', 'error');
          // Show the alert
          this.showAlert = true;
        });
    } else if (this._data.contractorId != null) {
      this.addFileContractor(this.base64Output);
    } else {
      this.addFileContract(this.base64Output);
    }


  }
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

}
