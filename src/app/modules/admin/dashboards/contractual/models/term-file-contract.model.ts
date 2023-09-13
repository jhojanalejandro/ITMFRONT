export interface TermContract{
    id?: string;
    termDate: Date | null;
    startDate?: Date | null; 
	termType: string;  
    detailContractor?: string;
    contractorId: string;
    contractId: string;

}