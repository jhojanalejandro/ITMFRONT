import { DecimalPipe } from "@angular/common";

export interface IHiringData{
    id?: any;
    contractorId: any;
    userId: any;
    fechaFinalizacionConvenio: Date;
    contrato: string;
    compromiso: string;
    fechaDeInicioProyectado: Date;
    fechaRealDeInicio: Date;
    actividad: string;
    ejecucion: string;
    actaComite: any;
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
    rubro: string;
    nombreRubro: string;
}
