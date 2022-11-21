export interface EconomicChart
{
    id: any;
    companyName?: string;
    projectName: string;
    descriptionProject?: string;
    registerDate?: Date;
    ModifyDate: Date;
    execution?: boolean    ;
    consecutivo?: string;
    ValorTotal: number;
    active: boolean;
}

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
export interface Components
{
    id: any;
    cantDay: number;
    componentName: string;
    contractorCant: number;
    totalValue: number;
    unitValue: number;
    listElements: any[];
}
export interface InventoryCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}



