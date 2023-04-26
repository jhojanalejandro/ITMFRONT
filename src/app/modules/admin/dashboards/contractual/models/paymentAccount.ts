export interface PaymentAccount{
    id?: string;
	tipoContratacion: string,
	codigo: string,
	convenio: string,
	nombre: string,
	identificacion: string,
	direccion: string,
	departamento: string,
	municipio?: string,
	barrio?: string,
	telefono: string,
	celular: string,
	correo: string,
	tipoAdministradora?: string,
	administradora?: string,
	cuentaBancaria: string,
	tipoCuenta: string,
	entidadCuentaBancaria: string,
	estado?: string,
	userId?: string,
	contractId?: number,
	componenteId?: number,
	elementId?: number,
	objetoConvenio?: string,
	paymentcant: any;
	company: string;
	from: Date;
	to: Date;
    nombreElemento: string;
    lugarExpedicion: string;
}