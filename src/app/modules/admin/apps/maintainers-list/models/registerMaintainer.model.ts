export interface RubroType{
	id?: string
	rubro: string
    rubroNumber: string;
	rubroOrigin?: string;
	type: string;
}
export interface CpcType{
	id?: string;
	cpcNumber: string
    cpcName: string;
	type: string;
}

export interface Bank{
	id?: string;
	bankName: string;
	type: string;
}