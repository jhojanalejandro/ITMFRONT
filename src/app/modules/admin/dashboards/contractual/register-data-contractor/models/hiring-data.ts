import { DecimalPipe } from "@angular/common";

export interface IHiringData{
    id?: any;
    contractorId: any;
    userId: any;
    contrato: string;
    compromiso: string;
    fechaDeInicioProyectado: Date;
    fechaRealDeInicio: Date;
    fechaFinalizacionConvenio: Date;
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
}

