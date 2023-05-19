export interface IFolderContractor{
    id?: any;
    userId: string;
    contractorId: string;
    contractId: string;
    folderName: string;
    descriptionProject: string;
    registerDate: Date;
    modifyDate: Date;
    typeFolder: string;
}

export interface FolderContract{
    id?: any;
    userId: string;
    contractId: string;
    folderName: string;
    descriptionProject: string;
    registerDate: Date;
    modifyDate: Date;
    typeFolder: string;
}