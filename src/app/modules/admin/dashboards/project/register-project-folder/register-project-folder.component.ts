import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { IContractor } from 'app/layout/common/models/contractor';
import { UploadDataService } from '../upload-data.service';
import swal from 'sweetalert2';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { IProjectFolder } from 'app/layout/common/models/project-folder';
import { AuthService } from 'app/core/auth/auth.service';


@Component({
    selector: 'app-register-contractor',
    templateUrl: './register-project-folder.component.html',
    styleUrls: ['./register-project-folder.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProjectFolderComponent implements OnInit {
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: File = null; // Variable to store file
  indeterminate = false;
  disabled = false;
  numberOfTicks = 0;
  showAlert: boolean = false;
  registerDate = new Date();
  formProject: FormGroup; 

  constructor(
    private _upload: UploadDataService,
    private _formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private authService: AuthService,
    public matDialogRef: MatDialogRef<ProjectFolderComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { ticket: any }
    ) {

      setInterval(() => {
        this.numberOfTicks++;
        // require view to be updated
        this.ref.detectChanges();
        this.ref.markForCheck();
      }, 1000);
     }

  ngOnInit(): void {
        // this.getRaffle();

      // this.getDepartamento();
    this.formProject = this._formBuilder.group({
    projectName: new FormControl(null, Validators.required),
    companyName: new FormControl(null, Validators.required),      
    description: new FormControl(null, Validators.required), 
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
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();   
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

}
