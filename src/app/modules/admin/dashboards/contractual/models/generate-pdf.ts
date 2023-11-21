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
    consecutive: number;
    contractNumber: string;
    companyName: string;
    additionValue: any;
    registerDateContract: Date;
    rubroContract: any;
    unitValueContract: any;
    numberModify: number;
    specificObligations: any;
    generalObligations: any;
    typeModify: string;
    initialValue: any;
}

export interface ResponseContractorPdf<T>{
    dataContract: DataContract;
    getDataContractors: T[];
    personalInCharge: PersonalInCharge[];
}

export interface CommitteeRequest{
    id: string;
    contractorId: string;
	contractorName: string;
    contractorIdentification: string;
    contractInitialDate: Date;
    contractFinalDate: Date;
    elementName: string;
    userIdentification: string;
    totalValue: any;
    profileRequire: string;
}

export interface DataContract{
    contractObject: string;
    contractNumber: string;
    registerDate: Date;
    companyName: string;
    projectName: string;
    rubro: string;
    rubroName: string;
    rubroOrigin: string;

}

export interface PreviusStudyContractorsList{
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
    elementObject: string;
    elementName: string;
    totalValue: any;
    requiredProfileAcademic: string;
    requiredProfileExperience: string;
    activityContractor: string;
    dutyContract: string;
    policeRequire: boolean;
}

export interface PersonalInCharge{
    userName: string;
    userCharge: string;
    userIdentification: string;
    userFirmType: string;
    userFirm: string;
    userChargeCode: string;
}


export interface MinutePdf{
    contractId: string;
    contractorId: string;
	contractorName: string;
    contractorIdentification: string;
	contractorExpeditionPlace: string;
    totalValueContract: any;
    initialDateContract: Date;
    finalContractDate: Date;
    elementObject: string;
    contractNumber: string;
    companyName: string;
    registerDateContract: Date;
    rubroContract: any;
    unitValueContract: any;
    numberModify: number;
    specificObligations: any;
    generalObligations: any;
    contractorMail: string;
    comiteGenerated: boolean;
    previusStudy: boolean;
    requirePolice: boolean;
}