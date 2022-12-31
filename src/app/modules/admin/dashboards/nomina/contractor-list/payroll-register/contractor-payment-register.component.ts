import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import Swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { NominaService } from '../../nomina.service';
import { ContractorPayments } from 'app/modules/admin/dashboards/nomina/models/contractor-payments';
import { EconomicContractor } from '../../../contractual/contractor-list/models/economic-data-contractor';
import { find } from 'lodash';



@Component({
  selector: 'app-contractor-payment',
  templateUrl: './contractor-payment-register.component.html',
  styleUrls: ['./contractor-payment-register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ContractorPaymentRegisterComponent implements OnInit {
  indeterminate = true;
  cantidadContratistas: number;
  paymentDataList: ContractorPayments[] = [];
  economicDataList: EconomicContractor[] = [];

  paymentContractor: EconomicContractor[] = [{ contractorId: 0, totalValue: 0, unitValue: 0, totalPaidMonth: 0, debt: 0, modifyDate: new Date() }];
  formFieldHelpers: string[] = [''];
  shareData: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'warn',
    message: ''
  };
  showAlert: boolean = false;
  registerDate = new Date();
  formContractorPayment: FormGroup;
  pagos: any = GlobalConst.nomina;

  constructor(private _nominaService: NominaService,
    private ref: ChangeDetectorRef,
    private _auth: AuthService,
    public matDialogRef: MatDialogRef<ContractorPaymentRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
  ) {
    if (this.datos.id != null && this.datos.id > 0 && this.datos.idContractors.length == 0) {
      this.shareData = true;
      this.getEconomicContractorPayment(this.datos.id);
    } else if (this.datos.idContractors.length == 0) {
      Swal.fire(
        'Ei!',
        'Si quires agregar información compartida debes seleccionar regisrtos',
        'question'
      );
      this.matDialogRef.close(true);
    } else if (this.datos.idContractors.length == 0 && this.datos.id == 0) {
      Swal.fire(
        'Ei!',
        'Hay un error al ingresar, intenta de nuevo',
        'warning'
      );
      this.matDialogRef.close(true);
    } else {
      this.cantidadContratistas = this.datos.idContractors.length;
      this.getEconomicContractorPayment(this.datos.idContractors);

    }
  }

  ngOnInit(): void {
    this.formContractorPayment = this._formBuilder.group({
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
      paymentcant: new FormControl(null, Validators.required),
      cashPaymentTotal: new FormControl(null, Validators.required),
      cashPayment: new FormControl(null, Validators.required),
      totalDebt: new FormControl(null, Validators.required),
      registerDate: new FormControl(null, Validators.required),
      contractorName: new FormControl({ value: this.datos.nombre, disabled: true }, Validators.required),
      description: new FormControl(null, Validators.required),
      cantidadContratistas: new FormControl({ value: null, disabled: true }, Validators.required),

    });
  }

  async addPayment() {
    if (this.formContractorPayment.value.cashPayment === 'pago efectivo') {
      this.formContractorPayment.value.cashPayment = true
    } else {
      this.formContractorPayment.value.cashPayment = false
    }

    if (this.datos.idContractors.length > 0) {
      for (let index = 0; index < this.datos.idContractors.length; index++) {
        this.paymentDataList.push({
          userId: this._auth.accessId,
          contractorId: this.datos.idContractors[index],
          monthPayment: this.formContractorPayment.value.cashPaymentTotal,
          paymentcant: this.formContractorPayment.value.cashPaymentTotal,
          cashPayment: this.formContractorPayment.value.cashPayment,
          fromDate: this.formContractorPayment.value.from,
          toDate: this.formContractorPayment.value.to,
          descriptionPayment: this.formContractorPayment.value.description
        });

      }
    } else {
      this.paymentDataList = [{
        userId: this._auth.accessId,
        contractorId: this.datos.id,
        monthPayment: this.formContractorPayment.value.cashPaymentTotal,
        paymentcant: this.formContractorPayment.value.cashPaymentTotal,
        cashPayment: this.formContractorPayment.value.cashPayment,
        fromDate: this.formContractorPayment.value.from,
        toDate: this.formContractorPayment.value.to,
        descriptionPayment: this.formContractorPayment.value.description
      }]
    }
    debugger
    this._nominaService
      .addContractorPayments(this.paymentDataList)
      .subscribe((res) => {
        if (res) {
          this.updateEconomicContractorPayment();
        }

      },
        (response) => {
          this.formContractorPayment.enable();
          // Set the alert
          Swal.fire('Error', 'Pago No Registrado!', 'error');
          console.log(response);


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
    this._nominaService.getByIdContractorPayments(this.datos.id).subscribe((Response) => {
      this._nominaService = Response;
    });
  }

  getEconomicContractorPayment(ids: any[]) {
    this._nominaService.getByIdEconomicDataContractor(ids).subscribe((Response) => {
      if (Response == null) {
        Swal.fire('ups', 'No se puede ingresar a esta vista debido a que los valores estan en cero', 'warning');
        this.matDialogRef.close();
      } else {
        debugger
        return this.paymentContractor = Response;
      }
    });
  }

  updateEconomicContractorPayment() {
    debugger

    if (this.datos.idContractors.length > 0) {
      for (let index = 0; index < this.datos.idContractors.length; index++) {
        let dataEconomic: EconomicContractor = find(x => x.contractorId == this.datos.idContractors[index]);
        this.economicDataList.push(
          {
            contractorId: this.datos.idContractors[index],
            debt: dataEconomic.debt - dataEconomic.unitValue,
            freed: 0,
            modifyDate: this.registerDate,
          }
        )
      }
    } else {
      this.economicDataList = [
        {
          contractorId: this.datos.data.id,
          debt: this.formContractorPayment.value.totalDebt - this.formContractorPayment.value.cashPaymentTotal,
          freed: 0,
          modifyDate: this.registerDate,
        }
      ]
    }

    this._nominaService.UpdateEconomicContractorPayment(this.economicDataList).subscribe((Response: any) => {
      if (Response) {
        Swal.fire('Exitoso', 'Pago Actualizado Exitosamente!', 'success');
        this.ref.detectChanges();
        this.ref.markForCheck();
        this.matDialogRef.close(true);
      }
    });
  }
}

