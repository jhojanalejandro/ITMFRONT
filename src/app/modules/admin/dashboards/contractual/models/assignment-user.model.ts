
export interface AssignmentUser{
    contractId: string;
    id?: string;
    userId: string; 
	assignmentType: string;  
}

export interface AssignmentType{
    id?: string;
    assigmentTypeDescription: string[];
    code: string; 
}
