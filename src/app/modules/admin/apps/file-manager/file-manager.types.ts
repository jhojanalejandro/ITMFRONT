export interface ItemsContract
{
    contractName: string;
    folders: FolderContractor[];
    folderContract?: FolderContract[];
    path: any[];
}

export interface ItemsContractor
{
    folders: FolderContractor[];
    folderContract?: FolderContract[];
    path: any[];
}

export interface Item
{
    folders: FolderContract[];
    path: any[];
}


export interface DataFile
{
    id?: string;
    documentType?: string;
    descriptionFile: string;
    registerDate: Date;
    filesName?: string;
    filedata?: string;
    size?: string;
    type?: string;
    fileType?: string | null;
    statusFile: string;
    documentTypeCode: string;
    documentTypes: string;
    disable?: boolean;
    folderName: string;
}

export interface FolderContractor
{
    id?: string;
    folderName: string;
    registerDate: string;
    modifyDate: string;
    folderDescription: string
    consutive: string;
    descriptionProject: string;
    contractorName: string;
    contractorIdentification: string;
}

export interface FolderContract
{
    id?: string;
    companyName: string;
    projectName: string;
    projectNumber: string;
}