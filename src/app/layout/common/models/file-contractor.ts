export interface IFileContractor{
    id?: any;
    userId: string;
    contractorId?: string;
    contractId: string;
    filesName: string;
    filedata: string;
    fileType: string;
    descriptionFile: string;
    registerDate: Date;
    modifyDate?: Date;
    passed: boolean;
    typeFilePayment: string;
    monthPayment?: string;
    folderId: string;
}

export interface Files{
    id?: any;
    userId: string;
    contractId: string;
    filesName: string;
    filedata: string;
    fileType: string;
    descriptionFile: string;
    registerDate: Date;
    folderId: string;
    documentType: string;
}

export interface DocumentTypeFile{
    id?: any;
    documentType1: string;
    code: string
}
