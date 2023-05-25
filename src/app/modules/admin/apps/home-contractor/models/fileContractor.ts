export interface FileContractor{
    id?: any;
    contractorId: string;
    contractId: string;
    filesName: string;
    filedata: string;
    typeFile: string;
    descriptionFile: string;
    userId?: string;
    registerDate: Date;
    modifyDate: Date;
    typeFilePayment: string;
    monthPayment: any;
    passed: true;
    DetailFileContractor: DetailFileContractor[];
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