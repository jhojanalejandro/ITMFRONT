import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject, Subject,takeUntil } from 'rxjs';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { HomeContractorService } from '../home-contractor.service';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { FileContractor } from '../models/fileContractor';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileContractorComponent implements OnInit {

  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  tipoArchivos: any = GlobalConst.tipoArchivo;
  registerDate = new Date();
  selectContract: any;
  typeDocs: any = GlobalConst.tipoDocumento;
  base64Output: any;
  numberOfTicks = 0;
  formFile: FormGroup; 
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private ref: ChangeDetectorRef,
    private _upload: HomeContractorService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<UploadFileContractorComponent>,
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
    console.log(this._data.contractId);
    
    this.formFile = this._formBuilder.group({
      file: new FormControl(null, Validators.required),
      filesName: new FormControl(null, Validators.required),    
      typeDoc: new FormControl(null, Validators.required), 
      typeFile: new FormControl(null, Validators.required), 
      description: new FormControl(null, Validators.required), 
    });

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

    const registerFile: FileContractor={
      userId: this._auth.accessId,
      contractorId: this._auth.accessId,
      contractId: this._data.contractId,
      typeFilePayment: this.formFile.value.typeDoc,
      filesName: this.formFile.value.filesName,
      typeFile: this.formFile.value.typeFile,
      descriptionFile: this.formFile.value.description,
      registerDate: this.registerDate, 
      modifyDate: this.registerDate,
      filedata: this.base64Output,
      mont: new  Date('mm'),
      passed: true,
      DetailFileContractor: [] 
    };  
    console.log(registerFile);
    
    this._upload.UploadFileContractor(registerFile).subscribe((res) => {   
        if(res){
          swal.fire('Bien', 'informacion Registrada Exitosamente!', 'success');
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();   
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

  addFileContract(event) {
    const registerProject: any={
      userId: this._auth.accessId,
      contractId: this._data.contractId,
      filesName: this.formFile.value.filesName,
      typeFile: this.formFile.value.typeFile,
      descriptionFile: this.formFile.value.description,
      registerDate: this.registerDate, 
      fildata: this.file       
    };  
    console.log(registerProject);
    
    this._upload.UploadFileContractor(registerProject).subscribe((res) => {   
        if(res){
          swal.fire('Bien', 'informacion Registrada Exitosamente!', 'success');
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();   
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

  

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }


}
