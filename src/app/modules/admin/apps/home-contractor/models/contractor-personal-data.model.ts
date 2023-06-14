export interface ContractorPersonalInformation{
    id: string;
    identificacion: string;
    lugarExpedicion: string;
    telefono: string;
    academicInformation: AcademicInformation[];
    genero: string;
    fechaNacimiento: Date;
    nacionalidad: string;
    direccion: string;
    departamento: string;
    municipio: string;
    barrio: string;
    celular: string;
    eps: string;
    arl: string;
    afp: string;
    cuentaBancaria: string;
    tipoCuenta: string;
    entidadCuentaBancaria: string;
    fechaActualizacion: Date;
}

export interface AcademicInformation{
    type: string;
    Institution: string;
    collegeDegree: string;
}
