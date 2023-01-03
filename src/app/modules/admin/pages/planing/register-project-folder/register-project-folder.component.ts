import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { IDetailProjectFolder } from "../models/detail-project";
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/contracts-list/upload-data.service';
import { IProjectFolder } from '../models/project-folder';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
  selector: 'app-register-contractor',
  templateUrl: './register-project-folder.component.html',
  styleUrls: ['./register-project-folder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class RegisterProjectFolderComponent implements OnInit {
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  showAlert: boolean = false;
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: File = null; // Variable to store file
  indeterminate = false;
  disabled = false;
  numberOfTicks = 0;
  registerDate = new Date();
  minDate: any;
  formProject: FormGroup;
  ejecucion: any = GlobalConst.ejecucionContrato;
  tipoModificacion = GlobalConst.tipoModificacion;
  editarData = GlobalConst.editarData;
  editData: boolean = false;
  projectName: any = null;
  descript: any = null;
  fechaContrato: any = null;
  fechaFinalizacion: any = null;
  companyName: any = null;
  execution: any = null;
  constructor(
    private _upload: UploadDataService,
    private _formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private authService: AuthService,
    public matDialogRef: MatDialogRef<RegisterProjectFolderComponent>,
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
    if (this._data != null) {
      this.editData = true;
      if (this._data.data.execution) {
        this.execution = 'Ejecutar Contrato';
      } else {
        this.execution = 'En Proceso';

      }
      this.fechaContrato = this._data.data.fechaContrato
      this.editData = true;
      this.companyName = this._data.data.companyName;
      this.projectName = this._data.data.projectName;
      this.descript = this._data.data.descriptionProject;
      this.fechaContrato = this._data.data.fechaContrato;
      this.fechaFinalizacion = this._data.data.fechaFinalizacion;

    }
    // this.getDepartamento();
    this.formProject = this._formBuilder.group({
      projectName: new FormControl(this.projectName, Validators.required),
      companyName: new FormControl(this.companyName, Validators.required),
      ejecucion: new FormControl(this.execution, Validators.required),
      description: new FormControl(this.descript, Validators.required),
      fechaContrato: new FormControl(this.fechaContrato, Validators.required),
      fechaFinalizacion: new FormControl(this.fechaFinalizacion, Validators.required),
      tipoModificacion: new FormControl(this.fechaFinalizacion),
      updateData: new FormControl(this.fechaFinalizacion),
      noAdicion: new FormControl(null),
      fechaInicioAmpliacion: new FormControl(null),
      fechaDeTerminacionAmpliacion: new FormControl(null),
    });

  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  addProjectFolder() {
    if (this.formProject.value.ejecucion == 'Ejecutar Contrato') {
      this.formProject.value.ejecucion = true;
    } else {
      this.formProject.value.ejecucion = false;
    }
    if (this.formProject.value.updateData === 'Solo Editar') {
      this.formProject.value.updateData = true;

    } else {
      this.formProject.value.updateData = false;

    }
    const detalle: IDetailProjectFolder = {
      fechaContrato: this.formProject.value.fechaContrato,
      fechaFinalizacion: this.formProject.value.fechaFinalizacion,
      adicion: false,
      tipoContrato: '',
      idContrato: 0,
      update: this.formProject.value.updateData
    }
    const registerProject: IProjectFolder = {
      userId: this.authService.accessId,
      companyName: this.formProject.value.companyName,
      projectName: this.formProject.value.projectName,
      descriptionProject: this.formProject.value.description,
      execution: this.formProject.value.ejecucion,
      activate: false,
      contractorsCant: 0,
      valorContrato: 0,
      valorSubTotal: 0,
      gastosOperativos: 0,
      noAdicion: this.formProject.value.noAdicion,
      fechaInicioAmpliacion: this.formProject.value.fechaInicioAmpliacion,
      fechaDeTerminacionAmpliacion: this.formProject.value.fechaDeTerminacionAmpliacion,
      detalleContratoDto: detalle
    };
    if (this.formProject.invalid) {
      this.formProject.enable();
         
      // Set the alert
      this.alert = {
          type   : 'error',
          message: 'ERROR EN LA INFORMACION'
      };

      // Show the alert
      this.showAlert = true;
    } else {


      this._upload.addProjectFolder(registerProject).subscribe((res) => {
        if (res) {
          swal.fire('Bien', 'informacion Registrada Exitosamente!', 'success');
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();
          this.cerrar();
        }

      },
        (response) => {
          this.formProject.enable();
          // Set the alert
          swal.fire('Error', 'Error al Registrar la informacion!', 'error');
        });
    }

  }

  async editProjectFolder() {

    let adicion: boolean = false;
    if (this._data.data.fechaFinalizacion != this.formProject.value.fechaFinalizacion) {
      adicion = true;
    }

    if (this.formProject.value.ejecucion == 'Ejecutar Contrato') {
      this.formProject.value.ejecucion = true;
    } else {
      this.formProject.value.ejecucion = false;
    }
    if (this.formProject.value.updateData === 'Solo Editar') {
      this.formProject.value.updateData = true;

    } else {
      this.formProject.value.updateData = false;

    }
    const detalle: IDetailProjectFolder = {
      fechaContrato: this.formProject.value.fechaContrato,
      fechaFinalizacion: this.formProject.value.fechaFinalizacion,
      adicion: adicion,
      tipoContrato: this.formProject.value.tipoModificacion,
      idContrato: this._data.data.id,
      update: this.formProject.value.updateData

    }
    const registerProject: IProjectFolder = {
      id: this._data.data.id,
      userId: this.authService.accessId,
      companyName: this.formProject.value.companyName,
      projectName: this.formProject.value.projectName,
      descriptionProject: this.formProject.value.description,
      execution: this.formProject.value.ejecucion,
      activate: false,
      contractorsCant: 0,
      detalleContratoDto: detalle,
      valorContrato: 0,
      valorSubTotal: 0,
      gastosOperativos: 0,
      noAdicion: this.formProject.value.noAdicion,
      fechaInicioAmpliacion: this.formProject.value.fechaInicioAmpliacion,
      fechaDeTerminacionAmpliacion: this.formProject.value.fechaDeTerminacionAmpliacion,
    };
    this._upload.addProjectFolder(registerProject).subscribe((res) => {
      if (res) {
        swal.fire('Bien', 'informacion Editada Exitosamente!', 'success');
        //this.matDialogRef.close();  
        this.ref.detectChanges();
        this.ref.markForCheck();
      }

    },
      (response) => {
        this.formProject.enable();
        // Set the alert
        swal.fire('Error', 'Error al Registrar la informacion!', 'error');
        // Show the alert
      });

  }
  cerrar(): void {
    this.matDialogRef.close(true);
  }

  dateChange() {
    this.minDate = new Date(this.formProject.value.fechaContrato);
    this.ref.markForCheck();

  }

}
