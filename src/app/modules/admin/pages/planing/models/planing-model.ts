export interface Activity{
    id: any;
    nombreActividad: string,
    idContrato: any;
    idComponente: any;
}

export interface Carro{
    id: any;
    tipo: string,
    modelo: any;
    color: any;
    cilindrje: string
}

export interface ProjectFolder{
    id?: any;
    userId?: string;
    companyName: string;
    projectName: string;
    descriptionProject: string;
    execution: any;
    activate: boolean;
    enableProject: boolean;
    contractorsCant: number;
    valorContrato: number;
    gastosOperativos: number;
    valorSubTotal: number;
    noAdicion: string;
    fechaInicioAmpliacion: Date | null;
    fechaDeTerminacionAmpliacion: Date | null;
    detalleContratoDto?: DetailProjectFolder;
    numberProject: string;
    rubro: string;
    nombreRubro: string;
    project: string;
}

export interface DetailProjectFolder{
    id?: any;
    fechaContrato: Date;
    fechaFinalizacion: Date;
    adicion: boolean;
    tipoContrato: string;
    idContrato?: any;
    update: boolean;
}

export interface Componente{
    id: any;
    nombreComponente: string,
    idContrato: number;
    elementos? : [];
}


export interface Elements{
    id?: any;
    nombreElemento: string;
    idComponente: string;
    cantidadContratistas: number;
    cantidadDias: number;
    valorUnidad: number;
    valorTotal: number;
    valorPorDia: number;
    valorTotalContratista: number;
    valorPorDiaContratista: number;
    cpc: string;
    nombreCpc: string;
    modificacion: boolean;
    tipoElemento: string;
    recursos: number; 
    consecutivo: string;
    obligacionesEspecificas: string;
    obligacionesGenerales: string;
    objetoElemento: string;
}

export interface ListElements{
    componentName: string;
    listElements: any[];
}

export interface DetalleContrato{
	id?: any,
	idcontrato: any,
	fechaContrato: Date,
	fechaFinalizacion: Date,
	modificacion: boolean,
	tipoContrato: string  
}

export interface ProjectFolders{
    id?: any;
    userId?: string;
    companyName: string;
    projectName: string;
    descriptionProject: string;
    execution: any;
    activate: boolean;
    enableProject: boolean;
    contractorsCant: number;
    valorContrato: number;
    gastosOperativos: number;
    valorSubTotal: number;
    noAdicion: string;
    fechaInicioAmpliacion: Date | null;
    fechaDeTerminacionAmpliacion: Date | null;
    numberProject: string;
    rubro: string;
    nombreRubro: string;
    project: string;
    fechaFinalizacion: string;
    fechaContrato: string;
}
