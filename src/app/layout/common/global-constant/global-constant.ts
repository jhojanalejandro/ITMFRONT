import { TypeSelectBool, TypeSelectString } from "../models/TypeSelect";

export class GlobalConst {
    public static encryptSecretKey = '576cf17b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae451f5a65ed1' 

    public static roles = [
        {
            label      : 'ADMIN',
            value      : 'ADM',
            description: 'Administrador de la cuenta'
        },
        {
            label      : 'SUPERVISOR',
            value      : 'SPV',
            description: 'jefe de personal.'
        },
        {
            label      : 'CONTRACTUAL',
            value      : 'CTL',
            description: 'Solo puede leer y escribir'
        },
        {
            label      : 'PLANEACIÓN',
            value      : 'PLNC',
            description: 'Solo puede leer y escribir'
        },
        {
            label      : 'COMITE',
            value      : 'CMT',
            description: 'Solo puede leer datos.'
        },
        {
            label      : 'JURIDICO',
            value      : 'JURD',
            description: 'Solo puede leer datos.'
        },
        {
            label      : 'DESACTIVADO',
            value      : 'DTV',
            description: 'Solo puede leer datos.'
        },

    ];

    public static nomina: TypeSelectString[]=[
        { viewValue: 'pago efectivo'},
        { viewValue: 'no pagado'}, 
    ] 

    public static requierePoliza: TypeSelectString[]=[
        { viewValue: 'Si'},
        { viewValue: 'No'}, 
    ] 

    public static tipoModificacion: TypeSelectString[]=[
        { viewValue: 'Adición'},
        { viewValue: 'Ampliación'}, 
        { viewValue: 'Modificación'},
        { viewValue: 'Adición y Ampliación'},
        { viewValue: 'Adición, Ampliación, Modificacion'},
        { viewValue: 'Ampliación y Modificacion'},
        { viewValue: 'Adición y Modificacion'},
    ] 
    
    public static editarData: TypeSelectString[]=[
        { viewValue: 'Solo Editar'},
        { viewValue: 'Agregar Modificación'}, 
    ] 

    public static Nivel: TypeSelectString[]=[
        { viewValue: '1'},
        { viewValue: '2'}, 
        { viewValue: '3'}, 
        { viewValue: '4'}, 
        { viewValue: '5'}, 

    ] 


    public static tipoCarpeta: TypeSelectString[]=[
        { viewValue: 'Cargar a gmas'},
        { viewValue: 'Carpeta pagos'}, 
        { viewValue: 'Archivos adicionales'}, 
    ] 

    public static nivelSeguridad: TypeSelectString[]=[
        { viewValue: '1'},
        { viewValue: '2'}, 
        { viewValue: '3'}, 
        { viewValue: '4'}
    ] 

    public static profesional: TypeSelectString[]=[
        { viewValue: 'Contractual'},
        { viewValue: 'Supervisor'}, 
        { viewValue: 'Nomina'}, 
        { viewValue: 'Planeación'}, 
        { viewValue: 'Juridico'}, 
        { viewValue: 'Comite'}, 
    ] 
    public static TipoUsuario: TypeSelectString[]=[
        { viewValue: 'Contractual'},
        { viewValue: 'Contratista'}, 
    ] 


    public static tipoNovedad: TypeSelectString[]=[
        { viewValue: 'Despido'},
        { viewValue: 'Renuncia'}, 
        { viewValue: 'Cancelado'}, 
        { viewValue: 'No contratado'}, 
    ] 
    
}