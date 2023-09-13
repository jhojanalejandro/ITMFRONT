import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import Swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { ContractorPayments } from 'app/modules/admin/dashboards/nomina/models/contractor-payments';
import { NominaService } from 'app/modules/admin/dashboards/nomina/service/nomina.service';
import { EconomicContractor } from 'app/modules/admin/dashboards/nomina/models/economic-data-contractor';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { PorcentageEnumCode } from 'app/layout/common/enums/porcentage-enum/porcentage-enum';
import { PorcentageModel } from '../../models/porcentage.model';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { HomeContractorService } from '../../services/home-contractor.service';


@Component({
  selector: 'app-contractor-payment-security',
  templateUrl: './contractor-payment-security-register.component.html',
  styleUrls: ['./contractor-payment-security-register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ContractorPaymentSecurityRegisterComponent implements OnInit, OnDestroy {
  paymentDataList: any;
  economicDataList: EconomicContractor[] = [];
  formFieldHelpers: string[] = [''];
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  showAlert: boolean = false;
  registerDate = new Date();
  formContractorPaymentSecurity: FormGroup;
  contractId: string;
  porcentageList: PorcentageModel[] = [];
  contractorPayment: ContractorPayments;
  health: string;
  pension: string;
  arl: string;
  base64Output: any;
  file: any = null; // Variable to store file
  selectedFiles: File[] = [];
  filesWithCheckbox: any[] = [];
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(private _nominaService: NominaService,
    private _genericService: GenericService,
    private _homeContractorService: HomeContractorService,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<ContractorPaymentSecurityRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.contractId = this.datos.contractId

    this.getPorcentageSecurity();
    this.getEconomicDataContractor();
    this.getHealtyContractor();
    this.formContractorPaymentSecurity = this._formBuilder.group({
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
      paymentHealth: new FormControl(null, Validators.required),
      paymentArl: new FormControl(null, Validators.required),
      PaymentPension: new FormControl(null, Validators.required),
      pension: new FormControl({ value: this.pension, disabled: true }, Validators.required),
      arl: new FormControl({ value: this.arl, disabled: true }, Validators.required),
      health: new FormControl({ value: this.health, disabled: true }, Validators.required),
      observation: new FormControl(null, Validators.required),
      file: new FormControl(null, Validators.required),

    });
    this.subscribeToValueChanges('paymentHealth');
    this.subscribeToValueChanges('paymentArl');
    this.subscribeToValueChanges('PaymentPension');
  }

  async addPayment() {
    this.paymentDataList = {
      contractorId: this.datos.id,
      contractId: this.datos.contractId,
      monthPayment: this.formContractorPaymentSecurity.value.paymentHealth,
      paymentcant: this.formContractorPaymentSecurity.value.paymentArl,
      cashPayment: this.formContractorPaymentSecurity.value.PaymentPension,
      descriptionPayment: this.formContractorPaymentSecurity.value.description,
      registerDate: new Date(),
    }
    this._nominaService
      .addContractorPayments(this.paymentDataList)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {

      });
  }

  cerrar(): void {
    this.matDialogRef.close();
  }

  private getEconomicDataContractor() {

    this._nominaService.getContractorPayment(this._auth.accessId, this.contractId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((Response) => {
        this.contractorPayment = Response;
      });
  }
  private getPorcentageSecurity() {
    this._genericService.GetPorcentageSecurity()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((Response) => {
        this.porcentageList = Response;
      });
  }

  private getHealtyContractor() {
    this._homeContractorService.getEmptityHealth(this._auth.accessId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((Response) => {
        this.pension = Response.data.data.find(f => f.emptityType == PorcentageEnumCode.PENSION).emptity
        this.arl = Response.data.data.find(f => f.emptityType == PorcentageEnumCode.ARL).emptity
        this.health = Response.data.data.find(f => f.emptityType == PorcentageEnumCode.SALUD).emptity
      });
  }

  calculateSecurity() {
    debugger
    let porcentage = this.porcentageList.find(f => f.code == PorcentageEnumCode.SALUD).percentageValue;
    const porcentajeCalculado = (this.contractorPayment.paymentcant * porcentage) / 100;
    if (this.formContractorPaymentSecurity.value.paymentHealth != null || this.formContractorPaymentSecurity.value.paymentHealth != '') {
      if (Number(this.formContractorPaymentSecurity.value.paymentHealth) < porcentajeCalculado) {
        Swal.fire('', 'El valor pagado de SALUD no es correcto, es posible que la planilla sea devuelta', 'warning');

      }
    }
  }

  calculateArl() {
    let porcentage = this.porcentageList.find(f => f.code == PorcentageEnumCode.ARL).percentageValue;
    const porcentajeCalculado = (this.contractorPayment.paymentcant * porcentage) / 100;
    if (this.formContractorPaymentSecurity.value.paymentArl != null || this.formContractorPaymentSecurity.value.paymentArl != '') {
      if (Number(this.formContractorPaymentSecurity.value.paymentArl) < porcentajeCalculado) {
        Swal.fire('', 'El valor pagado de ARL no es correcto, es posible que la planilla sea devuelta', 'warning');

      }
    }
  }

  calculatePension() {
    let porcentage = this.porcentageList.find(f => f.code == PorcentageEnumCode.ARL).percentageValue;
    const porcentajeCalculado = (this.contractorPayment.paymentcant * porcentage) / 100;
    if (this.formContractorPaymentSecurity.value.PaymentPension != null || this.formContractorPaymentSecurity.value.PaymentPension != '') {
      if (Number(this.formContractorPaymentSecurity.value.PaymentPension) < porcentajeCalculado) {
        Swal.fire('', 'El valor pagado de PENSION no es correcto, es posible que la planilla sea devuelta', 'warning');
      }
    }
  }

  addCommasToNumber(value: number): string {
    return value.toLocaleString('es');
  }
  subscribeToValueChanges(controlName: string): void {
    this.formContractorPaymentSecurity.get(controlName).valueChanges.subscribe(value => {
      this.formatNumberWithCommas(controlName, value);
    });
  }


  formatNumberWithCommas(controlName: string, value: number): void {
    const control = this.formContractorPaymentSecurity.get(controlName);
    const previousValue = control.value;

    // Remover puntos del valor anterior para evitar puntos duplicados
    const numericValue = Number(value.toString().replace(/\./g, ''));
    const formattedValue = this.addCommasToNumber(numericValue);

    // Si el valor formateado es diferente al valor en el control, actualizar el control
    if (formattedValue !== previousValue) {
      control.patchValue(formattedValue, { emitEvent: false });
    }
  }

  onChangeGetFile(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    this.convertFile(this.file).subscribe((base64) => {
      this.base64Output = base64;
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
    this.filesWithCheckbox = this.selectedFiles;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}

