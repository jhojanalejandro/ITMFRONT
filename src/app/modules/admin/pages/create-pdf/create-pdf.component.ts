import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContractContractors } from '../../dashboards/contractual/models/contract-contractors';
import { Minuta } from '../../dashboards/contractual/models/minuta';
import { ContractorService } from '../../dashboards/contractual/service/contractor.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { IElements } from '../planing/models/element';
@Component({
    selector: 'app-create-pdf',
    templateUrl: './create-pdf.component.html',
    styleUrls: ['./create-pdf.component.scss'],
})
export class CreatePdfComponent implements OnInit {
    //@ViewChild('pdfTable') pdfTable: ElementRef;
    @Input('contractContractors') contractContractors: ContractContractors = { contractId: null, contractors: [null] };
    dataContractors: any[] = [];

    cedula: string = '1000189631';
    nombre: string = 'jhojan alejandro hernandez yepes';
    direccion: string = 'Carrera 31 calle 107 -98 int 107';
    telefono: string = '3003853164';
    contrato: string = '234';
    convenio: string = 'convenio'
    lugarExpedicion: string = 'Medellin';
    obligaciones: string = '1. Apoyo en la gestión de procesos administrativos y logísticos. -> 2. Apoyo en la creación de espacio web para repositorio en la web del Instituto Tecnógico Metrolitano. -> 3. Apoyo en la creación de macros para informes y combinación de documentos.';

    num: string;
    digits: string[];
    listaData: any[] = [];
    realDigits: string[]
    data: any[] = [];
    fechaInicio: Date = new Date();
    constructor(private _economicService: ContractorService, private datepipe: DatePipe) { }

    ngOnInit(): void {
        this.num = this.obligaciones;
        this.digits = this.num.split('->');
        this.getHiringData();
    }

    // public downloadAsPDFs() {
    //     //const pdfTable = this.pdfTable.nativeElement;
    //     //var html = htmlToPdfmake(pdfTable.innerHTML);
    //     for (let index = 0; index < this.listaObligaciones.length; index++) {
    //         this.listaData[index] = [ [
    //             {
    //                 text: this.listaObligaciones[index].obligacionesEspecificas,
    //             },
    //             {
    //                 text: '',
    //                 alignment: 'center',
    //             },
    //             {
    //                 text: 'Correos electrónicos',
    //                 alignment: 'center',
    //             }
    //         ]

    //         ]
    //     }
    //     console.log(this.listaData);

    //     const documentDefinition = {
    //         content: [
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*', '*'],
    //                     body: [
    //                         [
    //                             {
    //                                 colSpan: 2,
    //                                 text: 'INFORME DE EJECUCIÓN MENSUAL OFICINA UNIDAD ESTRATEGICA DE NEGOCIOS ITM',
    //                                 style: 'tableHeader',
    //                                 alignment: 'center',
    //                             },
    //                             {
    //                                 text: '',
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'NOMBRE DEL CONTRATISTA',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: this.nombre,
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'NÚMERO DEL CONTRATO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: this.contrato,
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'FECHA DE INICIO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: new Date(),
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'PLAZO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: '3 MESES Y VEINTICINCO DÍAS',
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'OBJETO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: ['Prestación de servicios como contratista',
    //                                     'independiente, sin vínculo laboral por su propia cuenta',
    //                                     'y riesgo para realizar la gestión de Apoyo asistencial',
    //                                     'de logística y procesos administrativos en ejecución',
    //                                     'del Contrato Interadministrativo No. 4600094924 de',
    //                                     '2022, celebrado entre el Distrito Especial de Ciencia',
    //                                     'Tecnología e Innovación de Medellín y el',
    //                                     'Departamento Administrativo de Planeación']
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'VALOR DEL CONTRATO',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: '3 MESES Y VEINTICINCO DÍAS',
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'SUPERVISOR ITM',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: 'DIEGO ALEJANDRO MARÍN CIFUENTES',
    //                             }
    //                         ],
    //                     ],
    //                 },
    //             },
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*', '*', '*'],
    //                     body: [
    //                         [
    //                             {
    //                                 text: 'OBLIGACIONES ESPECIFICAS SEGÚN CONTRATO',
    //                                 alignment: 'center',
    //                                 style: 'tableHeader',

    //                             },
    //                             {
    //                                 text: 'EJECUCION O DESARROLLO DE LAS OBLIGACIONES ESPECIFICAS SEGÚN CONTRATO',
    //                                 alignment: 'center',
    //                                 style: 'tableHeader',
    //                             },
    //                             {
    //                                 text: 'EVIDENCIAS DE LAS OBLIGACIONES CENTRALES DEL CONTRATO',
    //                                 alignment: 'center',
    //                                 style: 'tableHeader',
    //                             },
    //                         ],
    //                         this.listaData,


    //                     ],
    //                 },
    //             },
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*'],
    //                     body: [
    //                         [
    //                             {
    //                                 rowSpan: 12,
    //                                 text: 'OBSERVACIONES (En caso de tenerlas)',
    //                                 alignment: 'center',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                     ],
    //                 },
    //             },
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*'],
    //                     body: [
    //                         [
    //                             {
    //                                 rowSpan: 12,
    //                                 text: 'DIFICULTADES (En caso de tenerlas)',
    //                                 alignment: 'center',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                         [
    //                             {
    //                                 text: '',
    //                             },
    //                         ],
    //                     ],
    //                 },
    //             },
    //             { text: '\n\n PERIODO EJECUTADO: \t\t\t del 29 de agosto al 30 de agosto: ' },
    //             { text: '\n\n VALOR DEL PERIODO A COBRAR: \t\t\t VALOR'},
    //             { text: '\n\n Para constancia se firma en Medellín a los 23 días del mes de septiembre del año 2022'},
    //             {text: '\n\n' },{canvas: [{ type: 'line', x1: 0, y1: 1, x2: 350-2*40, y2: 1, lineWidth: 1, margin: [5,0] }]} ,
    //             {text:  ' JHOJAN ALEJANDRO HERNANDEZ YEPES\n' }, 
    //             {text: 'CEDULA N: \t' + '\n'},
    //             {text: 'Contratista ITM' }

    //         ],
    //         styles: {
    //             header: {
    //                 fontSize: 18,
    //                 bold: true,
    //                 margin: [0, 0, 0, 10],
    //             },
    //             subheader: {
    //                 fontSize: 16,
    //                 bold: true,
    //                 margin: [0, 10, 0, 5],
    //             },
    //             tableHeader: {
    //                 bold: true,
    //                 fontSize: 13,
    //                 color: 'black',
    //                 align: 'center',
    //                 margin: [0, 0, 10, 10],
    //             },
    //             tableExample: {
    //                 margin: [0, 5, 0, 15],
    //             },
    //             title: {
    //                 bold: true,
    //                 fontSize: 13,
    //                 color: 'black',
    //                 alignment: 'center',
    //                 margin: [0, 10, 0, 0],
    //             },
    //         },
    //         defaultStyle: {
    //             // alignment: 'justify'
    //         },
    //     };
    //     let test = pdfMake
    //         .createPdf(documentDefinition)
    //         .download('Filenames.pdf');
    //     console.log(test);
    // }

    // public downloadAsPDFsActaSupervision() {
    //     //var html = htmlToPdfmake(pdfTable.innerHTML);
    //     for (let index = 0; index < this.digits.length; index++) {
    //         this.listaData[index] = [[
    //             {
    //                 text: this.digits[index],
    //             },
    //             {
    //                 text: '',
    //                 alignment: 'center',
    //             },
    //             {
    //                 text: 'Correos electrónicos',
    //                 alignment: 'center',
    //             }
    //         ]

    //         ]
    //     }
    //     console.log(this.listaData);

    //     const documentDefinition = {
    //         header: {
    //             columns: [
    //                 {
    //                     image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABACAMAAABvJxYMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUAAAAMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVv////Mb2P8AAAA/XRSTlMAAAIBAyF5qY0jBBEiOE9lipiip6uo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',
    //                     height: 50,
    //                     width: 150,
    //                     margin: [50, 0]
    //                     // alignment: 'center'
    //                 },
    //             ],
    //         },
    //         content: [
    //             {
    //                 text: '\n\nCONTRATO DE PRESTACIÓN DE SERVICIOS P-6240 DE 2022',
    //                 style: 'header',
    //                 alignment: 'center',
    //             },
    //             'Entre los suscritos, de una parte, ALEJANDRO HOYOS MONTOYA con c.c. 3.413.859, actuando en calidad de Jefe de Oficina- Asesora Jurídica del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 del 10 de septiembre del 2020 por medio de la cual se delegan funciones en materia de contratación, en el marco de la ley 80 de 1993, leyes modificatorias y decretos',
    //             'reglamentarios del INSTITUTO TECNOLÓGICO METROPOLITANO – INSTITUCIÓN UNIVERSITARIA, adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7, debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, previa adjudicación del Rector del ITM, que en adelante se denominará INSTITUTO y de otra parte DANIELA DIAZ CALLE mayor de edad, identificado (a) con Cédula de Ciudadanía 1152690770 de MEDELLIN que en adelante se denominará el CONTRATISTA, se ha convenido celebrar el presente contrato, que se regirá por las siguientes cláusulas: PRIMERA. -OBJETO DEL CONTRATO. Prestación de servicios como contratista independiente, sin vínculo laboral por su propia cuenta y riesgo para realizar la gestion de Profesional para realizar el seguimiento, análisis y evaluación a la Inversión Pública en ejecución del Contrato Interadministrativo No.4600095169 DE 2022, celebrado entre EL DISTRITO ESPECIAL DE CIENCIA',
    //             'TECNOLOGÍA E INNOVACIÓN DE MEDELLÍN – DEPARTAMENTO ADMINISTRATIVO DE PLANEACIÓN y el ITM. SEGUNDA. - DURACIÓN DEL CONTRATO. El presente contrato tendrá una duración de 03 MESES y 17 DIAS sin exceder la vigencia 2022, contados a partir de la suscripción del acta de inicio- la que se firmará una vez sea legalizado. PARAGRAFO El presente contrato está sujeto a la ejecución del contrato interadministrativo No. 4600095169 DE 2022 . No tendrá lugar a la liquidación conforme al Artículo 60 ley 80 de 1993 modificado por el artículo',
    //             '217 decreto 019 del 2012. TERCERA. - VALOR DEL CONTRATO Y FORMA DE PAGO. El valor del presente contrato se fija en la suma de Veintiún millones ochocientos quince mil cuatrocientos veintidós pesos m.l ($ 21815422) El I.T.M. cancelará al CONTRATISTA, pagos parciales correspondientes a la entrega del informe en donde conste el cumplimiento de las actividades correspondientes a la prestacion del servicio. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARAGRAFO: En el evento en que el contratista no cumpla con las actividades correspondientes y/o el lleno de la totalidad de los requisitos establecidos para el pago de los honorarios (cuenta de cobro, declaración juramentada, informe de gestion y pago de la seguridad social) en las fechas establecidas según el cronograma de pagos, el pago de honorarios correspondiente a dicho periodo se acumularan para el periodo inmediatamente siguiente. CUARTA. -OBLIGACIONES DEL CONTRATISTA. EL CONTRATISTA se obliga en forma especial a prestar el servicio objeto de este contrato en los',
    //             'términos señalados y específicamente a cumplir las siguientes OBLIGACIONES GENERALES: 1) Presentar el informe de gestión de manera mensual al ITM de las actividades realizadas con el visto bueno requerido. 2) Presentar el Informe final de las actividades realizadas durante la ejecución del contrato. 3) EL CONTRATISTA acepta que la propiedad intelectual sobre los estudios, documentos y en general los productos resultantes de la ejecución del presente contrato, quedará a cargo del Distrito Especial de Ciencia, Tecnología e Innovación de Medellín. 4) Concertar la presencialidad requerida. 5) Observar e implementar las directrices institucionales sobre la administración de documentos. 6) Cumplir a cabalidad con el objeto contractual, en la forma y plazo establecido en el mismo, y con las especificaciones técnicas señaladas en los estudios previos. 7)',
    //             'Cumplir con la prestación del servicio requerido en el sitio acordado con el supervisor del contrato, según las especificaciones técnicas indicadas en los estudios previos. 8) Acatar las recomendaciones del supervisor, como enlace directo entre el ITM y el Contratista. 9) Presentar las facturas o cuentas de cobro correspondientes a las actividades realizadas durante la ejecución del contrato. 10) Abstenerse de presentar la factura o cuenta de cobro por encima del presupuesto disponible, de acuerdo con el valor del P-6240 DE 2022 contrato. 11) Garantizar la prestación del servicio según las condiciones previamente estipuladas entre el contratista y el supervisor. 12) Informar por escrito al supervisor, las quejas, dudas, reclamos y demás inquietudes que puedan surgir en el desarrollo del objeto contractual. 13) Atender los requerimientos que sean formulados por el supervisor y para efectos de ejecutar en debida forma el contrato. 14) Toda comunicación entre el ITM y el contratista deberá',
    //             'constar por escrito con copia al supervisor del contrato. 15) Informar por escrito y en forma oportuna al ITM, los impedimentos para el cumplimiento del objeto contractual, referente a las obligaciones específicas. 16) DEBER DE CONFIDENCIALIDAD": El DistritoEspecial de Ciencia, Tecnología e Innovación de Medellín es el propietario de la información y las bases de datos actualizadas, documentadas y depuradas que el contratista recolecte durante el desarrollo del objeto contractual, en tal sentido le asiste al contratista el deber de confidencialidad, comprometiéndose a hacer uso debido de la información que conoce y a retornarla alDistrito Especial de Ciencia, Tecnología e Innovación de Medellín al terminar su vínculo',
    //             'contractual. Así mismo no podrá utilizar información para beneficio propio o de terceros. El contratista se compromete a garantizar la reserva de la información económica, financiera y tributaria que se le suministre para el desarrollo del objeto contractual. 17) Se obliga a responder civil y penalmente por sus acciones y omisiones en la actuación contractual, en los términos de la Ley. 18. El contratista deberá dar cumplimiento al Decreto 1072 de 2015 que establece el Sistema de Gestión de Seguridad y Salud en el',
    //             'trabajo SG-SST en lo que aplique. 19. El contratista deberá dar cumplimiento a la norma NTC-ISO 14001 de 2015, que establece el Sistema de Gestión Ambiental SGA en lo que aplique. 20) En ejecución de sus actividades el contratista debe disponer de manera correcta los residuos que su ejecución pueda generar. 21) El contratista deberá informar al ITM, si debe realizar sus actividades por fuera del lugar en el que normalmente las ejecuta, para que la Institución informe a la ARL dicha situación. 22) Desplazarse por sus propios medios al lugar requerido para realizar las actividades contractuales inherentes al objeto contractual, haciendo uso de los elementos de identificación establecidos por el proyecto.23)Deberá cumplir con las medidas de prevención y precaución dadas por el Gobierno Nacional, Departamental y Municipales en los Decretos sancionados en relación a la pandemia que se surte hoy en el mundo llamada COVID-19; Adicionalmente y de conformidad con la normatividad expedida por el Gobierno Nacional en lo relativo al Estado de Emergencia Económica,',
    //             'Social y Ecológica, eberá, debido a la naturaleza de sus actividades, objeto contractual y desarrollo en territorio de las mismas, adoptar todas las medidas personales de prevención, precaución, higiene y distanciamiento social, en aras de evitar el posible contagio o propagación del virus, para lo cual deberá hacer uso de los elementos de protección personal, en aras de mantener las condiciones de salubridad necesarias para la prestación del servicio presencial. así mismo se acoge a lo establecido por el ITM para el desarrollo de su actividad laboral en casa cuando haya lugar a ésta. 24) Las demás inherentes al objeto del contrato. OBLIGACIONES ESPECIFICAS:1.Realizar seguimiento a la inversión pública y su evaluación respectiva a través de la identificación del cumplimiento de objetivos trazados y su grado de ejecución.2.Generar alertas y recomendaciones de la inversión pública una vez se haya identificado los objetivos y su grado de ejecución.3.Realizar informes que consoliden la',
    //             'información recolectada del seguimiento mensual y la evaluación trimestral realizada a la inversión pública.4.Recolectar información asociada a los procesos presupuestales que permita elaborar el POAI de la respectiva vigencia y distribuirlo a las dependencias de acuerdo con los criterios establecidos e identificados.5.Sugerir a las diferentes dependencias la construcción de los mecanismos de planificación que permitan un oportuno seguimiento y priorización a la inversión pública.6.Elaborar respuestas y requerimientos, tanto de entidades internas como externas, que requieran información respecto al seguimiento de la inversión pública y los proyectos del Plan de Desarrollo 2020 – 2023.ADICIONALMENTE',
    //             'debera cumplir con los siguientes productos:1.Formato de seguimiento a proyectos de inversión.2.informe de seguimiento a los proyectos de inversión.3.informes de análisis, presentación de la evaluación realizada.4.Formatos de presupuesto, presentaciones a las dependencias, POAI elaborado.5.Presentación de los resultados del análisis para las reuniones estratégicas.6.Informe que contenga reporte de respuestas elaboradas.7 El CONTRATISTA se obliga igualmente a responder civil y penalmente por sus acciones y omisiones en la actuación contractual, en los términos de la Ley (Artículos P-6240 DE 2022 52º Ley 80 de 1993). QUINTA. -DERECHOS Y DEBERES. Las partes declaran conocer y desarrollar los derechos y deberes consagrados en la Ley 80 de 1993 y cumplir las obligaciones específicas consagradas en este contrato. SEXTA. - MODIFICACIÓN, INTERPRETACIÓN Y TERMINACIÓN DEL CONTRATO. EL INSTITUTO tendrá la dirección general y la responsabilidad de ejercer control y vigilancia de la ejecución del contrato. En consecuencia, este contrato se rige por los principios de modificación unilateral, interpretación unilateral y terminación unilateral por parte del Instituto Tecnológico Metropolitano',
    //             'conforme a las disposiciones contenidas en los Artículos 14, 15, 16 y 17 de la Ley 80 de 1993 (modificado por ley 1150 de 2007), la cual para todos los efectos legales hace parte integral de este contrato. SÉPTIMA. -CADUCIDAD. EL INSTITUTO, podrá declarar la caducidad si se presentan algunos de los hechos constitutivos del incumplimiento de las obligaciones a cargo del contratista, que afecta de manera grave y directa la ejecución del contrato, y evidencie que puede conducir a su paralización. La Entidad por acto administrativo debidamente motivado lo dará por terminado y ordenará su liquidación en el estado en que se encuentre. OCTAVA. -EFECTOS DE LA CADUCIDAD. Declarada la caducidad, no habrá lugar a la indemnización para el contratista, quien se hará acreedor a las sanciones e inhabilidades previstas en la Ley 80 de 1993, y las normas que la reglamentan y adicionan, Decreto 1082 de 2015. NOVENA. -MORA O INCUMPLIMIENTO PARCIAL. En caso de mora o incumplimiento parcial de las obligaciones adquiridas por EL CONTRATISTA, de acuerdo a las cláusulas del presente contrato, podrá EL INSTITUTO, mediante',
    //             'Resolución motivada, imponer multas, las cuales deberán ser directamente proporcionales al valor del contrato y a los perjuicios que sufra EL INSTITUTO, sin exceder del cinco por mil (5 x 1.000) del valor del contrato cada vez que se impongan. DÉCIMA-CLÁUSULA PENAL PECUNIARIA. Sin perjuicio de lo dispuesto en las cláusulas anteriores, EL INSTITUTO podrá imponer al CONTRATISTA, en caso de declaratoria de caducidad o de incumplimiento como pena, una suma equivalente al diez por ciento (10%) del valor del contrato. El valor de la cláusula penal que se haga efectiva, se considera como pago parcial pero definitivo de los perjuicios causados al INSTITUTO. DECIMA PRIMERA. -DE LA APLICACIÓN DE LA MULTA Y LA CLÁUSULA PENAL PECUNIARIA. Una vez ejecutoriados los actos administrativos que la imponen podrán ser tomados dichos valores del saldo a favor del CONTRATISTA o de las garantías constituidas. Si no fuere',
    //             'posible lo anterior, se cobrará por jurisdicción coactiva. DECIMA SEGUNDA. -DEL PROCEDIMIENTO PARA LA IMPOSICION DE LA MULTA: De conformidad con lo dispuesto en el artículo 86 de la Ley 1474 de 2011, en concordancia con los artículos 29 de la Constitución Política y 17 de la Ley 1150 de 2007 reglamentado por el Decreto 1082 de 2015, el procedimiento en caso de imposición de multas, sanciones o declaratoria de incumplimiento será el previsto en el artículo 86 de la ley. DECIMA TERCERA. -CESIÓN DEL CONTRATO. Los contratos de prestación de servicios estatales son "intuitupersona" y, en consecuencia, una vez celebrados no podrán cederse, salvo los casos en que medie autorización expedida por la Rectoría de la entidad, en acto administrativo debidamente sustentado. DÉCIMA CUARTA. -TERMINACIÓN DEL CONTRATO. - El presente contrato podrá darse por terminado cuando: a) Las partes de mutuo acuerdo decidan dar',
    //             'por terminado el contrato. b) Cuando de la aplicación de las causales establecidas en la cláusula sexta, opere la terminación anticipada del contrato. c) Cuando el contratista incumpla alguna de las obligaciones contractuales contraídas, sin perjuicio de realizar el proceso de aplicación de multas y/o de la aplicación de la cláusula penal pecuniaria. d) Cuando culmine el plazo de ejecución del contrato. DÉCIMA QUINTA. -CAUSALES DE SUSPENSIÓN DEL CONTRATO El presente contrato podrá suspenderse a) cuando el contratista por cualquier causal no pueda prestar el servicio para el cual fue contratado. Esta causal incluye enfermedad general, invalidez temporal, licencia de maternidad, licencia de paternidad y todas aquellas circunstancias de hecho y de derecho que no permitan la prestación adecuada de los servicios. b) Cuando el contratista no cumpla con los pagos al sistema general de seguridad social dentro del tiempo establecido por la Ley y que, no sea presentado de manera oportuna a la entidad Contratante. c) Por mutuo acuerdo de las partes. DÉCIMA SEXTA. -NATURALEZA',
    //             'JURÍDICA DEL CONTRATO. El presente contrato está fundamentado en el contenido del artículo 32 de la Ley 80 de 1993, el artículo 2, numeral 4, literal h) y artículo tercero de la Ley 1150 de 2007, reglamentado por el Decreto 1082 de 2015; la Ley 527 de P-6240 DE 2022 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio de Salud y Protección Social No. 385 y 407 de 2020 y demás normas afines con la materia. Además, se celebra en consideración a las calidades personales del CONTRATISTA, para el desempeño de actividades transitorias, toda vez que el objeto del mismo no es posible llevarlo a cabo con personal de la planta de cargos. EL',
    //             'CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL INSTITUTO en consecuencia no adquiere ningún vínculo de carácter laboral ni administrativo con él. DÉCIMA SEPTIMA. -INHABILIDADES E INCOMPATIBILIDADES. El presente contrato está sujeto a las inhabilidades e incompatibilidades contempladas en la Ley 80 de 1993 (modificada por ley 1150 de 2007) y EL CONTRATISTA, para todos los efectos legales de este contrato, declara que no está incluido dentro de dichas inhabilidades e incompatibilidades legales. DÉCIMA OCTAVA. -SUPERVISIÓN: La Supervisión de este contrato estará a cargo del Jefe de Oficina – Unidad Estratégica de Negocios o quien el INSTITUTO delegue, quien ejercerá actividades de supervisión y vigilancia técnica, administrativa y financiera del contrato. Es responsabilidad del supervisor verificar que EL CONTRATISTA haya adecuado sus afiliaciones al Sistema Integral de Seguridad Social en Salud y Pensiones, conforme a lo establecido en el presente contrato. DÉCIMA NOVENA. -APROPIACIÓN PRESUPUESTAL. El pago de las',
    //             'sumas de dinero que el INSTITUTO queda obligado en razón de éste contrato, se subordina a la apropiación presupuestal que de ella se haga en el respectivo presupuesto. VIGÉSIMA. -IMPUTACIÓN DE GASTOS. Los gastos que demanden la legalización del presente contrato correrán a cargo del CONTRATISTA, y los que impliquen para el INSTITUTO el cumplimiento del mismo durante la presente vigencia fiscal se hace con cargo al certificado de compromiso No. 6240, el cual hace parte integral de los Anexos de éste contrato. VIGÉSIMA PRIMERA. -AFILIACIÓN AL SISTEMA GENERAL DE SEGURIDAD SOCIAL. Con el objeto de dar cumplimiento a lo preceptuado en Ley 100 de 1993 y la Ley 789 de 2002, los Decretos 1990 de 2016, 780 de 1996, 1273 de 2018, Ley 1955 del 25 de mayo de 2019 el CONTRATISTA para la suscripción del contrato deberá presentar constancia de afiliación al sistema integral de seguridad social en Salud, Pensiones y ARL como trabajador independiente. El artículo 1 del Decreto 1273 de 2018,',
    //             'por medio del cual se modifica el artículo 2.2.1.1.1.7 del Decreto 780 de 2016, establece lo siguiente: “El pago de las cotizaciones al Sistema de Seguridad Social Integral de los trabajadores independientes se efectuará mes vencido, por periodos mensuales, a través de la Planilla Integrada de Liquidación de Aportes (PILA) y teniendo en cuenta los ingresos percibidos en el periodo de cotización, esto es, el mes anterior.”, atendiendo lo contemplado en el artículo 3.2.7.6 del Decreto 1273 de 2018, sobre “Plazos”. Así mismo el Decreto 1273 de 2018, establece: 1. El Ingreso Base de Cotización (IBC) corresponde como mínimo al 40% del valor mensualizado en cada contrato de prestación de servicios, sin incluir el Impuesto al Valor Agregado(IVA) cuando a ello haya lugar, y en ningún caso el IBC podrá ser inferior al salario mínimo mensual legal vigente ni superior a 25 veces el salario mínimo mensual legal vigente; 5. Cuando no haya lugar al pago de los servicios contratados, de conformidad con lo dispuesto para el efecto en el contrato, estará a cargo del contratista el pago de los',
    //             'aportes al Sistema de Seguridad Social Integral y los intereses moratorios a que hubiere lugar; en estos eventos excepcionales, el contratista deberá acredita al contratante el pago del periodo correspondiente; 7. Al contratista le corresponde pagar mes vencido el valor de la cotización al Sistema General de Riesgos Laborales, cuando la afiliación sea por riesgo I,II o III, conforme la clasificación de actividades económicas establecidas en el Decreto 1607 de 2002 o la norma que lo modifique , adicione o sustituya; en tanto que el contratante deberá pagar el valor de la cotización mes vencido, cuando la afiliación del contratista por riesgo IV y V. PARÁGRAFO PRIMERO: De conformidad con lo establecido en el artículo 3.2.2.1. del Decreto 1990 de diciembre de 2016, ha modificado los plazos para la autoliquidación y el pago de los aportes al Sistema de Seguridad Social Integral y Aportes Parafiscales, así: Todos los aportantes a los Sistemas de Salud, Pensiones y Riesgos Laborales del Sistema de Seguridad Social Integral, así como aquellos a favor del Servicio Nacional del Aprendizaje –SENA–, del Instituto Colombiano de Bienestar Familiar –ICBF– y',
    //             'de las Cajas de Compensación Familiar, efectuarán sus aportes utilizando la Planilla Integrada de Liquidación de Aportes –PILA–, bien sea en su modalidad electrónica o asistida, a más tardar en las fechas que se indican a continuación:',
    //             {
    //                 style: 'tableExample',
    //                 color: '#444',
    //                 table: {
    //                     widths: ['*', '*'],
    //                     body: [
    //                         [
    //                             {
    //                                 colSpan: 2,
    //                                 text: 'TRABAJADORES INDEPENDIENTES',
    //                                 style: 'tableHeader',
    //                                 alignment: 'center',
    //                             },
    //                             {
    //                                 text: '',
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: 'Dos últimos dígitos del NIT o documento de identificación',
    //                                 style: 'tableHeader',
    //                                 aligment: 'center'
    //                             }, {
    //                                 text: 'Día hábil de cada mes de vencimiento',
    //                                 style: 'tableHeader',
    //                                 aligment: 'center'
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: '00 al 07',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: this.contrato,
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: '08 al 14',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: new Date(),
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: '15 al 21',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: '3 MESES Y VEINTICINCO DÍAS',
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: '22 a 28',
    //                                 style: 'tableHeader',
    //                             },
    //                             {
    //                                 text: ''
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: '29 al 35',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: '3 MESES Y VEINTICINCO DÍAS',
    //                             }
    //                         ],
    //                         [
    //                             {
    //                                 text: '36 al 42',
    //                                 style: 'tableHeader',
    //                             }, {
    //                                 text: 'DIEGO ALEJANDRO MARÍN CIFUENTES',
    //                             }
    //                         ],
    //                     ],
    //                 },
    //             },
    //             'PARÁGRAFO SEGUNDO: Una vez efectuado el pago, deberá remitir la constancia al ITM. Lo anterior para la verificación de la respectiva cancelación de aportes. En caso de no acreditar el pago en la fecha establecida, el ITM podrá realizar la  suspensión del contrato. PARÁGRAFO TERCERO: Los trabajadores independientes con contrato de prestación de  servicios personales, deberán continuar efectuando el pago de sus aportes a la seguridad social, directamente',
    //             'mediante la planilla integrada de liquidación de aportes – PILA, en la forma en que lo han venido haciendo y en las fechas  establecidas en el artículo 3.2.2.2.1 del Decreto 780 de 2016. VIGÉSIMA. SEGUNDA. -CLÁUSULA DE INDEMNIDAD.  El contratista mantendrá indemne al Instituto, de cualquier reclamación proveniente de terceros que tenga como causa',
    //             'las actuaciones del contratista, de conformidad con la normatividad vigente. VIGÉSIMA TERCERA. -PAGO DE LOS  CONTRATOS. El ITM realizará los pagos que demande el convenio y/o contrato sujeto a la confirmación del ingreso de  los recursos transferidos por Municipio de Medellín a la cuenta bancaria del ITM donde son administrados los recursos.  VIGÉSIMA CUARTA. - PUBLICIDAD EN EL SECOP. El presente contrato deberá ser publicado en el SECOP,',
    //             'con fundamento en lo dispuesto artículo 2.2.1.1.1.7.1 del Decreto 1082 de 2015. VIGÉSIMA QUINTA. - PERFECCIONAMIENTO Y DOCUMENTOS DEL CONTRATO. . De conformidad con del Artículo 41 de la Ley 80 de 1993  en concordancia con los protocolos institucionales adoptados en el marco de la emergencia de salud pública y la Ley 527  de 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio',
    //             'de Salud y Protección Social No. 385 y 407 de 2020, el presente contrato se perfecciona con el acuerdo sobre el objeto y la contraprestación y la firma de este escrito mediante el acuse de recibido por correo electrónico del contratista suministrado por el contratista danieladiazcalle@gmail.com quien certifica que es de su propiedad y uso exclusivo. Para la ejecución se requerirá la aprobación de la existencia de las disponibilidades presupuéstales',
    //             'correspondientes. Para todos los efectos legales se entienden incorporados al presente contrato la Ley 80 de 1993 y normas concordantes, es decir, los decretos reglamentarios, así mismo los siguientes documentos anexos: 1) Carta de adjudicación del Rector 2) Certificado  de compromiso presupuestal 3) Formato único de hoja de vida para el Sector Público (Ley 190 de 1995); 4) Formato de  declaración de Rentas y Bienes 5) Autorización de consignación para pago; 6) Fotocopia de cédula de ciudadanía; 7)',
    //             'Fotocopia Libreta Militar (en los casos que aplique) ; 8) Certificado de Antecedentes Disciplinarios; 9) Certificado de Responsabilidad Fiscal; 10) Certificado de la Policía Nacional; 11) Certificado de Medidas correctivas. 12) Certificado de afiliación a la seguridad social (salud y pensión) como independiente; 13) Fotocopia del Rut; 14) Fotocopia de los certificados que acrediten los estudios y experiencia laboral; 16) Examen pre-ocupacional.',
    //             { text: '\n\n Para constancia se firma el presente contrato por las partes en la ciudad de Medellín ' },
    //         ],
    //         styles: {
    //             header: {
    //                 fontSize: 18,
    //                 bold: true,
    //                 margin: [0, 0, 0, 10],
    //             },
    //             subheader: {
    //                 fontSize: 16,
    //                 bold: true,
    //                 margin: [0, 10, 0, 5],
    //             },
    //             tableHeader: {
    //                 bold: true,
    //                 fontSize: 13,
    //                 color: 'black',
    //                 align: 'center',
    //                 margin: [0, 0, 10, 10],
    //             },
    //             tableExample: {
    //                 margin: [0, 5, 0, 15],
    //             },
    //             title: {
    //                 bold: true,
    //                 fontSize: 13,
    //                 color: 'black',
    //                 alignment: 'center',
    //                 margin: [0, 10, 0, 0],
    //             },
    //         },
    //         defaultStyle: {
    //             // alignment: 'justify'
    //         },
    //     };
    //     pdfMake
    //         .createPdf(documentDefinition)
    //         .download('pruebaMinuta.pdf');
    //         pdfMake.createPdf(documentDefinition)
    //         .getDataUrl(function (dataURL) {
    //             console.log(dataURL);
    //         })
    // }

    // public downloadAsPDFs() {
    //     for (let index = 0; index < this.contractContractors.contractors.length; index++) {
    //         console.log(this.dataContractors);
    //         let data = this.dataContractors.find(ct => ct.contractorId === this.contractContractors.contractors[index])
    //         const documentDefinition = {
    //             header: {
    //                 columns: [
    //                     {
    //                         image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABACAMAAABvJxYMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUAAAAMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVv////Mb2P8AAAA/XRSTlMAAAIBAyF5qY0jBBEiOE9lipiip6uoo5qLeGFFJAkFDjrQBxs7Yq/N4/L797ovP00PFkkGHTBdF8ewCFGGttvz6JIfWBQcMy16J5EoDRo0GSoVVDY5UP5zrNfv+PnGKVeELlulcJxVRoUyfKZKSF+4YBBxEgxLPWlZJq2IN0JBPEBHboGxyuFvg2SCd4wxVgqTdKQLXLzsUyyAZh6eiXVybGtoY14YRH57apuWZ6A+y+ni5vTun+39+hNMNZ3x5dmOzyCyzMCZTvXTWpQl0bf82Ie03b3WtW2q3tKP1dq7ydzkf+DE3/D2rqHnxeuzv8JDw7nqK86X1FLBvnbI2xy73AAAAAFiS0dE/tIAwlMAAAAJcEhZcwAAFxEAABcRAcom8z8AAAAHdElNRQfmDBcSCyTEopocAAALeElEQVRo3u2YeVhTxxbAO/cGkACioM9KQgIJFAHZTCAYFRXCogSIBHCBKlqLS0GJAYWKLFIFSzHagKjUBRCsPgTFhQIiEMStWFqriK1rq2hb22Klr77XN9/35k4IhE20f/X7Xs4fzJm5c2d+c+6Zc0544w2d6EQnOtGJTnSiE53oRCc6+b8ToJYhB8GQD/8WQmERfWzatCRBI8jB7JreK5zodaa8noHQXD19g1GG6BUNIN3I2GS0qf6YsWbm48b/Y8KbEy0YTEugfTRiJO5eFjqLUl6GBGisntUINvk63FbWEMIJ2OSAw7WxHfOW3SR7B6gtjpMm6zsRmr0BzZmj3smF28sPtDUAXN3wCDCZgrs8PujlH6i5j+4ZsPIgtBYZ6TMJPCmyqSQQMqdNn+E1Ew4js2Z7a4zI8rHEG5DTnXAr8vVzouPN6f4mrhjUJ4BLGQ/w5+Cu+9xAHtUVBwG6Nw1jCv2CxfidEImae16olMSapfecMPaI3OGUaSP0w+YvWLjIMTIyyiFiOPK3F2u4l/RwRy/F7bJ3lr8bg7dcsdJ2FQVKX/1eLJ0aiFuDuUevjZdRXek6IF+ZQGnCiQHzE/E76zfgxnjUhulJWEt+f+LGlbyRuGOjIIwam7JpRWqajU1aeka4x+bMsR9s2TpzML+BcGhu2ywgzcZ8jLmMBLWyTe0ELqbYlvwPabgblgPkH4kpLTeaBDw8lrocL7JhO3CbbUQNSCZYKnYEvZSbcumdaz8OFQ6Ie0Dpm5L3Uf6k/m6+y2lo7jUFYPcejMtZujoLw2Ts1eJ+AxRG46sMUj4EzE+wvf3QQftzFwDRXDV3JuDt44/AnbE/a+IBi6CCg0VFRcWmlJQUklP2xh/ySCoVMgvW9rueZQO4D+9W+0k4kHyqNnPJgSMYxu9oOPaTWAs8Q/7PcjnVdTuaE31MiZ149f6D4XhqRRGewhy1LXsZHghcTfKyueCl2PItFFAl43gf3QnD3CqqPZkGgFG+NvepVf25gbcStwIRUHpjbnZKijpi0ldJ8L2Ul6pnMqUc7DDcdEM9Gp6hMDHBlw/IeoJSqfNudbJQeANCjzNs3MQS60gBHQ7QojvNOY3bM06AXIm16s/UT/LFA7gHJFX8t6aW3z/c9c7UtGRdOmvoKUEubiPmaPyMOIv9NuPtPuyo2tR6rJxjgthFWJt00A67ScyAeCKIm8JFizglVvRaBwB9eJR4uW8WNuyqAwSLPjDLALADZo6cXgWNK115MftOouC9Xev+Nama1UqDm+95tdbCYU5GzQXOAO6Ll6I8kPnM4GVBn5lsz+0BLxe3/KZAwGg2CBz0JKBqw8jmvgIN6AQor4YRtozZc5soQIepsz+P8YlU03oafd5zlM8BaL0KvyjV5EsNd3gbjEff7D34pYAll9M4viLKT+pCeDU16IjCGjkNsEq5CjQormEDIyWgh6iMkO8HLhWCEuhoQuG58rnoRhCyGgUp4pVKqRUSuPyEYcCpN/xjAjlfXdsK4dcqdBeuU4A3gtC+Gp95a5omd5qi2SXtKjCI20HDLSqzPn+z49Y383nEtzfM/FpuI7sFLJxaY2Vw59bdUIIYtbDj5r2LqtP3H9g1Fgbfs64N+wJGmX3Hd9+x5fuvZ6wAouYbo6Ifup++MZsw/OrhrUctSTQwJDYPnZ5UpnZSWGPRNXa2p7RGhLa5GqXPUyjpmLegu3kJjdpboWG2qK+uGsxdEwohdcrHLmAq3BKSD9dyXO/BC2GPYJUXrJ8GnkDHKGjxA6w6b18vdY6Cecup674o2ALa/+gA77e6eaHXT5n8BK+RjKjHVZHwjLO2wfvucNFlU3DE+hYF+zgOjX1LaTPTAVDdQMpTFLYjGqKg4zgKpiEI9KvohuIuqIa3b551gGPIJ/Ce4iasaq3rjHSZABcGc5vhDOU4CH9aZ3IZdrivT6KlOsJDpY3w8eYKcenesDmZbRHbRQ3QYZwt/yFspotLUpOLT8KA/oWzkTsOWMrmKhvLa497/BiF1YX4/qFCJ5pS3nuXqlkg7BhL9X4eUCtoc6PygzTH3BElQLUV7iAQtzLwHLySBc8bVsJHZseuwu+9O+AJCWCZw4hbZhUAca8ByNJSFNYzn7R7tkEPxH1XDJQ/wWaaYP+4Gb84wux+3K6f/CrHaSE5kEUzzGmjsFCmA3lYm49i2gPKMVaY4RPdX499fToYhrvLEX6IrtEz2CQOrf4sFoQ0wNkUN5s2Hr7TDrNl1vDp9fy1X3zM7YCVKMkUNja0wSppBcW9DdqnANffoJfBZAfMfQGthLgV78KqBR+c1OZG5cNcWL2HBnxb0RUmVXPGU1TP0RfgvU9pVd2AfhTXT+J2HMnjl+5CTduS4bh9v4QPytPGRMKzIKb6s0QQcqeHG1ypXjSzM4xcALdmCGI9FLQFsNIV0JNsmEX28OB6irsERuZ55+6CR8CyKMw9AXN/gNZ8Ezif0eJGZi1Htd+lgGTP31FW9m7ahdPgE1TduOM0P54OuqiLWp8qfEj1f6DHR6irqWG4QZEjjEDOdqsOxMA2xO2F/ATdSzbwbUDZVQliT8GnV+3rV4D3oZ0rWPxj5/W7DpFxFZHoWsRFwkXWzl/ChQtQUeEhugOPIm5P+LNRCzwx7j7sx93qhc3YdHwfqs4YlZQxYRvKHOBTHLyXILenFHOW/CpqbreCf1Hd3+UD81ovN8/C82n9uamokKk98agLuP16PJs4+vznBECO+fFcMbqyMc+edjbsKyUvPG8XA1H0H/Uz7+TQre4/iAHKxln137h73Jk5qcPrwQv5v4/vQ0Xo1OenaXHW9s8XfDNrpxa3pgo507ibADxfbNQ7vqi4qsTBO0Tt5vXpgP89CjM+QIbHzYlhuKkvKNtd10oVwUpjYwWg8Q1FoNSQi6ziamiswGlF4hSCwqwADwI3dz9UGFjqGaMAwFvsF0QAfrCeQmWcgN6ch47JNSwlgcBvjoJvKO/j5l3rTebnjoW76Zn/Nvnuf/5Eqy6d/Kyl5dlOIPz2v573zjfyAL/dznojDxjfbbKzszYFw3EPqqyGLLT+smi2s/xFq+qLun26XFpqScfRJUGpUCjogFAmiNlslKIJsasMuT1dRgkPDOsnr8HQvwB8laP1bkde6P+zq/pppZl+gVQlFxJa00ly2BUGcpMV4VasIXYMkohULLZapw2eIbMi6SY8Wc+m9JRaJtU6CYyRbzAN1aOrRFphMG3WoJ+MsK1+a1O+wYU3v8tZt3xz1s4DthWyEUtJDTcvS7IstybOhC5x8eaUTUlw72JbZRjNqzVNDOpOCajRcwmkOb84IHRyQWUPzyZOpnKZhnIcKNvIp3vU6Kcp07vQ1WDEdPtbVjA4o+c4lfJdblqxM6wI/4t/qrS4wZUT8CUS8fxhYyj+D88rcrP2MzYElsSvM04rijcJ5wvLnetyLGq3Swtculf4b+PVlWz2z1s8UdmV5QNAcI7FlLhlFxmoNjzgk0fPYx/RE73IXIwKNjeUxcP3+Ccm13ZbSErS+D6ZzGK9P/X6pflVZ6uGRK7ubGjfuKQ7YUi/GMy9vYd7Z+J8tkV8re/BkmJpaLLYR+CUMzq5IC3pYneGd4ms3GN/96Fcfe7NYlQN5OaMZna5d09BX31+eAB3mWJNoJXp4aXI3j7+3XV7D9chbonHqmKbxEPZyXsX6+v1L6to3Rs+/r3KPqpabeE2x84Hf1w/djhJGsIDrwRNLUPwcZUJaIGksdxokxPdr0vCsklVGitpdc4JMsamQiNfTqpAUpZLlzL8eNKuVuTG6EmQSI5+w7WKgUpgSJPUyTelU9W4Sa0xO32TqNC10FWQke4WUpYmZMatT9AGwWCEPNkk1qfkyOaDew+9KAtmzrMkXxm5b5XXjCd/QYbYdKRJOtGJTnSiE53oRCc60cnfQ/4Hl0rmEYSZemoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMjNUMTg6MTE6MDErMDA6MDCB3DuhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTIzVDE4OjExOjAxKzAwOjAw8IGDHQAAAABJRU5ErkJggg==',
    //                         height: 50,
    //                         width: 150,
    //                         margin: [50, 0,10,15]
    //                         // alignment: 'center'
    //                     },
    //                 ],
    //             },
    //             content: [
    //                 {
    //                     text: ['\n\nCONTRATO DE PRESTACIÓN DE SERVICIOS P-6240 DE 2022',
    //                     {text: 'inlines', margin: 20},
    //                 ],
    //                     style: 'header',
    //                     alignment: 'center',
    //                 },
    //                 {
    //                     text: [
    //                         'Entre los suscritos, de una parte, ' + data.supervisorItm + ' con c.c. ' + data.identificacionSupervisor + ', actuando en calidad de ' + data.cargoSupervisorItm + 'del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 del 10 de septiembre del 2020 por medio de la cual se delegan funciones en materia de contratación, en el marco de la ley 80',
    //                         'de 1993, leyes modificatorias y decretos reglamentarios del INSTITUTO TECNOLÓGICO METROPOLITANO – INSTITUCIÓN UNIVERSITARIA, adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7, debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, previa adjudicación del Rector del ITM, que en adelante se denominará INSTITUTO y de otra parte ' + data.nombre + ' mayor de edad, identificado (a) con Cédula de Ciudadanía ' + data.identificacion + ' de ' + data.lugarExpedicion + ' que en adelante se denominará el CONTRATISTA, se ha convenido celebrar el presente contrato, que se regirá por las siguientes cláusulas: PRIMERA. -OBJETO DEL CONTRATO. Prestación de servicios como contratista independiente, sin vínculo laboral por su propia cuenta y riesgo para realizar la gestion de Profesional para realizar el seguimiento, análisis y evaluación a la Inversión Pública en ejecución del Contrato Interadministrativo No.4600095169 DE 2022, celebrado entre EL DISTRITO ESPECIAL DE CIENCIA',
    //                         'TECNOLOGÍA E INNOVACIÓN DE MEDELLÍN – DEPARTAMENTO ADMINISTRATIVO DE PLANEACIÓN y el ITM. SEGUNDA. - DURACIÓN DEL CONTRATO. El presente contrato tendrá una duración de 03 MESES y 17 DIAS sin exceder la vigencia 2022, contados a partir de la suscripción del acta de inicio- la que se firmará una vez sea legalizado. PARAGRAFO El presente contrato está sujeto a la ejecución del contrato interadministrativo No. 4600095169 DE 2022 . No tendrá lugar a la liquidación conforme al Artículo 60 ley 80 de 1993 modificado por el artículo',
    //                         '217 decreto 019 del 2012. TERCERA. - VALOR DEL CONTRATO Y FORMA DE PAGO. El valor del presente contrato se fija en la suma de Veintiún millones ochocientos quince mil cuatrocientos veintidós pesos m.l ($ 21815422) El I.T.M. cancelará al CONTRATISTA, pagos parciales correspondientes a la entrega del informe en donde conste el cumplimiento de las actividades correspondientes a la prestacion del servicio. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARAGRAFO: En el evento en que el contratista no cumpla con las actividades correspondientes y/o el lleno de la totalidad de los requisitos establecidos para el pago de los honorarios (cuenta de cobro, declaración juramentada, informe de gestion y pago de la seguridad social) en las fechas establecidas según el cronograma de pagos, el pago de honorarios correspondiente a dicho periodo se acumularan para el periodo inmediatamente siguiente. CUARTA. -OBLIGACIONES DEL CONTRATISTA. EL CONTRATISTA se obliga en forma especial a prestar el servicio objeto de este contrato en los',
    //                         'términos señalados y específicamente a cumplir las siguientes OBLIGACIONES GENERALES: ' + data.obligacionesGenerales + ' OBLIGACIONES ESPECIFICAS: ' + data.obligacionesEspecificas + '   QUINTA. -DERECHOS Y DEBERES. Las partes declaran conocer y desarrollar los derechos y deberes consagrados en la Ley 80 de 1993 y cumplir las obligaciones específicas consagradas en este contrato. SEXTA. - MODIFICACIÓN, INTERPRETACIÓN Y TERMINACIÓN DEL CONTRATO. EL INSTITUTO tendrá la dirección general y la responsabilidad de ejercer control y vigilancia de la ejecución del contrato. En consecuencia, este contrato se rige por los principios de modificación unilateral, interpretación unilateral y terminación unilateral por parte del Instituto Tecnológico Metropolitano',
    //                         'conforme a las disposiciones contenidas en los Artículos 14, 15, 16 y 17 de la Ley 80 de 1993 (modificado por ley 1150 de 2007), la cual para todos los efectos legales hace parte integral de este contrato. SÉPTIMA. -CADUCIDAD. EL INSTITUTO, podrá declarar la caducidad si se presentan algunos de los hechos constitutivos del incumplimiento de las obligaciones a cargo del contratista, que afecta de manera grave y directa la ejecución del contrato, y evidencie que puede conducir a su paralización. La Entidad por acto administrativo debidamente motivado lo dará por terminado y ordenará su liquidación en el estado en que se encuentre. OCTAVA. -EFECTOS DE LA CADUCIDAD. Declarada la caducidad, no habrá lugar a la indemnización para el contratista, quien se hará acreedor a las sanciones e inhabilidades previstas en la Ley 80 de 1993, y las normas que la reglamentan y adicionan, Decreto 1082 de 2015. NOVENA. -MORA O INCUMPLIMIENTO PARCIAL. En caso de mora o incumplimiento parcial de las obligaciones adquiridas por EL CONTRATISTA, de acuerdo a las cláusulas del presente contrato, podrá EL INSTITUTO, mediante',
    //                         'Resolución motivada, imponer multas, las cuales deberán ser directamente proporcionales al valor del contrato y a los perjuicios que sufra EL INSTITUTO, sin exceder del cinco por mil (5 x 1.000) del valor del contrato cada vez que se impongan. DÉCIMA-CLÁUSULA PENAL PECUNIARIA. Sin perjuicio de lo dispuesto en las cláusulas anteriores, EL INSTITUTO podrá imponer al CONTRATISTA, en caso de declaratoria de caducidad o de incumplimiento como pena, una suma equivalente al diez por ciento (10%) del valor del contrato. El valor de la cláusula penal que se haga efectiva, se considera como pago parcial pero definitivo de los perjuicios causados al INSTITUTO. DECIMA PRIMERA. -DE LA APLICACIÓN DE LA MULTA Y LA CLÁUSULA PENAL PECUNIARIA. Una vez ejecutoriados los actos administrativos que la imponen podrán ser tomados dichos valores del saldo a favor del CONTRATISTA o de las garantías constituidas. Si no fuere',
    //                         'posible lo anterior, se cobrará por jurisdicción coactiva. DECIMA SEGUNDA. -DEL PROCEDIMIENTO PARA LA IMPOSICION DE LA MULTA: De conformidad con lo dispuesto en el artículo 86 de la Ley 1474 de 2011, en concordancia con los artículos 29 de la Constitución Política y 17 de la Ley 1150 de 2007 reglamentado por el Decreto 1082 de 2015, el procedimiento en caso de imposición de multas, sanciones o declaratoria de incumplimiento será el previsto en el artículo 86 de la ley. DECIMA TERCERA. -CESIÓN DEL CONTRATO. Los contratos de prestación de servicios estatales son "intuitupersona" y, en consecuencia, una vez celebrados no podrán cederse, salvo los casos en que medie autorización expedida por la Rectoría de la entidad, en acto administrativo debidamente sustentado. DÉCIMA CUARTA. -TERMINACIÓN DEL CONTRATO. - El presente contrato podrá darse por terminado cuando: a) Las partes de mutuo acuerdo decidan dar',
    //                         'por terminado el contrato. b) Cuando de la aplicación de las causales establecidas en la cláusula sexta, opere la terminación anticipada del contrato. c) Cuando el contratista incumpla alguna de las obligaciones contractuales contraídas, sin perjuicio de realizar el proceso de aplicación de multas y/o de la aplicación de la cláusula penal pecuniaria. d) Cuando culmine el plazo de ejecución del contrato. DÉCIMA QUINTA. -CAUSALES DE SUSPENSIÓN DEL CONTRATO El presente contrato podrá suspenderse a) cuando el contratista por cualquier causal no pueda prestar el servicio para el cual fue contratado. Esta causal incluye enfermedad general, invalidez temporal, licencia de maternidad, licencia de paternidad y todas aquellas circunstancias de hecho y de derecho que no permitan la prestación adecuada de los servicios. b) Cuando el contratista no cumpla con los pagos al sistema general de seguridad social dentro del tiempo establecido por la Ley y que, no sea presentado de manera oportuna a la entidad Contratante. c) Por mutuo acuerdo de las partes. DÉCIMA SEXTA. -NATURALEZA',
    //                         'JURÍDICA DEL CONTRATO. El presente contrato está fundamentado en el contenido del artículo 32 de la Ley 80 de 1993, el artículo 2, numeral 4, literal h) y artículo tercero de la Ley 1150 de 2007, reglamentado por el Decreto 1082 de 2015; la Ley 527 de P-6240 DE 2022 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio de Salud y Protección Social No. 385 y 407 de 2020 y demás normas afines con la materia. Además, se celebra en consideración a las calidades personales del CONTRATISTA, para el desempeño de actividades transitorias, toda vez que el objeto del mismo no es posible llevarlo a cabo con personal de la planta de cargos. EL',
    //                         'CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL INSTITUTO en consecuencia no adquiere ningún vínculo de carácter laboral ni administrativo con él. DÉCIMA SEPTIMA. -INHABILIDADES E INCOMPATIBILIDADES. El presente contrato está sujeto a las inhabilidades e incompatibilidades contempladas en la Ley 80 de 1993 (modificada por ley 1150 de 2007) y EL CONTRATISTA, para todos los efectos legales de este contrato, declara que no está incluido dentro de dichas inhabilidades e incompatibilidades legales. DÉCIMA OCTAVA. -SUPERVISIÓN: La Supervisión de este contrato estará a cargo del Jefe de Oficina – Unidad Estratégica de Negocios o quien el INSTITUTO delegue, quien ejercerá actividades de supervisión y vigilancia técnica, administrativa y financiera del contrato. Es responsabilidad del supervisor verificar que EL CONTRATISTA haya adecuado sus afiliaciones al Sistema Integral de Seguridad Social en Salud y Pensiones, conforme a lo establecido en el presente contrato. DÉCIMA NOVENA. -APROPIACIÓN PRESUPUESTAL. El pago de las',
    //                         'sumas de dinero que el INSTITUTO queda obligado en razón de éste contrato, se subordina a la apropiación presupuestal que de ella se haga en el respectivo presupuesto. VIGÉSIMA. -IMPUTACIÓN DE GASTOS. Los gastos que demanden la legalización del presente contrato correrán a cargo del CONTRATISTA, y los que impliquen para el INSTITUTO el cumplimiento del mismo durante la presente vigencia fiscal se hace con cargo al certificado de compromiso No. 6240, el cual hace parte integral de los Anexos de éste contrato. VIGÉSIMA PRIMERA. -AFILIACIÓN AL SISTEMA GENERAL DE SEGURIDAD SOCIAL. Con el objeto de dar cumplimiento a lo preceptuado en Ley 100 de 1993 y la Ley 789 de 2002, los Decretos 1990 de 2016, 780 de 1996, 1273 de 2018, Ley 1955 del 25 de mayo de 2019 el CONTRATISTA para la suscripción del contrato deberá presentar constancia de afiliación al sistema integral de seguridad social en Salud, Pensiones y ARL como trabajador independiente. El artículo 1 del Decreto 1273 de 2018,',
    //                         'por medio del cual se modifica el artículo 2.2.1.1.1.7 del Decreto 780 de 2016, establece lo siguiente: “El pago de las cotizaciones al Sistema de Seguridad Social Integral de los trabajadores independientes se efectuará mes vencido, por periodos mensuales, a través de la Planilla Integrada de Liquidación de Aportes (PILA) y teniendo en cuenta los ingresos percibidos en el periodo de cotización, esto es, el mes anterior.”, atendiendo lo contemplado en el artículo 3.2.7.6 del Decreto 1273 de 2018, sobre “Plazos”. Así mismo el Decreto 1273 de 2018, establece: 1. El Ingreso Base de Cotización (IBC) corresponde como mínimo al 40% del valor mensualizado en cada contrato de prestación de servicios, sin incluir el Impuesto al Valor Agregado(IVA) cuando a ello haya lugar, y en ningún caso el IBC podrá ser inferior al salario mínimo mensual legal vigente ni superior a 25 veces el salario mínimo mensual legal vigente; 5. Cuando no haya lugar al pago de los servicios contratados, de conformidad con lo dispuesto para el efecto en el contrato, estará a cargo del contratista el pago de los',
    //                         'aportes al Sistema de Seguridad Social Integral y los intereses moratorios a que hubiere lugar; en estos eventos excepcionales, el contratista deberá acredita al contratante el pago del periodo correspondiente; 7. Al contratista le corresponde pagar mes vencido el valor de la cotización al Sistema General de Riesgos Laborales, cuando la afiliación sea por riesgo I,II o III, conforme la clasificación de actividades económicas establecidas en el Decreto 1607 de 2002 o la norma que lo modifique , adicione o sustituya; en tanto que el contratante deberá pagar el valor de la cotización mes vencido, cuando la afiliación del contratista por riesgo IV y V. PARÁGRAFO PRIMERO: De conformidad con lo establecido en el artículo 3.2.2.1. del Decreto 1990 de diciembre de 2016, ha modificado los plazos para la autoliquidación y el pago de los aportes al Sistema de Seguridad Social Integral y Aportes Parafiscales, así: Todos los aportantes a los Sistemas de Salud, Pensiones y Riesgos Laborales del Sistema de Seguridad Social Integral, así como aquellos a favor del Servicio Nacional del Aprendizaje –SENA–, del Instituto Colombiano de Bienestar Familiar –ICBF– y',
    //                         'de las Cajas de Compensación Familiar, efectuarán sus aportes utilizando la Planilla Integrada de Liquidación de Aportes –PILA–, bien sea en su modalidad electrónica o asistida, a más tardar en las fechas que se indican a continuación:',
    //                     ],			
    //                     style: 'header',
    //                     bold: false
    //                 },
    //                 {
    //                     style: 'tableExample',
    //                     color: '#444',
    //                     table: {
    //                         widths: ['*', '*'],
    //                         body: [
    //                             [
    //                                 {
    //                                     colSpan: 2,
    //                                     text: 'TRABAJADORES INDEPENDIENTES',
    //                                     style: 'tableHeader',
    //                                     alignment: 'center',
    //                                 },
    //                                 {
    //                                     text: '',
    //                                 }
    //                             ],
    //                             [
    //                                 {
    //                                     text: 'Dos últimos dígitos del NIT o documento de identificación',
    //                                     style: 'tableHeader',
    //                                     aligment: 'center'
    //                                 }, {
    //                                     text: 'Día hábil de cada mes de vencimiento',
    //                                     style: 'tableHeader',
    //                                     aligment: 'center'
    //                                 }
    //                             ],
    //                             [
    //                                 {
    //                                     text: '00 al 07',
    //                                     style: 'tableHeader',
    //                                 }, {
    //                                     text: data.numberProject,
    //                                 }
    //                             ],
    //                             [
    //                                 {
    //                                     text: '08 al 14',
    //                                     style: 'tableHeader',
    //                                 }, {
    //                                     text: new Date(),
    //                                 }
    //                             ],
    //                             [
    //                                 {
    //                                     text: '15 al 21',
    //                                     style: 'tableHeader',
    //                                 }, {
    //                                     text: '3 MESES Y VEINTICINCO DÍAS',
    //                                 }
    //                             ],
    //                             [
    //                                 {
    //                                     text: '22 a 28',
    //                                     style: 'tableHeader',
    //                                 },
    //                                 {
    //                                     text: ''
    //                                 }
    //                             ],
    //                             [
    //                                 {
    //                                     text: '29 al 35',
    //                                     style: 'tableHeader',
    //                                 }, {
    //                                     text: '3 MESES Y VEINTICINCO DÍAS',
    //                                 }
    //                             ],
    //                             [
    //                                 {
    //                                     text: '36 al 42',
    //                                     style: 'tableHeader',
    //                                 }, {
    //                                     text: 'DIEGO ALEJANDRO MARÍN CIFUENTES',
    //                                 }
    //                             ],
    //                         ],
    //                     },
    //                 },
    //                 {
    //                     text: [
    //                         'PARÁGRAFO SEGUNDO: Una vez efectuado el pago, deberá remitir la constancia al ITM. Lo anterior para la verificación de la respectiva cancelación de aportes. En caso de no acreditar el pago en la fecha establecida, el ITM podrá realizar la  suspensión del contrato. PARÁGRAFO TERCERO: Los trabajadores independientes con contrato de prestación de  servicios personales, deberán continuar efectuando el pago de sus aportes a la seguridad social, directamente',
    //                         'mediante la planilla integrada de liquidación de aportes – PILA, en la forma en que lo han venido haciendo y en las fechas  establecidas en el artículo 3.2.2.2.1 del Decreto 780 de 2016. VIGÉSIMA. SEGUNDA. -CLÁUSULA DE INDEMNIDAD.  El contratista mantendrá indemne al Instituto, de cualquier reclamación proveniente de terceros que tenga como causa',
    //                         'las actuaciones del contratista, de conformidad con la normatividad vigente. VIGÉSIMA TERCERA. -PAGO DE LOS  CONTRATOS. El ITM realizará los pagos que demande el convenio y/o contrato sujeto a la confirmación del ingreso de  los recursos transferidos por Municipio de Medellín a la cuenta bancaria del ITM donde son administrados los recursos.  VIGÉSIMA CUARTA. - PUBLICIDAD EN EL SECOP. El presente contrato deberá ser publicado en el SECOP,',
    //                         'con fundamento en lo dispuesto artículo 2.2.1.1.1.7.1 del Decreto 1082 de 2015. VIGÉSIMA QUINTA. - PERFECCIONAMIENTO Y DOCUMENTOS DEL CONTRATO. . De conformidad con del Artículo 41 de la Ley 80 de 1993  en concordancia con los protocolos institucionales adoptados en el marco de la emergencia de salud pública y la Ley 527  de 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio',
    //                         'de Salud y Protección Social No. 385 y 407 de 2020, el presente contrato se perfecciona con el acuerdo sobre el objeto y la contraprestación y la firma de este escrito mediante el acuse de recibido por correo electrónico del contratista suministrado por el contratista ' + data.correo + ' quien certifica que es de su propiedad y uso exclusivo. Para la ejecución se requerirá la aprobación de la existencia de las disponibilidades presupuéstales',
    //                         'correspondientes. Para todos los efectos legales se entienden incorporados al presente contrato la Ley 80 de 1993 y normas concordantes, es decir, los decretos reglamentarios, así mismo los siguientes documentos anexos: 1) Carta de adjudicación del Rector 2) Certificado  de compromiso presupuestal 3) Formato único de hoja de vida para el Sector Público (Ley 190 de 1995); 4) Formato de  declaración de Rentas y Bienes 5) Autorización de consignación para pago; 6) Fotocopia de cédula de ciudadanía; 7)',
    //                         'Fotocopia Libreta Militar (en los casos que aplique) ; 8) Certificado de Antecedentes Disciplinarios; 9) Certificado de Responsabilidad Fiscal; 10) Certificado de la Policía Nacional; 11) Certificado de Medidas correctivas. 12) Certificado de afiliación a la seguridad social (salud y pensión) como independiente; 13) Fotocopia del Rut; 14) Fotocopia de los certificados que acrediten los estudios y experiencia laboral; 16) Examen pre-ocupacional.',
    //                         { text: '\n\n Para constancia se firma el presente contrato por las partes en la ciudad de Medellín ' },
    //                     ],
    //                     style: 'header',
    //                     bold: false
    //                 }

    //             ],

    //             styles: {
    //                 header: {
    //                     fontSize: 12,
    //                     margin: [0, 5, 0, 5], 
    //                     bold: true,
    //                     alignment: 'justify'
    //                 },
    //                 subheader: {
    //                     fontSize: 16,
    //                     bold: true,
    //                     margin: [0, 10, 0, 5],
    //                 },
    //                 tableHeader: {
    //                     bold: true,
    //                     fontSize: 13,
    //                     color: 'black',
    //                     align: 'center',
    //                     margin: [0, 0, 10, 10],
    //                 },
    //                 tableExample: {
    //                     margin: [0, 5, 0, 15],
    //                 },
    //                 title: {
    //                     bold: true,
    //                     fontSize: 13,
    //                     color: 'black',
    //                     alignment: 'center',
    //                     margin: [0, 10, 0, 0],
    //                 },
    //             },
    //             defaultStyle: {
    //                 // alignment: 'justify'
    //             },
    //         };
    //         let test = pdfMake
    //             .createPdf(documentDefinition)
    //             .download('pruebaMinuta.pdf');
    //         console.log(test);
    //     }

    // }

    public downloadPDFActaDeInicio() {
        let latest_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        //this.valueLetter = GlobalConst.numeroALetras(this.dataCuenta.paymentcant, 'PESOS')
        const documentDefinition = {
            content: [
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: [100, 200, '*', '*'],
                        body: [
                            [
                                {
                                    rowSpan: 3,
                                    image: 'data:image/png;base64,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GhYqS4OZpOzJYpvZ8CDIXKzSFGYCAAAA8IPwEwBYS9N2ixWk4UFg+vAxs0rrtthSdu7iwX/P28v+MJtOHj4OAAAAACsTfgIAO/NIcBoezCx97nvBTNOtu14MIhdcPfL9mwdVmb2r2XTy2P8PAAAAADsh/AQAsvegde9jXnp80VPB677cPVI9+ZzHgspFN7Pp5GFoCQAAAABFEH4CAAAAAAAARfgfpxEAAAAAAAAogfATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAAAAAAKILwEwAAAAAAACiC8BMAAAAAAAAogvATAAAA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AAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAAAAiiD5CQAAAAAAABRB8hMAAAAAAAAoguQnAAAAAAAAUATJTwAAAAAAAKAIkp8AAAAAAABAESQ/AQAAAAAAgCJIfgIAAAAAAABFkPwEAAAAAACA/9+eHdAAAMAwDJp/1dfxBmxAgvwEAAAAAAAAEuQnAAAAAAAAkCA/AQAAAAAAgAT5CQAAAAAAACTITwAAAAAAACBBfgIAAAAAAAAJ8hMAAAAAAABIkJ8AAAAAAABAgvwEAAAAAAAAEuQnAAAAAAAAkCA/AQAAAAAAgAT5CQAAAAAAACTITwAAAAAAACBBfgIAAAAAAAAJ8hMAAAAAAABIkJ8AAAAAAABAgvwEAAAAAAAAEuQnAAAAAAAAkCA/AQAAAAAAgAT5CQAAAAAAACTITwAAAAAAACBBfgIAAAAAAAAJ8hMAAAAAAABIkJ8AAAAAAABAgvwEAAAAAAAAEuQnAAAAAAAAkCA/AQAAAAAAgAT5CQAAAAAAAPy37QA6rCGDaFczlQAAAABJRU5ErkJggg==',
                                    height: 50,
                                    width: 100,
                                    style: 'title',
                                },
                                {
                                    rowSpan: 3,
                                    text: 'ACTA DE INICIO DE CONTRATO',
                                    style: 'acta',
                                },
                                {
                                    text: 'Código',
                                    style: 'tableHeader',
                                    alignment: 'center',
                                },
                                {
                                    text: 'FBS 038',
                                    style: 'tableHeader',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text: 'Versión',
                                    alignment: 'center',
                                },
                                {
                                    text: latest_date,
                                    alignment: 'center',
                                },
                                {
                                    text: 'Versión',
                                    alignment: 'center',
                                },
                                {
                                    text: '03',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text: '',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                    alignment: 'center',
                                },
                                {
                                    text: 'Fecha',
                                    alignment: 'center',
                                },
                                {
                                    text: latest_date,
                                    alignment: 'center',
                                },
                            ]
                        ],
                    },
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: [100, 397],
                        body: [
                            [
                                {
                                    text: 'Fecha',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                },
                            ],
                        ],
                    },
                },
                {
                    text: [
                        'Mediante la suscripción de la presente acta, el contratante y el contratista asumen plena responsabilidad por la veracidad de la información en ella contenida.\n\n',
                    ],			
                    style: 'header',
                    bold: false
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: [505],
                        body: [
                            [
                                {
                                    text: 'INFORMACIÓN GENERAL DEL CONTRATO O CONVENIO',
                                    alignment: 'center',
                                },
                            ],
                        ],
                    },
                },
                {
                    text: [
                        'Esta información es transcrita tal cual como figura en los respectivos documentos contractuales de los que se refiere: \n\n',
                    ],			
                    style: 'header',
                    bold: false
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['*', '*', '*', '*', '*', '*'],
                        body: [
                            [
                                {
                                    rowSpan: 2,
                                    colSpan: 2,
                                    text: 'CONTRATO',
                                    alignment: 'center',
                                    style: 'contrato'
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: 'NÚMERO',
                                    alignment: 'center',
                                },
                                {
                                    colSpan: 3,
                                    text: 'P-4158 de 2022',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                }
                            ],
                            [
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: 'FECHA:',
                                    alignment: 'center',                                },
                                {
                                    text: '13',
                                },
                                {
                                    text: '02',
                                },
                                {
                                    text: '2023',
                                }
                            ],
                            [
                                {
                                    colSpan: 6,
                                    text: 'OBJETO: PRESTACIÓN DE SERVICIOS COMO CONTRATISTA INDEPENDIENTE, SIN VÍNCULO LABORAL POR SU PROPIA CUENTA Y RIESGO PARA REALIZAR LA GESTION COMO PROFESIONAL DE APOYO  ADMINISTRATIVO EN EJECUCIÓN DEL CONTRATO INTERADMINISTRATIVO NO.CW153499 DE 2021, CELEBRADO  ENTRE EMVARIAS Y EL ITM.',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    colSpan: 3,
                                    text: 'ORGANISMO CONTRATANTE:',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    colSpan: 3,
                                    text: 'INSTITUTO TECNOLOGICO METROPOLITANO ',
                                    alignment: 'center',
                                },
                                {
                                    text: '',                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    colSpan: 3,
                                    text: 'CONTRATISTA',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    colSpan: 3,
                                    text: 'YULIANA VERA CARDONA- C.C. 1,020,446,482 de BELLO',
                                },
                                {
                                    text: '',                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    colSpan: 2,
                                    text: 'VALOR: ',
                                    style: 'campoDerecha',
                                },
                                {
                                    text: '',
                                },
                                {
                                    colSpan: 4,
                                    text: 'SIETE MILLONES QUINIENTOS OCHENTA Y TRES MIL TRESCIENTOS TREINTA Y TRES PESOS M/L ($ 7,583,333)',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    colSpan: 2,
                                    text: 'PLAZO: ',
                                    style: 'campoDerecha',
                                },
                                {
                                    text: '',
                                },
                                {
                                    colSpan: 4,
                                    text: '02 MESES y 5 DIAS',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    colSpan: 2,
                                    rowSpan: 2,
                                    text: 'REGISTRO PRESUPUESTAL',
                                    style: 'subheader',
                                },
                                {
                                    text: '',
                                },
                                {
                                    colSpan: 2,
                                    text: '4158',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    colSpan: 1,
                                    text: 'FECHA:',                                },
                                {
                                    text: '13',
                                },
                                {
                                    text: '02',                                },
                                {
                                    text: '2023',
                                },
                            ],
                            [
                                {
                                    colSpan: 3,
                                    text: 'FECHA APROBACION DE PÓLIZAS:',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: 'N/A',
                                },
                                {
                                    text: 'N/A',                                },
                                {
                                    text: 'N/A',
                                },
                            ],
                        ],
                    },
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['*', '*','*'],
                        body: [
                            [
                                {
                                    text: 'SUPERVISOR',
                                    style: 'campoDerecha',
                                },
                                {
                                    text: 'NOMBRE:',
                                },
                                {
                                    text: 'GERMAN ALBERTO CARDONA',
                                },
                            ],
                        ],
                    },
                },
                {
                    text: [
                        'De conformidad con la cláusula segunda del Contrato No. P-4158 de 2022, se fija como fecha de inicio la del presente documento, por lo tanto, la fecha de terminación será el 30 de septiembre de 2022',
                        '\n\nPara constancia de lo anterior, firman la presente acta quienes en ella intervinieron,'                      
                    ],			
                    style: 'header',
                    bold: false
                },
                { text: '\n\nFIRMA: ' }, { canvas: [{ type: 'line', x1: 0, y1: 1, x2: 300 - 2 * 40, y2: 1, lineWidth: 1, margin: [5, 0] }] },
                { text: this.nombre }, { text: 'CONTRATISTA: \t' + this.cedula },
                { text: '\n\nFIRMA: ' }, { canvas: [{ type: 'line', x1: 0, y1: 1, x2: 300 - 2 * 40, y2: 1, lineWidth: 1, margin: [5, 0] }] },
                { text: this.nombre }, { text: 'SUPERVISOR: \t' + this.cedula }
            ],
            styles: {
                campoDerecha: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    align: 'center',
                },
                subheader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    align: 'center',
                    margin: [0, 10, 0, 0],
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    align: 'center',
                    margin: [0, 0, 0, 0],
                },
                tableExample: {
                    margin: [0, 5, 0, 15],
                },
                contrato: {
                    bold: true,
                    fontSize: 13,
                    margin: [0, 10, 0, 0],
                },
                title: {
                    bold: true,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 0, 0, 0],
                },
                acta: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 15, 0, 0],
                },
            },
            defaultStyle: {
                // alignment: 'justify'
            },
        };
        let test = pdfMake
            .createPdf(documentDefinition)
            .download('Filenames.pdf');
        console.log(test);
    }

    private getHiringData() {
        this.contractContractors.contractors[0] = '86ef47eb-76a3-4774-8b99-cfe935a9208a';
        this.contractContractors.contractId = '86EF47EB-76A3-4774-8B99-CFE935A9208A';
        this._economicService
            .getDataMinute(this.contractContractors)
            .subscribe((response: any) => {
                this.dataContractors = response;
            }, (resp => {
                console.log(resp);
            }));

    }
}
