import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { UploadDataService } from '../upload-data.service';
import swal from 'sweetalert2';
import { IProjectFolder } from 'app/layout/common/models/project-folder';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';


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
  ejecucion: any = GlobalCont.ejecucionContrato;
  editData: boolean = false;
  projectName: any = null;
  descript: any = null;
  companyName: any = null;
  constructor(
    private _upload: UploadDataService,
    private _formBuilder: FormBuilder,
      private ref: ChangeDetectorRef,
    private authService: AuthService,
    public matDialogRef: MatDialogRef<ProjectFolderComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { data: any }
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
    console.log('llega',this._data);
    if(this._data != null){
      this.editData = true;
      this.companyName = this._data.data.companyName;
      this.projectName = this._data.data.projectName;
      this.descript = this._data.data.descriptionProject;
    }
      // this.getDepartamento();
    this.formProject = this._formBuilder.group({
    projectName: new FormControl(this.projectName, Validators.required),
    companyName: new FormControl(this.companyName, Validators.required),
    ejecucion: new FormControl(null, Validators.required),       
    description: new FormControl(this.descript, Validators.required), 
    });

  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  async addProjectFolder() {
    if(this.formProject.value.ejecucion == 'Ejecutar Contrato'){
      this.formProject.value.ejecucion = true; 
    }else{
      this.formProject.value.ejecucion = false; 
    }
    const registerProject: IProjectFolder={
      userId: this.authService.accessId,
      companyName: this.formProject.value.companyName,
      projectName: this.formProject.value.projectName,
      descriptionProject: this.formProject.value.description,
      registerDate: this.registerDate, 
      modifyDate: this.registerDate, 
      execution:  this.formProject.value.ejecucion,
      activate: false   
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


  async editProjectFolder(){
    const registerProject: IProjectFolder={
      id: this._data.data.id,
      userId: this.authService.accessId,
      companyName: this.formProject.value.companyName,
      projectName: this.formProject.value.projectName,
      descriptionProject: this.formProject.value.description,
      registerDate: this._data.data.registerDate, 
      modifyDate: this.registerDate,   
      execution:  this.formProject.value.ejecucion,
      activate: false        
    };  
    this._upload.UpdateProjectFolder(registerProject).subscribe((res) => {   
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
  cerrar(): void {
    this.matDialogRef.close();
  } 

}
