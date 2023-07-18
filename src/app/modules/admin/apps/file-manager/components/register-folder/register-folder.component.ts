import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Folder } from 'app/layout/common/models/folder-contractor';
import { ActivatedRoute } from '@angular/router';
import { FileManagerService } from '../../services/file-manager.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';


@Component({
    selector: 'app-register',
    templateUrl: './register-folder.component.html',
    styleUrls: ['./register-folder.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterFolderComponent implements OnInit {
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  indeterminate = false;

  numberOfTicks = 0;
  showAlert: boolean = false;
  registerDate = new Date();
  formProject: FormGroup; 
  editData: boolean = false;
  folderName: any = null;
  descript: any;
  tiposCarpeta: any = GlobalConst.tipoCarpeta;

  constructor(
    private _uploadService: FileManagerService,
    private _formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private authService: AuthService,
    private router: ActivatedRoute,
    public matDialogRef: MatDialogRef<RegisterFolderComponent>,
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
    if(this._data.folderName != 'vacio'){
      this.editData = true;
      this.folderName = this._data.data.projectName;
      this.descript = this._data.data.descript;

    }
      // this.getDepartamento();
    this.formProject = this._formBuilder.group({
    folderName: new FormControl(this.folderName, Validators.required),      
    description: new FormControl(this.descript, Validators.required), 

    });

  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  addContractorFolder() {
    const registerGFolder: Folder={
      userId: this.authService.accessId,
      contractorId: this._data.contractorId,
      contractId: this._data.contractId,
      folderName: this.formProject.value.folderName,
      descriptionProject: this.formProject.value.description,
      registerDate: this.registerDate, 
      modifyDate: this.registerDate,
      folderType: this._data.folderType,      
    };  
    this._uploadService.addFolderContractor(registerGFolder).subscribe((res) => {   
        if(res){
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
          this.cerrar();  
        }

    },(response) => {
      this.formProject.enable();
      // Set the alert
      swal.fire('Error', 'Error al Registrar la informacion!', 'error');
      // Show the alert
      this.showAlert = true;
    });
  }
  addFolder(){
    if(this._data.folderType === 'Contratista'){
      this.addContractorFolder();
    }else{
      this.addContractFolder();
    }
  }
  addContractFolder() {
    const registerGFolder: Folder={
      userId: this.authService.accessId,
      contractId: this._data.contractId,
      folderName: this.formProject.value.folderName,
      descriptionProject: this.formProject.value.description,
      registerDate: this.registerDate, 
      modifyDate: this.registerDate,
      folderType: this._data.folderType,      
    };  
    this._uploadService.addFolderContractor(registerGFolder).subscribe((res) => {   
        if(res){
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
          this.cerrar();  
        }

    },(response) => {
      this.formProject.enable();
      // Set the alert
      swal.fire('Error', 'Error al Registrar la informacion!', 'error');
      // Show the alert
      this.showAlert = true;
    });
  }

  editContractFolder(){
    const editProject: Folder={
      id: this._data.data.id,
      userId: this.authService.accessId,
      contractorId: this._data.contractId,
      contractId: this._data.contractId,
      folderName: this.formProject.value.folderName,
      descriptionProject: this.formProject.value.description,
      registerDate: this._data.data.registerDate, 
      modifyDate: this.registerDate,
      folderType: this.formProject.value.typeFolder,       
    };  
    this._uploadService.UpdateContractFolder(editProject).subscribe((res) => {   
        if(res){
          swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: 'Información actualizada Exitosamente!',
            showConfirmButton: false,
            timer: 1500
          });
          this.ref.detectChanges();
          this.ref.markForCheck();   
          this.cerrar();  
        }

    },
    (response) => {
      this.formProject.enable();
      console.log('error',response);    
      // Set the alert
      swal.fire('Error', 'Error al Registrar la informacion!', 'error');
      // Show the alert
      this.showAlert = true;
    });

  }
  cerrar(): void {
    this.matDialogRef.close(true);
  } 

}
