import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
    selector: 'app-create-pdf',
    templateUrl: './create-pdf.component.html',
    styleUrls: ['./create-pdf.component.scss'],
    providers: [DatePipe],
})
export class CreatePdfComponent implements OnInit {
    //@ViewChild('pdfTable') pdfTable: ElementRef;
    myDate = new Date();

    constructor(private datePipe: DatePipe) {}

    ngOnInit(): void {}

    public downloadAsPDFs() {
        let dat = this.datePipe.transform(
            this.myDate,
            'EEEE, MMMM d, y',
            'utc'
        );
        const documentDefinition = {
            pageSize: 'A4',
            pageOrientation: 'FOLIO',
            pageMargins: [40, 80, 40, 60],
            header: {
                margin: [20, 20],
                table: {
                    color: '#444',
                    style: 'tableExample',
                    widths: [100, 210, 'auto', 70, 70],
                    headerRows: 3,
                    body: [
                        [
                            {
                                rowSpan: 3,
                                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABACAMAAABvJxYMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUAAAAMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVv////Mb2P8AAAA/XRSTlMAAAIBAyF5qY0jBBEiOE9lipiip6uo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',
                                style: 'title',
                                fit: [100, 100],
                            },
                            {
                                rowSpan: 3,
                                colSpan: 2,
                                text: 'ESTUDIO PREVIO CONTRATACIÓN DIRECTA PRESTACIÓN DE SERVICIOS',
                                style: 'title',
                                alignment: 'center',
                            },
                            {},
                            {
                                text: 'Código',
                            },
                            {
                                text: 'FBS 057',
                            },
                        ],
                        ['', '', '', 'Versión', '09'],
                        ['', '', '', 'Fecha', '03/02/2023'],
                    ],
                },
            },

            footer: {
                margin: [10, 10],
                text: 'Medellín - Colombia',
                alignment: 'center',
            },
            content: [
                {
                    text: 'Fecha de Elaboración: ' + dat,
                    style: 'subheader',
                    margin: [10, 10, 10, 10],
                },
                {
                    text: 'Rector',
                    style: 'marginRector',
                    margin: [10, 0, 0, 0],
                },
                {
                    text: 'Jhojan Alejandro Hernandez',
                    bold: true,
                    style: 'fontPeque2',
                    margin: [10, 0, 0, 0],
                },
                {
                    text: 'Instituto Tecnológico Metropolitano',
                    style: 'fontPeque2',
                    margin: [10, 0, 0, 0],
                },
                {
                    text: 'Ciudad',
                    style: 'fontPeque2',
                    margin: [10, 0, 0, 0],
                },
                {
                    margin: [10, 10, 10, 10],
                    text: [
                        {
                            text: 'Asunto : ',
                            fontSize: 10,
                            bold: true,
                        },
                        {
                            text: 'Estudios Previos para la contratación de prestación de servicios.',
                            fontSize: 10,
                        },
                    ],
                },
                {
                    text: 'Respetado Rector,',
                    style: 'fontPeque2',
                    margin: [10, 10, 10, 10],
                },
                {
                    margin: [10, 10, 10, 10],
                    text: [
                        {
                            text: 'La Unidad Estratégica de Negocios del ITM, requiere celebrar un contrato de prestación de servicios en la gestión como Profesional para realizar el seguimiento, análisis y evaluación a la Inversión Pública correspondientes al Contrato Interadministrativo No.',
                            fontSize: 10,
                        },
                        {
                            text: ' 4600095169',
                            fontSize: 11,
                        },
                        {
                            text: ' de ',
                            fontSize: 10,
                        },
                        {
                            text: '2023, ',
                            fontSize: 11,
                        },
                        {
                            text: 'cuyo objeto es',
                            fontSize: 10,
                        },
                        {
                            text: ' CONTRATO INTERADMINISTRATIVO PARA EL ACOMPAÑAMIENTO EN LOS PROCESOS DE GESTIÓN, IMPLEMENTACIÓN Y SEGUIMIENTO DE POLÍTICAS PÚBLICAS, PLANES Y PROGRAMAS EN LAS DIFERENTES DIMENSIONES DEL DESARROLLO A CARGO DEL DAP.',
                            fontSize: 11,
                        },
                    ],
                },
                {
                    text: 'Este requerimiento se fundamenta en el siguiente estudio:',
                    style: 'fontPeque2',
                    margin: [10, 10, 10, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: [100, '*'],
                        body: [
                            [
                                {
                                    colSpan: 2,
                                    text: 'DESCRIPCIÓN DE LA NECESIDAD O PROBLEMA INSTITUCIONAL QUE SE PRETENDE SATISFACER',
                                    style: 'titleTable2',
                                    fillColor: '#4FAACD',
                                },
                                {},
                            ],
                            [
                                {
                                    stack: [
                                        {
                                            text: 'Centro de costos o área de negocios',
                                            style: 'title',
                                            margin: [10, 10, 10, 10],
                                        },
                                        {
                                            text: 'Definición de la Necesidad',
                                            style: 'title',
                                            margin: [10, 100, 10, 10],
                                        },
                                    ],
                                },
                                [
                                    {
                                        table: {
                                            widths: [
                                                50, 50, 50, 50, 50, 50, 50,
                                            ],
                                            body: [
                                                [
                                                    {
                                                        text: 'Código Área de Negocio',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'Nombre Área de Negocio',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'Código Centro de Costos',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'Nombre Centro de Costos Nuevo',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'Misional o de Apoyo',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'Inversión o Funcionamiento',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'Proyecto',
                                                        style: 'fontPeque',
                                                    },
                                                ],
                                                [
                                                    {
                                                        text: '070201271525',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: '95169/2022 APOYO A LA GESTION DEL DAP',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: '1016231102123',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'CONVENIOS Y INTERADMINISTRATIVOS',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'APOYO',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: 'FUNCIONAMIENTO',
                                                        style: 'fontPeque',
                                                    },
                                                    {
                                                        text: '211- GASTOS PERSONALES',
                                                        style: 'fontPeque',
                                                    },
                                                ],
                                            ],
                                        },
                                    },
                                    {
                                        margin: [10, 10, 10, 10],
                                        text: [
                                            {
                                                text: 'El Plan de Desarrollo Institucional “ITM: A Otro Nivel”, 2020-2023, está orientado a trascender de la innovación competitiva a la que transforma, a partir de la articulación de la ciencia, la tecnología, la innovación y la producción artística, aportando desde su vocación tecnológica y compromiso social al logro de un modelo sostenible para la humanidad. El Plan de Desarrollo Institucional fue aprobado el día 29 de mayo de 2020 por El Consejo Directivo del Instituto Tecnológico Metropolitano Institución Universitaria, en ejercicio de sus atribuciones legales y estatutarias. La Unidad Estratégica de Negocios, observado la nueva propuesta rectoral, en especial el Gran Pilar No. 4, denominado “Modelo de gestión flexible, eficiente y sostenible” y con el fin de dar cumplimiento a objeto contractual fijado en el Contrato interadministrativo número 4600095169 cuyo objeto es ',
                                                fontSize: 10,
                                            },
                                            {
                                                text: ' CONTRATO INTERADMINISTRATIVO PARA EL ACOMPAÑAMIENTO EN LOS PROCESOS DE GESTIÓN,IMPLEMENTACIÓN Y SEGUIMIENTO DE POLÍTICAS PÚBLICAS, PLANES Y PROGRAMAS EN LAS DIFERENTES DIMENSIONES DEL DESARROLLO A CARGO DEL DAP., ',
                                                fontSize: 11,
                                            },
                                            {
                                                text: ' se solicita se autorice la contratación del siguiente personal, para así poder realizar actividades de acompañamiento y apoyo a la gestión, para la implementación y seguimiento al Plan de Desarrollo Distrital, Sistema Distrital de Planeación y los diferentes instrumentos de planificación y evaluación.',
                                                fontSize: 10,
                                            },
                                        ],
                                    },
                                    {
                                        margin: [20, 10, 20, 10],
                                        style: 'tableExample',
                                        table: {
                                            headerRows: 2,
                                            widths: [180, 180],
                                            body: [
                                                [
                                                    {
                                                        colSpan: 2,
                                                        text: 'PERFIL DEL CONTRATISTA REQUERIDO POR EL ITM',
                                                        style: 'titleTable2',
                                                        bold: true,
                                                        fillColor: '#3F91B1',
                                                    },
                                                    {},
                                                ],
                                                [
                                                    {
                                                        text: 'REQUISITOS ACADÉMICOS',
                                                        style: 'titleTable2',
                                                        bold: true,
                                                        fillColor: '#A2B1B6',
                                                    },
                                                    {
                                                        text: 'REQUISITOS DE EXPERIENCIA',
                                                        style: 'titleTable2',
                                                        bold: true,
                                                        fillColor: '#A2B1B6',
                                                    },
                                                ],
                                                [
                                                    {
                                                        text: 'PROFESIONAL EN CUALQUIER AREA DEL CONOCIMIENTO',
                                                        bold: true,
                                                        style: 'fontPeque2',
                                                    },
                                                    {
                                                        text: 'CON 1 AÑO DE EXPERIENCIA',
                                                        style: 'fontPeque2',
                                                    },
                                                ],
                                            ],
                                        },
                                    },
                                ],
                            ],
                        ],
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    pageBreak: 'before',
                    style: 'tableExample',
                    table: {
                        widths: [100, '*'],
                        body: [
                            [
                                {
                                    colSpan: 2,
                                    text: 'DESCRIPCIÓN DEL OBJETO A CONTRATAR',
                                    style: 'titleTable2',
                                    fillColor: '#4FAACD',
                                },
                                {},
                            ],
                            [
                                {
                                    stack: [
                                        {
                                            text: 'Descripción del objeto y sus Especificaciones Técnicas',
                                            style: 'title',
                                            margin: [10, 200, 10, 10],
                                        },
                                    ],
                                },
                                [
                                    {
                                        margin: [6, 6],
                                        text: [
                                            {
                                                text: 'Objeto : ',
                                                fontSize: 10,
                                                bold: true,
                                            },
                                            {
                                                text: ' Prestación de servicios como contratista independiente, sin vínculo laboral por su propia cuenta y riesgo para realizar la gestion de Profesional para realizar el seguimiento, análisis y evaluación a la Inversión Pública en ejecución del Contrato Interadministrativo No ',
                                                fontSize: 9,
                                            },
                                            {
                                                text: '4600095169 DE 2022, ',
                                                fontSize: 10,
                                            },
                                            {
                                                text: 'celebrado entre ',
                                                fontSize: 9,
                                            },
                                            {
                                                text: ' EL DISTRITO ESPECIAL DE CIENCIA TECNOLOGÍA E INNOVACIÓN DE MEDELLÍN – DEPARTAMENTO ADMINISTRATIVO DE PLANEACIÓN y el ITM.',
                                                fontSize: 9,
                                            },
                                        ],
                                    },
                                    {
                                        margin: [6, 6],
                                        text: [
                                            {
                                                text: 'Alcance del objeto: ',
                                                fontSize: 10,
                                                bold: true,
                                            },
                                            {
                                                text: ' Para el cumplimiento del objeto el contratista deberá desarrollar todas las actividades que sean necesarias para realizar la gestión como Profesional para realizar el seguimiento, análisis y evaluación a la Inversión Pública',
                                                style: 'fontSegundapagPeque',
                                            },
                                        ],
                                    },
                                    {
                                        margin: [6, 6],
                                        text: [
                                            {
                                                text: 'Especificaciones Técnicas: ',
                                                fontSize: 10,
                                                bold: true,
                                            },
                                            {
                                                text: 'Para efectos del cumplimiento del contrato el contratista deberá cumplir con las siguientes actividades:',
                                                style: 'fontSegundapagPeque',
                                            },
                                        ],
                                    },
                                    {
                                        margin: [6, 6],
                                        text: [
                                            {
                                                text: 'OBLIGACIONES GENERALES: ',
                                                style: 'fontSegundapagPeque',
                                            },
                                            {
                                                text: '1) Presentar el informe de gestión de manera mensual al ITM de las actividades realizadas con el visto bueno requerido. 2) Presentar el Informe final de las actividades realizadas durante la ejecución del contrato. 3)',
                                                style: 'fontSegundapagPeque',
                                            },
                                            {
                                                text: ' EL CONTRATISTA ',
                                                fontSize: 10,
                                            },
                                            {
                                                text: 'acepta que la propiedad intelectual sobre los estudios, documentos y en general los productos resultantes de la ejecución del presente contrato, quedará a cargo del Distrito Especial de Ciencia, Tecnología e Innovación de Medellín. 4) Concertar la presencialidad requerida. 5) Observar e implementar las directrices institucionales sobre la administración de documentos. 6) Cumplir a cabalidad con el objeto contractual, en la forma y plazo establecido en el mismo, y con las especificaciones técnicas señaladas en los estudios previos. 7) Cumplir con la prestación del servicio requerido en el sitio acordado con el supervisor del contrato, según las especificaciones técnicas indicadas en los estudios previos. 8) Acatar las recomendaciones del supervisor, como enlace directo entre el ITM y el Contratista. 9) Presentar las facturas o cuentas de cobro correspondientes a las actividades realizadas durante la ejecución del contrato. 10) Abstenerse de presentar la factura o cuenta de cobro por encima del presupuesto disponible, de acuerdo con el valor del contrato. 11) Garantizar la prestación del servicio según las condiciones previamente estipuladas entre el contratista y el supervisor. 12) Informar por escrito al supervisor, las quejas, dudas, reclamos y demás inquietudes que puedan surgir en el desarrollo del objeto contractual. 13) Atender los requerimientos que sean formulados por el supervisor y para efectos de ejecutar en debida forma el contrato. 14) Toda comunicación entre el ITM y el contratista deberá constar por escrito con copia al supervisor del contrato. 15) Informar por escrito y en forma oportuna al ITM, los impedimentos para el cumplimiento del objeto contractual, referente a las obligaciones específicas. 16)',
                                                style: 'fontSegundapagPeque',
                                            },
                                            {
                                                text: ' "DEBER DE CONFIDENCIALIDAD"',
                                                fontSize: 10,
                                            },
                                            {
                                                text: ': El Distrito Especial de Ciencia, Tecnología e Innovación de Medellín es el propietario de la información y las bases de datos actualizadas, documentadas y depuradas que el contratista recolecte durante el desarrollo del objeto contractual, en tal sentido le asiste al contratista el deber de confidencialidad, comprometiéndose a hacer uso debido de la información que conoce y a retornarla alDistrito Especial de Ciencia, Tecnología e Innovación de Medellín al terminar su vínculo contractual. Así mismo no podrá utilizar información para beneficio propio o de terceros. El contratista se compromete a garantizar la reserva de la información económica, financiera y tributaria que se le suministre para el desarrollo del objeto contractual. 17) Se obliga a responder civil y penalmente por sus acciones y omisiones en la actuación contractual, en los términos de la Ley. 18. El contratista deberá dar cumplimiento al Decreto 1072 de 2015 que establece el Sistema de Gestión de Seguridad y Salud en el trabajo SG-SST en lo que aplique. 19. El contratista deberá dar cumplimiento a la norma',
                                                style: 'fontSegundapagPeque',
                                            },
                                            {
                                                text: ' a NTC-ISO 14001 de 2015, ',
                                                fontSize: 10,
                                            },
                                            {
                                                text: 'que establece el Sistema de Gestión Ambiental SGA en lo que aplique. 20) En ejecución de sus actividades el contratista debe disponer de manera correcta los residuos que su ejecución pueda generar. 21) El contratista deberá informar al ITM, si debe realizar sus actividades por fuera del lugar en el que normalmente las ejecuta, para que la Institución informe a la ARL dicha situación. 22) Desplazarse por sus propios medios al lugar requerido para realizar las actividades contractuales inherentes al objeto contractual, haciendo uso de los elementos de identificación establecidos por el proyecto.23)Deberá cumplir con las medidas de prevención y precaución dadas por el Gobierno Nacional, Departamental y Municipales en los Decretos sancionados en relación a la pandemia que se surte hoy en el mundo llamada COVID-19; Adicionalmente y de conformidad con la normatividad expedida por el Gobierno Nacional en lo relativo',
                                                style: 'fontSegundapagPeque',
                                            },
                                        ],
                                    },
                                ],
                            ],
                        ],
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    pageBreak: 'before',
                    style: 'tableExample',
                    table: {
                        widths: [100, '*'],
                        body: [
                            [
                                [
                                    {
                                        text: '',
                                        style: 'title',
                                        margin: [10, 200, 10, 10],
                                    },
                                    {
                                        text: 'Tipo de Contrato',
                                        style: 'title2',
                                        margin: [10, 80, 10, 10],
                                    },
                                    {
                                        text: 'Plazo de Ejecución',
                                        style: 'title2',
                                        margin: [5, 5, 5, 5],
                                    },
                                    {
                                        text: 'Duración del Contrato Interadministrativo número 4600095169 de 2022',
                                        style: 'title2',
                                    },
                                    {
                                        text: 'Forma de pago',
                                        style: 'title2',
                                        margin: [0, 5, 0, 0],
                                    },
                                    {
                                        text: 'Supervisor',
                                        style: 'title2',
                                        margin: [5, 70, 5, 5],
                                    },
                                ],
                                [
                                    {
                                        margin: [6, 6],
                                        text: [
                                            {
                                                text: 'OBLIGACIONES GENERALES: ',
                                                style: 'fontSegundapagPeque',
                                            },
                                            {
                                                text: 'al Estado de Emergencia Económica, Social y Ecológica, deberá, debido a la naturaleza de sus actividades, objeto contractual y desarrollo en territorio de las mismas, adoptar todas las medidas personales de prevención, precaución, higiene y distanciamiento social, en aras de evitar el posible contagio o propagación del virus, para lo cual deberá hacer uso de los elementos de protección personal, en aras de mantener las condiciones de salubridad necesarias para la prestación del servicio presencial. así mismo se acoge a lo establecido por el ITM para el desarrollo de su actividad laboral en casa cuando haya lugar a ésta. 24) Las demás inherentes al objeto del contrato. OBLIGACIONES ESPECIFICAS:1.Realizar seguimiento a la inversión pública y su evaluación respectiva a través de la identificación del cumplimiento de objetivos trazados y su grado de ejecución.2.Generar alertas y recomendaciones de la inversión pública una vez se haya identificado los objetivos y su grado de ejecución.3.Realizar informes que consoliden la información recolectada del seguimiento mensual y la evaluación trimestral realizada a la inversión pública.4.Recolectar información asociada a los procesos presupuestales que permita elaborar el POAI de la respectiva vigencia y distribuirlo a las dependencias de acuerdo con los criterios establecidos e identificados.5.Sugerir a las diferentes dependencias la construcción de los mecanismos de planificación que permitan un oportuno seguimiento y priorización a la inversión pública.6.Elaborar respuestas y requerimientos, tanto de entidades internas como externas, que requieran información respecto al seguimiento de la inversión pública y los proyectos del Plan de Desarrollo 2020 – 2023.ADICIONALMENTE debera cumplir con los siguientes productos:1.Formato de seguimiento a proyectos de inversión.2.informe de seguimiento a los proyectos de inversión.3.informes de análisis, presentación de la evaluación realizada.4.Formatos de presupuesto, presentaciones a las dependencias, POAI elaborado.5.Presentación de los resultados del análisis para las reuniones estratégicas.6.Informe que contenga reporte de respuestas elaboradas.7',
                                                style: 'fontSegundapagPeque',
                                            },
                                        ],
                                    },
                                    {
                                        text: 'Prestación de servicios profesionales y de apoyo a la gestión.',
                                        style: 'fontSegundapagPeque',
                                        margin: [10, 5, 10, 10],
                                    },
                                    {
                                        text: '03 MESES y 17 DIAS sin exceder la vigencia 2022',
                                        style: 'fontSegundapagPeque',
                                        margin: [10, 5, 10, 10],
                                    },
                                    {
                                        text: 'Cuatro (4) meses, sin superar la vigencia 2022.',
                                        style: 'fontSegundapagPeque',
                                        margin: [10, 10, 10, 10],
                                    },
                                    {
                                        text: 'Se cancelará en pagos parciales correspondientes a la entrega previa del informe y/o producto. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo de satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARÁGRAFO: En el evento en que el contratista no cumpla con las actividades y/o productos correspondientes al mes, el Instituto no cancelará los honorarios de dicho mes; una vez se cuente con la totalidad de las actividades cumplidas, dicho pago será efectuado en la siguiente fecha de pago programada para el proyecto.',
                                        style: 'fontSegundapagPeque',
                                        margin: [0, 10, 0, 0],
                                    },
                                    {
                                        text: 'Jefe Oficina– Unidad Estratégica de Negocios',
                                        style: 'fontSegundapagPeque',
                                        margin: [10, 10, 10, 10],
                                    },
                                ],
                            ],
                        ],
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    style: 'tableExample',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'DESCRIPCIÓN DEL OBJETO A CONTRATAR',
                                    style: 'titleTable2',
                                    fillColor: '#4FAACD',
                                },
                            ],
                            [
                                {
                                    stack: [
                                        {
                                            text: 'Con fundamento en el artículo 2, numeral 4, literal h) de la ley 1150 de 2007, reglamentado por el artículo 2.2.1.2.1.4.9 del Decreto 1082 de 2015.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 2, 0, 0],
                                        },
                                        {
                                            text: 'En efecto, el precitado artículo 2.2.1.2.1.4.9 establece lo siguiente:',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 3, 0, 0],
                                        },
                                        {
                                            text: '“Artículo 2.2.1.2.1.4.9 Contratos de prestación de servicios profesionales y de apoyo al a gestión, o para la ejecución de trabajos artísticos que solo pueden encomendarse a determinadas personas naturales. Las Entidades Estatales pueden contratar bajo la modalidad de contratación directa la prestación de servicios profesionales y de apoyo a la gestión con la persona natural o jurídica que esté en capacidad de ejecutar el objeto del contrato, siempre y cuando la Entidad Estatal verifique la idoneidad o experiencia requerida y relacionada con el área de que se trate. En este caso, no es necesario que la Entidad Estatal haya obtenido previamente varias ofertas, de lo cual el ordenador del gasto debe dejar constancia escrita. Los servicios profesionales y de apoyo a la gestión corresponden a aquellos de naturaleza intelectual diferentes a los de consultoría que se derivan del cumplimiento de las funciones de la Entidad Estatal; así como los relacionados con actividades operativas, logísticas, o asistenciales.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 3, 0, 0],
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 2
                                : 1;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 2
                                : 1;
                        },
                        hLineColor: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    pageBreak: 'before',
                    style: 'tableExample',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    stack: [
                                        {
                                            text: 'La Entidad Estatal, para la contratación de trabajos artísticos que solamente puedan encomendarse a determinadas personas naturales, debe justificar esta situación en los estudios y documentos previos.”',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text: 'El contrato de prestación de servicios a que se refiere la norma se celebra por el Estado en aquellos eventos en que la función de la administración no puede ser suministrada por personas vinculadas con la entidad oficial contratante o cuando requiere de conocimientos especializados.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text: 'En el desarrollo de estas actividades se incluye también el apoyo a la tarea de generar y dinamizar procesos con el fin de obtener los productos y servicios para satisfacer las necesidades del ITM.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text: 'Con motivo de la expedición de la Sentencia de Unificación del Consejo de Estado: SUJ-025-CE-S2-2021, se deberá tener en cuenta lo siguiente en los contratos de prestación de servicios: ',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text:
                                                '1. En el marco del numeral 3º del artículo 32º de la Ley 80 de 1993, los contratos de prestación de servicios no generan una ' +
                                                'relación laboral ni el pago de prestaciones sociales. En todo caso, en los términos de los principios de transparencia, planeación ' +
                                                'y legalidad, en la estructuración de los procesos de contratación de prestación de servicios, se deberán adoptar las medidas ' +
                                                'necesarias que eviten la materialización de “relaciones laborales encubiertas”, en los términos del Consejo de Estado y de la Corte ' +
                                                'Constitucional. Es por eso que se invita a la adopción y ejecución de buenas prácticas administrativas que eviten la transformación ' +
                                                'de la naturaleza jurídica de la relación exclusivamente contractual que se tiene con los contratistas.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text:
                                                '2. Tal y como se estableció en la Directiva Presidencial No. 7 del 28 de octubre de 2021, el límite temporal establecido en la ' +
                                                'Sentencia de Unificación no prohíbe la celebración de contratos de prestación de servicios de manera sucesiva, antes del término ' +
                                                'de treinta (30) días hábiles, siempre y cuando se cumpla a cabalidad con las normas jurídicas pertinentes. Lo anterior, debido a ' +
                                                'que dicho término fue establecido por el Consejo de Estado con el fin de tener un marco de referencia para el cómputo de una ' +
                                                'eventual caducidad en el ejercicio de las acciones judiciales y de la prescripción de los derechos reclamados, en aquellos eventos' +
                                                'donde se determine por parte del juez, la existencia de una relación laboral, conforme al principio de la primacía de la realidad ' +
                                                'sobre las formas. Por eso se reitera, la clave del manejo adecuado de los contratos de prestación de servicios es que tanto el ' +
                                                'ordenador del gasto como el supervisor del contrato, no incurran en prácticas que configuren una subordinación de carácter laboral. ' +
                                                'Conforme lo anterior, en los documentos previos del contrato, incluido el estudio previo, deberán contenerse de manera detallada, ' +
                                                'el análisis de la necesidad, justificado desde la falta de personal de plata para satisfacer la necesidad o la especialidad del servicio, ' +
                                                'según corresponda, garantizando en todo caso, que dicho vínculo constituya una relación autónoma e independiente y que no se ' +
                                                'genere una subordinación o dependencia.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text:
                                                '3. De conformidad como se estableció en la Directiva Presidencial citada en el numeral anterior, el plazo de los contratos de' +
                                                'prestación de servicios debe ser el estrictamente necesario para la ejecución de su objeto y para el desarrollo de las actividades ' +
                                                'previstas, en los términos de la normativa aplicable.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text:
                                                '4. En ningún caso, la Sentencia de Unificación restringió el derecho al ejercicio autónomo y libre de la profesión u oficio de los ' +
                                                'contratistas. Conforme a lo anterior, no se puede limitar la concurrencia de vínculos contractuales.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 2
                                : 1;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 2
                                : 1;
                        },
                        hLineColor: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    style: 'tableExample',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'ANÁLISIS ECONÓMICO DEL VALOR ESTIMADO DEL CONTRATO',
                                    style: 'titleTable2',
                                    fillColor: '#4FAACD',
                                },
                            ],
                            [
                                {
                                    stack: [
                                        {
                                            text: 'Análisis de precios de mercado: El presupuesto oficial de la contratación que se pretende adelantar se hizo consultando el valor de los contratos celebrados por el ITM en vigencias anteriores para este tipo de profesionales o de auxiliares. ',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text: 'Estudio técnico: El contratista deberá cumplir con las especificaciones técnicas establecidas en este documento, en la minuta del contrato que se pretende celebrar.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 8, 0, 0],
                                        },
                                        {
                                            margin: [0, 8, 0, 0],
                                            text: [
                                                {
                                                    text: 'El valor estimado para esta Contratación es de',
                                                    style: 'fontSegundapagPeque',
                                                },
                                                {
                                                    text: ' Veintiún millones ochocientos quince mil cuatrocientos veintidós pesos m.l($ 21815422).',
                                                    style: 'fontSegundapagPeque',
                                                    bold: true,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 2
                                : 1;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 2
                                : 1;
                        },
                        hLineColor: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                    },
                },
                {
                    pageBreak: 'before',
                    margin: [10, 10, 10, 10],
                    style: 'tableExample',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'CRITERIOS PARA SELECCIONAR LA OFERTA MÁS FAVORABLE',
                                    style: 'titleTable2',
                                    fillColor: '#4FAACD',
                                },
                            ],
                            [
                                {
                                    stack: [
                                        {
                                            text:
                                                'Considerando el servicio profesional y de apoyo a la gestión que se requiere y teniendo en cuenta lo ordenado por la Ley 1150 de' +
                                                '2007 y el Decreto 1082 de 2015 lo importante a tener en cuenta para seleccionar la oferta más favorable y conveniente para la ' +
                                                'entidad en este tipo de contratos, es la idoneidad, conocimiento y experiencia que acredite quien asuma la ejecución del objeto ' +
                                                'contractual, que garantice a la entidad la satisfacción de la necesidad planteada y por consiguiente el cumplimiento del objeto. ' +
                                                'Deberá acreditarse por el contratista que cumple con los requisitos académicos y de experiencia requeridos para la satisfacción de la necesidad.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text: 'JUSTIFICACIÓN DE LA CONTRATACIÓN CON “DANIELA DIAZ CALLE”',
                                            style: 'fontSegundapagPeque',
                                            bold: true,
                                            decoration: 'underline',
                                            margin: [0, 8, 0, 0],
                                            alignment: 'center',
                                        },
                                        {
                                            margin: [0, 8, 0, 0],
                                            text: [
                                                {
                                                    text: 'La contratación se realizará con',
                                                    style: 'fontSegundapagPeque',
                                                },
                                                {
                                                    text: ' “DANIELA DIAZ CALLE ',
                                                    style: 'fontSegundapagPeque',
                                                    bold: true,
                                                },
                                                {
                                                    text: 'con cédula de ciudadanía ',
                                                    style: 'fontSegundapagPeque',
                                                },
                                                {
                                                    text: '1152690770”,',
                                                    style: 'fontSegundapagPeque',
                                                    bold: true,
                                                },
                                                {
                                                    text: ' quien cumple con los requisitos académicos y/o de experiencia señalados en el perfil para satisfacer la necesidad requerida por la institución. ',
                                                    style: 'fontSegundapagPeque',
                                                },
                                            ],
                                        },
                                        {
                                            margin: [0, 8, 0, 0],
                                            text: [
                                                {
                                                    text: '“DANIELA DIAZ CALLE” ',
                                                    style: 'fontSegundapagPeque',
                                                    bold: true,
                                                },
                                                {
                                                    text: 'cumple con el perfil requerido el cual es ',
                                                    style: 'fontSegundapagPeque',
                                                },
                                                {
                                                    text: 'PROFESIONAL EN CUALQUIER AREA DEL CONOCIMIENTO CON 1 AÑO DE EXPERIENCIA',
                                                    style: 'fontSegundapagPeque',
                                                    bold: true,
                                                },
                                            ],
                                        },
                                        {
                                            text: 'Se anexan certificados académicos y/o de experiencia que permiten acreditar la idoneidad del contratista para suscribir el contrato con el Instituto Tecnológico Metropolitano.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 8, 0, 0],
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 2
                                : 1;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 2
                                : 1;
                        },
                        hLineColor: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    style: 'tableExample',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'ANALISIS DE RIESGO Y FORMA DE MITIGARLO',
                                    style: 'titleTable2',
                                    fillColor: '#4FAACD',
                                },
                            ],
                            [
                                {
                                    stack: [
                                        {
                                            text:
                                                'La política para el manejo del riesgo contractual del Estado para los diferentes procesos, consagra como principio rector, que estos ' +
                                                'corresponden a las Entidades Estatales, las cuales deben asumir sus propios riesgos por su carácter público y el objeto social ' +
                                                'para el que fueron creadas o autorizadas y, a los contratistas, aquellos riesgos determinados por el objeto que persiguen en el ' +
                                                'cumplimiento de su actividad; siendo entonces la asignación adecuada una herramienta que minimiza el costo de la mitigación del ' +
                                                'riesgo, logrando asignar cada riesgo a la parte que mejor lo controla: ',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            stack: [
                                                {
                                                    ul: [
                                                        {
                                                            margin: [
                                                                0, 5, 0, 0,
                                                            ],
                                                            text: [
                                                                {
                                                                    text: 'Riesgo Previsible: ',
                                                                    style: 'fontSegundapagPeque',
                                                                    bold: true,
                                                                },
                                                                {
                                                                    text: ' Son los posibles hechos o circunstancias que por la naturaleza de la actividad a ejecutar es factible su ocurrencia.',
                                                                    style: 'fontSegundapagPeque',
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            margin: [
                                                                0, 5, 0, 0,
                                                            ],
                                                            text: [
                                                                {
                                                                    text: 'Riesgo Imprevisible: ',
                                                                    style: 'fontSegundapagPeque',
                                                                    bold: true,
                                                                },
                                                                {
                                                                    text:
                                                                        'Son aquellos hechos o circunstancias donde no es factible su previsión, es decir el acontecimiento de  ' +
                                                                        'su ocurrencia, tales como desastres naturales, actos terroristas, guerra o eventos que alteren el orden público.',
                                                                    style: 'fontSegundapagPeque',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: 'A continuación, se establecen, los riesgos que deben asumir las partes en el presente proceso:',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        [
                                            {
                                                table: {
                                                    color: '#444',
                                                    style: 'tableExample',
                                                    widths: [
                                                        'auto',
                                                        'auto',
                                                        'auto',
                                                        'auto',
                                                        'auto',
                                                        'auto',
                                                        'auto',
                                                    ],
                                                    body: [
                                                        [
                                                            {
                                                                rowSpan: 2,
                                                                text: 'CLASE',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                colSpan: 3,
                                                                text: 'TIPIFICACION DEL RIESGO',
                                                                style: 'titleTable1',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    5, 30, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                            {},
                                                            {
                                                                colSpan: 3,
                                                                text: 'ASIGNACION DEL RIESGO',
                                                                style: 'titleTable1',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    5, 30, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                            {},
                                                        ],
                                                        [
                                                            {
                                                                text: 'No.',
                                                                style: 'titleTable1',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    5, 30, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                text: 'Descripción',
                                                                style: 'titleTable1',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    5, 30, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                colSpan: 2,
                                                                text: 'Observaciones',
                                                                style: 'titleTable1',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    5, 30, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                            {
                                                                text: 'ITM',
                                                                style: 'titleTable1',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    5, 30, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                colSpan: 2,
                                                                text: 'PROPONENTE Y/O CONTRATISTA',
                                                                style: 'titleTable1',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    5, 30, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                        ],
                                                        [
                                                            {
                                                                rowSpan: 5,
                                                                text: 'Administrativos, legales, documentales y/o regulatorios.',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 150, 5,
                                                                    5,
                                                                ],
                                                            },
                                                            {
                                                                text: '1',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                text: 'No firma del contrato por parte del proponente y/o CONTRATISTA.',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: 'En caso de que el CONTRATISTA se rehusó a firmarlo, no estuvo de acuerdo con el clausulado. Riesgo que asume el CONTRATISTA.',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: '',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                colSpan: 2,
                                                                text: 'X',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                        ],
                                                        [
                                                            {},
                                                            {
                                                                text: '2',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                text: 'Incumplimiento del contrato por parte del CONTRATISTA.',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: 'Hace referencia a cualquier clase de incumplimiento por parte del CONTRATISTA, antes, durante y posterior a la orden de iniciación del contrato. Riesgo que asume el CONTRATISTA',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: '',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                colSpan: 2,
                                                                text: 'X',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                        ],
                                                        [
                                                            {},
                                                            {
                                                                text: '3',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                text: 'Demora en la radicación oportuna por parte del CONTRATISTA de las facturas (correctamente diligenciadas y firmadas) y/o cuentas de los gastos reembolsables.',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: 'Riesgo que asume el CONTRATISTA, teniendo en cuenta que le corresponde a éste tener planes de contingencia y/o calidad para que las facturas se elaboren correctamente y radiquen oportunamente de acuerdo con lo manifestado en el contrato.',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: '',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                colSpan: 2,
                                                                text: 'X',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                        ],
                                                        [
                                                            {},
                                                            {
                                                                text: '4',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                text: 'Demora en la legalización del contrato por parte del CONTRATISTA.',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: 'Causada por parte del CONTRATISTA, por no radicar completa, correcta y oportunamente la documentación de legalización, según el instructivo y/o lo manifestado en el contrato. Riesgo que asume el CONTRATISTA.',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: '',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                colSpan: 2,
                                                                text: 'X',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                        ],
                                                        [
                                                            {},
                                                            {
                                                                text: '5',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {
                                                                text: 'Errores involuntarios que hayan quedado en la oferta presentada al ITM',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: 'Hace referencia a cualquier error que se pueda presentar en la oferta presentada al ITM ',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                text: '',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                            },
                                                            {
                                                                colSpan: 2,
                                                                text: 'X',
                                                                alignment:
                                                                    'center',
                                                                style: 'titleTable1',
                                                                margin: [
                                                                    5, 50, 5, 5,
                                                                ],
                                                            },
                                                            {},
                                                        ],
                                                    ],
                                                },
                                            },
                                            {
                                                text: 'CÓMO MINIMIZAR EL RIESGO:',
                                                style: 'fontSegundapagPeque',
                                                bold: true,
                                                margin: [0, 5, 0, 0],
                                            },
                                            {
                                                stack: [
                                                    {
                                                        ul: [
                                                            {
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                                text: [
                                                                    {
                                                                        text:
                                                                            'Estableciendo una forma de pago de tal manera que sólo se efectúe el mismo, una vez se produzca la entrega a entera satisfacción del bien o servicio.',
                                                                        style: 'fontSegundapagPeque',
                                                                    },
                                                                ],
                                                            },
                                                            {
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                                text: [
                                                                   
                                                                    {
                                                                        text: ' Consignando las cláusulas de multas y penal pecuniaria en el contrato.',
                                                                        style: 'fontSegundapagPeque',
                                                                    },
                                                                ],
                                                            },
                                                            {
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                                text: [
                                                                   
                                                                    {
                                                                        text: ' Estricto y permanente acompañamiento y seguimiento por parte de la Supervisión asignada.',
                                                                        style: 'fontSegundapagPeque',
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            ],
                        ],
                    },

                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 2
                                : 1;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 2
                                : 1;
                        },
                        hLineColor: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    style: 'tableExample',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'ANÁLISIS QUE SUSTENTA LA EXIGENCIA DE GARANTÍAS',
                                    style: 'titleTable2',
                                    fillColor: '#4FAACD',
                                },
                            ],
                            [
                                {
                                    stack: [
                                        {
                                            text: 'De conformidad con el artículo 7 de la ley 1150 de 2007, las garantías no serán obligatorias en los contratos cuyo valor sea inferior al 10% de la menor cuantía, en consecuencia, el ITM se abstendrá de exigir garantías, dada la naturaleza del objeto, la forma de pago y las condiciones establecidas en el análisis de riesgos para minimizar estos.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text: 'No obstante, la anterior determinación, de acuerdo con lo establecido en los artículos 7 a 17 de la Ley 1480 de 2011, en asocio con las determinaciones de los artículos 932 y 958 del Código de Comercio, el Contratista tiene la obligación de garantizar la calidad del bien o servicio objeto del contrato.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 8, 0, 0],
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 2
                                : 1;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 2
                                : 1;
                        },
                        hLineColor: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    style: 'tableExample',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    colSpan: 2,
                                    text: 'RESPONSABLE',
                                    style: 'titleTable2',
                                    fillColor: '#4FAACD',
                                },
                                {},
                            ],
                            [
                                {
                                    text: [
                                        {
                                            text: 'Nombre: ',
                                            style: 'fontSegundapagPeque',
                                            bold: true,
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text: 'OLGA LUCIA GOMEZ HOYOS',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 5, 0, 0],
                                        },
                                        {
                                            text: '\nCargo: ',
                                            style: 'fontSegundapagPeque',
                                            bold: true,
                                            margin: [0, 8, 0, 0],
                                        },
                                        {
                                            text: 'Jefe Oficina – Unidad Estratégica de Negocios',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 8, 0, 0],
                                        },
                                    ],
                                },
                                {
                                    image: 'data:image/jpeg;base64,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',
                                    style: 'title',
                                    fit: [100, 100],
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 2
                                : 1;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 2
                                : 1;
                        },
                        hLineColor: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? '#4FAACD'
                                : 'gray';
                        },
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    table: {
                        widths: [163, 163, 163],
                        body: [
                            [
                                {
                                    text: 'Elaborado Por',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'Revisado Por',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'Aprobado Por',
                                    style: 'fontPeque',
                                },
                            ],
                            [
                                {
                                    text: 'Maicol Yepes',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'Maicol Yepes',
                                    style: 'fontPeque',
                                },
                                {
                                    text: 'Maicol Yepes',
                                    style: 'fontPeque',
                                },
                            ],
                        ],
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                },
                subheader: {
                    fontSize: 10,
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
                    margin: [0, 0, 0, 5],
                },
                title: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                },
                title2: {
                    bold: true,
                    fontSize: 10,
                    color: 'black',
                    alignment: 'center',
                },
                titleTable1: {
                    bold: true,
                    fontSize: 8,
                    color: 'black',
                    alignment: 'center',
                },
                titleTable2: {
                    fontSize: 10,
                    color: 'white',
                    alignment: 'center',
                },
                marginRector: {
                    fontSize: 10,
                    margin: [0, 5, 10, 0],
                },
                fontPeque: {
                    fontSize: 8,
                    alignment: 'center',
                },
                fontPeque2: {
                    fontSize: 10,
                },
                fontSegundapag: {
                    fontSize: 9,
                },
                fontSegundapagPeque: {
                    fontSize: 9,
                },
            },

            defaultStyle: {
                // alignment: 'justify'
            },
        };
        let test = pdfMake
            .createPdf(documentDefinition)
            .download('Filenames.pdf');
        console.log('puto');
    }
}
