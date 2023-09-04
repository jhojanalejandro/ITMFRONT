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
import { CommiteeRequestContractor, CommitteeRequest, PreviusStudyContractors } from '../../../models/generate-pdf';
import { PdfTypeGenerate } from 'app/layout/common/enums/document-type/pdf-type';
import { Subject, takeUntil } from 'rxjs';
import { UploadFileDataService } from '../../../service/upload-file.service';
import { DocumentTypeCodes } from 'app/layout/common/enums/document-type/document-type';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';

@Component({
    selector: 'app-generate-pdf',
    templateUrl: './generate-pdf.component.html'
})
export class GeneratePdfComponent implements OnInit {
    @ViewChild('pdfTable') pdfTable: ElementRef;
    @Input('contractContractors') contractContractors: ContractContractors;
    @Input() contractorId: string;
    @Input() contractId: string;
    @Input() generateType: string;
    @Output() readonly pdfGenerated: EventEmitter<boolean> = new EventEmitter<boolean>();
    currentDate: string;
    fechaActual: any = new Date();
    anioActual: any = this.fechaActual.getFullYear();
    anioAnterior: any = this.anioActual - 1;
    base64Output: any;
    headerImageBase654: any;
    footerImageBase654: any;
    itmImageBase64: string = null;
    alcaldiaImageBase654: any;
    committeeRequestData: CommiteeRequestContractor;
    previusStudyData: PreviusStudyContractors;
    dateTransform: any = new Date();
    typeDocs: DocumentTypeFile[] = [];
    documentGenerate: any[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    year: Date = new Date();
    comiteeContarctor: any[]= [];
    constructor(
        private _shareService: ShareService,
        private _pdfdataService: PdfDataService,
        private _upload: UploadFileDataService,
        private _auth: AuthService

    ) { }

    ngOnInit(): void {
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

    private generatePreviusStudyWithoutPolicy(previusStudyData: PreviusStudyContractors) {
        let user = previusStudyData.personalInCharge.find(ct => ct.userChargeCode === CodeUser.RECRUITER || ct.userChargeCode === CodeUser.SUPERVISORAREAC)
        let juridic = previusStudyData.personalInCharge.find(ct => ct.userChargeCode === CodeUser.JURIDICO || ct.userChargeCode === CodeUser.SUPERVISORAREAN)
        let supervisor = previusStudyData.personalInCharge.find(ct => ct.userChargeCode === CodeUser.SUPERVISOR)
        this.currentDate = this._shareService.getCurrentDate();
        if (this.itmImageBase64 == null || user == null || juridic == null || supervisor == null || user.userFirm == null || supervisor.userFirm == null || juridic.userFirm == null) {

            if (this.itmImageBase64 == null || this.itmImageBase64 == undefined) {
                swal.fire('', 'Error al cargar las imagenenes del pdf', 'warning');
            } else if (juridic == null) {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se  se encontro juridico signado',
                    showConfirmButton: false,
                    timer: 2500
                });
            } else if (juridic.userFirm == null) {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se  se encontro la firma del juridico',
                    showConfirmButton: false,
                    timer: 2500
                });
            }
            else if (supervisor == null) {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro supervisor asignado ',
                    showConfirmButton: false,
                    timer: 2500
                });
            }
            else if (supervisor.userFirm == null) {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro la firma del supervisor ',
                    showConfirmButton: false,
                    timer: 2500
                });
            } else if (user == null) {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro contratual asignado ',
                    showConfirmButton: false,
                    timer: 2500
                });
            } else if (user.userFirm == null) {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro la firma del contratual ',
                    showConfirmButton: false,
                    timer: 2500
                });
            }
            this.hideComponent();
        }

        for (let index = 0; index < this.contractContractors.contractors.length; index++) {
            let data = previusStudyData.previusStudyDto.find(ct => ct.contractorId == this.contractContractors.contractors[index].toUpperCase());

            if (data.totalValue != null && data.contractInitialDate != null && data.contractFinalDate != null && data.specificObligations != null
                && data.generalObligations != null && this.itmImageBase64 != null && user != null && juridic != null && supervisor != null && user.userFirm != null && supervisor.userFirm != null && juridic.userFirm != null) {
                let fechaLetras = this._shareService.calcularDiferencia(data.contractInitialDate, data.contractFinalDate);
                let valorLetras = this._shareService.numeroALetras(data.totalValue, 'PESOS');
                let totalContrato = this.addCommasToNumber(data.totalValue);
                data.specificObligations = data.specificObligations.replaceAll('->', ' ');
                data.generalObligations = data.generalObligations.replaceAll('->', ' ');
                const documentPreviousStudy = {
                    pageSize: 'A4',
                    pageOrientation: 'FOLIO',
                    pageMargins: [40, 80, 40, 60],
                    header: {
                        margin: [20, 20, 20, 20],
                        table: {
                            color: '#444',
                            style: 'tableExample',
                            widths: ['auto', 'auto', 'auto', 70],
                            headerRows: 3,
                            body: [
                                [
                                    {
                                        rowSpan: 3,
                                        image: this.itmImageBase64,
                                        fit: [80, 80],
                                    },
                                    {
                                        rowSpan: 3,
                                        text: 'ESTUDIO PREVIO CONTRATACIÓN DIRECTA PRESTACIÓN DE SERVICIOS',
                                        style: 'title',
                                    },
                                    {
                                        text: 'Código',
                                    },
                                    {
                                        text: 'FBS 057',
                                    },
                                ],
                                ['', '', 'Versión', '09'],
                                ['', '', 'Fecha', this.currentDate],
                            ]
                        }
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
                            text: 'ALEJANDRO VILLA GOMEZ',
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
                                    bold: true,
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
                                widths: [100, 400],
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
                                                    style: 'titleTable1',
                                                    margin: [0, 10, 10, 10],
                                                },
                                                {
                                                    text: 'Definición de la Necesidad',
                                                    style: 'titleTable1',
                                                    margin: [0, 100, 10, 10],
                                                },
                                            ],
                                        },
                                        [
                                            {
                                                table: {
                                                    widths: [45, 45, 45, 45, 45, 45, 40],
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
                            margin: [10, 10, 10, 30],
                            table: {
                                widths: [100, 390],
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
                                                    margin: [10, 100, 10, 10],
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
                                                        fontSize: 10,
                                                        bold: true,
                                                    },
                                                    {
                                                        text: '' + data.generalObligations + '. ',
                                                        style: 'fontSegundapagPeque',
                                                    },
                                                    {
                                                        text: 'OBLIGACIONES ESPECIFICAS: ',
                                                        fontSize: 10,
                                                        bold: true,
                                                    },
                                                    {
                                                        text: data.specificObligations,
                                                        style: 'fontSegundapagPeque',
                                                    },
                                                ],
                                            }
                                        ],
                                    ],
                                    [
                                        {
                                            text: 'Tipo de Contrato',
                                            style: 'titleTable1',
                                        },
                                        {
                                            text: 'Prestación de servicios profesionales y de apoyo a la gestión.',
                                            style: 'fontSegundapagPeque',
                                        }
                                    ],
                                    [
                                        {
                                            text: 'Plazo de Ejecución',
                                            style: 'titleTable1',
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
                                            style: 'titleTable1',
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
                                            style: 'titleTable1',
                                            margin: [20, 5, 0, 0],
                                        },

                                        {
                                            text: 'Se cancelará en pagos parciales correspondientes a la entrega previa del informe y/o producto. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo de satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARÁGRAFO: En el evento en que el contratista no cumpla con las actividades y/o productos correspondientes al mes, el Instituto no cancelará los honorarios de dicho mes; una vez se cuente con la totalidad de las actividades cumplidas, dicho pago será efectuado en la siguiente fecha de pago programada para el proyecto.',
                                            style: 'fontSegundapagPeque',
                                        },

                                    ],
                                    [
                                        {
                                            text: 'Supervisor',
                                            style: 'titleTable1',
                                        },

                                        {
                                            text: supervisor.userCharge + ' - Unidad Estratégica de Negocios',
                                            style: 'fontSegundapagPeque',
                                        }
                                    ]
                                ],
                            },
                        },
                        {
                            margin: [10, 10, 10, 30],
                            table: {
                                widths: [500],
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
                                                            text: valorLetras + ' m.l($' + totalContrato + ').',
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
                                }
                            }
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
                                                            text: 'La contratación se realizará con ',
                                                            style: 'fontSegundapagPeque',
                                                        },
                                                        {
                                                            text: '“' + data.contractorName,
                                                            style: 'fontSegundapagPeque',
                                                            bold: true,
                                                        },
                                                        {
                                                            text: ' con cédula de ciudadanía ',
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
                                                            text: data.requiredProfile,
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
                                                    margin: [5, 15, 15, 5],
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
                                                                        margin: [5, 40, 5, 5],
                                                                    },
                                                                    {
                                                                        colSpan: 3,
                                                                        text: 'TIPIFICACION DEL RIESGO',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 10, 5, 5],
                                                                    },
                                                                    {},
                                                                    {},
                                                                    {
                                                                        colSpan: 2,
                                                                        text: 'ASIGNACION DEL RIESGO',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 10, 5, 5],
                                                                    },
                                                                    ''
                                                                ],
                                                                [
                                                                    '',
                                                                    {
                                                                        text: 'No.',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 10, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Descripción',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 10, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Observaciones',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 10, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'ITM',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 10, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'PROPONENTE Y/O CONTRATISTA',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 10, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    {
                                                                        rowSpan: 5,
                                                                        text: 'Administrativos, legales, documentales y/o regulatorios.',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 100, 5, 5],
                                                                    },
                                                                    {
                                                                        text: '1',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 20, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'No firma del contrato por parte del proponente y/o CONTRATISTA.',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'En caso de que el CONTRATISTA se rehusó a firmarlo, no estuvo de acuerdo con el clausulado. Riesgo que asume el CONTRATISTA.',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 15, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    '',
                                                                    {
                                                                        text: '2',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 15, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Incumplimiento del contrato por parte del CONTRATISTA.',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'Hace referencia a cualquier clase de incumplimiento por parte del CONTRATISTA, antes, durante y posterior a la orden de iniciación del contrato. Riesgo que asume el CONTRATISTA',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 15, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    '',
                                                                    {
                                                                        text: '3',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 15, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Demora en la radicación oportuna por parte del CONTRATISTA de las facturas (correctamente diligenciadas y firmadas) y/o cuentas de los gastos reembolsables.',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'Riesgo que asume el CONTRATISTA, teniendo en cuenta que le corresponde a éste tener planes de contingencia y/o calidad para que las facturas se elaboren correctamente y radiquen oportunamente de acuerdo con lo manifestado en el contrato.',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 20, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    '',
                                                                    {
                                                                        text: '4',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 20, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Demora en la legalización del contrato por parte del CONTRATISTA.',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'Causada por parte del CONTRATISTA, por no radicar completa, correcta y oportunamente la documentación de legalización, según el instructivo y/o lo manifestado en el contrato. Riesgo que asume el CONTRATISTA.',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 20, 5, 5],
                                                                    },
                                                                ],
                                                                [
                                                                    '',
                                                                    {
                                                                        text: '5',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 20, 5, 5],
                                                                    },
                                                                    {
                                                                        text: 'Errores involuntarios que hayan quedado en la oferta presentada al ITM',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'Hace referencia a cualquier error que se pueda presentar en la oferta presentada al ITM ',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: '',
                                                                        style: 'titleTable1',
                                                                    },
                                                                    {
                                                                        text: 'X',
                                                                        style: 'titleTable1',
                                                                        margin: [5, 5, 5, 5],
                                                                    }
                                                                ]
                                                            ]
                                                        }
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
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            ]
                                        }
                                    ]
                                ]
                            }
                        },
                        {
                            margin: [5, 5, 5, 10],
                            table: {
                                widths: ['*'],
                                body: [
                                    [
                                        {
                                            text: 'ANÁLISIS QUE SUSTENTA LA EXIGENCIA DE GARANTÍAS',
                                            style: 'titleTable2',
                                            fillColor: '#4FAACD',
                                        }
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
                                                }
                                            ]
                                        }
                                    ]
                                ]
                            }
                        },
                        {
                            style: 'tableImage',
                            table: {
                                widths: [255, 250],
                                body: [
                                    [
                                        {
                                            colSpan: 2,
                                            text: 'RESPONSABLE',
                                            style: 'titleTable2',
                                            fillColor: '#4FAACD',
                                        },
                                        {}
                                    ],
                                    [
                                        {
                                            margin: [0, 10, 0, 0],
                                            text: [
                                                {
                                                    text: 'Nombre: ',
                                                    style: 'fontSegundapagPeque',
                                                    bold: true,
                                                    margin: [0, 5, 0, 0],
                                                },
                                                {
                                                    text: user.userName,
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
                                                    text: user.userCharge + ' - Unidad Estratégica de Negocios',
                                                    style: 'fontSegundapagPeque',
                                                    margin: [0, 8, 0, 0],
                                                },
                                            ]
                                        },
                                        {
                                            image: 'data:image/' + user.userFirmType + ';base64,' + user.userFirm,
                                            fit: [70, 70],
                                            alignment: 'center',
                                        }
                                    ]
                                ]
                            }
                        },
                        {
                            margin: [5, 5, 0, 10],
                            table: {
                                widths: [165, 165, 165],
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
                                            image: 'data:image/' + user.userFirmType + ';base64,' + user.userFirm,
                                            fit: [70, 70],
                                            style: 'fontPeque',

                                        },
                                        {
                                            image: 'data:image/' + juridic.userFirmType + ';base64,' + juridic.userFirm,
                                            fit: [70, 70],
                                            style: 'fontPeque',
                                        },
                                        {

                                            image: 'data:image/' + supervisor.userFirmType + ';base64,' + supervisor.userFirm,
                                            fit: [70, 70],
                                            style: 'fontPeque',
                                        },
                                    ],
                                    [
                                        {
                                            text: user.userName,
                                            alignment: 'center',
                                        },
                                        {
                                            text: juridic.userName,
                                            alignment: 'center',
                                        },
                                        {
                                            text: supervisor.userName,
                                            alignment: 'center',
                                        },
                                    ]
                                ],
                            },
                        }
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
                            alignment: 'center',
                            margin: [0, 0, 10, 10],
                        },
                        tableExample: {
                            margin: [0, 0, 0, 5],
                        },
                        title: {
                            bold: true,
                            fontSize: 10,
                            color: 'black',
                            alignment: 'center',
                        },
                        titleTable1: {
                            bold: true,
                            fontSize: 10,
                            color: 'black',
                            alignment: 'center',
                        },
                        titleTable2: {
                            fontSize: 10,
                            alignment: 'center',
                        },
                        fontPeque: {
                            fontSize: 10,
                            alignment: 'center',
                        },
                        fontPeque2: {
                            fontSize: 10,
                        },
                        marginTable: {
                            margin: [10, 10, 30, 30],
                        },
                        fontSegundapagPeque: {
                            fontSize: 10,
                            alignment: 'justify'
                        },
                        tableImage: {
                            margin: [5, 5, 5, 10],
                        }
                    }
                };

                let SolicitudComite = {
                    document: documentPreviousStudy,
                    contractorName: data.contractorName,
                    contractorId: data.contractorId
                }
                this.documentGenerate.push(SolicitudComite);
            } else {
                if (data.requiredProfile == null || data.requiredProfile == '') {
                    swal.fire('', 'No se encontro el perfil requerido', 'warning');
                    this.hideComponent();
                    return;
                } else if (data.generalObligations == null || data.generalObligations == '' || data.specificObligations == null || data.specificObligations == '') {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'no se encontraron las obligaciones del contratato para el contratista ' + data.contractorName,
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
                else if (data.totalValue == null || data.totalValue == '') {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'no se encontro el valor del contrato para el contratista ' + data.contractorName,
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
            }

        }
        if (this.documentGenerate.length > 0) {
            this.savePdfGenerated(this.documentGenerate, this.contractContractors.contractId, DocumentTypeCodes.ESTUDIOSPREVIOS).then(
                () => this.hideComponent()
            );
        }

    }

    private generateCommitteeRequest(committeeRequestData: any) {
        let user = committeeRequestData.personalInCharge.find(ct => ct.userChargeCode === CodeUser.RECRUITER || ct.userChargeCode === CodeUser.SUPERVISORAREAC)

        if (this.itmImageBase64 != null && user.userName != null  != null && user.userFirm != null) {
            for (let index = 0; index < this.contractContractors.contractors.length; index++) {
                let data = committeeRequestData.find(ct => ct.contractorId === this.contractContractors.contractors[index].toUpperCase());
                if(data.profileRequireExperience == null || data.profileRequireAcademic == null || data.contractorIdentification == null){
                    if (data.profileRequireExperience == null) {
                        swal.fire('', 'no se ha cargado el perfil de experiencia requerido para el contratista' + data.contractorName , 'warning');
                    }
                    else if (data.profileRequireAcademic == null) {
                        swal.fire('', 'no se ha cargado el perfil academico requerido para el contratista' + data.contractorName , 'warning');
                    }
                    else if (data.contractorIdentification == null) {
                        swal.fire('', 'no se encontro la identificacion del contratista '+ data.contractorName, 'warning');
                    }
                    this.hideComponent();
                }else{
                    this.comiteeContarctor[index] = [
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
                        ]
                    ]
                }

            }
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
                                    fit: [150, 150],
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
                                text: 'Remito para su estudio las hojas de vida de los proponentes contratistas para el apoyo integral en la ejecución del Contrato Interadministrativo ' + committeeRequestData.contractNumber + 'de ' + committeeRequestData.registerDate.getFullYear() + ', cuyo objeto es ' + committeeRequestData.contractObject,
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
                                ].concat(this.comiteeContarctor)

                            ]
                        }
                    },
                    {
                        margin: [10, 0, 0, 0],
                        text: '\n\nFIRMA:'
                    },
                    {
                        margin: [10, 0, 0, 0],
                        text: user.userName
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
                    memo: {
                        bold: true,
                        fontSize: 13,
                        color: 'black',
                        alignment: 'center',
                        margin: [0, 20, 0, 0],
                    },
                    titleTable1: {
                        bold: true,
                        fontSize: 10,
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
                }
            };
            let SolicitudComite = {
                document: documentSolicitudComite,
                contractorId: this.contractContractors.contractId
            }
            this.documentGenerate.push(SolicitudComite);
        } else {
            if (this.itmImageBase64 == null || this.itmImageBase64 == '') {
                swal.fire('', 'Error al cargar la imagen ', 'warning');
            }
            else if (user.userFirm == null) {
                swal.fire('', 'no se ha cargado la firma de contractual', 'warning');
            }
            else if (user.userName == null) {
                swal.fire('', 'no se encontro contarctual asignado', 'warning');
            }
            this.hideComponent();
        }
        if (this.documentGenerate.length > 0) {
            this.savePdfGenerated(this.documentGenerate, this.contractContractors.contractId, DocumentTypeCodes.SOLICITUDCOMITE);
        }

    }

    private async getcommitteeRequestData(): Promise<void> {
        return await new Promise((rslv) => {
            this.contractContractors.typeMinute = DocumentTypeCodes.SOLICITUDCOMITE
            this._pdfdataService.getcommitteeRequestData(this.contractContractors).subscribe((Response) => {
                this.committeeRequestData = Response;
                if (this.committeeRequestData != null) {
                    this.hideComponent();
                }
                rslv();
            });
        });

    }

    private async gePreviusStudyData(): Promise<void> {
        return await new Promise((rslv) => {
            this.contractContractors.typeMinute = DocumentTypeCodes.ESTUDIOSPREVIOS
            this._pdfdataService.getPreviusStudy(this.contractContractors)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((Response) => {
                    this.previusStudyData = Response;
                    if (Response.previusStudyDto.length == 0) {
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

    private async savePdfGenerated(pdfDocument: any, contractId: string, origin: string): Promise<void> {
        let registerFileLis: FileContractor[] = [];
        for (let index = 0; index < pdfDocument.length; index++) {
            let documentType = this.typeDocs.find(f => f.code == origin)
            let nombreDocumento = documentType.documentTypeDescription + pdfDocument[index].contractorName;
            let date = this.currentDate;
            let userId = this._auth.accessId;
            const pdf = pdfMake.createPdf(pdfDocument[index].document);
            const dataURL = await new Promise<string>((resolve, reject) => {
                pdf.getDataUrl((dataURL) => resolve(dataURL));
            });
            const registerFile: FileContractor = {
                userId: userId,
                contractorId: pdfDocument[index].contractorId,
                contractId: contractId,
                filesName: nombreDocumento,
                fileType: 'PDF',
                descriptionFile: documentType.documentTypeDescription + ' generada',
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
        this._upload.UploadFileBillContractors(registerFileLis)
            .subscribe((res) => {
                if (res.success) {
                    swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        html: res.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    this.hideComponent();
                }
            });
    }

    private getDocumentType() {
        this._upload
            .getDocumentType()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                this.typeDocs = response;
            });
    }

    addCommasToNumber(value: number): string {
        return value.toLocaleString('es');
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
