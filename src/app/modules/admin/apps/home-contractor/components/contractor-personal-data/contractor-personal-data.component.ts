import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { PlaningService } from 'app/modules/admin/pages/planing/service/planing.service';
import { eachMonthOfInterval, getDaysInMonth } from 'date-fns';
import { ContractorPersonalInformation } from '../../models/contractor-personal-data.model';
import { IHiringData } from 'app/modules/admin/dashboards/contractual/models/hiring-data';
import { HomeContractorService } from '../../services/home-contractor.service';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
  selector: 'app-contractor-personal-data',
  templateUrl: './contractor-personal-data.component.html',
  styleUrls: ['./contractor-personal-data.component.scss'],
})
export class ContractorPersonalDataComponent implements OnInit {
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  showAlert: boolean = false;
  registerDate: Date = new Date();
  minDate: Date;
  maxdate: Date;
  update: boolean = false;
  twoYearAgoExam: Date;
  title: string = 'Guardar';
  formContractor: FormGroup;
  departments: any;
  municipio: any;
  contractorPersonalInformation: ContractorPersonalInformation;
  contractorinformationStepperForm: FormGroup;

  private readonly _unsubscribe$ = new Subject<void>();
  constructor(
    private _homeService: HomeContractorService,
    private ref: ChangeDetectorRef,
    private _planingService: PlaningService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<ContractorPersonalDataComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) {
    // if (this.datos.id != null) {
    //   this.getHiring();
    // } else if (this.datos.idContractors.length == 0) {
    //   Swal.fire(
    //     'Ei!',
    //     'Si quires agregar información compartida debes seleccionar regisrtos',
    //     'question'
    //   );
    //   this.matDialogRef.close(true);
    // } else if (this.datos.idContractors.length == 0 && this.datos.id == null) {
    //   Swal.fire(
    //     'Ei!',
    //     'Hay un error al ingresar, intenta de nuevo',
    //     'warning'
    //   );
    // }

  }

  ngOnInit(): void {
    if (this.datos.id != null) {
      this.getHiring();
    }

        // Horizontal stepper form
        this.contractorinformationStepperForm = this._formBuilder.group({
          step1: this._formBuilder.group({
              email: ['', [Validators.required, Validators.email]],
              country: ['', Validators.required],
              Municipality: ['', Validators.required],
              departamento: ['', Validators.required],
          }),
          step2: this._formBuilder.group({
              userName: ['', Validators.required],
              lastName: ['', Validators.required],
              phoneNumber: ['', Validators.required],
              cedula: ['', Validators.required],
          }),
          step3: this._formBuilder.group({
              password: ['', Validators.required],
              agreements: ['', Validators.requiredTrue]
          })
      });
    this.validateDate();
  }


  saveContractorDataInformation() {
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
    // let dataAdmin = this.supervisorList.find(x => x.id == this.formContractor.value.supervisorItm || x.userName == this.formContractor.value.supervisorItm);
    const registerContractor: any = {
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
      fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
      actaComite: 'vacio',
      cdp: this.formContractor.value.cdp,
      caso: this.formContractor.value.caso
    };
    this._homeService
      .saveContractorPersonalInformation(registerContractor)
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

  }

  cerrar(): void {
    this.matDialogRef.close();
  }


  private getHiring() {
    this._planingService
      .getHiringDataById(this.datos.id, this.datos.contractId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response: IHiringData) => {
        if (response.id != null) {
          this.title = 'Actualizar'
          this.update = true;
          // this.hiringData = response;
        }
      });
  }

  requiere(event) {
    // if (event.value === 'Si') {
    //   this.showDataPoliza = true;
    // } else {
    //   this.showDataPoliza = false;
    // }
  }

  dateChange(event) {
    // this.minDate = event.value;
    // var date2: any = new Date(this.minDate);
    // let day = this.cantDayContract * 24;
    // var numberOfMlSeconds = date2.getTime();
    // var addMlSeconds = (1000 * 60 * 60 * day);
    // this.maxdate = new Date(numberOfMlSeconds + addMlSeconds);
    // this.ref.markForCheck();
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

  private validateDate() {
    const currentDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(currentDate.getFullYear() - 2); // Resta dos años al año actual

    this.twoYearAgoExam = minDate; // Comprueba si la fecha es anterior a la mínima permitida
  }

  getDepartamento() {
    this._homeService.getDepartments().subscribe((Response) => {
      this.departments = Response;
    })
  }

  getMunicipios(e: any) {
    this.municipio = this.departments.find(f => f.id === e.value).ciudades;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
