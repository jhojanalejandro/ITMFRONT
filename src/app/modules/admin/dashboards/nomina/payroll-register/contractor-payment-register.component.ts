import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { IContractor } from 'app/layout/common/models/contractor';
import swal from 'sweetalert2';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { NominaService } from '../nomina.service';
import { IContractorPayments } from 'app/layout/common/models/contractor-payments';


@Component({
    selector: 'app-contractor-payment',
    templateUrl: './contractor-payment-register.component.html',
    styleUrls: ['./contractor-payment-register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class  ContractorPaymentRegisterComponent implements OnInit {
  checked = false;
  indeterminate = false;
  formFieldHelpers: string[] = [''];
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'warn',
    message: ''
  };
  showAlert: boolean = false;
  registerDate = new Date();
  entidadesB: any = GlobalCont.entidadesB;
  entidadesEps: any = GlobalCont.eps;
  formContractorPayment: FormGroup; 
  pagos: any = GlobalCont.nomina;

    constructor(private _nominaService: NominaService,
      private ref: ChangeDetectorRef,
      private _auth: AuthService,
      public matDialogRef: MatDialogRef<ContractorPaymentRegisterComponent>,
      @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
      ) {}

    ngOnInit(): void {
      this.formContractorPayment = this._formBuilder.group({
        monthPayment: new FormControl(this.registerDate, Validators.required),
        paymentcant: new FormControl(null, Validators.required),
        cashPayment: new FormControl(null, Validators.required),
        registerDate: new FormControl(null, Validators.required),
        contractorName: new FormControl('contratista', Validators.required),
      });
    }

    async addContractor() {
        const registerPayment: IContractorPayments={
          userId: this._auth.accessId,
          contractorId: this.datos.data.id,
          monthPayment: this.formContractorPayment.value.monthPayment,
          paymentcant: this.formContractorPayment.value.paymentcant,
          cashPayment: this.formContractorPayment.value.cashPayment,
          registerDate: this.registerDate,
          modifyDate: this.registerDate
        };  
      debugger
      this._nominaService
      .addContractorPayments(registerPayment)
      .subscribe((res) => {   
        if(res){
          swal.fire('Pago Registrado Exitosamente!', '', 'success');
          this.ref.detectChanges();
          this.ref.markForCheck();  
        }

      },
      (response) => {
          this.formContractorPayment.enable();
          // Set the alert
          this.alert = {
              type   : 'error',
              message: 'ERROR EN LA INFORMACION'
          };

          // Show the alert
          this.showAlert = true;
      });
    }

    cerrar(): void {
      this.matDialogRef.close();
  }
    getEconomicDataContractor() {
         this._nominaService.getByIdEconomicDataContractor(this.datos.data.id).subscribe((Response) => {
            this._nominaService = Response;
        });
    }
    getContractorPayment() {
      this._nominaService.getByIdContractorPayments(this.datos.data.id).subscribe((Response) => {
         this._nominaService = Response;
     });
    }
}