import { TypeSelect, TypeSelectString } from "../models/TypeSelect";

export class GlobalCont {
    public static nacionalidad: TypeSelectString[]=[
        { viewValue: 'colombiano'},
        { viewValue: 'venezolano'}, 
        { viewValue: 'chileno'},
        { viewValue: 'brasileño'},
        { viewValue: 'español'},
        { viewValue: 'estadounidense'},
        { viewValue: 'francés'},
        { viewValue: 'paraguayo'},
        { viewValue: 'peruano'},
        { viewValue: 'dominicano'},
        { viewValue: 'Argentino'},
        { viewValue: 'mexicano'},
        { viewValue: 'ecuatoriano'},
        { viewValue: 'panameño'},
    ] 
    public static genero: TypeSelectString[]=[
        { viewValue: 'masculino'},
        { viewValue: 'femanino'}, 
    ] 

    public static tipoCuenta: TypeSelectString[]=[
        { viewValue: 'Ahorros'},
        { viewValue: 'Corriente'}, 
    ] 

    public static entidadesB: TypeSelectString[]=[
        { viewValue: 'Bancolombia'},
        { viewValue: 'Banco caja social'}, 
        { viewValue: 'Banco de bogota'}, 
        { viewValue: 'Davivienda'}, 
        { viewValue: 'BBVA'}, 
        { viewValue: 'Banco de Occidente'}, 
        { viewValue: 'Banco Itaú'}, 
        { viewValue: 'Banco Popular'}, 
        { viewValue: 'Banco AV Villas'}
    ] 

    public static comunas: TypeSelectString[]=[
        { viewValue: '1'},
        { viewValue: '2'}, 
        { viewValue: '3'}, 
        { viewValue: '4'}, 
        { viewValue: '5'}, 
        { viewValue: '6'}, 
        { viewValue: '7'}, 
        { viewValue: '8'}, 
        { viewValue: '9'}, 
        { viewValue: '10'}, 
        { viewValue: '11'}, 
        { viewValue: '12'}, 
        { viewValue: '13'}, 
        { viewValue: '14'}, 
        { viewValue: '15'}, 
        { viewValue: '16'}, 
        { viewValue: '17'}, 
        { viewValue: '18'}, 
        { viewValue: '19'}, 
        { viewValue: '20'}, 
    ] 

    public static nivelSeguridad: TypeSelectString[]=[
        { viewValue: '1'},
        { viewValue: '2'}, 
        { viewValue: '3'}, 
        { viewValue: '4'}
    ] 

    public static eps: TypeSelectString[]=[
        { viewValue: 'SURA E.P.S.'},
        { viewValue: 'SALUD TOTAL S.A.  E.P.S.'},
        { viewValue: 'SALUDVIDA S.A. E.P.S'}, 
        { viewValue: 'SAVIA SALUD EPS'}, 
        { viewValue: 'CAPRESOCA  EPS'}, 
        { viewValue: 'COMFENALCO  VALLE  E.P.S.'}, 
        { viewValue: 'COMPENSAR   E.P.S.'}, 
        { viewValue: 'E.P.S.  SANITAS  S.A.'}, 
        { viewValue: 'EPS  CONVIDA'}, 
        { viewValue: 'NUEVA EPS S.A.'}, 
        { viewValue: 'FUNDACIÓN SALUD MIA EPS'}, 
        { viewValue: 'EPS Y MEDICINA PREPAGADA SURAMERICANA S.A'}
    ] 

    public static pensiones: TypeSelectString[]=[
        { viewValue: 'Colfondos'},
        { viewValue: 'Porvenir'}, 
        { viewValue: 'Protección'}, 
        { viewValue: 'Skandia'}, 
        { viewValue: 'Colpensiones'}, 
    ] 

    public static arl: TypeSelectString[]=[
        { viewValue: 'Sura'},
        { viewValue: 'Positiva'}, 
        { viewValue: 'Axa Colpatria'}, 
        { viewValue: 'Colmena'}, 
        { viewValue: 'Bolívar'}, 
        { viewValue: 'La Equidad'}, 
        { viewValue: 'mapfre seguros'}, 
    ] 
}