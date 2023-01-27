export interface FileContractor{
    id?: any;
    contractorId: any;
    contractId: any;
    filesName: string;
    filedata: string;
    typeFile: string;
    descriptionFile: string;
    userId?: any;
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
    files: string[]
}