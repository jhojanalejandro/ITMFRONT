import { DecimalPipe } from "@angular/common";

export interface IHiringData{
    id?: any;
    contractorId: any;
    userId?: any;
    fechaFinalizacionConvenio: Date;
    contrato: string;
    compromiso: string;
    fechaRealDeInicio: Date;
    actaComite: any;
    numeroActa: string;    
    fechaDeComite: Date;
    requierePoliza: boolean;
    noPoliza: string;
    vigenciaInicial: Date;
    vigenciaFinal: Date;
    fechaExpedicionPoliza: Date;
    valorAsegurado: any;
    fechaExaPreocupacional: Date;
    nivel: any;
    supervisorItm: string;
    cargoSupervisorItm: string;
    rubro: string;
    nombreRubro: string;
    cdp: string;
}