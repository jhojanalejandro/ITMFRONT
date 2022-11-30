import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UploadDataService } from '../contracts-list/upload-data.service';
import swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { IHiringData } from './models/hiring-data';
import { EconomicChartService } from 'app/modules/admin/pages/planing/economic-chart/economic-chart.service';
import { AsignmentData } from '../models/asignment-data';


@Component({
  selector: 'app-register-contractor',
  templateUrl: './register-data-contractor.component.html',
  styleUrls: ['./register-data-contractor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContractorDataRegisterComponent implements OnInit {
  checked = false;
  indeterminate = false;
  elemento: any = 'elemento';
  componente: any = 'compoente';
  elements: any;
  componentes: any;
  componentselectId: any;
  elementselectId: any;
  formFieldHelpers: string[] = [''];
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  showAlert: boolean = false;
  registerDate = new Date();
  entidadesB: any = GlobalConst.entidadesB;
  entidadesEps: any = GlobalConst.eps;
  entidadesP: any = GlobalConst.pensiones;
  requierePoliza: any = GlobalConst.requierePoliza
  entidadesdArl: any = GlobalConst.arl;
  niveles: any = GlobalConst.Nivel;
  comunas: any = GlobalConst.comunas;
  tipoCuenta: any = GlobalConst.tipoCuenta;
  formContractor: FormGroup;
  nacionalidades: any = GlobalConst.nacionalidad;

  constructor(
    private _upload: UploadDataService,
    private ref: ChangeDetectorRef,
    private _service: EconomicChartService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<ContractorDataRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log(this.datos);
    this.getComponent();
    this.getElementById(this.datos.data.elementId);
    this.getComponentById(this.datos.data.componenteId);

    this.formContractor = this._formBuilder.group({
      contrato: new FormControl(null),
      compromiso: new FormControl(null),
      rubro: new FormControl(null),
      nombreRubro: new FormControl(null),
      fechaInicioProyectado: new FormControl(null, Validators.required),
      fechaInicioReal: new FormControl(null, Validators.required),
      honorariosMensuales: new FormControl(null, Validators.required),
      actividad: new FormControl(null),
      ejecucion: new FormControl(null),
      fechaComite: new FormControl(null),
      requierePoliza: new FormControl(null),
      noPoliza: new FormControl(null),
      vigenciaInicial: new FormControl(null),
      vigenciaFinal: new FormControl(null),
      fechaExPedicionPoliza: new FormControl(null),
      valorAsegurado: new FormControl(null),
      fechaExaPreocupacional: new FormControl(null),
      nivel: new FormControl(null),
      interventor: new FormControl(null),
      cargoInterventor: new FormControl(null),
      noAdicion: new FormControl(null),
      fechaInicioAplicacion: new FormControl(null),
      fechaterminacionAplicacion: new FormControl(null, Validators.required),
      fechaFinalizacionConvenio: new FormControl(null, Validators.required),
      elemento: new FormControl(null, Validators.required),
      componente: new FormControl(null, Validators.required),
    });
  }

  async addContractor() {
    if (this.formContractor.value.requierePoliza == 'si') {
      this.formContractor.value.requierePoliza = true;
    } else {
      this.formContractor.value.requierePoliza = false;

    }

    if (this.formContractor.value.cuentabancaria == null) {
      this.formContractor.value.cuentabancaria = '0'
    }
    if (this.formContractor.value.nivel == null) {
      this.formContractor.value.nivel = '0'
    }

    const registerContractor: IHiringData = {
      userId: this._auth.accessId,
      contractorId: this.datos.data.id,
      contrato: 'vacio',
      compromiso: 'vacio',
      fechaDeInicioProyectado: this.formContractor.value.fechaInicioProyectado,
      fechaRealDeInicio: this.formContractor.value.fechaInicioReal,
      actividad: this.formContractor.value.actividad,
      ejecucion: this.formContractor.value.ejecucion,
      fechaDeComite: this.formContractor.value.fechaComite,
      requierePoliza: this.formContractor.value.requierePoliza,
      noPoliza: this.formContractor.value.noPoliza,
      vigenciaInicial: this.formContractor.value.vigenciaInicial,
      vigenciaFinal: this.formContractor.value.vigenciaFinal,
      fechaExpedicionPoliza: this.formContractor.value.fechaExPedicionPoliza,
      valorAsegurado: Number(this.formContractor.value.valorAsegurado),
      fechaExaPreocupacional: this.formContractor.value.fechaExaPreocupacional,
      nivel: Number(this.formContractor.value.nivel),
      interventorItm: this.formContractor.value.interventor,
      cargoInterventorItm: this.formContractor.value.cargoInterventor,
      noAdicion: this.formContractor.value.noAdicion,
      fechaInicioAmpliacion: this.formContractor.value.fechaInicioAplicacion,
      fechaDeTerminacionAmpliacion: this.formContractor.value.fechaterminacionAplicacion,
      fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
      actaComite: 'vacio',
      rubro:  this.formContractor.value.rubro,
      nombreRubro:  this.formContractor.value.nombreRubro
    };
    debugger
    this._upload
      .addContractor(registerContractor)
      .subscribe((res) => {
        if (res) {
          swal.fire('Contratista Registrado Exitosamente!', '', 'success');
          this.ref.detectChanges();
          this.ref.markForCheck();
        }

      },
        (response) => {
          this.formContractor.enable();
          // Set the alert
          this.alert = {
            type: 'error',
            message: 'ERROR EN LA INFORMACION'
          };

          // Show the alert
          this.showAlert = true;
        });
  }

  cerrar(): void {
    this.matDialogRef.close();
  }

  private getComponent() {
    this._service
      .getComponent(this.datos.data.contractId)
      .subscribe((response) => {
        this.componentes = response;
      });
  }

  private getComponentById(id: any) {
    this._service
      .getComponentById(id)
      .subscribe((response) => {
        this.componente = response.nombreComponente;

      });
  }

  private getElementById(id: any) {
    this._service
      .getElementoById(id)
      .subscribe((response) => {
        this.elemento = response.nombreElemento

      });
  }
  getElements = () => {
    this._service
      .getElementoComponente(this.componentselectId)
      .subscribe((response) => {
        this.elements = response;
      });
    let asignar: AsignmentData = {
      id: this.componentselectId,
      type: 'Componente',
      idContractor: this.datos.data.id
    }
    this._service.asignmentData(asignar).subscribe((response) => {
      if (response) {

      }
    })
  }

  asignElement = () => {
    let asignar: AsignmentData = {
      id: this.elementselectId,
      type: 'Elemento',
      idContractor: this.datos.data.id
    }
    this._service.asignmentData(asignar).subscribe((response) => {
      if (response) {
      }
    })

  }

}
