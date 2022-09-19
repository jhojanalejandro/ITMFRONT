import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { UploadDataService } from '../upload-data.service';
import swal from 'sweetalert2';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { IProjectFolder } from 'app/layout/common/models/project-folder';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject,takeUntil } from 'rxjs';

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
  file: File = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  registerDate = new Date();
  selectContract: any;
  contratos: any;
  formProject: FormGroup; 
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _upload: UploadDataService,
    private authService: AuthService,
    public matDialogRef: MatDialogRef<UploadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.getContractsData();
    this.formProject = this._formBuilder.group({
      file: new FormControl(null, Validators.required),
      IdProject: new FormControl(null, Validators.required),      
    });
  }
  close(){
    this.matDialogRef.close();   
  }
  async addProjectFolder() {
    const registerProject: IProjectFolder={
      idUser: this.authService.accessId,
      companyName: this.formProject.value.companyName,
      projectName: this.formProject.value.projectName,
      registerDate: this.registerDate, 
      modifyDate: this.registerDate,        
    };  
    this._upload.addProjectFolder(registerProject).subscribe((res) => {   
        if(res){
          swal.fire('informacion Registrada Exitosamente!', '', 'success');
          this.matDialogRef.close();     
        }

    },
    (response) => {
      this.formProject.enable();
      console.log('error',response);    
      // Set the alert
      swal.fire('Error al Registrar la informacion!', '', 'error');
      // Show the alert
      this.showAlert = true;
    });
  }
  onChange(event) {
    this.file = event.target.files[0];
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


}
