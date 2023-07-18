
export interface AssignmentUser{
    contractId: string;
    id?: string;
    userId: string; 
	assignmentType: string;  
    rollId: string;  
}

export interface AssignmentType{
    id?: string;
    assigmentTypeDescription: string[];
    code: string; 
}
