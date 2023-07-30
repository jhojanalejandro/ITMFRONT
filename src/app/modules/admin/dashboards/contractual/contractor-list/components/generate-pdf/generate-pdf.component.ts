import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import swal from 'sweetalert2';
import { DocumentTypeFile, FileContractor } from 'app/layout/common/models/file-contractor';
import { AuthService } from 'app/core/auth/auth.service';
import { ShareService } from 'app/layout/common/share-service/share-service.service';
import { RouteImageEnum } from 'app/layout/common/enums/route-image/route-image';
import { PdfDataService } from 'app/layout/common/share-service/pdf-data-service.service';
import { ContractContractors } from '../../../models/contractor';
import { CommitteeRequest, PreviusStudy } from '../../../models/generate-pdf';
import { PdfTypeGenerate } from 'app/layout/common/enums/document-type/pdf-type';
import { Subject, takeUntil } from 'rxjs';
import { UploadFileDataService } from '../../../service/upload-file.service';
import { DocumentTypeCodes } from 'app/layout/common/enums/document-type/document-type';

@Component({
    selector: 'app-generate-pdf',
    templateUrl: './generate-pdf.component.html',
    styleUrls: ['./generate-pdf.component.scss']
})
export class GeneratePdfComponent implements OnInit {
    @ViewChild('pdfTable') pdfTable: ElementRef;
    @Input('contractContractors') contractContractors: ContractContractors;
    @Input() contractorId: string;
    @Input() contractId: string;
    @Input() generateType: string;
    @Output() readonly pdfGenerated: EventEmitter<boolean> = new EventEmitter<boolean>();
    valueLetter: any;
    currentDate: string;
    fechaActual: any = new Date();
    anioActual: any = this.fechaActual.getFullYear();
    anioAnterior: any = this.anioActual - 1;
    file: any;
    docDefinition: any;
    base64Output: any;
    headerImageBase654: any;
    footerImageBase654: any;
    itmImageBase64: string = null;
    alcaldiaImageBase654: any;
    committeeRequestData: CommitteeRequest[];
    previusStudyData: PreviusStudy[] = [];
    dateTransform: any = new Date();
    typeDocs: DocumentTypeFile[] = [];
    documentSolicitudComiteList: any[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    year: Date = new Date();

    constructor(
        private _shareService: ShareService,
        private _pdfdataService: PdfDataService,
        private _upload: UploadFileDataService,
        private _auth: AuthService

    ) { }

    ngOnInit(): void {
        debugger
        console.log('fecha',this.year.getFullYear());
        
        this.getDocumentType();
        this.dateTransform = this._shareService.transformDate(this.dateTransform);
        switch (this.generateType) {
            case PdfTypeGenerate.PREVIUSSTUDY:
                this.gePreviusStudyData().then(
                    () => this.getBase64Image(RouteImageEnum.LOGOITM, 'study')
                );
                break;
            case PdfTypeGenerate.COMMITTEEREQUEST:
                this.getcommitteeRequestData().then(
                    () => this.getBase64Image(RouteImageEnum.LOGOITM, 'comite')
                )
                break;
        }
        this.currentDate = this._shareService.getCurrentDate();

    }

    private generatePreviusStudyWithoutPolicy(previusStudyData: PreviusStudy[]) {

        for (let index = 0; index < this.contractContractors.contractors.length; index++) {
            let data = previusStudyData.find(ct => ct.contractorId == this.contractContractors.contractors[index].toUpperCase());
            if (data.totalValue != null && data.contractInitialDate != null && data.contractFinalDate != null && data.specificObligations != null
                && data.generalObligations != null && this.itmImageBase64 != null && data.user && data.userJuridic != null && data.supervisorItmName != null && data.userFirm != null) {
                let fechaLetras = this._shareService.calcularDiferencia(data.contractInitialDate, data.contractFinalDate);
                let valorLetras = this._shareService.numeroALetras(data.totalValue, 'PESOS');
                let totalContrato = (+data.totalValue.toFixed(0)).toLocaleString();
                data.specificObligations = data.specificObligations.replaceAll('->', ' ');
                data.generalObligations = data.generalObligations.replaceAll('->', ' ');
                const documentPreviousStudy = {
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
                                        image: this.itmImageBase64,
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
                                ['', '', '', 'Fecha', this.currentDate],
                            ],
                        },
                    },
                    content: [

                        {
                            text: 'Fecha de Elaboración: ' + this.dateTransform,
                            style: 'subheader',
                            margin: [10, 10, 15, 0],
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
                                    alignment: 'justify'
                                },
                                {
                                    text: ' 4600095169',
                                    fontSize: 11,
                                    alignment: 'justify'
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

                            table: {
                                widths: [100, '*'],
                                style: 'marginTable',
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
                                                    widths: [50, 50, 50, 50, 50, 50, 50],
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
                                                        text: 'El Plan de Desarrollo Institucional “ITM: A Otro Nivel”, 2020-2023, está orientado a trascender de la innovación competitiva a la que transforma, a partir de la articulación de la ciencia, la tecnología, la innovación y la producción artística, aportando desde su vocación tecnológica y compromiso social al logro de un modelo sostenible para la humanidad. El Plan de Desarrollo Institucional fue aprobado el día 29 de mayo de 2020 por El Consejo Directivo del Instituto Tecnológico Metropolitano Institución Universitaria, en ejercicio de sus atribuciones legales y estatutarias. La Unidad Estratégica de Negocios, observado la nueva propuesta rectoral, en especial el Gran Pilar No. 4, denominado “Modelo de gestión flexible, eficiente y sostenible” y con el fin de dar cumplimiento a objeto contractual fijado en el Contrato interadministrativo número ' + data.contractNumber + ' cuyo objeto es ' + '“' + data.elementObject + '”',
                                                        fontSize: 10,
                                                        alignment: 'justify'
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
                                                                style: 'titleTable2',
                                                            },
                                                            {
                                                                text: 'CON 1 AÑO DE EXPERIENCIA',
                                                                style: 'titleTable2',
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
                                                        text: ' Prestación de servicios como contratista independiente, sin vínculo laboral por su propia cuenta y riesgo para realizar ' + data.elementObject + ' del Contrato Interadministrativo No ', fontSize: 9,
                                                        alignment: 'justify'
                                                    },
                                                    {
                                                        text: data.contractNumber + ' de ' + this.anioActual,
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
                            table: {
                                margin: [10, 10, 10, 10],
                                widths: [100, '*'],
                                body: [
                                    [

                                        {
                                            text: '',
                                            style: 'title',
                                        },
                                        {
                                            text: 'OBLIGACIONES GENERALES:' + data.generalObligations + '. OBLIGACIONES ESPECIFICAS:' + data.specificObligations,
                                            style: 'fontSegundapagPeque',
                                        },
                                    ],
                                    [
                                        {
                                            text: 'Tipo de Contrato',
                                            style: 'title2',
                                        },
                                        {
                                            text: 'Prestación de servicios profesionales y de apoyo a la gestión.',
                                            style: 'fontSegundapagPeque',
                                        }
                                    ],
                                    [
                                        {
                                            text: 'Plazo de Ejecución',
                                            style: 'title2',
                                            margin: [5, 5, 5, 5],
                                        },
                                        {
                                            text: fechaLetras + ' sin exceder la vigencia ' + this.anioActual,
                                            style: 'fontSegundapagPeque',
                                            margin: [10, 5, 10, 10],
                                        },

                                    ],
                                    [
                                        {
                                            text: 'Duración del Contrato Interadministrativo número ' + data.contractNumber + ' de ' + this.anioActual,
                                            style: 'title2',
                                        },
                                        {
                                            text: fechaLetras + ' sin superar la vigencia ' + this.anioActual,
                                            style: 'fontSegundapagPeque',
                                            margin: [10, 10, 10, 10],
                                        }

                                    ],
                                    [
                                        {
                                            text: 'Forma de pago',
                                            style: 'title2',
                                            margin: [20, 5, 0, 0],
                                        },

                                        {
                                            text: 'Se cancelará en pagos parciales correspondientes a la entrega previa del informe y/o producto. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo de satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARÁGRAFO: En el evento en que el contratista no cumpla con las actividades y/o productos correspondientes al mes, el Instituto no cancelará los honorarios de dicho mes; una vez se cuente con la totalidad de las actividades cumplidas, dicho pago será efectuado en la siguiente fecha de pago programada para el proyecto.',
                                            style: 'fontSegundapagPeque',
                                            margin: [0, 10, 0, 0],
                                        },

                                    ],
                                    [
                                        {
                                            text: 'Supervisor',
                                            style: 'title2',
                                        },

                                        {
                                            text: data.supervisorCharge + ' - Unidad Estratégica de Negocios',
                                            style: 'fontSegundapagPeque',
                                        }
                                    ]

                                ],
                            },
                        },
                        {
                            margin: [10, 10, 10, 10],
                            table: {
                                widths: ['*'],
                                body: [
                                    [
                                        {
                                            text: 'FUNDAMENTO JURÍDICO',
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
                                                }
                                            ],
                                        },
                                    ],
                                ],
                            },
                            layout: {
                                hLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.body.length ? 2 : 1;
                                },
                                vLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.widths.length ? 2 : 1;
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
                                                            text: 'El valor estimado para esta Contratación es de ',
                                                            style: 'fontSegundapagPeque',
                                                        },
                                                        {
                                                            text: valorLetras + 'm.l($' + totalContrato + ').',
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
                                    return i === 0 || i === node.table.body.length ? 2 : 1;
                                },
                                vLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.widths.length ? 2 : 1;
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
                                                    text: 'JUSTIFICACIÓN DE LA CONTRATACIÓN CON “' + data.contractorName + '”',
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
                                                            text: '“' + data.contractorName,
                                                            style: 'fontSegundapagPeque',
                                                            bold: true,
                                                        },
                                                        {
                                                            text: 'con cédula de ciudadanía ',
                                                            style: 'fontSegundapagPeque',
                                                        },
                                                        {
                                                            text: data.contractorIdentification + '”,',
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
                                                            text: '“' + data.contractorName + '” ',
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
                                    return i === 0 || i === node.table.body.length ? 2 : 1;
                                },
                                vLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.widths.length ? 2 : 1;
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
                                                                    margin: [0, 5, 0, 0],
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
                                                                    margin: [0, 5, 0, 0],
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
                                                    margin: [0, 10, 50, 50],
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
                                                            ],
                                                            body: [
                                                                [
                                                                    {
                                                                        rowSpan: 2,
                                                                        text: 'CLASE',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                    {
                                                                        colSpan: 3,
                                                                        text: 'TIPIFICACION DEL RIESGO',
                                                                        style: 'titleTable1',
                                                                        alignment: 'center',
                                                                        margin: [5, 30, 5, 5],
                                                                    },
                                                                    {},
                                                                    {},
                                                                    {
                                                                        colSpan: 2,
                                                                        text: 'ASIGNACION DEL RIESGO',
                                                                        style: 'titleTable1',
                                                                        alignment: 'center',
                                                                        margin: [5, 30, 5, 5],
                                                                    },
                                                                    {}
                                                                ],
                                                                [
                                                                    {},
                                                                    {
                                                                        text: 'No.',
                                                                        style: 'titleTable1',
                                                                        alignment: 'center',
                                                                        margin: [5, 30, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Descripción',
                                                                        style: 'titleTable1',
                                                                        alignment: 'center',
                                                                        margin: [5, 30, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Observaciones',
                                                                        style: 'titleTable1',
                                                                        alignment: 'center',
                                                                        margin: [5, 30, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'ITM',
                                                                        style: 'titleTable1',
                                                                        alignment: 'center',
                                                                        margin: [5, 30, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'PROPONENTE Y/O CONTRATISTA',
                                                                        style: 'titleTable1',
                                                                        alignment: 'center',
                                                                        margin: [5, 30, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    {
                                                                        rowSpan: 5,
                                                                        text: 'Administrativos, legales, documentales y/o regulatorios.',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 150, 5, 5],
                                                                    },
                                                                    {
                                                                        text: '1',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'No firma del contrato por parte del proponente y/o CONTRATISTA.',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'En caso de que el CONTRATISTA se rehusó a firmarlo, no estuvo de acuerdo con el clausulado. Riesgo que asume el CONTRATISTA.',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    {},
                                                                    {
                                                                        text: '2',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Incumplimiento del contrato por parte del CONTRATISTA.',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'Hace referencia a cualquier clase de incumplimiento por parte del CONTRATISTA, antes, durante y posterior a la orden de iniciación del contrato. Riesgo que asume el CONTRATISTA',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    {},
                                                                    {
                                                                        text: '3',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Demora en la radicación oportuna por parte del CONTRATISTA de las facturas (correctamente diligenciadas y firmadas) y/o cuentas de los gastos reembolsables.',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'Riesgo que asume el CONTRATISTA, teniendo en cuenta que le corresponde a éste tener planes de contingencia y/o calidad para que las facturas se elaboren correctamente y radiquen oportunamente de acuerdo con lo manifestado en el contrato.',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    {},
                                                                    {
                                                                        text: '4',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Demora en la legalización del contrato por parte del CONTRATISTA.',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'Causada por parte del CONTRATISTA, por no radicar completa, correcta y oportunamente la documentación de legalización, según el instructivo y/o lo manifestado en el contrato. Riesgo que asume el CONTRATISTA.',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    {},
                                                                    {
                                                                        text: '5',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 50, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Errores involuntarios que hayan quedado en la oferta presentada al ITM',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'Hace referencia a cualquier error que se pueda presentar en la oferta presentada al ITM ',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        alignment: 'center',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 5, 5, 5],
                                                                    },
                                                                ]
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
                                                                        margin: [0, 5, 0, 0],
                                                                        text: [
                                                                            {
                                                                                text: 'Estableciendo una forma de pago de tal manera que sólo se efectúe el mismo, una vez se produzca la entrega a entera satisfacción del bien o servicio.',
                                                                                style: 'fontSegundapagPeque',
                                                                            },
                                                                        ],
                                                                    },
                                                                    {
                                                                        margin: [0, 5, 0, 0],
                                                                        text: [
                                                                            {
                                                                                text: ' Consignando las cláusulas de multas y penal pecuniaria en el contrato.',
                                                                                style: 'fontSegundapagPeque',
                                                                            },
                                                                        ],
                                                                    },
                                                                    {
                                                                        margin: [0, 5, 0, 0],
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
                                    return i === 0 || i === node.table.body.length ? 2 : 1;
                                },
                                vLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.widths.length ? 2 : 1;
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
                                    return i === 0 || i === node.table.body.length ? 2 : 1;
                                },
                                vLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.widths.length ? 2 : 1;
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
                                widths: ['*', '*'],
                                body: [
                                    [
                                        {
                                            colSpan: 2,
                                            text: 'RESPONSABLE',
                                            style: 'titleTable2',
                                            fillColor: '#4FAACD',
                                        }
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
                                                    text: data.user,
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
                                                    text: data.userCharge + ' - Unidad Estratégica de Negocios',
                                                    style: 'fontSegundapagPeque',
                                                    margin: [0, 8, 0, 0],
                                                },
                                            ],
                                        },
                                        {
                                            image: 'data:image/png;base64,' + data.userFirm,
                                            style: 'title',
                                            fit: [70, 70],
                                        },
                                    ],
                                ],
                            },
                            layout: {
                                hLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.body.length ? 2 : 1;
                                },
                                vLineWidth: function (i, node) {
                                    return i === 0 || i === node.table.widths.length ? 2 : 1;
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
                                widths: [160, 160, 160],
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
                                            text: data.user,
                                            style: 'title',
                                        },
                                        {
                                            text: data.userJuridic,
                                        },
                                        {
                                            text: data.supervisorItmName,
                                        },
                                    ],
                                    [
                                        {
                                            image: 'data:image/jpg;base64,' + this.itmImageBase64,
                                            fit: [70, 70],
                                            style: 'fontPeque',

                                        },
                                        {
                                            image: 'data:image/png;base64,' + data.userJuridicFirm,
                                            fit: [70, 70],
                                            style: 'fontPeque',
                                        },
                                        {

                                            image: 'data:image/jpg;base64,' + data.supervisorFirm,
                                            fit: [70, 70],
                                            style: 'fontPeque',

                                        },
                                    ]
                                ],
                            },
                        },
                    ],
                    footer: {
                        margin: [10, 10],
                        text: 'Medellín - Colombia',
                        alignment: 'center',
                    },
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
                            alignment: 'center',
                        },
                        fontPeque: {
                            fontSize: 8,
                            alignment: 'center',
                        },
                        fontPeque2: {
                            fontSize: 10,
                        },
                        marginTable: {
                            margin: [10, 10, 10, 10],
                        },
                        fontSegundapagPeque: {
                            fontSize: 9,
                            alignment: 'justify'
                        },
                    },

                    defaultStyle: {
                        // alignment: 'justify'
                    },
                };

                let SolicitudComite = {
                    documentPreviousStudy: documentPreviousStudy,
                    contractorName: data.contractorName,
                    contractorId: data.contractorId
                }
                this.documentSolicitudComiteList.push(SolicitudComite);
            } else {
                if (this.itmImageBase64 == null || this.itmImageBase64 == '' || this.itmImageBase64 == undefined) {
                    swal.fire('', 'Error al cargar las imagenenes del pdf', 'warning');
                    this.hideComponent();
                    return;
                }
                else if (data.generalObligations == null || data.generalObligations == '' || data.specificObligations == null || data.specificObligations == '') {
                    swal.fire('', 'no se encontraron las obligaciones del contratista para el contratista ' + data.contractorName, 'warning');
                }
                else if (data.totalValue == null || data.totalValue == '') {
                    swal.fire('', 'no se encontro el valor del contrato para el contratista ' + data.contractorName, 'warning');
                } else if (data.userJuridicFirm != null || data.userJuridicFirm == '') {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'No se  se encontro la firma del juridico para el contratista ' + data.contractorName,
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else if (data.supervisorFirm == null || data.supervisorFirm == '') {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'No se encontro la firma del supervisor para el contratista ' + data.contractorName,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    this.hideComponent();
                } else if (data.userFirm == null || data.userFirm == '') {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'No se encontro la firma del contratual para el contratista ' + data.contractorName,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    this.hideComponent();
                    return;
                }
                if (this.contractContractors.contractors.length == 1) {
                    this.hideComponent();
                }
            }

        }
        if (this.documentSolicitudComiteList.length > 0) {
            this.savePdfGenerated(this.documentSolicitudComiteList, this.contractContractors.contractId, DocumentTypeCodes.ESTUDIOSPREVIOS);
        }

    }

    private generateCommitteeRequest(committeeRequestData: any) {
        for (let index = 0; index < this.contractContractors.contractors.length; index++) {
            let data = committeeRequestData.find(ct => ct.contractorId === this.contractContractors.contractors[index].toUpperCase());
            if (this.itmImageBase64 != null && data.profileRequire != null && data.contractorName != null && data.contractorIdentification != null) {
                const documentSolicitudComite = {
                    pageSize: 'A4',
                    pageOrientation: 'FOLIO',
                    pageMargins: [40, 80, 40, 60],
                    header: {
                        margin: [50, 20, 0, 30],
                        table: {
                            color: '#444',
                            style: 'tableHeader',
                            widths: [100, 170, 'auto', 70, 70],
                            headerRows: 3,
                            body: [
                                [
                                    {
                                        rowSpan: 3,
                                        image: this.itmImageBase64,
                                        style: 'title',
                                        fit: [100, 100],
                                    },
                                    {
                                        rowSpan: 3,
                                        colSpan: 2,
                                        text: 'MEMORANDO',
                                        style: 'memo',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: 'Código',
                                    },
                                    {
                                        text: 'FG 005',
                                    },
                                ],
                                ['', '', '', 'Versión', '01'],
                                ['', '', '', 'Fecha ', this.currentDate],
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
                            text: 'Medellín, ' + this.currentDate,
                            style: 'subheader',
                            margin: [10, 10, 10, 10],
                        },
                        {
                            text: 'Señores',
                            style: 'marginRector',
                            margin: [10, 0, 0, 0],
                        },
                        {
                            text: 'COMITÉ DE SELECCIÓN DE SERVICIOS TEMPORALES',
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
                            margin: [10, 10, 10, 10],
                            text: [
                                {
                                    text: 'Asunto : ',
                                    fontSize: 10,
                                    bold: true,
                                },
                                {
                                    text: 'Remisión Hoja de Vida ',
                                    fontSize: 10,
                                },
                            ],
                        },
                        {
                            text: 'Respetados señores:',
                            style: 'fontPeque2',
                            margin: [10, 10, 10, 10],
                        },
                        {
                            margin: [10, 10, 10, 10],
                            text: [
                                {
                                    text: 'Remito para su estudio las hojas de vida de los proponentes contratistas para el apoyo integral en la ejecución del Contrato Interadministrativo ' + data.contractNumber + 'de ' + this.anioActual + ', cuyo objeto es ' + data.elementObject,
                                    fontSize: 10,
                                    alignment: 'justify'
                                },
                            ],
                        },

                        {
                            margin: [10, 10, 10, 10],
                            table: {
                                widths: [115, 100, 130, 115],
                                body: [
                                    [
                                        {
                                            text: 'NOMBRE COMPLETO',
                                            style: 'fontPeque',
                                        },
                                        {
                                            text: 'DOCUMENTO',
                                            style: 'fontPeque',
                                        },
                                        {
                                            text: 'PRODUCTO PARA CONTRATAR',
                                            style: 'fontPeque',
                                        },
                                        {
                                            text: 'PERFIL REQUERIDO',
                                            style: 'fontPeque',
                                        },
                                    ],
                                    [
                                        {
                                            text: data.contractorName,
                                            style: 'fontPeque',
                                        },
                                        {
                                            text: data.contractorIdentification,
                                            style: 'fontPeque',
                                        },
                                        {
                                            text: 'Prestación de servicios como contratista independiente, sin vínculo laboral por su propia cuenta y riesgo para realizar la gestion de ' + data.elementName + ' ejecución del Contrato Interadministrativo No. ' + data.contractNumber + ' de ' + this.year.getFullYear(),
                                            style: 'fontPeque',
                                        },
                                        {
                                            text: data.profileRequire,
                                            style: 'fontPeque',
                                        },
                                    ],
                                ],
                            },
                        },
                        {
                            margin: [10, 0, 0, 0],
                            text: '\n\nFIRMA:'
                        },
                        {
                            margin: [10, 0, 0, 0],
                            text: data.contractorName
                        },
                        {
                            margin: [10, 0, 0, 0],
                            text: 'Profesional Universitaria'
                        },
                        {
                            margin: [10, 0, 0, 0],
                            text: 'Unidad Estratégica de Negocios'
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
                            margin: [10, 0, 10, 10],
                        },
                        title: {
                            bold: true,
                            fontSize: 13,
                            color: 'black',
                            alignment: 'center',
                        },
                        memo: {
                            bold: true,
                            fontSize: 13,
                            color: 'black',
                            alignment: 'center',
                            margin: [0, 20, 0, 0],
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
                            alignment: 'justify'
                        },
                    },

                    defaultStyle: {
                        // alignment: 'justify'
                    },
                };
                let SolicitudComite = {
                    document: documentSolicitudComite,
                    contractorName: data.contractorName,
                    contractorId: data.contractorId
                }
                this.documentSolicitudComiteList.push(SolicitudComite);
            } else {
                if (this.itmImageBase64 == null || this.itmImageBase64 == '') {
                    swal.fire('', 'Error al cargar la imagen ', 'warning');
                }
                else if (data.profileRequire == null || data.profileRequire == '') {
                    swal.fire('', 'no se ha cargado el perfil requerido', 'warning');
                }
                else if (data.contractorIdentification == null || data.contractorIdentification == '') {
                    swal.fire('', 'no se encontro la identificacion del contratista', 'warning');
                }
                this.hideComponent();
            }
        }
        if (this.documentSolicitudComiteList.length > 0) {
            this.savePdfGenerated(this.documentSolicitudComiteList, this.contractContractors.contractId, DocumentTypeCodes.SOLICITUDCOMITE);
        }

    }


    private async getcommitteeRequestData(): Promise<void> {
        return await new Promise((rslv) => {
            this._pdfdataService.getcommitteeRequestData(this.contractContractors).subscribe((Response) => {
                this.committeeRequestData = Response;
                if (this.committeeRequestData.length == 0) {
                    this.hideComponent();
                }

                rslv();
            });
        });

    }

    private async gePreviusStudyData(): Promise<void> {
        return await new Promise((rslv) => {

            this._pdfdataService.getPreviusStudy(this.contractContractors)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((Response) => {
                    this.previusStudyData = Response;
                    if (Response.length == 0) {
                        this.hideComponent();
                    }
                    rslv();
                });

        });
    }


    private getBase64Image(route: string, origin: string) {
        this._shareService.loadAndConvertImageToBase64(route)
            .then(base64Data => {
                this.itmImageBase64 = base64Data;
                if (origin == 'comite') {
                    this.generateCommitteeRequest(this.committeeRequestData);
                } else {
                    this.generatePreviusStudyWithoutPolicy(this.previusStudyData);
                }
            })
            .catch(error => {
                console.error('Error al cargar y convertir la imagen:', error);
            });
    }
    hideComponent() {
        this.pdfGenerated.emit(false);
    }

    private async savePdfGenerated(pdfDocument: any, contractId: string, origin: string) {
        let registerFileLis: FileContractor[] = [];
        debugger
        for (let index = 0; index < pdfDocument.length; index++) {
            let documentType = this.typeDocs.find(f => f.code == origin)
            let nombreDocumento = documentType.documentTypeDescription + pdfDocument[index].contractorName;
            let date = this.currentDate;
            let userId = this._auth.accessId;
            const pdf = pdfMake.createPdf(pdfDocument[index].document);
            const dataURL = await new Promise<string>((resolve, reject) => {
                pdf.getDataUrl((dataURL) => resolve(dataURL));
            });

            debugger
            const registerFile: FileContractor = {
                userId: userId,
                contractorId: pdfDocument[index].contractorId,
                contractId: contractId,
                filesName: nombreDocumento,
                fileType: 'PDF',
                descriptionFile: documentType.documentTypeDescription +' generada',
                registerDate: date,
                documentType: documentType.id,
                modifyDate: date,
                filedata: dataURL.split('data:application/pdf;base64,')[1],
                monthPayment: null,
                folderId: null,
                origin: origin
            };
            registerFileLis.push(registerFile)
        }

        debugger
        this._upload.UploadFileBillContractors(registerFileLis)
            .subscribe((res) => {
                if (res) {
                    swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        html: 'Información Registrada Exitosamente!',
                        showConfirmButton: false,
                        timer: 1500
                    });

                }

            },
                (response) => {
                    console.log(response);
                    swal.fire('Error', 'Error al Registrar la informacion!', 'error');
                });

        this.hideComponent();
    }

    private getDocumentType() {
        this._upload
            .getDocumentType()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                this.typeDocs = response;
            });

    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
