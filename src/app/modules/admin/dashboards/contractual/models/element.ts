export interface IElements{
    id?: any;
    nombreElemento: string;
    idComponente: string;
    cantidadContratistas: number;
    cantidadDias: number;
    valorUnidad: number;
    valorTotal: number;
    valorPorDia: number;
    cpc: string;
    nombreCpc: string;
    adicion: boolean;
    tipoElemento: string;
    recursos: number; 
}



export interface Componente{
    id: any;
    nombreComponente: string;
    IdContrato: number;
}