export interface FileContractor{
    id?: any;
    userId: string;
    contractorId?: string;
    contractId: string;
    filesName: string;
    filedata: string;
    fileType: string;
    documentType: string;
    descriptionFile: string;
    registerDate: any;
    modifyDate?: any;
    monthPayment?: string;
    folderId: string;
    origin?: string;
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
    documentTypeDescription: string;
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
    userId: string;
}


export interface DetailFileContractor{
    id?: any;
    fileId: any;
    reason: string;
    observation: string;
    files: any[];
    passed: boolean;
    registerDate: Date;
    statusFileId: string;
    contractId: string;
    contractorId: string;
}

export interface ContractsContractor{
    id: any;
    companyName: string;
}