import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { IContractor } from 'app/layout/common/models/contractor';
import { UploadDataComponent } from '../upload-data.component';
import { UploadDataService } from '../upload-data.service';
import swal from 'sweetalert2';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';


@Component({
    selector: 'app-register-contractor',
    templateUrl: './register-contractor.component.html',
    styleUrls: ['./register-contractor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContractorRegister implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'warn',
    message: ''
  };
  departments: any;
  municipio: any;
  showAlert: boolean = false;
  data: any;
  registerDate = new Date();
  entidadesB: any = GlobalCont.entidadesB;
  entidadesEps: any = GlobalCont.eps;
  entidadesP: any = GlobalCont.pensiones;
  entidadesdArl: any = GlobalCont.arl; 
  comunas: any = GlobalCont.comunas;
  tipoCuenta: any = GlobalCont.tipoCuenta;
  formContractor: FormGroup; 
  nacionalidades: any = GlobalCont.nacionalidad;

    constructor(private _upload: UploadDataService,
      public matDialogRef: MatDialogRef<ContractorRegister>,
      @Inject(MAT_DIALOG_DATA) public datos: any, private _formBuilder: FormBuilder
      ) {}

    ngOnInit(): void {
        // this.getRaffle();
      
      this.getDepartamento();
        this.formContractor = this._formBuilder.group({
          nombre: new FormControl(null, Validators.required),
          apellido: new FormControl(null, Validators.required),
          documentodeidentificacion: new FormControl(null, Validators.required),
          lugardeexpedicion: new FormControl(null, Validators.required),
          fechanacimiento: new FormControl(null, Validators.required),
          municipio: new FormControl(null, Validators.required),
          comuna: new FormControl(null, Validators.required),
          barrio: new FormControl(null, Validators.required),
          telefono: new FormControl(null, Validators.required),
          celular: new FormControl(null, Validators.required),
          sexo: new FormControl(null, Validators.required),
          nacionalidad: new FormControl(null, Validators.required),
          direccion: new FormControl(null, Validators.required),
          departamento: new FormControl(null, Validators.required),
          eps: new FormControl(null, Validators.required),
          pension: new FormControl(null, Validators.required),
          arl: new FormControl(null, Validators.required),
          cuentabancaria: new FormControl(null, Validators.required),
          tipodecuenta: new FormControl(null, Validators.required),
          entidadcuentabancaria: new FormControl(null, Validators.required),

      });
    }
    close(){
      this.data = 'vacio'
     
      this.matDialogRef.close(this.data);   
    }
    async addContractor() {
        const registerContractor: IContractor={
          nombre: this.formContractor.value.nombre,
          apellido: this.formContractor.value.apellido,
          documentodeidentificacion: this.formContractor.value.documentodeidentificacion,
          lugardeexpedicion: this.formContractor.value.winOportunities,
          fechanacimiento: this.formContractor.value.cipher,
          municipio: this.formContractor.value.ticketCant,
          comuna: this.formContractor.value.priceTicket,
          barrio: this.formContractor.value.valueReward,
          telefono: this.formContractor.value.telefono,
          celular: this.formContractor.value.celular,
          sexo: this.formContractor.value.sexo,
          direccion: this.formContractor.value.direccion,
          departamento: this.formContractor.value.departamento,
          eps: this.formContractor.value.departamento,
          pension: this.formContractor.value.departamento,
          arl: this.formContractor.value.departamento,
          cuentabancaria: this.formContractor.value.departamento,
          tipodecuenta: this.formContractor.value.departamento,
          entidadcuentabancaria: this.formContractor.value.departamento,
          nacionalidad: this.formContractor.value.nacionalidad,
        };   
      this._upload
      .addContractor(registerContractor)
      .subscribe((res) => {   
        swal.fire('Eliminado!', '', 'success');
          this.data = res;
          this.matDialogRef.close(this.data);     
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
    async getDepartamento(){
      (await  this._upload.getDepartments()).subscribe((Response) =>{
        this.departments = Response;                
      })
    }

    async getMunicipio(){
      (await  this._upload.getDepartments()).subscribe((Response) =>{
        this.municipio = Response[this.formContractor.value.departamento].ciudades;            
    })

}
}
