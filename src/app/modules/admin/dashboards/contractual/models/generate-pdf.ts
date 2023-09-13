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

export interface CommiteeRequestContractor{
    contractObject: string;
    contractNumber: string;
    registerDate: Date;
    contractName: string;
    commiteeRequestDto: CommitteeRequest[],
    personalInCharge: PersonalInCharge[]
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


export interface PreviusStudyContractors{
    previusStudyDto: PreviusStudyContractorsList[],
    personalInCharge: PersonalInCharge[]
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