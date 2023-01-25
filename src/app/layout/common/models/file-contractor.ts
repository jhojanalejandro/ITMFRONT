export interface IFileContractor{
    id?: any;
    userId: any;
    contractorId: string;
    contractId: string;
    filesName: string;
    filedata: string;
    typeFile: string;
    descriptionFile: string;
    registerDate: Date;
    modifyDate: Date;
    passed: boolean;
    typeFilePayment: string;
    monthPayment?: string;
    FolderId: string;
}

export interface IDetailFile{
    id?: any;
    fileId: any;
    observation: string;
    motivo: string;
    files: IFileContractor
}

