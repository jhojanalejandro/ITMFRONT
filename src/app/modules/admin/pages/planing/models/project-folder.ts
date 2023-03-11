
export interface IProjectFolder{
    id?: any;
    userId?: any;
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
    fechaInicioAmpliacion: Date;
    fechaDeTerminacionAmpliacion: Date;
    detalleContratoDto: DetailProjectFolder;
    numberProject: string;
    rubro: string;
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

