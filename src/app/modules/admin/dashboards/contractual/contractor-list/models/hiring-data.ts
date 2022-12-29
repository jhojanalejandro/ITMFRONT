import { DecimalPipe } from "@angular/common";

export interface IHiringData{
    id?: any;
    contractorId: any;
    userId?: any;
    fechaFinalizacionConvenio: Date;
    contrato: string;
    compromiso: string;
    fechaDeInicioProyectado: Date;
    fechaRealDeInicio: Date;
    actividad: string;
    ejecucion: string;
    actaComite: any;
    fechaDeComite: Date;
    requierePoliza: boolean;
    noPoliza: string;
    vigenciaInicial: Date;
    vigenciaFinal: Date;
    fechaExpedicionPoliza: Date;
    valorAsegurado: any;
    fechaExaPreocupacional: Date;
    nivel: any;
    interventorItm: string;
    cargoInterventorItm: string;
    rubro: string;
    nombreRubro: string;
    cdp: string;
    idsContractors?: number[];
}
