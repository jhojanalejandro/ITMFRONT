import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { IHiringData } from '../models/hiring-data';
import { EconomicChartService } from 'app/modules/admin/pages/planing/economic-chart/economic-chart.service';
import { UploadDataService } from '../../contracts-list/upload-data.service';
import { AsignmentData } from '../../models/asignment-data';
import { EconomicContractor } from '../models/economic-data-contractor';
import { IElements } from '../../../../pages/planing/models/element';


@Component({
  selector: 'app-register-contractor-share',
  templateUrl: './register-data-contractor-share.component.html',
  styleUrls: ['./register-data-contractor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContractorDataRegisterShareComponent implements OnInit {
  checked = false;
  indeterminate = false;
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
  hinringData: IHiringData = { contractorId: '0', fechaFinalizacionConvenio: null, contrato: null, compromiso: null, fechaDeInicioProyectado: null, fechaRealDeInicio: null, actividad: null, ejecucion: null, actaComite: null, fechaDeComite: null, requierePoliza: null, noPoliza: null, vigenciaInicial: null, vigenciaFinal: null, fechaExpedicionPoliza: null, valorAsegurado: null, fechaExaPreocupacional: null, nivel: null, interventorItm: null, cargoInterventorItm: null, rubro: null, nombreRubro: null, cdp: null, idsContractors: [] }
  constructor(
    private _upload: UploadDataService,
    private ref: ChangeDetectorRef,
    private _economicService: EconomicChartService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<ContractorDataRegisterShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    debugger
    console.log(this.data.idContractors[0]);

    this.formContractor = this._formBuilder.group({
      contrato: new FormControl(this.hinringData.contrato),
      compromiso: new FormControl(this.hinringData.compromiso),
      rubro: new FormControl(this.hinringData.rubro),
      nombreRubro: new FormControl(this.hinringData.nombreRubro),
      fechaInicioProyectado: new FormControl(this.hinringData.fechaDeInicioProyectado, Validators.required),
      fechaInicioReal: new FormControl(this.hinringData.fechaRealDeInicio, Validators.required),
      actividad: new FormControl(this.hinringData.actividad),
      ejecucion: new FormControl(this.hinringData.ejecucion),
      fechaComite: new FormControl(this.hinringData.fechaDeComite),
      requierePoliza: new FormControl(this.hinringData.requierePoliza),
      noPoliza: new FormControl(this.hinringData.noPoliza),
      vigenciaInicial: new FormControl(this.hinringData.vigenciaInicial),
      vigenciaFinal: new FormControl(this.hinringData.vigenciaFinal),
      fechaExPedicionPoliza: new FormControl(this.hinringData.fechaExpedicionPoliza),
      valorAsegurado: new FormControl(this.hinringData.valorAsegurado),
      fechaExamenPreocupacional: new FormControl(this.hinringData.fechaExaPreocupacional),
      nivel: new FormControl(this.hinringData.nivel),
      interventor: new FormControl(this.hinringData.interventorItm),
      cargoInterventor: new FormControl(this.hinringData.cargoInterventorItm),
      fechaFinalizacionConvenio: new FormControl(this.hinringData.fechaFinalizacionConvenio, Validators.required),
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
      contractorId: this.data.data.id,
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
      fechaExaPreocupacional: this.formContractor.value.fechaExamenPreocupacional,
      nivel: Number(this.formContractor.value.nivel),
      interventorItm: this.formContractor.value.interventor,
      cargoInterventorItm: this.formContractor.value.cargoInterventor,
      fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
      actaComite: 'vacio',
      rubro: this.formContractor.value.rubro,
      nombreRubro: this.formContractor.value.nombreRubro,
      cdp: this.formContractor.value.cdp,
      idsContractors: this.data.idContractors
    };
    this._upload
      .addHiringContractor(registerContractor)
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

  async updateContractor() {
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
      contractorId: this.data.data.id,
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
      fechaExaPreocupacional: this.formContractor.value.fechaExamenPreocupacional,
      nivel: Number(this.formContractor.value.nivel),
      interventorItm: this.formContractor.value.interventor,
      cargoInterventorItm: this.formContractor.value.cargoInterventor,
      fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
      actaComite: 'vacio',
      rubro: this.formContractor.value.rubro,
      nombreRubro: this.formContractor.value.nombreRubro,
      cdp: this.formContractor.value.cdp,
      idsContractors: this.data.idContractors
    };
    this._upload
      .addHiringContractor(registerContractor)
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




}
