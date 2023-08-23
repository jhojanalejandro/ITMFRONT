export interface OtherMinute{
    id: string;
    contractId: string;
    contractorId: string;
	contractorName: string;
    contractorIdentification: string;
	contractorExpeditionPlace: string;
    totalValueContract: any;
    initialDateContract: Date;
    finalDateContract: Date;
    initialDateContractExtension: Date;
    finalDateContractExtension: Date;
    object: string;
    supervisor: string;
    supervisorIdentification: string
    consecutive: number;
    contractNumber: string;
    supervisorCharge: string;
    companyName: string;
    additionValue: any;
    registerDateContract: Date;
    rubroContract: any;
    unitValueContract: any;
    numberModify: number;
    specificObligations: any;
    generalObligations: any;
    typeModify: string;
}

export interface CommitteeRequest{
    id: string;
    contractorId: string;
	contractorName: string;
    contractorIdentification: string;
    contractInitialDate: Date;
    contractFinalDate: Date;
    contractNumber: string;
    elementObject: string;
    elementName: string;
    user: string;
    userIdentification: string;
    totalValue: any;
    userFirm: string;
    profileRequire: string;
}


export interface PreviusStudy{
    id: string;
    contractId: string;
    contractorId: string;
	contractorName: string;
    contractorIdentification: string;
    contractInitialDate: Date;
    contractFinalDate: Date;
    specificObligations: any;
    generalObligations: any;
    userIdentification: string;
    contractNumber: string;
    supervisorIdentification: string;
    supervisorFirm: string;
    supervisorItmName: string;
    elementObject: string;
    elementName: string;
    user: string;
    juridic: string;
    juridicFirm: string;
    totalValue: any;
    userFirm: string;
    userCharge: string;
    supervisorCharge: string;
    userFirmType: string;
    supervisorFirmType: string;
    juridicFirmType: string;
    requiredProfile: string;
}

export interface MinutePdf{
    contractId: string;
    contractorId: string;
	contractorName: string;
    contractorIdentification: string;
	contractorExpeditionPlace: string;
    totalValueContract: any;
    initialDateContract: Date;
    finalDateContract: Date;
    elementObject: string;
    supervisor: string;
    supervisorIdentification: string
    contractNumber: string;
    supervisorCharge: string;
    companyName: string;
    contrato: any;
    registerDateContract: Date;
    rubroContract: any;
    unitValueContract: any;
    numberModify: number;
    specificObligations: any;
    generalObligations: any;
    contractorMail: string;
    comiteGenerated: boolean;
    previusStudy: boolean;
}