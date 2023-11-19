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
	typeMinute: string
    contractId: string;
	contractors: string[];
}

export interface Contractor{
    id?: string;
	nombre: string,
	habilitado: string;
	identificacion: string;
	lugarExpedicion: string;
	fechaNacimiento: any | null;
	direccion: string;
	telefono: string;
	celular: string;
	correo: string;
	userId?: string;
	elementId: string;
	componentId: string;
	legalProccess: any;
	hiringStatus: any;
	assignmentUser?: string[];
	all?: any;
	expanded?: any;
	gender?: string;
	contractValue?: any;
	nacionality?: string;
	expeditionPlace?: string;
	initialContractDate?: Date;
	finalContractDate?: Date; 
	cantDays?: number;
	emptityHealthDto?: any; 
	bankEntity: string;
	cdp?: string;
	level: number;
	eps: string;
	arl: string;
	afp: string;
	contract: string;
}


export interface Minuta{
    contractor: Contractor;
    elementosComponente: Elements;
    hiringData: IHiringData;
    contract: ContractFolder;
}



export interface NewnessContractor{
    id?: string;
	contractorId: string;
    newnessDescripcion: string;
    newnessType: string;   
	contractId: string;
	newnessCode: string;
	registerDate: Date;
}


export interface ContractorPayroll{
    id?: string;
	nombre: string,
	habilitado: string;
	identificacion: string;
	lugarExpedicion: string;
	fechaNacimiento: Date;
	direccion: string;
	telefono: string;
	celular: string;
	correo: string;
	userId?: string;
	proccess: any;
	elementId: string;
	componentId: string;
	legalProccess: any;
	hiringStatus: any;
	assignmentUser?: string[];
}


export interface PostContractual{
    id?: string;
	nombre: string,
	identificacion: string;
	lugarExpedicion: string;
	fechaNacimiento: any | null;
	direccion: string;
	telefono: string;
	celular: string;
	correo: string;
	userId?: string;
	elementId: string;
	componentId: string;
	assignmentUser?: string[];
	expanded?: any;
	gender?: string;
	contractValue?: any;
	nacionality?: string;
	expeditionPlace?: string;
	initialContractDate?: Date;
	finalContractDate?: Date; 
	cantDays?: number;
	emptityHealthDto?: any; 
	bankEntity: string;
	cdp?: string;
	level: number;
	eps: string;
	arl: string;
	afp: string;
	contract: string;
	paymentsCant: string;
	statusContractor: string;
	periodPaymented: string;
	paymentCant: string;
	debt: string;
}

export interface NominaContractual{
    id?: string;
	nombre: string,
	identificacion: string;
	lugarExpedicion: string;
	fechaNacimiento: any | null;
	direccion: string;
	telefono: string;
	celular: string;
	correo: string;
	userId?: string;
	elementId: string;
	componentId: string;
	paymentPension: any;
	paymentArl: any;
	paymentEps: any;
	assignmentUser?: string[];
	expanded?: any;
	gender?: string;
	contractValue?: any;
	nacionality?: string;
	expeditionPlace?: string;
	initialContractDate?: Date;
	finalContractDate?: Date; 
	cantDays?: number;
	emptityHealthDto?: any; 
	bankEntity: string;
	cdp?: string;
	level: number;
	eps: string;
	arl: string;
	afp: string;
	payrollNumber: string;
	paymentPeriodDate: any;
	correctArlPayment: string;
	correctAfpPayment: string;
	correctEpsPayment: string;
	correctSheet: string;
	contract: string;
}
export interface ContractorPayment{
    id?: string;
	fromDate?: Date;
	toDate?: Date;
	paymentCant: string;
	projectName: string;
	consecutive: string;
}
