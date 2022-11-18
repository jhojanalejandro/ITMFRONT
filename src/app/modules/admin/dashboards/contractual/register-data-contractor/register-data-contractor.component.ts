import { Component, OnInit,Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { IContractor } from 'app/layout/common/models/contractor';
import { UploadDataService } from '../contracts-list/upload-data.service';
import swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
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
  entidadesB: any = GlobalConst.entidadesB;
  entidadesEps: any = GlobalConst.eps;
  entidadesP: any = GlobalConst.pensiones;
  requierePoliza: any = GlobalConst.requierePoliza
  entidadesdArl: any = GlobalConst.arl;
  niveles: any = GlobalConst.Nivel;  
  comunas: any = GlobalConst.comunas;
  tipoCuenta: any = GlobalConst.tipoCuenta;
  formContractor: FormGroup; 
  nacionalidades: any = GlobalConst.nacionalidad;

    constructor(private _upload: UploadDataService,
      private ref: ChangeDetectorRef,
      private _auth: AuthService,
      public matDialogRef: MatDialogRef<ContractorDataRegisterComponent>,
      @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
      ) {}

    ngOnInit(): void {
      this.formContractor = this._formBuilder.group({
        contrato: new FormControl(null),
        compromiso: new FormControl(null),
        fechaContrato: new FormControl(null),
        fechaInicioProyectado: new FormControl(null),
        fechaInicioReal: new FormControl(null),
        fechaFinalizacion: new FormControl(null),
        honorariosMensuales: new FormControl(null),
        actividad: new FormControl(null),
        ejecucion: new FormControl(null),
        // profesional: new FormControl(null, Validators.required),
        // laboral: new FormControl(null, Validators.required),
        fechaComite: new FormControl(null),
        requierePoliza: new FormControl(null),
        noPoliza: new FormControl(null),
        vigenciaInicial: new FormControl(null),
        vigenciaFinal: new FormControl(null),
        fechaExPedicionPoliza: new FormControl(null),
        valorAsegurado: new FormControl(null),
        fechaExaPreocupacional: new FormControl(null),
        nivel: new FormControl(null),
        interventor: new FormControl(null),
        cargoInterventor: new FormControl(null),
        noAdicion: new FormControl(null),
        fechaInicioAplicacion: new FormControl(null),
        fechaterminacionAplicacion: new FormControl(null),
        // duracionTotal: new FormControl(null, Validators.required),
        fechaFinalizacionConvenio: new FormControl(null, Validators.required),
        eps: new FormControl(null, Validators.required),
        pension: new FormControl(null, Validators.required),
        arl: new FormControl(null, Validators.required),
        cuentabancaria: new FormControl(null, Validators.required),
        tipodecuenta: new FormControl(null, Validators.required),
        entidadcuentabancaria: new FormControl(null, Validators.required),

      });
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
          nombreDelRubro: 'vacio',
          cpc: 'vacio',
          nombreCpc: 'vacio',
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
    //    this.municipio = GlobalConst.departamentos[this.formContractor.value.departamento].ciudades;            
    // }
}
