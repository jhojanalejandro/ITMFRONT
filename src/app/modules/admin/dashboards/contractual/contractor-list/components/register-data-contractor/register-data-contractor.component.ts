import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import Swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { IHiringData } from '../../../models/hiring-data';
import { EconomicChartService } from 'app/modules/admin/pages/planing/service/economic-chart.service';
import { UploadDataService } from '../../../service/upload-data.service';
import { AsignmentData } from '../../../models/asignment-data';
import { EconomicContractor } from '../../../../nomina/models/economic-data-contractor';
import { IElements } from '../../../../../pages/planing/models/element';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register-contractor',
  templateUrl: './register-data-contractor.component.html',
  styleUrls: ['./register-data-contractor.component.scss'],
})
export class ContractorDataRegisterComponent implements OnInit {
  shareData: boolean = false;
  durationInSeconds = 3;
  registerDate: Date = new Date();
  minDate: Date;
  maxdate: Date;
  elemento: any = 'elemento';
  componente: any = 'compoente';
  elements: any;
  cantDayContract: any;
  showDataPoliza: boolean = false;
  registerContractor: IHiringData;
  hiringDataList: IHiringData[] = [];
  economicDataList: EconomicContractor[] = [];
  update: boolean = false;
  componentes: any;
  userAdmins: any;
  componentselectId: any;
  elementselectId: any;
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  nivel: string = 'Nivel';
  supervisor: string = 'Supervisor';
  showAlert: boolean = false;
  requierePoliza: any = GlobalConst.requierePoliza
  niveles: any = GlobalConst.Nivel;
  formContractor: FormGroup;
  hinringData: IHiringData = {      contractId: this.datos.contractId, contractorId: null, fechaFinalizacionConvenio: null, contrato: null, compromiso: null, fechaRealDeInicio: null, actaComite: null, fechaDeComite: null, requierePoliza: null, noPoliza: null, vigenciaInicial: null, vigenciaFinal: null, fechaExpedicionPoliza: null, valorAsegurado: null, fechaExaPreocupacional: null, nivel: null, supervisorItm: null, cargoSupervisorItm: null, rubro: null, nombreRubro: null, cdp: null, numeroActa: null, identificacionSupervisor: null }
  constructor(
    private _uploadService: UploadDataService,
    private ref: ChangeDetectorRef,
    private _economicService: EconomicChartService,
    private _auth: AuthService,
    private _snackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ContractorDataRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) {
    if (this.datos.id != null) {
      this.getHiring();
      this.shareData = true;
      if (this.datos.elementId != null && this.datos.elementId != null && this.datos.idContractors.length == 0) {
        this.getElementById(this.datos.elementId);
        this.getComponentById(this.datos.componenteId);
      }
    } else if (this.datos.idContractors.length == 0) {
      Swal.fire(
        'Ei!',
        'Si quires agregar información compartida debes seleccionar regisrtos',
        'question'
      );
      this.matDialogRef.close(true);
    } else if (this.datos.idContractors.length == 0 && this.datos.id == null) {
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
      fechaInicioReal: new FormControl(this.hinringData.fechaRealDeInicio, Validators.required),
      numeroActa: new FormControl(this.hinringData.numeroActa),
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
      fechaFinalizacionConvenio: new FormControl(this.hinringData.fechaFinalizacionConvenio, Validators.required),
      elemento: new FormControl(null, Validators.required),
      componente: new FormControl(null, Validators.required),
      cdp: new FormControl(null),
    });
    this.getAdmins();
  }
  async addDataContractor() {

    if (this.formContractor.value.requierePoliza == 'si') {
      this.formContractor.value.requierePoliza = true;
    } else {
      this.formContractor.value.requierePoliza = false;
    }
    let dataAdmin = this.userAdmins.find(x => x.id == this.formContractor.value.supervisorItm);
    if (this.formContractor.value.cuentabancaria == null) {
      this.formContractor.value.cuentabancaria = '0'
    }
    if (this.formContractor.value.nivel == null) {
      this.formContractor.value.nivel = '0'
    }
    if (this.datos.idContractors.length > 0) {
      for (let index = 0; index < this.datos.idContractors.length; index++) {
        this.hiringDataList.push({
          userId: this._auth.accessId,
          contractorId: this.datos.idContractors[index],
          contractId: this.datos.contractId,
          contrato: 'vacio',
          compromiso: 'vacio',
          fechaRealDeInicio: this.formContractor.value.fechaInicioReal,
          numeroActa: this.formContractor.value.numeroActa,
          fechaDeComite: this.formContractor.value.fechaComite,
          requierePoliza: this.formContractor.value.requierePoliza,
          noPoliza: this.formContractor.value.noPoliza,
          vigenciaInicial: this.formContractor.value.vigenciaInicial,
          vigenciaFinal: this.formContractor.value.vigenciaFinal,
          fechaExpedicionPoliza: this.formContractor.value.fechaExPedicionPoliza,
          valorAsegurado: Number(this.formContractor.value.valorAsegurado),
          fechaExaPreocupacional: this.formContractor.value.fechaExamenPreocupacional,
          nivel: Number(this.formContractor.value.nivel),
          supervisorItm: dataAdmin.userName,
          cargoSupervisorItm: dataAdmin.professionalposition,
          identificacionSupervisor: dataAdmin.identificacionSupervisor,
          fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
          actaComite: 'vacio',
          rubro: this.formContractor.value.rubro,
          nombreRubro: this.formContractor.value.nombreRubro,
          cdp: this.formContractor.value.cdp,
        });
      }
    } else {
      this.hiringDataList = [{
        userId: this._auth.accessId,
        contractorId: this.datos.id,
        contractId: this.datos.contractId,
        contrato: 'vacio',
        compromiso: 'vacio',
        fechaRealDeInicio: this.formContractor.value.fechaInicioReal,
        numeroActa: this.formContractor.value.numeroActa,
        fechaDeComite: this.formContractor.value.fechaComite,
        requierePoliza: this.formContractor.value.requierePoliza,
        noPoliza: this.formContractor.value.noPoliza,
        vigenciaInicial: this.formContractor.value.vigenciaInicial,
        vigenciaFinal: this.formContractor.value.vigenciaFinal,
        fechaExpedicionPoliza: this.formContractor.value.fechaExPedicionPoliza,
        valorAsegurado: Number(this.formContractor.value.valorAsegurado),
        fechaExaPreocupacional: this.formContractor.value.fechaExamenPreocupacional,
        nivel: Number(this.formContractor.value.nivel),
        supervisorItm: dataAdmin.userName,
        cargoSupervisorItm: dataAdmin.Professionalposition,
        identificacionSupervisor: dataAdmin.identificacionSupervisor,
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
      }, (response) => {
        this.formContractor.enable();
        // Set the alert
        this.alert = {
          type: 'error',
          message: 'ERROR EN LA INFORMACION'
        };
        console.log(response);

        Swal.fire('Error', 'Información no Actualizada!', 'error');
        this.showAlert = true;
      });
    this.hiringDataList = [];
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
    let dataAdmin = this.userAdmins.find(x => x.id == this.formContractor.value.supervisorItm || x.userName == this.formContractor.value.supervisorItm);
    const registerContractor: IHiringData[] = [{
      userId: this._auth.accessId,
      contractorId: this.datos.id,
      contractId: this.datos.contractId,
      contrato: 'vacio',
      compromiso: 'vacio',
      fechaRealDeInicio: this.formContractor.value.fechaInicioReal,
      numeroActa: this.formContractor.value.numeroActa,
      fechaDeComite: this.formContractor.value.fechaComite,
      requierePoliza: this.formContractor.value.requierePoliza,
      noPoliza: this.formContractor.value.noPoliza,
      vigenciaInicial: this.formContractor.value.vigenciaInicial,
      vigenciaFinal: this.formContractor.value.vigenciaFinal,
      fechaExpedicionPoliza: this.formContractor.value.fechaExPedicionPoliza,
      valorAsegurado: Number(this.formContractor.value.valorAsegurado),
      fechaExaPreocupacional: this.formContractor.value.fechaExamenPreocupacional,
      nivel: Number(this.formContractor.value.nivel),
      supervisorItm: dataAdmin.userName,
      cargoSupervisorItm: dataAdmin.professionalposition,
      identificacionSupervisor: dataAdmin.identificacionSupervisor,
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
        this.cantDayContract = response.cantidadDias
      });
  }
  getElements = () => {
    if (this.datos.idContractors.length == 0) {
      this.datos.idContractors[0] = this.datos.id
    }
    this._economicService
      .getElementoComponente(this.componentselectId)
      .subscribe((response) => {
        this.elements = response;
      });
    let asignar: AsignmentData = {
      contractId: this.datos.contractId,
      id: this.componentselectId,
      type: 'Componente',
      idContractor: this.datos.idContractors
    }
    this._economicService.asignmentData(asignar).subscribe((response) => {
      if (response) {
        this.openSnackBar('Componente asignado al contartista', "Exitoso")
      }
    })
  }

  asignElement = () => {
    if (this.datos.idContractors.length == 0) {
      this.datos.idContractors[0] = this.datos.id
    }
    let asignar: AsignmentData = {
      contractId: this.datos.contractId,
      id: this.elementselectId,
      type: 'Elemento',
      idContractor: this.datos.idContractors
    }
    let dataElement = this.elements.find(x => x.id === this.elementselectId);
    this.cantDayContract = dataElement.cantidadDias;
    this._economicService.asignmentData(asignar).subscribe((response) => {
      if (response) {
        this.sendEconomicdataContractor();
      }
    })
  }

  sendEconomicdataContractor() {
    let element: IElements = this.elements.find(item => item.id === this.elementselectId);

    for (let index = 0; index < this.datos.idContractors.length; index++) {
      let economicData: EconomicContractor = {
        contractorId: this.datos.idContractors[index],
        contractId: this.datos.contractId,
        userId: this._auth.accessId,
        registerDate: this.registerDate,
        totalValue: element.valorTotalContratista,
        unitValue: element.valorUnidad,
        totalPaidMonth: element.valorUnidad,
        cashPayment: false,
        missing: 0,
        debt: element.valorTotalContratista,
        modifyDate: this.registerDate,
        freed: 0,
      };
      this.economicDataList.push(economicData);
    }
    this._economicService.sendEconomicdataContractor(this.economicDataList).subscribe((response) => {
      if (response) {
        this.openSnackBar('Elemento asignado al contartista', "Exitoso")
      }
    })
    this.economicDataList = [];
  }

  private getHiring() {
    this._economicService
      .getHiringDataById(this.datos.id,this.datos.contractId)
      .subscribe((response: IHiringData) => {
        if (response != null) {
          this.update = true;
          this.hinringData = response;
          this.supervisor = response.supervisorItm;
          this.nivel = response.nivel;
        }
      });
  }

  requiere(event) {
    if (event.value === 'Si') {
      this.showDataPoliza = true;
    } else {
      this.showDataPoliza = false;
    }
  }

  private getAdmins() {
    this._auth
      .getAdmin()
      .subscribe((response) => {
        this.userAdmins = response;
      });
  }

  dateChange(event) {
    this.minDate = event.value;
    var date2: any = new Date(this.minDate);
    let day = this.cantDayContract * 24;
    var numberOfMlSeconds = date2.getTime();
    console.log(date2);
    var addMlSeconds = (1000 * 60 * 60 * day);
    this.maxdate = new Date(numberOfMlSeconds + addMlSeconds);
    console.log(this.maxdate);
    this.ref.markForCheck();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
