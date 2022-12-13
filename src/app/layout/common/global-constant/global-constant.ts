import { TypeSelect, TypeSelectBool, TypeSelectString } from "../models/TypeSelect";

export class GlobalConst {
    public static encryptSecretKey = '576cf17b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae451f5a65ed1' 
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
    public static roles = [
        {
            label      : 'Admin',
            value      : 1,
            description: 'Administrador de la cuenta'
        },
        {
            label      : 'Leer, Escribir, y Eliminar',
            value      : 2,
            description: 'jefe de personal.'
        },
        {
            label      : 'Leer y Escribir',
            value      : 3,
            description: 'Solo puede leer y escribir'
        },
        {
            label      : 'inactivo',
            value      : 4,
            description: 'Solo puede leer datos.'
        }

    ];
    public static nomina: TypeSelectString[]=[
        { viewValue: 'pago efectivo'},
        { viewValue: 'no pagado'}, 
    ] 
    public static tipoCuenta: TypeSelectString[]=[
        { viewValue: 'Ahorros'},
        { viewValue: 'Corriente'}, 
    ] 

    public static tipoElemento: TypeSelectString[]=[
        { viewValue: 'Docente'},
        { viewValue: 'Suministro'},
        { viewValue: 'Corriente'}, 
    ] 
    public static requierePoliza: TypeSelectString[]=[
        { viewValue: 'Si'},
        { viewValue: 'No'}, 
    ] 

    public static Nivel: TypeSelectString[]=[
        { viewValue: '1'},
        { viewValue: '2'}, 
        { viewValue: '3'}, 
        { viewValue: '4'}, 
        { viewValue: '5'}, 

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

    public static tipoArchivo: TypeSelectString[]=[
        { viewValue: 'PDF'},
        { viewValue: 'PNG'}, 
        { viewValue: 'JPG'}, 
        { viewValue: 'DOCX'}, 
        { viewValue: 'XLSX'}, 

    ] 
    public static tipoDocumento: TypeSelectString[]=[
        { viewValue: 'Planilla'},
        { viewValue: 'Cuenta De Cobro'},
        { viewValue: 'acta'},
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

    public static ejecucionContrato: TypeSelectBool[]=[
        { value: true, viewValue: 'Ejecutar Contrato'},
        { value: false,viewValue: 'En Proceso'}, 
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

    public static estudios: TypeSelectString[]=[
        { viewValue: 'Bachiller'},
        { viewValue: 'Tecnico'}, 
        { viewValue: 'Tecnologo'}, 
        { viewValue: 'Pregrado'}, 
        { viewValue: 'Especializacion'}, 
        { viewValue: 'Maestria'}, 
        { viewValue: 'Doctorado'}, 
    ] 
    public static profesional: TypeSelectString[]=[
        { viewValue: 'Contractual'},
        { viewValue: 'Supervisor'}, 
        { viewValue: 'Nomina'}, 
        { viewValue: 'Planeación'}, 
    ] 
    public static TipoUsuario: TypeSelectString[]=[
        { viewValue: 'Contractual'},
        { viewValue: 'Contratista'}, 
    ] 

    public static Unidades(num){

        switch(num)
        {
            case 1: return 'UN';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
        }
    
        return '';
    }//Unidades()
    
    public static Decenas(num){
    
        let decena = Math.floor(num/10);
        let unidad = num - (decena * 10);
    
        switch(decena)
        {
            case 1:
                switch(unidad)
                {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + this.Unidades(unidad);
                }
            case 2:
                switch(unidad)
                {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + this.Unidades(unidad);
                }
            case 3: return this.DecenasY('TREINTA', unidad);
            case 4: return this.DecenasY('CUARENTA', unidad);
            case 5: return this.DecenasY('CINCUENTA', unidad);
            case 6: return this.DecenasY('SESENTA', unidad);
            case 7: return this.DecenasY('SETENTA', unidad);
            case 8: return this.DecenasY('OCHENTA', unidad);
            case 9: return this.DecenasY('NOVENTA', unidad);
            case 0: return this.Unidades(unidad);
        }
    }//Unidades()
    
    public static DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + this.Unidades(numUnidades)
    
        return strSin;
    }//DecenasY()
    
    public static Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);
    
        switch(centenas)
        {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + this.Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + this.Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + this.Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + this.Decenas(decenas);
            case 5: return 'QUINIENTOS ' + this.Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + this.Decenas(decenas);
            case 7: return 'SETECIENTOS ' + this.Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + this.Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + this.Decenas(decenas);
        }
    
        return this.Decenas(decenas);
    }//Centenas()
    
    public static Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)
    
        let letras = '';
    
        if (cientos > 0)
            if (cientos > 1)
                letras = this.Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;
    
        if (resto > 0)
            letras += '';
    
        return letras;
    }//Seccion()
    
    public static Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)
    
        let strMiles = this.Seccion(num, divisor, 'UN MIL', 'MIL');
        let strCentenas = this.Centenas(resto);
    
        if(strMiles == '')
            return strCentenas;
    
        return strMiles + ' ' + strCentenas;
    }//Miles()
    
    public static Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)
    
        let strMillones = this.Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
        let strMiles = this.Miles(resto);
    
        if(strMillones == '')
            return strMiles;
    
        return strMillones + ' ' + strMiles;
    }//Millones()
    
    public static numeroALetras(num, currency) {
        currency = currency || {};
        let data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural || 'PESOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
            letrasMonedaSingular: currency.singular || 'PESO', //'PESO', 'Dólar', 'Bolivar', 'etc'
            letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVOS',
            letrasMonedaCentavoSingular: currency.centSingular || 'COLOMBIANOS'
        };
    
        if (data.centavos > 0) {
            let centavos = ''
            if (data.centavos == 1)
                centavos = this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
            else
                centavos =  this.Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
            data.letrasCentavos = 'CON ' + centavos
        };
    
        if(data.enteros == 0)
            return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        if (data.enteros == 1)
            return this.Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
        else
            return this.Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    };
    
}