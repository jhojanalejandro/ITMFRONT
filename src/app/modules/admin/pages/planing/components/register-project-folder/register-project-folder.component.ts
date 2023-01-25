import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/service/upload-data.service';
import { IProjectFolder, DetailProjectFolder } from '../../models/project-folder';
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
  numberOfTicks = 0;
  registerDate: Date = new Date();
  minDate: Date;
  formProject: FormGroup;
  ejecucion: any = GlobalConst.ejecucionContrato;
  tipoModificacion = GlobalConst.tipoModificacion;
  editarData = GlobalConst.editarData;
  editData: boolean = false;
  dataProject: IProjectFolder = { companyName: null, projectName: null, descriptionProject: null, execution: false, activate: null, contractorsCant: null, valorContrato: null, gastosOperativos: null, valorSubTotal: null, noAdicion: null, fechaInicioAmpliacion: null, fechaDeTerminacionAmpliacion: null, detalleContratoDto: null, numberProject: null, enableProject: true }
  dataDetail: DetailProjectFolder = { fechaContrato: null, fechaFinalizacion: null, adicion: null, tipoContrato: null, update: null }
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
    if (this._data != null) {
      this.editData = true;
      if (this._data.data.execution) {
        this.dataProject.execution = 'Ejecutar Contrato';
      } else {
        this.dataProject.execution = 'En Proceso';

      }
      this.dataDetail.fechaContrato = this._data.data.fechaContrato
      this.dataProject.companyName = this._data.data.companyName;
      this.dataProject.projectName = this._data.data.projectName;
      this.dataProject.descriptionProject = this._data.data.descriptionProject;
      this.dataDetail.fechaFinalizacion = this._data.data.fechaFinalizacion;
      this.dataProject.numberProject = this._data.data.numberProject
    }
  }

  ngOnInit(): void {
    // this.getDepartamento();
    this.formProject = this._formBuilder.group({
      projectName: new FormControl(this.dataProject.projectName, Validators.required),
      companyName: new FormControl(this.dataProject.companyName, Validators.required),
      ejecucion: new FormControl(this.dataProject.execution, Validators.required),
      description: new FormControl(this.dataProject.descriptionProject, Validators.required),
      fechaContrato: new FormControl(this.dataDetail.fechaContrato, Validators.required),
      fechaFinalizacion: new FormControl(this.dataDetail.fechaFinalizacion, Validators.required),
      tipoModificacion: new FormControl(null),
      updateData: new FormControl(null),
      noAdicion: new FormControl(null),
      fechaInicioAmpliacion: new FormControl(null),
      fechaDeTerminacionAmpliacion: new FormControl(null),
      numberProject: new FormControl(this.dataProject.numberProject),

    });

  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  addProjectFolder() {
    this.formProject.value.ejecucion = false
    if (this.formProject.value.updateData === 'Solo Editar') {
      this.formProject.value.updateData = true;

    } else {
      this.formProject.value.updateData = false;
    }
    const detalle: DetailProjectFolder = {
      fechaContrato: this.formProject.value.fechaContrato,
      fechaFinalizacion: this.formProject.value.fechaFinalizacion,
      adicion: false,
      tipoContrato: '',
      idContrato: null,
      update: this.formProject.value.updateData
    }
    const registerProject: IProjectFolder = {
      userId: this.authService.accessId,
      companyName: this.formProject.value.companyName,
      projectName: this.formProject.value.projectName,
      descriptionProject: this.formProject.value.description,
      execution: this.formProject.value.ejecucion,
      activate: true,
      enableProject: false,
      contractorsCant: 0,
      valorContrato: 0,
      valorSubTotal: 0,
      gastosOperativos: 0,
      noAdicion: this.formProject.value.noAdicion,
      fechaInicioAmpliacion: this.formProject.value.fechaInicioAmpliacion,
      fechaDeTerminacionAmpliacion: this.formProject.value.fechaDeTerminacionAmpliacion,
      detalleContratoDto: detalle,
      numberProject: this.formProject.value.numberProject

    };
    if (this.formProject.invalid) {
      this.formProject.enable();

      // Set the alert
      this.alert = {
        type: 'error',
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
          console.log(response);
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
    const detalle: DetailProjectFolder = {
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
      activate: true,
      enableProject: false,
      contractorsCant: 0,
      detalleContratoDto: detalle,
      valorContrato: 0,
      valorSubTotal: 0,
      gastosOperativos: 0,
      noAdicion: this.formProject.value.noAdicion,
      fechaInicioAmpliacion: this.formProject.value.fechaInicioAmpliacion,
      fechaDeTerminacionAmpliacion: this.formProject.value.fechaDeTerminacionAmpliacion,
      numberProject: this.formProject.value.numberProject
    };
    this._upload.addProjectFolder(registerProject).subscribe((res) => {
      if (res) {
        swal.fire('Bien', 'informacion Editada Exitosamente!', 'success');
        //this.matDialogRef.close();  
        this.ref.detectChanges();
        this.ref.markForCheck();
        this.cerrar();
      }

    },
      (response) => {
        this.formProject.enable();
        // Set the alert
        console.log(response);

        swal.fire('Error', 'Error al Registrar la informacion!', 'error');
        // Show the alert
      });

  }
  cerrar(): void {
    this.matDialogRef.close(true);
  }

  dateChange(event) {
    this.minDate = event.value;
    this.ref.markForCheck();

  }

}
