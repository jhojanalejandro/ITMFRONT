import { FileContractor } from "app/layout/common/models/file-contractor";

export interface PorcentageModel{
    Id: string;
    percentageValue: number;
    code: string;
}
export interface PaymentSecurity{
    id?: string;
    contractorPayments: string;
    observation: string;
    paymentPension: string;
    paymentArl: string,
    paymentEps: string;
    registerDate: Date;
    payrollNumber: string;
    consecutive: number;
    paymentPeriodDate: string;
    verifySheet: boolean;
    correctAfpPayment: boolean;
    correctArlPayment: boolean;
    correctEpsPayment: boolean;
    correctSheet: boolean;
    contractorFile: FileContractor
}

export interface VerifySheet{
    correctDate: boolean;
    correctNumberSheet: boolean;
    correctIdentification: boolean;
    correctAfpPayment: boolean;
    correctArlPayment: boolean;
    correctEpsPayment: boolean;
    correctSheet: boolean;
    verifySheet: boolean;
}
