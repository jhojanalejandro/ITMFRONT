import { DecimalPipe } from "@angular/common";

export interface IContractor{
    id?: any;
    contractorId: any;
    userId: any;
    cpc: any;
    nombreCpc: string;
    contrato: string;
    compromiso: string;
    fechaDeContrato: Date;
    fechaDeInicioProyectado: Date;
    fechaRealDeInicio: Date;
    fechaFinalizacion: Date;
    fechaFinalizacionConvenio: Date;
    actividad: string;
    ejecucion: string;
    actaComite: any;
    // obligacionesGenerales: string;
    // obligacionesEspecificas: string;
    // profesional: string;
    // laboral: string;
    fechaDeComite: Date;
    requierePoliza: string;
    noPoliza: string;
    vigenciaInicial: Date;
    vigenciaFinal: Date;
    fechaExpedicionPoliza: Date;
    valorAsegurado: any;
    fechaExaPreocupacional: Date;
    nivel: any;
    interventorItm: string;
    cargoInterventorItm: string;
    noAdicion: string;
    fechaInicioAmpliacion: Date;
    fechaDeTerminacionAmpliacion: Date;
    // duracionTotal: number;
    eps: string;
    pension: string;
    arl: string;
    cuentaBancaria: string;
    tipoCuenta: string;
    entidadCuentaBancaria: string;
    rubroPresupuestal: string;
    nombreDelRubro: string,    
    // "entidadAseguradora": "string",  
}
