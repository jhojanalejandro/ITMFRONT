export interface ContractorPayments{
    id?: any;
    userId: string;
    contractorId: String;
    contractId: String;
    cashPayment: boolean;
    monthPayment: any;
    paymentcant: any;
    fromDate: any;
    toDate: any;
    descriptionPayment: string
    registerDate: Date;
    consecutive: number;
    levelRisk?: string;
}
