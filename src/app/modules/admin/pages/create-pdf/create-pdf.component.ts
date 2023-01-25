import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { IElements } from '../planing/models/element';
@Component({
    selector: 'app-create-pdf',
    templateUrl: './create-pdf.component.html',
    styleUrls: ['./create-pdf.component.scss'],
})
export class CreatePdfComponent implements OnInit {
    //@ViewChild('pdfTable') pdfTable: ElementRef;
    cedula: string = '1000189631';
    nombre: string = 'jhojan alejandro hernandez yepes';
    direccion: string = 'Carrera 31 calle 107 -98 int 107';
    telefono: string = '3003853164';
    contrato: string = '234';
    listaObligaciones: IElements[] = [{
        id: 'any',
        nombreElemento: 'string',
        idComponente: 'string',
        cantidadContratistas: 1,
        cantidadDias: 10,
        valorUnidad: 2000000,
        valorTotal: 5000000,
        valorPorDia: 100000,
        valorTotalContratista: 200000,
        valorPorDiaContratista: 0,
        cpc: 'string',
        nombreCpc: 'string',
        modificacion: true,
        tipoElemento: 'string',
        recursos: 0,
        consecutivo: 'string',
        obligacionesEspecificas: '1. Apoyo en la gestión de procesos administrativos y logísticos',
        obligacionesGenerales: 'string',
        objetoElemento: 'string',
    },
    {
        id: 'any',
        nombreElemento: 'string',
        idComponente: 'string',
        cantidadContratistas: 1,
        cantidadDias: 10,
        valorUnidad: 2000000,
        valorTotal: 5000000,
        valorPorDia: 100000,
        valorTotalContratista: 200000,
        valorPorDiaContratista: 0,
        cpc: 'string',
        nombreCpc: 'string',
        modificacion: true,
        tipoElemento: 'string',
        recursos: 0,
        consecutivo: 'string',
        obligacionesEspecificas: '2. Apoyo en la creación de espacio web para repositorio en la web del Instituto Tecnógico Metrolitano.',
        obligacionesGenerales: 'string',
        objetoElemento: 'string',
    },
    {
        id: 'any',
        nombreElemento: 'string',
        idComponente: 'string',
        cantidadContratistas: 1,
        cantidadDias: 10,
        valorUnidad: 2000000,
        valorTotal: 5000000,
        valorPorDia: 100000,
        valorTotalContratista: 200000,
        valorPorDiaContratista: 0,
        cpc: 'string',
        nombreCpc: 'string',
        modificacion: true,
        tipoElemento: 'string',
        recursos: 0,
        consecutivo: 'string',
        obligacionesEspecificas: '3. Apoyo en la creación de macros para informes y combinación de documentos.',
        obligacionesGenerales: 'string',
        objetoElemento: 'string',
    }
    ];
    listaData: any[] = [];
    data: any[] = [];
    fechaInicio: Date = new Date();
    ngOnInit(): void { }

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

    public downloadAsPDFs() {
        //const pdfTable = this.pdfTable.nativeElement;
        //var html = htmlToPdfmake(pdfTable.innerHTML);
        for (let index = 0; index < this.listaObligaciones.length; index++) {
            this.listaData[index] = [[
                {
                    text: this.listaObligaciones[index].obligacionesEspecificas,
                },
                {
                    text: '',
                    alignment: 'center',
                },
                {
                    text: 'Correos electrónicos',
                    alignment: 'center',
                }
            ]

            ]
        }
        console.log(this.listaData);

        const documentDefinition = {
            header: {
                columns: [
                    {
                        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABACAMAAABvJxYMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUAAAAMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVv////Mb2P8AAAA/XRSTlMAAAIBAyF5qY0jBBEiOE9lipiip6uo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',
                        height: 50,
                        width: 150,
                        margin: [50, 0]
                        // alignment: 'center'
                    },
                ],
            },
            content: [
                {
                    text: '\n\nCONTRATO DE PRESTACIÓN DE SERVICIOS P-6240 DE 2022',
                    style: 'header',
                    alignment: 'center',
                },
                'Entre los suscritos, de una parte, ALEJANDRO HOYOS MONTOYA con c.c. 3.413.859, actuando en calidad de Jefe de Oficina- Asesora Jurídica del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 del 10 de septiembre del 2020 por medio de la cual se delegan funciones en materia de contratación, en el marco de la ley 80 de 1993, leyes modificatorias y decretos',
                'reglamentarios del INSTITUTO TECNOLÓGICO METROPOLITANO – INSTITUCIÓN UNIVERSITARIA, adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7, debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, previa adjudicación del Rector del ITM, que en adelante se denominará INSTITUTO y de otra parte DANIELA DIAZ CALLE mayor de edad, identificado (a) con Cédula de Ciudadanía 1152690770 de MEDELLIN que en adelante se denominará el CONTRATISTA, se ha convenido celebrar el presente contrato, que se regirá por las siguientes cláusulas: PRIMERA. -OBJETO DEL CONTRATO. Prestación de servicios como contratista independiente, sin vínculo laboral por su propia cuenta y riesgo para realizar la gestion de Profesional para realizar el seguimiento, análisis y evaluación a la Inversión Pública en ejecución del Contrato Interadministrativo No.4600095169 DE 2022, celebrado entre EL DISTRITO ESPECIAL DE CIENCIA',
                'TECNOLOGÍA E INNOVACIÓN DE MEDELLÍN – DEPARTAMENTO ADMINISTRATIVO DE PLANEACIÓN y el ITM. SEGUNDA. - DURACIÓN DEL CONTRATO. El presente contrato tendrá una duración de 03 MESES y 17 DIAS sin exceder la vigencia 2022, contados a partir de la suscripción del acta de inicio- la que se firmará una vez sea legalizado. PARAGRAFO El presente contrato está sujeto a la ejecución del contrato interadministrativo No. 4600095169 DE 2022 . No tendrá lugar a la liquidación conforme al Artículo 60 ley 80 de 1993 modificado por el artículo',
                '217 decreto 019 del 2012. TERCERA. - VALOR DEL CONTRATO Y FORMA DE PAGO. El valor del presente contrato se fija en la suma de Veintiún millones ochocientos quince mil cuatrocientos veintidós pesos m.l ($ 21815422) El I.T.M. cancelará al CONTRATISTA, pagos parciales correspondientes a la entrega del informe en donde conste el cumplimiento de las actividades correspondientes a la prestacion del servicio. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARAGRAFO: En el evento en que el contratista no cumpla con las actividades correspondientes y/o el lleno de la totalidad de los requisitos establecidos para el pago de los honorarios (cuenta de cobro, declaración juramentada, informe de gestion y pago de la seguridad social) en las fechas establecidas según el cronograma de pagos, el pago de honorarios correspondiente a dicho periodo se acumularan para el periodo inmediatamente siguiente. CUARTA. -OBLIGACIONES DEL CONTRATISTA. EL CONTRATISTA se obliga en forma especial a prestar el servicio objeto de este contrato en los',
                'términos señalados y específicamente a cumplir las siguientes OBLIGACIONES GENERALES: 1) Presentar el informe de gestión de manera mensual al ITM de las actividades realizadas con el visto bueno requerido. 2) Presentar el Informe final de las actividades realizadas durante la ejecución del contrato. 3) EL CONTRATISTA acepta que la propiedad intelectual sobre los estudios, documentos y en general los productos resultantes de la ejecución del presente contrato, quedará a cargo del Distrito Especial de Ciencia, Tecnología e Innovación de Medellín. 4) Concertar la presencialidad requerida. 5) Observar e implementar las directrices institucionales sobre la administración de documentos. 6) Cumplir a cabalidad con el objeto contractual, en la forma y plazo establecido en el mismo, y con las especificaciones técnicas señaladas en los estudios previos. 7)',
                'Cumplir con la prestación del servicio requerido en el sitio acordado con el supervisor del contrato, según las especificaciones técnicas indicadas en los estudios previos. 8) Acatar las recomendaciones del supervisor, como enlace directo entre el ITM y el Contratista. 9) Presentar las facturas o cuentas de cobro correspondientes a las actividades realizadas durante la ejecución del contrato. 10) Abstenerse de presentar la factura o cuenta de cobro por encima del presupuesto disponible, de acuerdo con el valor del P-6240 DE 2022 contrato. 11) Garantizar la prestación del servicio según las condiciones previamente estipuladas entre el contratista y el supervisor. 12) Informar por escrito al supervisor, las quejas, dudas, reclamos y demás inquietudes que puedan surgir en el desarrollo del objeto contractual. 13) Atender los requerimientos que sean formulados por el supervisor y para efectos de ejecutar en debida forma el contrato. 14) Toda comunicación entre el ITM y el contratista deberá',
                'constar por escrito con copia al supervisor del contrato. 15) Informar por escrito y en forma oportuna al ITM, los impedimentos para el cumplimiento del objeto contractual, referente a las obligaciones específicas. 16) DEBER DE CONFIDENCIALIDAD": El DistritoEspecial de Ciencia, Tecnología e Innovación de Medellín es el propietario de la información y las bases de datos actualizadas, documentadas y depuradas que el contratista recolecte durante el desarrollo del objeto contractual, en tal sentido le asiste al contratista el deber de confidencialidad, comprometiéndose a hacer uso debido de la información que conoce y a retornarla alDistrito Especial de Ciencia, Tecnología e Innovación de Medellín al terminar su vínculo',
                'contractual. Así mismo no podrá utilizar información para beneficio propio o de terceros. El contratista se compromete a garantizar la reserva de la información económica, financiera y tributaria que se le suministre para el desarrollo del objeto contractual. 17) Se obliga a responder civil y penalmente por sus acciones y omisiones en la actuación contractual, en los términos de la Ley. 18. El contratista deberá dar cumplimiento al Decreto 1072 de 2015 que establece el Sistema de Gestión de Seguridad y Salud en el',
                'trabajo SG-SST en lo que aplique. 19. El contratista deberá dar cumplimiento a la norma NTC-ISO 14001 de 2015, que establece el Sistema de Gestión Ambiental SGA en lo que aplique. 20) En ejecución de sus actividades el contratista debe disponer de manera correcta los residuos que su ejecución pueda generar. 21) El contratista deberá informar al ITM, si debe realizar sus actividades por fuera del lugar en el que normalmente las ejecuta, para que la Institución informe a la ARL dicha situación. 22) Desplazarse por sus propios medios al lugar requerido para realizar las actividades contractuales inherentes al objeto contractual, haciendo uso de los elementos de identificación establecidos por el proyecto.23)Deberá cumplir con las medidas de prevención y precaución dadas por el Gobierno Nacional, Departamental y Municipales en los Decretos sancionados en relación a la pandemia que se surte hoy en el mundo llamada COVID-19; Adicionalmente y de conformidad con la normatividad expedida por el Gobierno Nacional en lo relativo al Estado de Emergencia Económica,',
                'Social y Ecológica, eberá, debido a la naturaleza de sus actividades, objeto contractual y desarrollo en territorio de las mismas, adoptar todas las medidas personales de prevención, precaución, higiene y distanciamiento social, en aras de evitar el posible contagio o propagación del virus, para lo cual deberá hacer uso de los elementos de protección personal, en aras de mantener las condiciones de salubridad necesarias para la prestación del servicio presencial. así mismo se acoge a lo establecido por el ITM para el desarrollo de su actividad laboral en casa cuando haya lugar a ésta. 24) Las demás inherentes al objeto del contrato. OBLIGACIONES ESPECIFICAS:1.Realizar seguimiento a la inversión pública y su evaluación respectiva a través de la identificación del cumplimiento de objetivos trazados y su grado de ejecución.2.Generar alertas y recomendaciones de la inversión pública una vez se haya identificado los objetivos y su grado de ejecución.3.Realizar informes que consoliden la',
                'información recolectada del seguimiento mensual y la evaluación trimestral realizada a la inversión pública.4.Recolectar información asociada a los procesos presupuestales que permita elaborar el POAI de la respectiva vigencia y distribuirlo a las dependencias de acuerdo con los criterios establecidos e identificados.5.Sugerir a las diferentes dependencias la construcción de los mecanismos de planificación que permitan un oportuno seguimiento y priorización a la inversión pública.6.Elaborar respuestas y requerimientos, tanto de entidades internas como externas, que requieran información respecto al seguimiento de la inversión pública y los proyectos del Plan de Desarrollo 2020 – 2023.ADICIONALMENTE',
                'debera cumplir con los siguientes productos:1.Formato de seguimiento a proyectos de inversión.2.informe de seguimiento a los proyectos de inversión.3.informes de análisis, presentación de la evaluación realizada.4.Formatos de presupuesto, presentaciones a las dependencias, POAI elaborado.5.Presentación de los resultados del análisis para las reuniones estratégicas.6.Informe que contenga reporte de respuestas elaboradas.7 El CONTRATISTA se obliga igualmente a responder civil y penalmente por sus acciones y omisiones en la actuación contractual, en los términos de la Ley (Artículos P-6240 DE 2022 52º Ley 80 de 1993). QUINTA. -DERECHOS Y DEBERES. Las partes declaran conocer y desarrollar los derechos y deberes consagrados en la Ley 80 de 1993 y cumplir las obligaciones específicas consagradas en este contrato. SEXTA. - MODIFICACIÓN, INTERPRETACIÓN Y TERMINACIÓN DEL CONTRATO. EL INSTITUTO tendrá la dirección general y la responsabilidad de ejercer control y vigilancia de la ejecución del contrato. En consecuencia, este contrato se rige por los principios de modificación unilateral, interpretación unilateral y terminación unilateral por parte del Instituto Tecnológico Metropolitano',
                'conforme a las disposiciones contenidas en los Artículos 14, 15, 16 y 17 de la Ley 80 de 1993 (modificado por ley 1150 de 2007), la cual para todos los efectos legales hace parte integral de este contrato. SÉPTIMA. -CADUCIDAD. EL INSTITUTO, podrá declarar la caducidad si se presentan algunos de los hechos constitutivos del incumplimiento de las obligaciones a cargo del contratista, que afecta de manera grave y directa la ejecución del contrato, y evidencie que puede conducir a su paralización. La Entidad por acto administrativo debidamente motivado lo dará por terminado y ordenará su liquidación en el estado en que se encuentre. OCTAVA. -EFECTOS DE LA CADUCIDAD. Declarada la caducidad, no habrá lugar a la indemnización para el contratista, quien se hará acreedor a las sanciones e inhabilidades previstas en la Ley 80 de 1993, y las normas que la reglamentan y adicionan, Decreto 1082 de 2015. NOVENA. -MORA O INCUMPLIMIENTO PARCIAL. En caso de mora o incumplimiento parcial de las obligaciones adquiridas por EL CONTRATISTA, de acuerdo a las cláusulas del presente contrato, podrá EL INSTITUTO, mediante',
                'Resolución motivada, imponer multas, las cuales deberán ser directamente proporcionales al valor del contrato y a los perjuicios que sufra EL INSTITUTO, sin exceder del cinco por mil (5 x 1.000) del valor del contrato cada vez que se impongan. DÉCIMA-CLÁUSULA PENAL PECUNIARIA. Sin perjuicio de lo dispuesto en las cláusulas anteriores, EL INSTITUTO podrá imponer al CONTRATISTA, en caso de declaratoria de caducidad o de incumplimiento como pena, una suma equivalente al diez por ciento (10%) del valor del contrato. El valor de la cláusula penal que se haga efectiva, se considera como pago parcial pero definitivo de los perjuicios causados al INSTITUTO. DECIMA PRIMERA. -DE LA APLICACIÓN DE LA MULTA Y LA CLÁUSULA PENAL PECUNIARIA. Una vez ejecutoriados los actos administrativos que la imponen podrán ser tomados dichos valores del saldo a favor del CONTRATISTA o de las garantías constituidas. Si no fuere',
                'posible lo anterior, se cobrará por jurisdicción coactiva. DECIMA SEGUNDA. -DEL PROCEDIMIENTO PARA LA IMPOSICION DE LA MULTA: De conformidad con lo dispuesto en el artículo 86 de la Ley 1474 de 2011, en concordancia con los artículos 29 de la Constitución Política y 17 de la Ley 1150 de 2007 reglamentado por el Decreto 1082 de 2015, el procedimiento en caso de imposición de multas, sanciones o declaratoria de incumplimiento será el previsto en el artículo 86 de la ley. DECIMA TERCERA. -CESIÓN DEL CONTRATO. Los contratos de prestación de servicios estatales son "intuitupersona" y, en consecuencia, una vez celebrados no podrán cederse, salvo los casos en que medie autorización expedida por la Rectoría de la entidad, en acto administrativo debidamente sustentado. DÉCIMA CUARTA. -TERMINACIÓN DEL CONTRATO. - El presente contrato podrá darse por terminado cuando: a) Las partes de mutuo acuerdo decidan dar',
                'por terminado el contrato. b) Cuando de la aplicación de las causales establecidas en la cláusula sexta, opere la terminación anticipada del contrato. c) Cuando el contratista incumpla alguna de las obligaciones contractuales contraídas, sin perjuicio de realizar el proceso de aplicación de multas y/o de la aplicación de la cláusula penal pecuniaria. d) Cuando culmine el plazo de ejecución del contrato. DÉCIMA QUINTA. -CAUSALES DE SUSPENSIÓN DEL CONTRATO El presente contrato podrá suspenderse a) cuando el contratista por cualquier causal no pueda prestar el servicio para el cual fue contratado. Esta causal incluye enfermedad general, invalidez temporal, licencia de maternidad, licencia de paternidad y todas aquellas circunstancias de hecho y de derecho que no permitan la prestación adecuada de los servicios. b) Cuando el contratista no cumpla con los pagos al sistema general de seguridad social dentro del tiempo establecido por la Ley y que, no sea presentado de manera oportuna a la entidad Contratante. c) Por mutuo acuerdo de las partes. DÉCIMA SEXTA. -NATURALEZA',
                'JURÍDICA DEL CONTRATO. El presente contrato está fundamentado en el contenido del artículo 32 de la Ley 80 de 1993, el artículo 2, numeral 4, literal h) y artículo tercero de la Ley 1150 de 2007, reglamentado por el Decreto 1082 de 2015; la Ley 527 de P-6240 DE 2022 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio de Salud y Protección Social No. 385 y 407 de 2020 y demás normas afines con la materia. Además, se celebra en consideración a las calidades personales del CONTRATISTA, para el desempeño de actividades transitorias, toda vez que el objeto del mismo no es posible llevarlo a cabo con personal de la planta de cargos. EL',
                'CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL INSTITUTO en consecuencia no adquiere ningún vínculo de carácter laboral ni administrativo con él. DÉCIMA SEPTIMA. -INHABILIDADES E INCOMPATIBILIDADES. El presente contrato está sujeto a las inhabilidades e incompatibilidades contempladas en la Ley 80 de 1993 (modificada por ley 1150 de 2007) y EL CONTRATISTA, para todos los efectos legales de este contrato, declara que no está incluido dentro de dichas inhabilidades e incompatibilidades legales. DÉCIMA OCTAVA. -SUPERVISIÓN: La Supervisión de este contrato estará a cargo del Jefe de Oficina – Unidad Estratégica de Negocios o quien el INSTITUTO delegue, quien ejercerá actividades de supervisión y vigilancia técnica, administrativa y financiera del contrato. Es responsabilidad del supervisor verificar que EL CONTRATISTA haya adecuado sus afiliaciones al Sistema Integral de Seguridad Social en Salud y Pensiones, conforme a lo establecido en el presente contrato. DÉCIMA NOVENA. -APROPIACIÓN PRESUPUESTAL. El pago de las',
                'sumas de dinero que el INSTITUTO queda obligado en razón de éste contrato, se subordina a la apropiación presupuestal que de ella se haga en el respectivo presupuesto. VIGÉSIMA. -IMPUTACIÓN DE GASTOS. Los gastos que demanden la legalización del presente contrato correrán a cargo del CONTRATISTA, y los que impliquen para el INSTITUTO el cumplimiento del mismo durante la presente vigencia fiscal se hace con cargo al certificado de compromiso No. 6240, el cual hace parte integral de los Anexos de éste contrato. VIGÉSIMA PRIMERA. -AFILIACIÓN AL SISTEMA GENERAL DE SEGURIDAD SOCIAL. Con el objeto de dar cumplimiento a lo preceptuado en Ley 100 de 1993 y la Ley 789 de 2002, los Decretos 1990 de 2016, 780 de 1996, 1273 de 2018, Ley 1955 del 25 de mayo de 2019 el CONTRATISTA para la suscripción del contrato deberá presentar constancia de afiliación al sistema integral de seguridad social en Salud, Pensiones y ARL como trabajador independiente. El artículo 1 del Decreto 1273 de 2018,',
                'por medio del cual se modifica el artículo 2.2.1.1.1.7 del Decreto 780 de 2016, establece lo siguiente: “El pago de las cotizaciones al Sistema de Seguridad Social Integral de los trabajadores independientes se efectuará mes vencido, por periodos mensuales, a través de la Planilla Integrada de Liquidación de Aportes (PILA) y teniendo en cuenta los ingresos percibidos en el periodo de cotización, esto es, el mes anterior.”, atendiendo lo contemplado en el artículo 3.2.7.6 del Decreto 1273 de 2018, sobre “Plazos”. Así mismo el Decreto 1273 de 2018, establece: 1. El Ingreso Base de Cotización (IBC) corresponde como mínimo al 40% del valor mensualizado en cada contrato de prestación de servicios, sin incluir el Impuesto al Valor Agregado(IVA) cuando a ello haya lugar, y en ningún caso el IBC podrá ser inferior al salario mínimo mensual legal vigente ni superior a 25 veces el salario mínimo mensual legal vigente; 5. Cuando no haya lugar al pago de los servicios contratados, de conformidad con lo dispuesto para el efecto en el contrato, estará a cargo del contratista el pago de los',
                'aportes al Sistema de Seguridad Social Integral y los intereses moratorios a que hubiere lugar; en estos eventos excepcionales, el contratista deberá acredita al contratante el pago del periodo correspondiente; 7. Al contratista le corresponde pagar mes vencido el valor de la cotización al Sistema General de Riesgos Laborales, cuando la afiliación sea por riesgo I,II o III, conforme la clasificación de actividades económicas establecidas en el Decreto 1607 de 2002 o la norma que lo modifique , adicione o sustituya; en tanto que el contratante deberá pagar el valor de la cotización mes vencido, cuando la afiliación del contratista por riesgo IV y V. PARÁGRAFO PRIMERO: De conformidad con lo establecido en el artículo 3.2.2.1. del Decreto 1990 de diciembre de 2016, ha modificado los plazos para la autoliquidación y el pago de los aportes al Sistema de Seguridad Social Integral y Aportes Parafiscales, así: Todos los aportantes a los Sistemas de Salud, Pensiones y Riesgos Laborales del Sistema de Seguridad Social Integral, así como aquellos a favor del Servicio Nacional del Aprendizaje –SENA–, del Instituto Colombiano de Bienestar Familiar –ICBF– y',
                'de las Cajas de Compensación Familiar, efectuarán sus aportes utilizando la Planilla Integrada de Liquidación de Aportes –PILA–, bien sea en su modalidad electrónica o asistida, a más tardar en las fechas que se indican a continuación:',
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    colSpan: 2,
                                    text: 'TRABAJADORES INDEPENDIENTES',
                                    style: 'tableHeader',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                }
                            ],
                            [
                                {
                                    text: 'Dos últimos dígitos del NIT o documento de identificación',
                                    style: 'tableHeader',
                                    aligment: 'center'
                                }, {
                                    text: 'Día hábil de cada mes de vencimiento',
                                    style: 'tableHeader',
                                    aligment: 'center'
                                }
                            ],
                            [
                                {
                                    text: '00 al 07',
                                    style: 'tableHeader',
                                }, {
                                    text: this.contrato,
                                }
                            ],
                            [
                                {
                                    text: '08 al 14',
                                    style: 'tableHeader',
                                }, {
                                    text: new Date(),
                                }
                            ],
                            [
                                {
                                    text: '15 al 21',
                                    style: 'tableHeader',
                                }, {
                                    text: '3 MESES Y VEINTICINCO DÍAS',
                                }
                            ],
                            [
                                {
                                    text: '22 a 28',
                                    style: 'tableHeader',
                                },
                                {
                                    text: ''
                                }
                            ],
                            [
                                {
                                    text: '29 al 35',
                                    style: 'tableHeader',
                                }, {
                                    text: '3 MESES Y VEINTICINCO DÍAS',
                                }
                            ],
                            [
                                {
                                    text: '36 al 42',
                                    style: 'tableHeader',
                                }, {
                                    text: 'DIEGO ALEJANDRO MARÍN CIFUENTES',
                                }
                            ],
                        ],
                    },
                },
                'PARÁGRAFO SEGUNDO: Una vez efectuado el pago, deberá remitir la constancia al ITM. Lo anterior para la verificación de la respectiva cancelación de aportes. En caso de no acreditar el pago en la fecha establecida, el ITM podrá realizar la  suspensión del contrato. PARÁGRAFO TERCERO: Los trabajadores independientes con contrato de prestación de  servicios personales, deberán continuar efectuando el pago de sus aportes a la seguridad social, directamente',
                'mediante la planilla integrada de liquidación de aportes – PILA, en la forma en que lo han venido haciendo y en las fechas  establecidas en el artículo 3.2.2.2.1 del Decreto 780 de 2016. VIGÉSIMA. SEGUNDA. -CLÁUSULA DE INDEMNIDAD.  El contratista mantendrá indemne al Instituto, de cualquier reclamación proveniente de terceros que tenga como causa',
                'las actuaciones del contratista, de conformidad con la normatividad vigente. VIGÉSIMA TERCERA. -PAGO DE LOS  CONTRATOS. El ITM realizará los pagos que demande el convenio y/o contrato sujeto a la confirmación del ingreso de  los recursos transferidos por Municipio de Medellín a la cuenta bancaria del ITM donde son administrados los recursos.  VIGÉSIMA CUARTA. - PUBLICIDAD EN EL SECOP. El presente contrato deberá ser publicado en el SECOP,',
                'con fundamento en lo dispuesto artículo 2.2.1.1.1.7.1 del Decreto 1082 de 2015. VIGÉSIMA QUINTA. - PERFECCIONAMIENTO Y DOCUMENTOS DEL CONTRATO. . De conformidad con del Artículo 41 de la Ley 80 de 1993  en concordancia con los protocolos institucionales adoptados en el marco de la emergencia de salud pública y la Ley 527  de 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio',
                'de Salud y Protección Social No. 385 y 407 de 2020, el presente contrato se perfecciona con el acuerdo sobre el objeto y la contraprestación y la firma de este escrito mediante el acuse de recibido por correo electrónico del contratista suministrado por el contratista danieladiazcalle@gmail.com quien certifica que es de su propiedad y uso exclusivo. Para la ejecución se requerirá la aprobación de la existencia de las disponibilidades presupuéstales',
                'correspondientes. Para todos los efectos legales se entienden incorporados al presente contrato la Ley 80 de 1993 y normas concordantes, es decir, los decretos reglamentarios, así mismo los siguientes documentos anexos: 1) Carta de adjudicación del Rector 2) Certificado  de compromiso presupuestal 3) Formato único de hoja de vida para el Sector Público (Ley 190 de 1995); 4) Formato de  declaración de Rentas y Bienes 5) Autorización de consignación para pago; 6) Fotocopia de cédula de ciudadanía; 7)',
                'Fotocopia Libreta Militar (en los casos que aplique) ; 8) Certificado de Antecedentes Disciplinarios; 9) Certificado de Responsabilidad Fiscal; 10) Certificado de la Policía Nacional; 11) Certificado de Medidas correctivas. 12) Certificado de afiliación a la seguridad social (salud y pensión) como independiente; 13) Fotocopia del Rut; 14) Fotocopia de los certificados que acrediten los estudios y experiencia laboral; 16) Examen pre-ocupacional.',
                { text: '\n\n Para constancia se firma el presente contrato por las partes en la ciudad de Medellín ' },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5],
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    align: 'center',
                    margin: [0, 0, 10, 10],
                },
                tableExample: {
                    margin: [0, 5, 0, 15],
                },
                title: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 10, 0, 0],
                },
            },
            defaultStyle: {
                // alignment: 'justify'
            },
        };
        let test = pdfMake
            .createPdf(documentDefinition)
            .download('pruebaMinuta.pdf');
        console.log(test);
    }
}
