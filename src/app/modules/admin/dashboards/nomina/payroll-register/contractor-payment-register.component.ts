import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { NominaService } from '../nomina.service';
import { IContractorPayments } from 'app/layout/common/models/contractor-payments';
import { EconomicContractor } from '../../contractual/contractor-list/models/economic-data-contractor';
import { Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-contractor-payment',
  templateUrl: './contractor-payment-register.component.html',
  styleUrls: ['./contractor-payment-register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ContractorPaymentRegisterComponent implements OnInit {
  indeterminate = true;
  paymentContractor: EconomicContractor = { contractorId : 0, totalValue: 0, unitValue: 0, totalPaidMonth: 0, debt: 0, modifyDate: new Date()};
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
  formContractorPayment: FormGroup;
  pagos: any = GlobalConst.nomina;

  constructor(private _nominaService: NominaService,
    private ref: ChangeDetectorRef,
    private _auth: AuthService,
    private _router: Router,
    public matDialogRef: MatDialogRef<ContractorPaymentRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getEconomicContractorPayment();
    this.formContractorPayment = this._formBuilder.group({
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
      paymentcant: new FormControl(null, Validators.required),
      cashPaymentTotal: new FormControl(null, Validators.required),
      cashPayment: new FormControl(null, Validators.required),
      totalDebt: new FormControl(null, Validators.required),
      registerDate: new FormControl(null, Validators.required),
      contractorName: new FormControl({ value: this.datos.data.nombre, disabled: true }, Validators.required),
      description: new FormControl(null, Validators.required),
    });
  }

  async addContractor() {
    if(this.formContractorPayment.value.cashPayment ==='pago efectivo'){
      this.formContractorPayment.value.cashPayment = true
    }else{
      this.formContractorPayment.value.cashPayment = false
    }
    const registerPayment: IContractorPayments = {
      userId: this._auth.accessId,
      contractorId: this.datos.data.id,
      monthPayment: this.formContractorPayment.value.cashPaymentTotal,
      paymentcant: this.formContractorPayment.value.cashPaymentTotal,
      cashPayment: this.formContractorPayment.value.cashPayment,
      registerDate: this.formContractorPayment.value.from,
      modifyDate: this.formContractorPayment.value.to,
      descriptionPayment: this.formContractorPayment.value.description
    };
    debugger
    this._nominaService
      .addContractorPayments(registerPayment)
      .subscribe((res) => {
        if (res) {
          swal.fire('Pago Registrado Exitosamente!', '', 'success');
          this.updateEconomicContractorPayment();
          this.ref.detectChanges();
          this.ref.markForCheck();
        }

      },
        (response) => {
          this.formContractorPayment.enable();
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

  getContractorPayment() {
    this._nominaService.getByIdContractorPayments(this.datos.data.id).subscribe((Response) => {
      this._nominaService = Response;
    });
  }

  getEconomicContractorPayment() {
    this._nominaService.getByIdEconomicDataContractor(this.datos.data.id).subscribe((Response: EconomicContractor) => {
      if(Response == null){
        swal.fire('Error', 'No se puede ingresar a esta vista debido a que los valores estan en cero', 'error');
        this.matDialogRef.close();
      }else{
        return this.paymentContractor = Response;
      }
    });
  }

  updateEconomicContractorPayment() {
    let economicData: EconomicContractor = {
      contractorId: this.datos.data.id,
      debt: this.formContractorPayment.value.totalDebt - this.formContractorPayment.value.cashPayment,
      freed: 0,
      modifyDate: this.registerDate,
    }
    this._nominaService.UpdateEconomicContractorPayment(economicData).subscribe((Response: any) => {
      if (Response) {
        swal.fire('Exitoso', 'Pago Actualizado Exitosamente!', 'success');
      }
    });
  }
}

