import { Elements, ProjectFolder } from "app/modules/admin/pages/planing/models/planing-model";
import { IHiringData } from "./hiring-data";

export interface AsignmentData{
    contractId: string;
    id: any;
    idContractor: string[];
    type: string;   
}


export interface ContractContractors{
    contractId: string;
	contractors: string[];
}

export interface Contractor{
    id?: string;
	tipoContratacion: string,
	codigo: string,
	convenio: string,
	fechaInicio: string,
	fechaFin: string,
	nombre: string,
	apellido: string,
	identificacion: string,
	lugarExpedicion: string,
	tecnico?: string,
	tecnologo?: string,
	pregrado?: string,
	especializacion?: string,
	maestria?: string,
	doctorado?: string,
	genero?: string,
	fechaNacimiento: Date,
	nacionalidad?: string,
	direccion: string,
	departamento: string,
	municipio?: string,
	barrio?: string,
	telefono: string,
	celular: string,
	correo: string,
	tipoAdministradora?: string,
	administradora?: string,
	cuentaBancaria: string,
	tipoCuenta: string,
	entidadCuentaBancaria: string,
	estado?: string,
	userId?: string,
	claveUsuario?: string,
	contractId?: number,
	fechaCreacion?: Date,
	fechaActualizacion?: Date,
	componenteId?: number,
	elementId?: number,
	objetoConvenio?: string,
	unitValue: number;
	company: string;
	from: Date;
	to: Date;
}


export interface Minuta{
    contractor: Contractor;
    elementosComponente: Elements;
    hiringData: IHiringData;
    contract: ProjectFolder;
}



export interface NewnessContractor{
    contractorId: string;
    id: any;
    descripcionNovedad: string;
    tipoNovedad: string;   
	contractId: string;
}
