export interface PersonalInformation{
    contractorPersonalInformation: ContractorPersonalInformation;
    academicInformation: AcademicInformation[];
    emptityHealth: EmptityHealth[];
}
export interface ContractorPersonalInformation{
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
}

export interface AcademicInformation{
    academicInformationtype: string;
    institution: string;
    collegeDegree: string;
    contractor: string;
}

export interface EmptityHealth{
    contractor: string;
    emptitytype: string;
    emptity: string;
}


