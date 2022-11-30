export interface IProjectFolder{
    id?: any;
    userId: any;
    companyName: string;
    projectName: string;
    descriptionProject: string;
    registerDate: Date;
    modifyDate: Date;
    budget: number;
    execution: boolean;
    activate: boolean;
    contractorsCant: number;
    fechaContrato: Date;
    fechaFinalizacion: Date;
    componentes: any[];
}
