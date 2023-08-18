export interface MinuteExtension{
    contractId: string;
    contractorId: string;
	contractorName: string;
    contractorIdentification: string;
	contractorExpeditionPlace: string;
    totalValueContract: string;
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
}