export interface PersonalInformation {
    contractorPersonalInformation: ContractorPersonalInformation;
    academicInformation: AcademicInformation[];
}
export interface ContractorPersonalInformation {
    id: string;
    identificacion: string;
    lugarExpedicion: string;
    telefono: string;
    genero: string;
    fechaNacimiento: Date;
    nacionalidad: string;
    direccion: string;
    departamento: string;
    municipio: string;
    barrio: string;
    celular: string;
    cuentaBancaria: string;
    tipoCuenta: string;
    entidadCuentaBancaria: string;
    fechaActualizacion: Date;
    eps: string;
    arl: string;
    afp: string;
}

export interface AcademicInformation {
    academicInformationtype: string;
    institution: string;
    collegeDegree: string;
    contractor: string;
}
