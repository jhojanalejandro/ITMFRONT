import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import Swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { IHiringData } from '../../../models/hiring-data';
import { UploadDataService } from '../../../service/upload-data.service';
import { EconomicContractor } from '../../../../nomina/models/economic-data-contractor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AsignmentData } from '../../../models/contractor';
import { DetalleContrato, Elements } from 'app/modules/admin/pages/planing/models/planing-model';
import { PlaningService } from 'app/modules/admin/pages/planing/service/planing.service';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { eachMonthOfInterval, getDaysInMonth } from 'date-fns';

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
  userList: any;
  componentselectId: any;
  elementselectId: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  nivel: string = 'Nivel ARL';
  supervisor: string = 'Supervisor';
  showAlert: boolean = false;
  requierePoliza: any = GlobalConst.requierePoliza
  niveles: any = GlobalConst.Nivel;
  valorContrato: any;
  showToal: boolean = false;
  formContractor: FormGroup;
  hinringData: IHiringData = { contractId: this.datos.contractId, contractorId: null, fechaFinalizacionConvenio: null, contrato: null, compromiso: null, fechaRealDeInicio: null, actaComite: null, fechaDeComite: null, requierePoliza: null, noPoliza: null, vigenciaInicial: null, vigenciaFinal: null, fechaExpedicionPoliza: null, valorAsegurado: null, fechaExaPreocupacional: null, nivel: null, supervisorItm: null, cargoSupervisorItm: null, cdp: null, numeroActa: null, identificacionSupervisor: null, caso: null }
  private readonly _unsubscribe$ = new Subject<void>();
  detalleContrat: DetalleContrato = {
    idcontrato: null,
    fechaContrato: null,
    fechaFinalizacion: null,
    tipoContrato: null,
  };
  constructor(
    private _uploadService: UploadDataService,
    private _genericService: GenericService,
    private ref: ChangeDetectorRef,
    private _planingService: PlaningService,
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
        this.getComponentById(this.datos.componentId);
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
      caso: new FormControl(null),
    });
    this.getAdmins();
    this.getDetailProject();
  }
  async addDataHiring() {
    let response = this.sendEconomicdataContractor();
    if(response){
      if (this.formContractor.value.requierePoliza == 'si') {
        this.formContractor.value.requierePoliza = true;
      } else {
        this.formContractor.value.requierePoliza = false;
      }
      let dataAdmin = this.userList.find(x => x.id === this.formContractor.value.supervisorItm);
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
            identificacionSupervisor: dataAdmin.identification,
            fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
            actaComite: 'vacio',
            cdp: this.formContractor.value.cdp,
            caso: this.formContractor.value.caso
  
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
          cdp: this.formContractor.value.cdp,
          caso: this.formContractor.value.caso
        }];
      }
      this._uploadService
        .addHiringContractor(this.hiringDataList)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((res) => {
          if (res) {
  
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '',
              html: 'Información Registrada Exitosamente!',
              showConfirmButton: false,
              timer: 1500
            });
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
  
          Swal.fire('Error', 'Información no Registrada!', 'error');
          this.showAlert = true;
        });
    }else{
      Swal.fire('Error', 'Información Economica Presento un error!', 'error');

    }

    this.hiringDataList = [];
  }

  async updateContractor() {
    let response = this.sendEconomicdataContractor();
    if(response){
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
      let dataAdmin = this.userList.find(x => x.id == this.formContractor.value.supervisorItm || x.userName == this.formContractor.value.supervisorItm);
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
        identificacionSupervisor: dataAdmin.identification,
        fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
        actaComite: 'vacio',
        cdp: this.formContractor.value.cdp,
        caso: this.formContractor.value.caso
  
      }];
      this._uploadService
        .addHiringContractor(registerContractor)
        .pipe(takeUntil(this._unsubscribe$))
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
    }else{
      Swal.fire('Error', 'Información Economica Presento un error!', 'error');
    }
    
  }

  cerrar(): void {
    this.matDialogRef.close();
  }

  private getComponent() {
    this._planingService
      .getComponent(this.datos.contractId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        this.componentes = response;
      });
  }

  private getComponentById(id: any) {
    this._planingService
      .getComponentById(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        this.componente = response.nombreComponente;
      });
  }

  private getElementById(id: any) {
    this._planingService
      .getElementoById(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        this.elemento = response.nombreElemento
        this.cantDayContract = response.cantidadDias
      });
  }
  getElements = () => {
    if (this.datos.idContractors.length == 0) {
      this.datos.idContractors[0] = this.datos.id
    }
    this._planingService
      .getElementoComponente(this.componentselectId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        this.elements = response;
      });
    let asignar: AsignmentData = {
      contractId: this.datos.contractId,
      id: this.componentselectId,
      type: 'Componente',
      idContractor: this.datos.idContractors
    }
    this._planingService.asignmentData(asignar).subscribe((response) => {
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
    this._planingService.asignmentData(asignar)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(resp => {
        if(resp && this.formContractor.value.fechaFinalizacionConvenio != null){
          this.calculateContratcValue();
        }
      });
  }

  sendEconomicdataContractor() {
    if(this.elementselectId != null){
      let element: Elements = this.elements.find(item => item.id === this.elementselectId);

      for (let index = 0; index < this.datos.idContractors.length; index++) {
        let economicData: EconomicContractor = {
          contractorId: this.datos.idContractors[index],
          contractId: this.datos.contractId,
          userId: this._auth.accessId,
          registerDate: this.registerDate,
          totalValue: this.valorContrato,
          unitValue: element.valorUnidad,
          totalPaidMonth: element.valorUnidad,
          cashPayment: false,
          missing: 0,
          debt: this.valorContrato,
          modifyDate: this.registerDate,
          freed: 0,
        };
        this.economicDataList.push(economicData);
      }
      this._planingService.sendEconomicdataContractor(this.economicDataList)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((response) => {
          if (response) {
            this.openSnackBar('Elemento asignado al contartista', "Exitoso")
            return true;
          }else{
            return false;
          }
        })
      this.economicDataList = [];
    }
    return false;
  }

  private getHiring() {
    this._planingService
      .getHiringDataById(this.datos.id, this.datos.contractId)
      .pipe(takeUntil(this._unsubscribe$))
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
    this._auth.getAdmins()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((teams: any) => {
        this.userList = teams;
      });
  }

  dateChange(event) {
    this.minDate = event.value;
    var date2: any = new Date(this.minDate);
    let day = this.cantDayContract * 24;
    var numberOfMlSeconds = date2.getTime();
    var addMlSeconds = (1000 * 60 * 60 * day);
    this.maxdate = new Date(numberOfMlSeconds + addMlSeconds);
    this.ref.markForCheck();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  dateChangeFinal(event) {
    this.ref.markForCheck();
    this.calculateContratcValue();
  }

  private getDetailProject() {
    this._genericService.getDetalleContratoById(this.datos.contractId, true)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        if (response) {
          debugger
          this.detalleContrat = response;
        }
      })
  }
  calculateDaysBetweenDates(startDate: Date, endDate: Date): number {
    let dateInitial = new Date(startDate);
    let dateFinal = new Date(endDate);
    let restarDias = this.obtenerMesesCon31Dias(dateInitial, dateFinal);
    debugger
    const oneDay = 24 * 60 * 60 * 1000; // Cantidad de milisegundos en un día
    const startTime = dateInitial.getTime();
    const endTime = dateFinal.getTime();
    const diffDays = Math.round(Math.abs((endTime - startTime) / oneDay));
    return diffDays - restarDias;
  }

  obtenerMesesCon31Dias(fechaInicio: Date, fechaFin: Date): number {
    let dias = 0;
  
    const mesesEnIntervalo = eachMonthOfInterval({ start: fechaInicio, end: fechaFin });
  
    for (const mes of mesesEnIntervalo) {
      const diasEnMes = getDaysInMonth(mes);
  
      if (diasEnMes === 31) {
        dias++;
      }
    }
  
    return dias;
  }

  calculateContratcValue(){
    let element: Elements = this.elements.find(item => item.id === this.elementselectId);
    let cantidadDias = this.calculateDaysBetweenDates( this.minDate, this.formContractor.value.fechaFinalizacionConvenio);
    this.valorContrato = element.valorPorDiaContratista * cantidadDias;
    this.valorContrato = (+this.valorContrato.toFixed(0)).toLocaleString();
    this.showToal = true;
    debugger
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
