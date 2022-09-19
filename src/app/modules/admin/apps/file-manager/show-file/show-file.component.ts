import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { IProjectFolder } from 'app/layout/common/models/project-folder';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject,takeUntil } from 'rxjs';
import { UploadDataService } from 'app/modules/admin/dashboards/project/upload-data.service';

@Component({
    selector: 'app-register-contractor',
    templateUrl: './show-file.component.html',
    styleUrls: ['./show-file.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ShowFileComponent implements OnInit {
  shortLink: string = "";
  file: File = null; // Variable to store file
  selectContract: any;
  contratos: any;    pdfFilePath = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  formProject: FormGroup; 
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _upload: UploadDataService,
    private authService: AuthService,
    ) {}

  ngOnInit(): void {
    this.getContractsData();
  }

  async addProjectFolder() {
    // const registerProject: IProjectFolder={
    //   idUser: this.authService.accessId,
    //   companyName: this.formProject.value.companyName,
    //   projectName: this.formProject.value.projectName,      
    // };  
    // this._upload.addProjectFolder(registerProject).subscribe((res) => {   
    //     if(res){
    //       swal.fire('informacion Registrada Exitosamente!', '', 'success');
    //       this.matDialogRef.close();     
    //     }
    // },
    // (response) => {
    //   this.formProject.enable();
    //   console.log('error',response);    
    //   // Set the alert
    //   swal.fire('Error al Registrar la informacion!', '', 'error');
    //   // Show the alert
    // });
  }
  onChange(event) {
    this.file = event.target.files[0];
  }

  onUpload() {
    // this.loading = !this.loading;
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
