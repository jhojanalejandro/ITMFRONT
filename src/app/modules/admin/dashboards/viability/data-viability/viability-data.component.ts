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
        consecutivo: new FormControl(null, Validators.required),
        cpc: new FormControl(null, Validators.required),
        nombreCpc: new FormControl(null, Validators.required),
        contrato: new FormControl(null, Validators.required),
        compromiso: new FormControl(null, Validators.required),
        fechaContrato: new FormControl(null, Validators.required),
        fechaInicioProyectado: new FormControl(null, Validators.required),
        fechaInicioReal: new FormControl(null, Validators.required),
        fechaFinalizacion: new FormControl(null, Validators.required),
        honorariosMensuales: new FormControl(null, Validators.required),
        actividad: new FormControl(null, Validators.required),
        encabezado: new FormControl(null, Validators.required),
        ejecucion: new FormControl(null, Validators.required),
        obligacionesGenerales: new FormControl(null, Validators.required),
        obligacionesEspecificas: new FormControl(null, Validators.required),

      });

    }

    async addContractor() {
        const registerContractor: any={
          consecutivo: this.formContractor.value.consecutivo,
          cpc: this.formContractor.value.cpc,
          nombreCpc: this.formContractor.value.nombreCpc,
          contrato: this.formContractor.value.contrato.toString(),
          compromiso: this.formContractor.value.compromiso,
          fechaContrato: this.formContractor.value.fechaContrato,
          fechaInicioProyectado: this.formContractor.value.fechaInicioProyectado,
          fechaInicioReal: this.formContractor.value.fechaInicioReal,
          fechaFinalizacion: this.formContractor.value.fechaFinalizacion,
          honorariosMensuales: this.formContractor.value.honorariosMensuales,
          actividad: this.formContractor.value.actividad,
          encabezado: this.formContractor.value.encabezado,
          ejecucion: this.formContractor.value.ejecucion,
          obligacionesGenerales: this.formContractor.value.obligacionesGenerales,
          obligacionesEspecificas: this.formContractor.value.obligacionesEspecificas
        };  
      this._upload
      .addContractor(registerContractor)
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