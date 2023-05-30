import { Elements, ContractFolder } from "app/modules/admin/pages/planing/models/planing-model";
import { IHiringData } from "./hiring-data";

export interface AsignmentData{
    contractId: string;
    id: string;
    contractorId: string[];
    type: string; 
	activityId?: string;  
}


export interface ContractContractors{
    contractId: string;
	contractors: string[];
}

export interface Contractor{
    id?: string;
	nombre: string,
	habilitado: string;
	identificacion: string,
	lugarExpedicion: string,
	fechaNacimiento: Date,
	direccion: string,
	telefono: string,
	celular: string,
	correo: string,
	userId?: string,
	proccess: any;
	elementId: string;
	componentId: string;
	legalProccess: any;
	hiringStatus: boolean;
}


export interface Minuta{
    contractor: Contractor;
    elementosComponente: Elements;
    hiringData: IHiringData;
    contract: ContractFolder;
}



export interface NewnessContractor{
    contractorId: string;
    id?: string;
    descripcionNovedad: string;
    tipoNovedad: string;   
	contractId: string;
}
