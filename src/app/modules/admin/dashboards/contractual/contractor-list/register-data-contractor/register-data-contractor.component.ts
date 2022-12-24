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
  hinringData: IHiringData = { contractorId: '0', fechaFinalizacionConvenio: null, contrato: null, compromiso: null, fechaDeInicioProyectado: null, fechaRealDeInicio: null, actividad: null, ejecucion: null, actaComite: null, fechaDeComite: null, requierePoliza: null, noPoliza: null, vigenciaInicial: null, vigenciaFinal: null, fechaExpedicionPoliza: null, valorAsegurado: null, fechaExaPreocupacional: null, nivel: null, interventorItm: null, cargoInterventorItm: null, noAdicion: null, fechaInicioAmpliacion: null, fechaDeTerminacionAmpliacion: null, rubro: null, nombreRubro: null, cdp: null, idsContractors: [] }
  constructor(
    private _upload: UploadDataService,
    private ref: ChangeDetectorRef,
    private _economicService: EconomicChartService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<ContractorDataRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) {
    if (this.datos.data != null) {
      this.getHiring();
      this.getElementById(this.datos.data.elementId);
      this.getComponentById(this.datos.data.componenteId);
    }
  }

  ngOnInit(): void {

    this.getComponent();
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
      noAdicion: new FormControl(this.hinringData.noAdicion),
      fechaInicioAmpliacion: new FormControl(this.hinringData.fechaInicioAmpliacion),
      fechaDeTerminacionAmpliacion: new FormControl(this.hinringData.fechaDeTerminacionAmpliacion, Validators.required),
      fechaFinalizacionConvenio: new FormControl(this.hinringData.fechaFinalizacionConvenio, Validators.required),
      elemento: new FormControl(null, Validators.required),
      componente: new FormControl(null, Validators.required),
      cdp: new FormControl(null),
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
      fechaExaPreocupacional: this.formContractor.value.fechaExamenPreocupacional,
      nivel: Number(this.formContractor.value.nivel),
      interventorItm: this.formContractor.value.interventor,
      cargoInterventorItm: this.formContractor.value.cargoInterventor,
      noAdicion: this.formContractor.value.noAdicion,
      fechaInicioAmpliacion: this.formContractor.value.fechaInicioAplicacion,
      fechaDeTerminacionAmpliacion: this.formContractor.value.fechaterminacionAplicacion,
      fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
      actaComite: 'vacio',
      rubro: this.formContractor.value.rubro,
      nombreRubro: this.formContractor.value.nombreRubro,
      cdp: this.formContractor.value.cdp,
      idsContractors: []

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
      rubro: this.formContractor.value.rubro,
      nombreRubro: this.formContractor.value.nombreRubro,
      cdp: this.formContractor.value.cdp,
      idsContractors: []
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

  private getComponent() {
    this._economicService
      .getComponent(this.datos.data.contractId)
      .subscribe((response) => {
        this.componentes = response;
      });
  }

  private getComponentById(id: any) {
    this._economicService
      .getComponentById(id)
      .subscribe((response) => {
        this.componente = response.nombreComponente;

      });
  }

  private getElementById(id: any) {
    this._economicService
      .getElementoById(id)
      .subscribe((response) => {
        this.elemento = response.nombreElemento

      });
  }
  getElements = () => {
    this._economicService
      .getElementoComponente(this.componentselectId)
      .subscribe((response) => {
        this.elements = response;
      });
    let asignar: AsignmentData = {
      id: this.componentselectId,
      type: 'Componente',
      idContractor: this.datos.data.id
    }
    this._economicService.asignmentData(asignar).subscribe((response) => {
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
    this._economicService.asignmentData(asignar).subscribe((response) => {
      if (response) {
        this.sendEconomicdataContractor();
      }
    })

  }

  sendEconomicdataContractor() {
    let element: IElements = this.elements.find(item => item.id === this.elementselectId);
    let economicData: EconomicContractor = {
      contractorId: this.datos.data.id,
      userId: this._auth.accessId,
      registerDate: this.registerDate,
      totalValue: element.valorTotal,
      unitValue: element.valorUnidad,
      totalPaidMonth: element.valorUnidad,
      cashPayment: false,
      missing: 0,
      debt: element.valorTotal,
      modifyDate: this.registerDate,
      freed: 0
    }
    this._economicService.sendEconomicdataContractor(economicData).subscribe((response) => {
      if (response) {

      }
    })
  }

  private getHiring() {
    this._economicService
      .getHiringDataById(this.datos.data.contractId)
      .subscribe((response: IHiringData) => {
        this.hinringData = response;
      });
  }


}
