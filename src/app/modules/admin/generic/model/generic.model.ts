export interface CpcType{
    id?: string;
    cpcNumber: string,
    cpcName: string;
}

export interface StatusContract{
    id?: string;
    statusContractDescription: string,
    code: string;
}
export interface ElementType{
    id?: string;
    elementType: string,
    code: string;
}
export interface RubroType{
    id: string;
    rubro: string,
    rubroNumber: string;
    rubroOrigin: string;

}