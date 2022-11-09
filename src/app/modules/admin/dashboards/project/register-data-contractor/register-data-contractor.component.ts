import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { IContractor } from 'app/layout/common/models/contractor';
import { UploadDataService } from '../upload-data.service';
import swal from 'sweetalert2';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';


@Component({
    selector: 'app-register-contractor',
    templateUrl: './register-data-contractor.component.html',
    styleUrls: ['./register-data-contractor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContractorDataRegisterComponent implements OnInit {
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
  requierePoliza: any = GlobalCont.requierePoliza
  entidadesdArl: any = GlobalCont.arl;
  niveles: any = GlobalCont.Nivel;  
  comunas: any = GlobalCont.comunas;
  tipoCuenta: any = GlobalCont.tipoCuenta;
  formContractor: FormGroup; 
  nacionalidades: any = GlobalCont.nacionalidad;

    constructor(private _upload: UploadDataService,
      private ref: ChangeDetectorRef,
      private _auth: AuthService,
      public matDialogRef: MatDialogRef<ContractorDataRegisterComponent>,
      @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
      ) {}

    ngOnInit(): void {
      // this.ref.detectChanges();
      console.log('id',this.datos.data.id);
      
      this.formContractor = this._formBuilder.group({
        contrato: new FormControl(null, Validators.required),
        compromiso: new FormControl(null, Validators.required),
        fechaContrato: new FormControl(null, Validators.required),
        fechaInicioProyectado: new FormControl(null, Validators.required),
        fechaInicioReal: new FormControl(null, Validators.required),
        fechaFinalizacion: new FormControl(null, Validators.required),
        honorariosMensuales: new FormControl(null, Validators.required),
        actividad: new FormControl(null, Validators.required),
        ejecucion: new FormControl(null, Validators.required),
        // obligacionesGenerales: new FormControl(null, Validators.required),
        // obligacionesEspecificas: new FormControl(null, Validators.required),
        // profesional: new FormControl(null, Validators.required),
        // laboral: new FormControl(null, Validators.required),
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
        // duracionTotal: new FormControl(null, Validators.required),
        fechaFinalizacionConvenio: new FormControl(null, Validators.required),
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
        if(this.formContractor.value.requierePoliza == 'si'){
          this.formContractor.value.requierePoliza = true;
        }else{
          this.formContractor.value.requierePoliza = false;

        }

        if(this.formContractor.value.cuentabancaria == null){
          this.formContractor.value.cuentabancaria = '0'
        }
        if(this.formContractor.value.nivel == null){
          this.formContractor.value.nivel = '0'
        }
        const registerContractor: IContractor={
          userId: this._auth.accessId,
          contractorId: this.datos.data.id,
          contrato: this.formContractor.value.contrato,
          compromiso: this.formContractor.value.compromiso.toString(),
          fechaDeContrato: this.formContractor.value.fechaContrato,
          fechaDeInicioProyectado: this.formContractor.value.fechaInicioProyectado,
          fechaRealDeInicio: this.formContractor.value.fechaInicioReal,
          fechaFinalizacion: this.formContractor.value.fechaFinalizacion,
          actividad: this.formContractor.value.actividad,
          ejecucion: this.formContractor.value.ejecucion,
          fechaDeComite: this.formContractor.value.fechaComite,
          requierePoliza: this.formContractor.value.requierePoliza,
          noPoliza: this.formContractor.value.noPoliza,
          vigenciaInicial: this.formContractor.value.vigenciaInicial,
          vigenciaFinal: this.formContractor.value.vigenciaFinal,
          fechaExpedicionPoliza: this.formContractor.value.fechaExPedicionPoliza,
          valorAsegurado: Number(this.formContractor.value.valorAsegurado),
          fechaExaPreocupacional: this.formContractor.value.fechaExaPreocupacional,
          nivel: Number(this.formContractor.value.nivel),
          interventorItm: this.formContractor.value.interventor,
          cargoInterventorItm: this.formContractor.value.cargoInterventor,
          noAdicion: this.formContractor.value.noAdicion,
          fechaInicioAmpliacion: this.formContractor.value.fechaInicioAplicacion,
          fechaDeTerminacionAmpliacion: this.formContractor.value.fechaterminacionAplicacion,
          eps: this.formContractor.value.eps,
          pension: this.formContractor.value.pension,
          arl: this.formContractor.value.arl,
          cuentaBancaria: this.formContractor.value.cuentabancaria.toString(),
          tipoCuenta: this.formContractor.value.tipodecuenta,
          entidadCuentaBancaria: this.formContractor.value.entidadcuentabancaria,
          fechaFinalizacionConvenio: this.formContractor.value.fechaFinalizacionConvenio,
          actaComite: 'vacio',
          rubroPresupuestal: 'vacio',
          nombreDelRubro: 'vacio'
        };  
      debugger
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

    cerrar(): void {
      this.matDialogRef.close();
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
