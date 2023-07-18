import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { PlaningService } from 'app/modules/admin/pages/planing/service/planing.service';
import { eachMonthOfInterval, getDaysInMonth } from 'date-fns';
import { AcademicInformation, ContractorPersonalInformation, EmptityHealth, PersonalInformation } from '../../models/contractor-personal-data.model';
import { IHiringData } from 'app/modules/admin/dashboards/contractual/models/hiring-data';
import { HomeContractorService } from '../../services/home-contractor.service';
import { FuseAlertType } from '@fuse/components/alert';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { Bank } from '../../models/mater.model';

@Component({
  selector: 'app-contractor-personal-data',
  templateUrl: './contractor-personal-data.component.html',
  styleUrls: ['./contractor-personal-data.component.scss'],
  
})
export class ContractorPersonalDataComponent implements OnInit,OnDestroy {

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
  departments: any = GlobalConst.departments;
  municipio: any;
  eps: any[] = [
    'COOSALUD',
    'NUEVA EPS',
    'ALIANSALUD',
    'SALUD TOTAL',
    'EPS SANITAS',
    'EPS SURA',
    'SALUD MIA',
    'CAPITAL SALUD',
    'SAVIA SALUD',
    'SAVIA SALUD',
  ];
  arl: any[] = GlobalConst.arl;
  afp: any[] = GlobalConst.afp;
  banks: Bank[];
  accountType: any = GlobalConst.accountType;
  step = 0;
  contractorPersonalInformation: ContractorPersonalInformation;
  contractorinformationStepperForm: FormGroup;
  nacionalities: any = GlobalConst.nacionality
  labelPosition: string;
  numberOfTicks = 0;
  academicInformationList: AcademicInformation[] = [];
  emptityHealth: EmptityHealth[] = [];

  academicInformation: AcademicInformation = {
    collegeDegree: '',
    academicInformationtype: '',
    institution: '',
    contractor: ''
  };
  genero: string;
  private readonly _unsubscribe$ = new Subject<void>();
  filteredOptionsEps: Observable<string[]>;
  filteredOptionsAfp: Observable<string[]>;
  filteredOptionsArl: Observable<string[]>;
  filteredOptionsAccountType: Observable<string[]>;
  filteredOptionsBanks: Observable<Bank[]>;
  generos: string[] = [
    'Masculino',
    'Femenino',
    'Otro'
  ]
  minBirth: Date;
  constructor(
    private _homeService: HomeContractorService,
    private ref: ChangeDetectorRef,
    private _planingService: PlaningService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<ContractorPersonalDataComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.getBanks();
    if (this.datos.id != null) {
      this.getHiring();

    }
    this.validarFechaNacimiento();
    setInterval(() => {
      this.numberOfTicks++;
      this.ref.detectChanges();
      this.ref.markForCheck();
    }, 1000);
    // Horizontal stepper form
    this.contractorinformationStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        identification: ['', Validators.required],
        birthDate: [null, Validators.required],
        expeditionPlace: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        movilPhoneNumber: ['', Validators.required],
        Municipality: ['', Validators.required],
        nacionality: ['', Validators.required],
        departamento: ['', Validators.required],
        address: ['', Validators.required],
        neiberhood: ['', Validators.required],

      }),
      step2: this._formBuilder.group({
        technical: [''],
        technologist: [''],
        technologistInstitution: [''],
        technicalInstitution: [''],
        undergraduate: [''],
        undergraduateInstitution: [''],
        specialization: [''],
        specializationInstitution: [''],
        master: [''],
        masterInstitution: [''],
        doctorate: [''],
        doctorateInstitution: [''],
      }),
      step3: this._formBuilder.group({
        bank: ['', Validators.required],
        accountType: ['', Validators.required],
        accountNumber: ['', Validators.required],
      }),
      step4: this._formBuilder.group({
        eps: ['', Validators.required],
        arl: ['', Validators.required],
        afp: ['', Validators.required],
        // password: ['', Validators.required],
        // agreements: ['', Validators.requiredTrue]
      })
    });
    this.validateDate();

    this.filteredOptionsEps = this.contractorinformationStepperForm.get('step4.eps').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEps(value || ''))
    );
    this.filteredOptionsAfp = this.contractorinformationStepperForm.get('step4.afp').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAfp(value || ''))
    );
    this.filteredOptionsArl = this.contractorinformationStepperForm.get('step4.arl').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterArl(value || ''))
    );

    this.filteredOptionsAccountType = this.contractorinformationStepperForm.get('step3.accountType').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccountType(value || ''))
    );
  }


  saveContractorDataInformation() {
    this.academicInformationList = [];
    for (let index = 0; index < 5; index++) {
      this.academicInformation = {
        collegeDegree: '',
        academicInformationtype: '',
        institution: '',
        contractor: ''
      }
      switch (index) {
        case 0:
          if (this.contractorinformationStepperForm.controls['step2'].value.technical != null && this.contractorinformationStepperForm.controls['step2'].value.technical != '') {
            this.academicInformation.academicInformationtype = 'Tecnico',
              this.academicInformation.institution = this.contractorinformationStepperForm.controls['step2'].value.technicalInstitution,
              this.academicInformation.collegeDegree = this.contractorinformationStepperForm.controls['step2'].value.technical

          }
          break;
        case 1:
          if (this.contractorinformationStepperForm.controls['step2'].value.technologist != null && this.contractorinformationStepperForm.controls['step2'].value.technologist != '') {
            this.academicInformation.academicInformationtype = 'Tecnologo',
              this.academicInformation.institution = this.contractorinformationStepperForm.controls['step2'].value.technologistInstitution,
              this.academicInformation.collegeDegree = this.contractorinformationStepperForm.controls['step2'].value.technologist

          }
          break;
        case 2:
          if (this.contractorinformationStepperForm.controls['step2'].value.undergraduate != null && this.contractorinformationStepperForm.controls['step2'].value.undergraduate != '') {
            this.academicInformation.academicInformationtype = 'Pregrado',
              this.academicInformation.institution = this.contractorinformationStepperForm.controls['step2'].value.undergraduateInstitution,
              this.academicInformation.collegeDegree = this.contractorinformationStepperForm.controls['step2'].value.undergraduate
          }
          break;
        case 3:
          if (this.contractorinformationStepperForm.controls['step2'].value.specialization != null && this.contractorinformationStepperForm.controls['step2'].value.specialization != '') {
            this.academicInformation.academicInformationtype = 'Especialización'
            this.academicInformation.institution = this.contractorinformationStepperForm.controls['step2'].value.specializationInstitution
            this.academicInformation.collegeDegree = this.contractorinformationStepperForm.controls['step2'].value.specialization;
            this.academicInformation.contractor = this._auth.accessId;
          }
          break;
        case 4:
          if (this.contractorinformationStepperForm.controls['step2'].value.master != null && this.contractorinformationStepperForm.controls['step2'].value.master != '') {
            this.academicInformation.academicInformationtype = 'Maestria';
            this.academicInformation.institution = this.contractorinformationStepperForm.controls['step2'].value.masterInstitution;
            this.academicInformation.collegeDegree = this.contractorinformationStepperForm.controls['step2'].value.master
            this.academicInformation.contractor = this._auth.accessId
          }
          break;
        case 5:
          if (this.contractorinformationStepperForm.controls['step2'].value.doctorate != null && this.contractorinformationStepperForm.controls['step2'].value.doctorate != '') {
            this.academicInformation.academicInformationtype = 'Doctorado';
            this.academicInformation.institution = this.contractorinformationStepperForm.controls['step2'].value.doctorateInstitution;
            this.academicInformation.collegeDegree = this.contractorinformationStepperForm.controls['step2'].value.doctorate;
            this.academicInformation.contractor = this._auth.accessId;
          }
          break;
      }
      if (this.academicInformation.institution != '' && this.academicInformation.collegeDegree != '') {
        let technologist = this.academicInformationList.findIndex(f => f.academicInformationtype === this.academicInformation.academicInformationtype);
        if (technologist < 0) {
          this.academicInformation.contractor = this._auth.accessId;
          this.academicInformationList.push(this.academicInformation)
        }

      }

    }

    let bank = this.banks.find(x => x.bankName == this.contractorinformationStepperForm.controls['step3'].value.bank).id;
    let departamento = this.departments.find(x => x.id == this.contractorinformationStepperForm.controls['step1'].value.departamento).departamento;

    const personalInfoirmation: ContractorPersonalInformation = {
      id: this._auth.accessId,
      fechaNacimiento: this.contractorinformationStepperForm.controls['step1'].value.birthDate,
      telefono: this.contractorinformationStepperForm.controls['step1'].value.phoneNumber,
      celular: this.contractorinformationStepperForm.controls['step1'].value.movilPhoneNumber.toString(),
      identificacion: this.contractorinformationStepperForm.controls['step1'].value.identification,
      direccion: this.contractorinformationStepperForm.controls['step1'].value.address,
      lugarExpedicion: this.contractorinformationStepperForm.controls['step1'].value.expeditionPlace,
      genero: this.genero,
      nacionalidad: this.contractorinformationStepperForm.controls['step1'].value.nacionality,
      departamento: departamento,
      municipio: this.contractorinformationStepperForm.controls['step1'].value.Municipality,
      barrio: this.contractorinformationStepperForm.controls['step1'].value.neiberhood,
      cuentaBancaria: this.contractorinformationStepperForm.controls['step3'].value.accountNumber.toString(),
      tipoCuenta: this.contractorinformationStepperForm.controls['step3'].value.accountType,
      entidadCuentaBancaria: bank,
      fechaActualizacion: new Date(),
    };
    let saludEps: EmptityHealth = {
      contractor: this._auth.accessId,
      emptitytype: 'EPS',
      emptity: this.contractorinformationStepperForm.controls['step4'].value.eps
    }
    this.emptityHealth.push(saludEps)
    let saludArl: EmptityHealth = {
      contractor: this._auth.accessId,
      emptitytype: 'ARL',
      emptity: this.contractorinformationStepperForm.controls['step4'].value.arl
    }
    this.emptityHealth.push(saludArl)
    let saludAfp: EmptityHealth = {
      contractor: this._auth.accessId,
      emptitytype: 'AFP',
      emptity: this.contractorinformationStepperForm.controls['step4'].value.afp
    }
    this.emptityHealth.push(saludAfp)
    const registerpersonalInfoirmation: PersonalInformation = {
      contractorPersonalInformation: personalInfoirmation,
      academicInformation: this.academicInformationList,
      emptityHealth: this.emptityHealth
    };
    this._homeService
      .saveContractorPersonalInformation(registerpersonalInfoirmation)
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

          console.log(response);

          Swal.fire('Error', 'Información no Guardada!', 'error');
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

  getMunicipios(e: any) {
    this.municipio = this.departments.find(f => f.id === e.value).ciudades;
  }

  private getBanks() {
    this._homeService
      .getBanks()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response: Bank[]) => {
        if (response != null) {
          this.banks = response;
          this.filteredOptionsBanks = this.contractorinformationStepperForm.get('step3.bank').valueChanges.pipe(
            startWith(''),
            map((value) => this._filterBanks(value || ''))
          );

        }
      });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  private _filterEps(value: any): string[] {
    return this.eps.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  private _filterAfp(value: any): string[] {
    return this.afp.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  private _filterArl(value: any): string[] {
    return this.arl.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  private _filterBanks(value: any): Bank[] {
    return this.banks.filter((option: Bank) =>
      option.bankName.toLowerCase().includes(value.toLowerCase())
    );
  }

  private _filterAccountType(value: any): string[] {
    return this.accountType.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }
  validarFechaNacimiento() {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.minBirth = eighteenYearsAgo;
  }
  onChange(event: any) {
    this.genero = event.value
  }
  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }

}
