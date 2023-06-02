export interface FileContractor{
    id?: any;
    userId: string;
    contractorId?: string;
    contractId: string;
    filesName: string;
    filedata: string;
    fileType: string;
    descriptionFile: string;
    registerDate: any;
    modifyDate?: any;
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

export interface DetailFile{
    id?: string;
    fileId: string;
    reason: string;
    observation: string;
    registerDate: Date;
    statusFileId: string;
    passed: any;
}


export interface DetailFileContractor{
    id?: any;
    fileId: any;
    reason: string;
    observation: string;
    files: string[];
    passed: boolean;
    registerDate: Date;
}

export interface ContractsContractor{
    id: any;
    companyName: string;
}