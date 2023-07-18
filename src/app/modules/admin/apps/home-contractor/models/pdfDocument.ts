export interface ExecutionReport{
    contractorName: string;
    contractorIdentification: string;
    contractNumber: string;
    elementObject: string;
    totalValue: string;
    contractInitialDate: Date;
    contractFinalDate: Date;
    supervisorContract: string;
    periodExecutedInitialDate: string;
    periodExecutedFinalDate: string;
    specificObligations: string;
    totalValuePeriod: string;
}

export interface ChargeAccount{
    contractorName: string;
    contractorIdentification: string;
    expeditionIdentification: string;
    phoneNumber: string;
    contractNumber: string;
    direction: string;
    elementName: string;
    totalValue: string;
    periodExecutedInitialDate: string;
    periodExecutedFinalDate: string;
    accountNumber: string;
    bankingEntity: string;
    accountType: string;
    contractName: string;
    chargeAccountNumber: string
}
