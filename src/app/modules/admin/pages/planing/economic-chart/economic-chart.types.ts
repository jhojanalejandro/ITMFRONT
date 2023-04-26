
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



