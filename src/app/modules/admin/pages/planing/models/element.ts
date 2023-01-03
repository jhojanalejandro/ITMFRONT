export interface IElements{
    id?: any;
    nombreElemento: string;
    idComponente: string;
    cantidadContratistas: number;
    cantidadDias: number;
    valorUnidad: number;
    valorTotal: number;
    valorPorDia: number;
    valorTotalContratista: number;
    valorPorDiaContratista: number;
    cpc: string;
    nombreCpc: string;
    modificacion: boolean;
    tipoElemento: string;
    recursos: number; 
    consecutivo: string;
    obligacionesEspecificas: string;
    obligacionesGenerales: string;
}




export interface Componente{
    id: any;
    nombreComponente: string;
    IdContrato: number;
}