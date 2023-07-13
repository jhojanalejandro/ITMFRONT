export interface Activity{
    id: any;
    nombreActividad: string,
    contractId: any;
    componentId: any;
    elementos? : [];
}

export interface Carro{
    id: any;
    tipo: string,
    modelo: any;
    color: any;
    cilindrje: string
}

export interface ContractList{
    id?: any;
    userId?: string;
    companyName: string;
    projectName: string;
    statusContract: string;
    activate: boolean;
    enableProject: boolean;
    contractorsCant: number;
    valorContrato: number;
    numberProject: string;
    project: string;
    fechaFinalizacion: Date;
    fechaContrato: Date;
    rubro?: string;
    fuenteRubro?: string;
    nombreRubro?: string;
    objectContract: string;
}
export interface ContractFolder{
    id?: string;
    userId?: string;
    companyName: string;
    projectName: string;
    objectContract: string;
    statusContractId: string;
    activate: boolean;
    enableProject: boolean;
    contractorsCant: number;
    valorContrato: number;
    gastosOperativos: number;
    valorSubTotal: number;
    noAdicion: string;
    fechaInicioAmpliacion: Date | null;
    fechaDeTerminacionAmpliacion: Date | null;
    detalleContratoDto?: DetailContractFolder;
    numberProject: string;
    rubro: string;
    nombreRubro: string;
    project: string;
    fuenteRubro: string;
}

export interface DetailContractFolder{
    id?: any;
    fechaContrato: Date;
    fechaFinalizacion: Date;
    adicion: boolean;
    tipoContrato: string;
    contractId?: any;
    update: boolean;
}

export interface Componente{
    id: any;
    nombreComponente: string,
    contractId: number;
    elementos? : [];
    activities? : [];

}


export interface Elements{
    id?: any;
    nombreElemento: string;
    componentId: string;
    cantidadContratistas: number;
    cantidadDias: number;
    valorUnidad: any;
    valorTotal: any;
    valorPorDia: any;
    valorTotalContratista: number;
    valorPorDiaContratista: number;
    cpcId: string;
    modificacion: boolean;
    tipoElemento: string;
    recursos: any; 
    consecutivo: string;
    obligacionesEspecificas: string;
    obligacionesGenerales: string;
    objetoElemento: string;
    activityId?: string;
}

export interface ElementComponent{
    id?: any;
    nombreElemento: string;
    componentId: string;
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
    activityId?: string;
}

export interface ListElements{
    componentName: string;
    listElements: any[];
}

export interface DetalleContrato{
	id?: any,
	contractId: any,
	fechaContrato: string,
	fechaFinalizacion: string,
	tipoContrato: string  
}

export interface ContractFolders{
    id?: any;
    userId?: string;
    companyName: string;
    projectName: string;
    statusContract: string;
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
    rubroId?: string;
    nombreRubro: string;
    project: string;
    fechaFinalizacion: Date;
    fechaContrato: Date;
    fuenteRubro: string;
    objectContract: string;
    statusContractId?: string;

}



export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
export interface Components
{
    id: any;
    cantDay: number;
    componentName: string;
    contractorCant: number;
    totalValue: number;
    unitValue: number;
    listElements: any[];
}
export interface InventoryCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface OptionTypeData{
    id: any;
    nombreComponente: string,
    idContrato: number;
    elementos? : [];
}

