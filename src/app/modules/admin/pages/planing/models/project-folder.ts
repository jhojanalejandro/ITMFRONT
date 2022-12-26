import { IDetailProjectFolder } from "./detail-project";

export interface IProjectFolder{
    id?: any;
    userId: any;
    companyName: string;
    projectName: string;
    descriptionProject: string;
    execution: boolean;
    activate: boolean;
    contractorsCant: number;
    valorContrato: number;
    gastosOperativos: number;
    valorSubTotal: number;
    detalleContratoDto: IDetailProjectFolder;
}
