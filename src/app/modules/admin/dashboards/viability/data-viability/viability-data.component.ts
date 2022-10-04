import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { IContractor } from 'app/layout/common/models/contractor';
import swal from 'sweetalert2';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { ViabilityService } from '../viability.service';


@Component({
    selector: 'app-viability',
    templateUrl: './viability-data.component.html',
    styleUrls: ['./viability-data.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ViabilityDataComponent implements OnInit {
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
  entidadesP: any = GlobalCont.pensiones;
  entidadesdArl: any = GlobalCont.arl; 
  comunas: any = GlobalCont.comunas;
  tipoCuenta: any = GlobalCont.tipoCuenta;
  formContractor: FormGroup; 
  nacionalidades: any = GlobalCont.nacionalidad;

    constructor(private _upload: ViabilityService,
      private ref: ChangeDetectorRef,
      public matDialogRef: MatDialogRef<ViabilityDataComponent>,
      @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
      ) {}

    ngOnInit(): void {
      // this.ref.detectChanges();
      this.formContractor = this._formBuilder.group({
        rubropresupuestal: new FormControl(null, Validators.required),
        nombredelrubro: new FormControl(null, Validators.required),
        fuenteRubro: new FormControl(null, Validators.required),
        posicion: new FormControl(null, Validators.required)

      });

    }

    async addViability() {
        const registerViability: any={
          rubropresupuestal: this.formContractor.value.rubropresupuestal,
          nombredelrubro: this.formContractor.value.cpc,
          fuenteRubro: this.formContractor.value.fuenteRubro,
          posicion: this.formContractor.value.posicion
        };  
      this._upload
      .addViability(registerViability)
      .subscribe((res) => {   
        if(res){
          swal.fire('Contratista Registrado Exitosamente!', '', 'success');
          this.ref.detectChanges();
          this.ref.markForCheck();  
        }

      },
      (response) => {
          this.formContractor.enable();
          // Set the alert
          swal.fire('Error en el registro de la informacion!', '', 'error');

          this.alert = {
              type   : 'error',
              message: 'ERROR EN LA INFORMACION'
          };

          // Show the alert
          this.showAlert = true;
      });
    }

    // async getRaffle() {
    //     (await this.api.getAllRaffleNames()).subscribe((Response) => {
    //         this.RaffleNameData = Response;
    //     });
    // }
    // async getDepartamento(){
    //   (await  this._upload.getDepartments()).subscribe((Response) =>{
    //     this.departments = Response;                
    //   })
    // }

    // async getMunicipio(){
    //   // this.municipio = this.departamentos[this.formContractor.value.departamento].ciudades;   
    //    this.municipio = GlobalCont.departamentos[this.formContractor.value.departamento].ciudades;            
    // }
}
