export interface ItemsContract
{
    folders: FolderContractor[];
    folderContract?: FoldersByContract[];
    path: any[];
}

export interface ItemsContractor
{
    folders: FolderContractor[];
    folderContract?: FoldersByContract[];
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
}

export interface FolderContractor
{
    id?: string;
    Nombre: string;
    Identificacion: string;
    type: string;
}

export interface FolderContract
{
    id?: string;
    nombreEmpresa: string;
    nombreProyecto: string;
    numeroContrato: string;
}

export interface FoldersByContract
{
    id?: string;
    nombreEmpresa: string;
    nombreProyecto: string;
    numeroContrato: string;
}
