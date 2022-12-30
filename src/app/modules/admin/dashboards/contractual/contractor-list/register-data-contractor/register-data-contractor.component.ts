import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import Swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { IHiringData } from '../models/hiring-data';
import { EconomicChartService } from 'app/modules/admin/pages/planing/economic-chart/economic-chart.service';
import { UploadDataService } from '../../contracts-list/upload-data.service';
import { AsignmentData } from '../../models/asignment-data';
import { EconomicContractor } from '../models/economic-data-contractor';
import { IElements } from '../../../../pages/planing/models/element';
import { F } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-register-contractor',
  templateUrl: './register-data-contractor.component.html',
  styleUrls: ['./register-data-contractor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContractorDataRegisterComponent implements OnInit {
  shareData: boolean = false;
  elemento: any = 'elemento';
  componente: any = 'compoente';
  elements: any;
  showDataPoliza: boolean = false;
  registerContractor: IHiringData;
  hiringDataList: IHiringData[] = [];
  update: boolean = false;
  componentes: any;
  componentselectId: any;
  elementselectId: any;
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  showAlert: boolean = false;
  registerDate = new Date();
  requierePoliza: any = GlobalConst.requierePoliza
  niveles: any = GlobalConst.Nivel;
  formContractor: FormGroup;
  hinringData: IHiringData = { contractorId: '0', fechaFinalizacionConvenio: null, contrato: null, compromiso: null, fechaDeInicioProyectado: null, fechaRealDeInicio: null, actividad: null, ejecucion: null, actaComite: null, fechaDeComite: null, requierePoliza: null, noPoliza: null, vigenciaInicial: null, vigenciaFinal: null, fechaExpedicionPoliza: null, valorAsegurado: null, fechaExaPreocupacional: null, nivel: null, supervisorItm: null, cargoSupervisorItm: null, rubro: null, nombreRubro: null, cdp: null }
  constructor(
    private _uploadService: UploadDataService,
    private ref: ChangeDetectorRef,
    private _economicService: EconomicChartService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<ContractorDataRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) {
    debugger
    if (this.datos.id != null && this.datos.id >0 ) {
      this.getHiring();
      if (this.datos.elementId != null && this.datos.elementId != 0 && this.datos.idContractors.length == 0) {
        this.getElementById(this.datos.elementId);
        this.getComponentById(this.datos.componenteId);
      }else if( this.datos.idContractors.length > 0){
        this.shareData = true;
      }
    }else if(this.datos.idContractors.length == 0){
      Swal.fire(
        'Ei!',
        'Si quires agregar información compartida debes seleccionar regisrtos',
        'question'
    );
    this.matDialogRef.close(true);
    }else if(this.datos.idContractors.length == 0 && this.datos.id == 0){
      Swal.fire(
        'Ei!',
        'Hay un error al ingresar, intenta de nuevo',
        'warning'
    );
    this.matDialogRef.close(true);
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
      supervisorItm: new FormControl(this.hinringData.supervisorItm),
      cargoSupervisorItm: new FormControl(this.hinringData.cargoSupervisorItm),

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

    if(this.datos.idContractors.length > 0){
      this.registerContractor = {
        userId: this._auth.accessId,
        contractorId: '0',
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
        supervisorItm: this.formContractor.value.supervisorItm,
        cargoSupervisorItm: this.formContractor.value.cargoSupervisorItm,
        fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
        actaComite: 'vacio',
        rubro: this.formContractor.value.rubro,
        nombreRubro: this.formContractor.value.nombreRubro,
        cdp: this.formContractor.value.cdp,
      };
      debugger
      this.datos.idContractors.forEach(element => {
        this.registerContractor.contractorId = element;
        this.hiringDataList.push(this.registerContractor);
        //this.hiringDataList[this.hiringDataList.findIndex(el => el.id === this.datos.idContractors[element])] = this.registerContractor;
      });
    }else{
      this.hiringDataList = [{
        userId: this._auth.accessId,
        contractorId: this.datos.id,
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
        supervisorItm: this.formContractor.value.interventor,
        cargoSupervisorItm: this.formContractor.value.cargoInterventor,
        fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
        actaComite: 'vacio',
        rubro: this.formContractor.value.rubro,
        nombreRubro: this.formContractor.value.nombreRubro,
        cdp: this.formContractor.value.cdp
      }];
    }


    this._uploadService
      .addHiringContractor(this.hiringDataList)
      .subscribe((res) => {
        if (res) {
          Swal.fire('Bien', 'Contratista Registrado Exitosamente!', 'success');
          this.ref.detectChanges();
          this.ref.markForCheck();
          this.matDialogRef.close(true);
        }

      },
        (response) => {
          this.formContractor.enable();
          // Set the alert
          this.alert = {
            type: 'error',
            message: 'ERROR EN LA INFORMACION'
          };
          console.log(response);
          
          Swal.fire('Error', 'Información no Actualizada!', 'error');
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

    const registerContractor: IHiringData[] = [{
      userId: this._auth.accessId,
      contractorId: this.datos.id,
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
      supervisorItm: this.formContractor.value.interventor,
      cargoSupervisorItm: this.formContractor.value.cargoInterventor,
      fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
      actaComite: 'vacio',
      rubro: this.formContractor.value.rubro,
      nombreRubro: this.formContractor.value.nombreRubro,
      cdp: this.formContractor.value.cdp,
    }];
    this._uploadService
      .addHiringContractor(registerContractor)
      .subscribe((res) => {
        if (res) {
          Swal.fire('Bien', 'Contratista Registrado Exitosamente!', 'success');
          this.ref.detectChanges();
          this.ref.markForCheck();
          this.matDialogRef.close(true);
        }

      },
        (response) => {
          this.formContractor.enable();
          // Set the alert
          console.log(response);
          
          Swal.fire('Error', 'Información no Actualizada!', 'error');

          // Show the alert
          this.showAlert = true;
        });
  }

  cerrar(): void {
    this.matDialogRef.close();
  }

  private getComponent() {
    this._economicService
      .getComponent(this.datos.contractId)
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
      idContractor: this.datos.id
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
      idContractor: this.datos.id
    }
    this._economicService.asignmentData(asignar).subscribe((response) => {
      if (response) {
        this.sendEconomicdataContractor();
      }
    })
  }

  sendEconomicdataContractor() {
    let element: IElements = this.elements.find(item => item.id === this.elementselectId);
    debugger
    const total = element.valorTotal / element.cantidadContratistas;
    let economicData: EconomicContractor = {
      contractorId: this.datos.id,
      userId: this._auth.accessId,
      registerDate: this.registerDate,
      totalValue: total,
      unitValue: element.valorUnidad,
      totalPaidMonth: element.valorUnidad,
      cashPayment: false,
      missing: 0,
      debt: total,
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
      .getHiringDataById(this.datos.contractId)
      .subscribe((response: IHiringData) => {
        if (response != null) {
          this.update = true;
          this.hinringData = response;
        }
      });
  }

  requiere(event){
    if(event.value==='Si'){
      this.showDataPoliza = true;
    }else{
      this.showDataPoliza = false;
    }
  }

}
