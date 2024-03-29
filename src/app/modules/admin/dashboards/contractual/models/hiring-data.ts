import { DecimalPipe } from "@angular/common";

export interface IHiringData{
    id?: string;
    contractorId: string;
    contractId: string;
    userId?: string;
    fechaFinalizacionConvenio: Date;
    contrato: string;
    compromiso: string;
    fechaRealDeInicio: Date;
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
    // supervisorId: string;
    cdp: string;
    caso: string;
    statusContractor?: string;
    actividadContratista: string;
}
