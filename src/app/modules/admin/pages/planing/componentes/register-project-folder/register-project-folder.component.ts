import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/service/upload-data.service';
import { FuseAlertType } from '@fuse/components/alert';
import { DetailContractFolder, ContractFolder, ContractFolders } from '../../models/planing-model';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { Subject, takeUntil } from 'rxjs';
import { RubroType, StatusContract } from 'app/modules/admin/generic/model/generic.model';
import { CodeStatusContract } from 'app/layout/common/enums/statusContract';
import { DetailTypeCodes, DocumentTypeFileCodes } from 'app/layout/common/enums/document-type/document-type';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';

@Component({
  selector: 'app-register-contractor',
  templateUrl: './register-project-folder.component.html',
  styleUrls: ['./register-project-folder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class RegisterContractFolderComponent implements OnInit {
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  showAlert: boolean = false;
  numberOfTicks = 0;
  registerDate: Date = new Date();
  minDate: Date;
  statusContract: StatusContract[] = [];
  formProject: FormGroup;
  tipoContrato: any;
  rubros: RubroType[] = [];
  rubroNumber: string;
  editData: boolean = false;
  AddeditData: boolean = false;
  dataProject: ContractFolders = { companyName: null, projectName: null, statusContract: null, activate: null, contractorsCant: null, valorContrato: null, gastosOperativos: null, valorSubTotal: null, noAdicion: null, fechaInicioAmpliacion: null, fechaDeTerminacionAmpliacion: null, fechaFinalizacion: null, fechaContrato: null, numberProject: null, enableProject: true, project: null, rubro: null, nombreRubro: null, fuenteRubro: null, objectContract: null }
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  permission: boolean = false;
  detailType: string;
  constructor(
    private _upload: UploadDataService,
    private _genericService: GenericService,
    private _formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private authService: AuthService,
    public matDialogRef: MatDialogRef<RegisterContractFolderComponent>,
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
      this.dataProject.fechaContrato = new Date(this._data.data.fechaContrato)
      this.dataProject.companyName = this._data.data.companyName;
      this.dataProject.projectName = this._data.data.projectName;
      this.dataProject.fechaFinalizacion = new Date(this._data.data.fechaFinalizacion);
      this.dataProject.numberProject = this._data.data.numberProject;
      this.dataProject.rubro = this._data.data.rubro;
      this.dataProject.project = this._data.data.project;
      this.dataProject.nombreRubro = this._data.data.nombreRubro;
      this.dataProject.rubroId = this._data.data.rubroId;
      this.dataProject.fuenteRubro = this._data.data.fuenteRubro;
      this.dataProject.objectContract = this._data.data.objectContract;
      this.dataProject.statusContractId = this._data.data.statusContractId;
      this.detailType = this._data.data.detailType;


    }
  }

  ngOnInit(): void {
    // this.getDepartamento();
    this.permission = this.authService.validateRoll(CodeUser.PLANEACION, null);
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos de modificar Información!', 'warning');

    }

    this.getStatusContract();
    this.getTypeMinuteContract();
    this.getRubroContract();
    this.formProject = this._formBuilder.group({
      projectName: new FormControl(this.dataProject.projectName, Validators.required),
      companyName: new FormControl(this.dataProject.companyName, Validators.required),
      statusContract: new FormControl(this.dataProject.statusContractId),
      objectContract: new FormControl(this.dataProject.objectContract),
      fechaContrato: new FormControl(this.dataProject.fechaContrato, Validators.required),
      fechaFinalizacion: new FormControl(this.dataProject.fechaFinalizacion, Validators.required),
      tipoModificacion: new FormControl(null),
      noAdicion: new FormControl(null),
      fechaInicioAmpliacion: new FormControl(null),
      fechaDeTerminacionAmpliacion: new FormControl(null),
      numberProject: new FormControl(this.dataProject.numberProject),
      rubro: new FormControl(this.dataProject.rubroId),
      nombreRubro: new FormControl(this.dataProject.nombreRubro),
      fuenteRubro: new FormControl(this.dataProject.fuenteRubro),

      project: new FormControl(this.dataProject.project)
    });

  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  addContractFolder() {
    if (this.formProject.invalid) {
      this.formProject.enable();

      // Set the alert
      this.alert = {
        type: 'error',
        message: 'ERROR EN LA INFORMACION'
      };

      // Show the alert
      this.showAlert = true;
      return
    } else {

      if (this.formProject.value.statusContract == null) {
        let status: StatusContract[] = this.statusContract.filter(f => f.code == CodeStatusContract.INICIADO)
        this.formProject.value.statusContract = status[0].id;
      }
      if (this.formProject.value.updateData === 'Solo Editar') {
        this.formProject.value.updateData = true;

      } else {
        this.formProject.value.updateData = false;
      }
      const detalle: DetailContractFolder = {
        fechaContrato: this.formProject.value.fechaContrato,
        fechaFinalizacion: this.formProject.value.fechaFinalizacion,
        adicion: false,
        detailType: this.detailType,
        contractId: null,
        registerDate: this.registerDate,
        modifyDate: this.registerDate,
        userId: this.authService.accessId,
      }
      const registerProject: ContractFolder = {
        companyName: this.formProject.value.companyName,
        projectName: this.formProject.value.projectName,
        objectContract: this.formProject.value.objectContract,
        statusContractId: this.formProject.value.statusContract,
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
        numberProject: this.formProject.value.numberProject,
        project: this.formProject.value.project,
        rubro: this.formProject.value.rubro,
        nombreRubro: this.formProject.value.nombreRubro,
        fuenteRubro: this.formProject.value.fuenteRubro

      };

      this._upload.addContractFolder(registerProject)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
          if (res) {
            if (res.success) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '',
                html: res.message,
                showConfirmButton: false,
                timer: 1500
              });
              //this.matDialogRef.close();  
              this.ref.detectChanges();
              this.ref.markForCheck();
              this.matDialogRef.close(true);
            } else {
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: '',
                html: res.message,
                showConfirmButton: false,
                timer: 1500
              });
            }
          }

        },
          (response) => {
            this.formProject.enable();
            // Set the alert
            console.log(response);
          });
    }

  }

  async editContractFolder() {

    let adicion: boolean = false;
    if (this._data.data.fechaFinalizacion != this.formProject.value.fechaFinalizacion) {
      adicion = true;
    }

    if (this.formProject.value.updateData === 'Solo Editar') {
      this.formProject.value.updateData = false;

    } else {
      this.formProject.value.updateData = true;

    }
    const detalle: DetailContractFolder = {
      fechaContrato: this.formProject.value.fechaContrato,
      fechaFinalizacion: this.formProject.value.fechaFinalizacion,
      adicion: adicion,
      detailType: this.formProject.value.tipoModificacion,
      contractId: this._data.data.id,
      id: this._data.data.detailContractId,
      modifyDate: this.registerDate,
      userId: this.authService.accessId,
    }
    const registerProject: ContractFolder = {
      id: this._data.data.id,
      companyName: this.formProject.value.companyName,
      projectName: this.formProject.value.projectName,
      objectContract: this.formProject.value.objectContract,
      statusContractId: this.formProject.value.statusContract,
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
      numberProject: this.formProject.value.numberProject,
      project: this.formProject.value.project,
      rubro: this.formProject.value.rubro,
      nombreRubro: this.formProject.value.nombreRubro,
      fuenteRubro: this.formProject.value.fuenteRubro
    };
    this._upload.addContractFolder(registerProject)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: 'Información actualizada Exitosamente!',
            showConfirmButton: false,
            timer: 1500
          });
          //this.matDialogRef.close();  
          this.ref.detectChanges();
          this.ref.markForCheck();
          this.matDialogRef.close(true);
        }

      },
        (response) => {
          this.formProject.enable();
          // Set the alert
          console.log(response);

          Swal.fire('Error', 'Error al Registrar la informacion!', 'error');
          // Show the alert
        });

  }
  cerrar(): void {
    this.matDialogRef.close(false);
  }

  dateChange(event) {
    this.minDate = event.value;
    this.ref.markForCheck();

  }

  private getStatusContract() {
    this._genericService.getstatusContract()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.statusContract = res;
      });
  }

  changeRubro(e: any) {
    let dataRubro = this.rubros.find(f => f.id == e.value)
    this.dataProject.rubro = dataRubro.rubroNumber;
    this.dataProject.nombreRubro = dataRubro.rubro;
    this.dataProject.fuenteRubro = dataRubro.rubroOrigin;
  }

  private getRubroContract() {
    this._genericService.getRubrosContract()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (resp) => {
          this.rubros = resp;
        }
      );
  }

  changeTipe(e: any) {
    if (e.value === 'Agregar Modificación') {
      this.AddeditData = true;
    } else {
      this.AddeditData = false;
    }
  }
  private getTypeMinuteContract() {
    this._genericService.getDetailType()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (resp) => {
          this.detailType = resp.find(f => f.code === DetailTypeCodes.MFC).id
          this.tipoContrato = resp;
        }
      );
  }

  

}
