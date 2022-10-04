import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { IProjectFolder } from 'app/layout/common/models/project-folder';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject, Subject,takeUntil } from 'rxjs';
import { UploadFileDataService } from './upload-file.service';

@Component({
    selector: 'app-register-contractor',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UploadFileComponent implements OnInit {
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  registerDate = new Date();
  selectContract: any;
  contratos: any;
  mostrarContrato = false;
  numberOfTicks = 0;
  formFile: FormGroup; 
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ref: ChangeDetectorRef,
    private _upload: UploadFileDataService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<UploadFileComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data: { show: any, idContractor: any }
    ) {

      setInterval(() => {
        this.numberOfTicks++;
        // require view to be updated
        this.ref.detectChanges();
        this.ref.markForCheck();
      }, 1000);
    }

  ngOnInit(): void {
    console.log('llega id', this._data);
    
    if(this._data.show){      
      this.mostrarContrato = true;
    }
    this.getContractsData();
    this.formFile = this._formBuilder.group({
      file: new FormControl(null, Validators.required),
      filesName: new FormControl(null, Validators.required),      
      IdProject: new FormControl(null, Validators.required), 
    });
  }

  onChange(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    // reader.onload = () => {
    //     this.file = reader.result;
    //     console.log('base 64', this.file);   
    // };
  }


  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
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
  
  getContractsData(){
    // Get the data
    this._upload.getAllContract()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.contratos = data;

    });
  }

  uploadPdfFile(event) {
    
    let fileToUpload = <File>this.file;
    const formData = new FormData();
    formData.append('excel', fileToUpload, fileToUpload.name);
    formData.append('idUser', this._auth.accessId.toString());
    formData.append('idContrato', '2');
    console.log(formData);
    
  // Should match the parameter name in backend
    this._upload.UploadFileContractor(formData).subscribe((res) => {   
      if(res){
        swal.fire('informacion Registrada Exitosamente!', '', 'success');
        //this.matDialogRef.close();  
        this.ref.detectChanges();
        this.ref.markForCheck();   
      }

  },
  (response) => {
    this.formFile.enable();
    console.log('error',response);    
    // Set the alert
    swal.fire('Error al Registrar la informacion!', '', 'error');
    // Show the alert
    this.showAlert = true;
  });

  }


}
