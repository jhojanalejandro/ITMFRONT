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
import { HomeContractorService } from '../home-contractor.service';


@Component({
    selector: 'app-viability',
    templateUrl: './upload-data-contractor.component.html',
    styleUrls: ['./upload-data-contractor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UploadDataContractoDataComponent implements OnInit {
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

    constructor(private _upload: HomeContractorService,
      private ref: ChangeDetectorRef,
      public matDialogRef: MatDialogRef<UploadDataContractoDataComponent>,
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
        profesional: new FormControl(null, Validators.required),
        laboral: new FormControl(null, Validators.required),
        fechaComite: new FormControl(null, Validators.required),
        requierePoliza: new FormControl(null, Validators.required),
        noPoliza: new FormControl(null, Validators.required),
        vigenciaInicial: new FormControl(null, Validators.required),
        vigenciaFinal: new FormControl(null, Validators.required),
        fechaExPedicionPoliza: new FormControl(null, Validators.required),
        valorAsegurado: new FormControl(null, Validators.required),
        fechaExaPreocupacional: new FormControl(null, Validators.required),
        nivel: new FormControl(null, Validators.required),
        interventor: new FormControl(null, Validators.required),
        cargoInterventor: new FormControl(null, Validators.required),
        noAdicion: new FormControl(null, Validators.required),
        fechaInicioAplicacion: new FormControl(null, Validators.required),
        fechaterminacionAplicacion: new FormControl(null, Validators.required),
        duracionTotal: new FormControl(null, Validators.required),
        eps: new FormControl(null, Validators.required),
        pension: new FormControl(null, Validators.required),
        arl: new FormControl(null, Validators.required),
        cuentabancaria: new FormControl(null, Validators.required),
        tipodecuenta: new FormControl(null, Validators.required),
        entidadcuentabancaria: new FormControl(null, Validators.required),

      });
      console.log('llega dialog',this.datos);

    }

    async addContractor() {
        const registerContractor: IContractor={
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
          obligacionesEspecificas: this.formContractor.value.obligacionesEspecificas,
          profesional: this.formContractor.value.profesional,
          laboral: this.formContractor.value.laboral,
          fechaComite: this.formContractor.value.fechaComite,
          requierePoliza: this.formContractor.value.requierePoliza,
          noPoliza: this.formContractor.value.noPoliza,
          vigenciaInicial: this.formContractor.value.vigenciaInicial,
          vigenciaFinal: this.formContractor.value.vigenciaFinal,
          fechaExPedicionPoliza: this.formContractor.value.fechaExPedicionPoliza,
          valorAsegurado: this.formContractor.value.valorAsegurado,
          fechaExaPreocupacional: this.formContractor.value.fechaExaPreocupacional,
          nivel: this.formContractor.value.nivel,
          interventor: this.formContractor.value.interventor,
          cargoInterventor: this.formContractor.value.cargoInterventor,
          noAdicion: this.formContractor.value.cargoInterventor,
          fechaInicioAplicacion: this.formContractor.value.fechaInicioAplicacion,
          fechaterminacionAplicacion: this.formContractor.value.fechaterminacionAplicacion,
          duracionTotal: this.formContractor.value.duracionTotal,
          eps: this.formContractor.value.eps,
          pension: this.formContractor.value.pension,
          arl: this.formContractor.value.arl,
          cuentabancaria: this.formContractor.value.cuentabancaria.toString(),
          tipodecuenta: this.formContractor.value.tipodecuenta,
          entidadcuentabancaria: this.formContractor.value.entidadcuentabancaria,
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
          swal.fire('Contratista Registrado Exitosamente!', '', 'success');

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
