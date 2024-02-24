import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import swal from 'sweetalert2';
import { DocumentTypeFile, FileContractor } from 'app/layout/common/models/file-contractor';
import { AuthService } from 'app/core/auth/auth.service';
import { ShareService } from 'app/layout/common/share-service/share-service.service';
import { PdfDataService } from 'app/layout/common/share-service/pdf-data-service.service';
import { DocumentTypeCodes, DocumentTypeFileCodes } from 'app/layout/common/enums/document-type/document-type';
import { RouteImageEnum } from 'app/layout/common/enums/route-image/route-image';
import { Subject, takeUntil } from 'rxjs';
import { ContractContractors } from '../../contractual/models/contractor';
import { DataContract, MinutePdf, OtherMinute, PersonalInCharge, ResponseContractorPdf } from '../../contractual/models/generate-pdf';
import { ContractorService } from '../../contractual/service/contractor.service';
import { UploadFileDataService } from '../../contractual/service/upload-file.service';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';


@Component({
    selector: 'app-minuta-contrato',
    templateUrl: './minuta-contrato.component.html'
})
export class MinutaContratoComponent implements OnInit {
    @ViewChild('pdfTable') pdfTable: ElementRef;
    @Input() contractContractors: ContractContractors;
    @Output() readonly pdfGenerated: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() pdfType: string;
    otherMinuteData: ResponseContractorPdf<OtherMinute>;
    lisDataTable: any[] = [];
    file: any;
    minutePdfData: ResponseContractorPdf<MinutePdf>;
    SaveMinuta: FileContractor[] = []
    docDefinition: any;
    base64Output: any;

    @Input() generateType: string;
    typeDocs: any[] = [];
    typeMinute: any[] = [];
    headerImageBase64: any;
    footerImageBase64: any;
    private readonly _unsubscribe$ = new Subject<void>();
    documentGenerated: any[] = [];
    currentDate: string;
    dataMinuta: any[] = [];
    listaAddData: any[] = [];

    constructor(private _economicService: ContractorService,
        private _upload: UploadFileDataService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _shareService: ShareService,
        private _pdfdataService: PdfDataService,
        private _auth: AuthService) { }

    ngOnInit(): void {
        this.currentDate = this._shareService.getCurrentDate();

        this.getDocumentType();
        this.getMinuteType();
        switch (this.generateType) {
            case DocumentTypeFileCodes.MNT:
                this.contractContractors.typeMinute = DocumentTypeFileCodes.MNT
                this.getDataMinute().then(
                    () => this.getBase64Image(RouteImageEnum.HEADER, 'HEADER', null)
                ).then(
                    () => this.getBase64Image(RouteImageEnum.FOOTER, 'FOOTER', DocumentTypeFileCodes.MNT)
                )
                break;
            case 'OTRO SI':

                this.getDataMinuteExtension().then(
                    () => this.getBase64Image(RouteImageEnum.HEADEROTHER, 'HEADER', null)
                ).then(
                    () => this.getBase64Image(RouteImageEnum.FOOTEROTHER, 'FOOTER', this.contractContractors.typeMinute)
                )
                break;
            // case DocumentTypeFileCodes.ADC:
            //   this.contractContractors.typeMinute = DocumentTypeFileCodes.ADC
            //   this.getDataMinuteExtension().then(
            //     () => this.getBase64Image(RouteImageEnum.HEADEROTHER, 'HEADER', null)
            //   ).then(
            //     () => this.getBase64Image(RouteImageEnum.FOOTEROTHER, 'FOOTER', DocumentTypeFileCodes.ADC)
            //   )
            //   break;
            // case DocumentTypeFileCodes.MC:
            //   this.contractContractors.typeMinute = DocumentTypeFileCodes.MC
            //   this.getDataMinuteExtension().then(
            //     () => this.getBase64Image(RouteImageEnum.HEADEROTHERMODIFY, 'HEADER', null)
            //   ).then(
            //     () => this.getBase64Image(RouteImageEnum.FOOTEROTHER, 'FOOTER', DocumentTypeFileCodes.MC)
            //   )
            //   break;
        }
    }

    private async getDataMinute(): Promise<void> {
        return await new Promise((rslv) => {
            this._economicService
                .getDataMinute(this.contractContractors)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((response: ResponseContractorPdf<MinutePdf>) => {
                    if (response.getDataContractors.length > 0) {
                        this.minutePdfData = response;
                    }
                    rslv();
                }, (resp => {
                    console.log(resp);
                }));
        })

    }
    private async getDataMinuteExtension(): Promise<void> {
        return await new Promise((rslv) => {
            this.contractContractors.typeMinute = 'OTRO SI'
            this._pdfdataService.getDataMinuteExtension(this.contractContractors)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((Response: ResponseContractorPdf<OtherMinute>) => {
                    if (Response.getDataContractors.length > 0) {
                        this.contractContractors.typeMinute = Response.getDataContractors[0].typeModify
                        this.otherMinuteData = Response;
                    } else {
                        swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: '',
                            html: 'No se encontraron registros',
                        });
                        this.hideComponent();
                        return;
                    }
                    rslv();
                });
        });
    }

    private generateMinutePDF() {
        let dataProject = this.minutePdfData.dataContract;
        let supervisor = this.minutePdfData.personalInCharge.find(ct => ct.userChargeCode === CodeUser.SUPERVISOR);
        for (let index = 0; index < this.contractContractors.contractors.length; index++) {
            let data = this.minutePdfData.getDataContractors.find(ct => ct.contractorId === this.contractContractors.contractors[index]);
            let fechaLetras = this._shareService.calcularDiferencia(data.initialDateContract, data.finalContractDate);
            let valorLetras = this._shareService.numeroALetras(data.totalValueContract, 'PESOS');
            let totalContrato = this.addCommasToNumber(data.totalValueContract);
            if (!data.legalprocessAprove || data.specificObligations == null || data.generalObligations == null || data.contractorMail == null || data.contractorName == null || supervisor == null || data.totalValueContract === null && data.contractNumber == null || data.contractNumber == 'vacio' || this.headerImageBase64 == null || this.footerImageBase64 == null || !data.comiteGenerated || !data.previusStudy) {
                if (this.headerImageBase64 == null || this.headerImageBase64 == '' || this.footerImageBase64 == null || this.footerImageBase64 == '') {
                    swal.fire('', 'Error al cargar las imagenenes del pdf', 'warning');
                    this.hideComponent();
                    return;
                }
                else if (data.generalObligations == null || data.specificObligations == '' || data.generalObligations == null || data.specificObligations == '') {
                    swal.fire('', 'no se encontraron las obligaciones del contratista', 'warning');
                    this.hideComponent();
                    return;
                }
                else if (!data.comiteGenerated) {
                    swal.fire('', 'se debe generar solicitud de comite', 'warning');
                    this.hideComponent();
                    return;
                }
                else if (!data.previusStudy) {
                    swal.fire('', 'se debe generar estudios previos', 'warning');
                    this.hideComponent();
                    return;
                }
                else if (data.totalValueContract == null || data.totalValueContract == '') {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'No se encontro el valor del contrato para el contratista ' + data.contractorName,
                        showConfirmButton: false,
                        timer: 5000
                    });
                } else if (data.contractNumber == null || data.contractNumber == '' || data.contractNumber == 'vacio') {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'No se encontro el número de la minuta para el contratista ' + data.contractorName,
                        showConfirmButton: false,
                        timer: 5000
                    });

                } else if (supervisor == null) {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'No se encontro la información del supervisor ',
                        showConfirmButton: false,
                        timer: 4000
                    });
                } else if (!data.legalprocessAprove) {
                    swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'Aun se a realizado la aprobación juridica',
                        showConfirmButton: false,
                        timer: 4000
                    });
                }
            } else {
                data.specificObligations = data.specificObligations.replaceAll('->', ' ').replace(/\n/g, '');
                data.generalObligations = data.generalObligations.replaceAll('->', ' ').replace(/\n/g, '');
                let documentMinute = null;
                let d = data.contractNumber

                if (data.requirePolice) {
                    documentMinute = this.documentMinuteWithPolice(data, fechaLetras, valorLetras, totalContrato, dataProject, supervisor);
                } else {
                    documentMinute = this.documentMinuteWithoutPolice(data, fechaLetras, valorLetras, totalContrato, dataProject, supervisor);
                }

                let minute = {
                    document: documentMinute,
                    contractorName: data.contractorName,
                    contractorId: data.contractorId,
                    documentType: DocumentTypeFileCodes.MNT
                }
                this.documentGenerated.push(minute);
            }
        }
        if (this.documentGenerated.length > 0) {
            this.savePdfGenerated(this.documentGenerated, this.contractContractors.contractId, DocumentTypeCodes.MINUTA);
        }
    }

    private documentMinuteWithPolice(data: any, fechaLetras: any, valorLetras: any, totalContrato: any, dataProject: DataContract, supervisor: PersonalInCharge): any {
        const documentMinute = {
            pageSize: 'A4',
            pageOrientation: 'FOLIO',
            pageMargins: [40, 80, 40, 60],
            header: {
                margin: [20, 10, 20, 10],
                image: this.headerImageBase64,
                fit: [540, 540],
            },
            footer: {
                margin: [0, 0, 10, 20],
                image: this.footerImageBase64,
                fit: [580, 580],
            },
            content: [
                {
                    margin: [10, 10, 10, 10],
                    text: ['\n\nCONTRATO DE PRESTACIÓN DE SERVICIOS' + ' P - ' + data.contractNumber + ' DE ' + new Date(dataProject.registerDate).getFullYear()],
                    style: 'header',
                    alignment: 'center',
                },
                {
                    margin: [10, 10, 10, 10],
                    text: [
                        'Entre los suscritos, de una parte, yolanda maria henao con cedula de ciudadania 43507013, actuando en calidad de jefe de oficina asesora juridica del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 del 10 de septiembre del 2020 por medio de la cual se delegan funciones en materia de contratación, en el marco de la ley 80',
                        'de 1993, leyes modificatorias y decretos reglamentarios del INSTITUTO TECNOLÓGICO METROPOLITANO - INSTITUCIÓN UNIVERSITARIA, adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7, debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, previa adjudicación del Rector del ITM, que en adelante se denominará INSTITUTO y de otra parte ' + data.contractorName + ' mayor de edad, identificado (a) con Cédula de Ciudadanía ' + data.contractorIdentification + ' de ' + data.contractorExpeditionPlace + ' que en adelante se denominará el CONTRATISTA, se ha convenido celebrar el presente contrato, que se regirá por las siguientes cláusulas:',
                        ' PRIMERA. -OBJETO DEL CONTRATO. ' + data.elementObject,
                        '. SEGUNDA: DURACIÓN DEL CONTRATO. El presente contrato tendrá una duración de ' + fechaLetras + ', contados a partir de la suscripción del contrato a traves de la plataforma SECOP II. PARAGRAFO El presente contrato está sujeto a la ejecución del contrato interadministrativo No. ' + dataProject.contractNumber + ' DE ' + new Date().getFullYear() + ' . No tendrá lugar a la liquidación conforme al Artículo 60 ley 80 de 1993 modificado por el artículo 217 decreto 019 del 2012.',
                        ' TERCERA. - VALOR DEL CONTRATO Y FORMA DE PAGO. El valor del presente contrato se fija en la suma de ' + valorLetras + ' m.l ($ ' + totalContrato + ') El I.T.M. cancelará al CONTRATISTA, en pagos parciales correspondientes a la entrega previa del informe y/o producto. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARAGRAFO: En el evento en que el contratista no cumpla con las actividades y/o productos correspondientes al mes, el Instituto no cancelará los',
                        'honorarios de dicho mes; una vez se cuente con la totalidad de las actividades cumplidas, dicho pago será efectuado en la siguiente fecha de pago programada para el proyecto. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social.',
                        'PARAGRAFO: En el evento en que el contratista no cumpla con las actividades correspondientes y/o el lleno de la totalidad de los requisitos establecidos para el pago de los honorarios (cuenta de cobro, declaración juramentada, informe de gestion y pago de la seguridad social) en las fechas establecidas según el cronograma de pagos, el pago de honorarios correspondiente a dicho periodo se acumularan para el periodo inmediatamente siguiente.',
                        ' CUARTA. -OBLIGACIONES DEL CONTRATISTA. EL CONTRATISTA se obliga en forma especial a prestar el servicio objeto de este contrato en los términos señalados y específicamente a cumplir las siguientes OBLIGACIONES GENERALES: ' + data.generalObligations + ' OBLIGACIONES ESPECIFICAS: ' + data.specificObligations + 'El CONTRATISTA se obliga igualmente a responder civil y penalmente por sus acciones y omisiones en la actuación contractual, en los términos de la Ley (Artículos 52º Ley 80 de 1993).',
                        ' QUINTA. -DERECHOS Y DEBERES. Las partes declaran conocer y desarrollar los derechos y deberes consagrados en la Ley 80 de 1993 y cumplir las obligaciones específicas consagradas en este contrato.',
                        ' SEXTA. -MODIFICACIÓN, INTERPRETACIÓN Y TERMINACIÓN DEL CONTRATO. EL INSTITUTO tendrá la dirección general y la responsabilidad de ejercer control y vigilancia de la ejecución del contrato. En consecuencia, este contrato se rige por los principios de modificación unilateral, interpretación unilateral y terminación unilateral por parte del Instituto Tecnológico Metropolitano conforme a las disposiciones contenidas en los Artículos 14, 15, 16 y 17 de la Ley 80 de 1993 (modificado por ley 1150 de 2007), la cual para todos los efectos legales hace parte integral de este contrato.',
                        ' SÉPTIMA. - GARANTÍA. GARANTÍA ÚNICA DE CUMPLIMIENTO. EL CONTRATISTA se obliga a constituir a su cargo y en favor del INSTITUTO una Garantía única de Cumplimiento, que deberá ser otorgada por una entidad bancaria o compañía de seguros legalmente constituida en Colombia, debidamente aceptada por EL INSTITUTO en forma y contenido satisfactorios para ésta y que deberá amparar el siguiente riesgo: a) De Cumplimiento del Contrato: para garantizar el fiel cumplimiento de las obligaciones contraídas por este contrato, por una cuantía equivalente al diez por ciento (10%) del valor del contrato más adiciones y reajustes, la cual deberá permanecer vigente por término del contrato y cuatro (4) meses más.',
                        ' OCTAVA. -CADUCIDAD. EL INSTITUTO, podrá declarar la caducidad si se presentan algunos de los hechos constitutivos del incumplimiento de las obligaciones a cargo del contratista, que afecta de manera grave y directa la ejecución del contrato, y evidencie que puede conducir a su paralización. La Entidad por acto administrativo debidamente motivado lo dará por terminado y ordenará su liquidación en el estado en que se encuentre.',
                        ' NOVENA. -EFECTOS DE LA CADUCIDAD. Declarada la caducidad, no habrá lugar a la indemnización para el contratista, quien se hará acreedor a las sanciones e inhabilidades previstas en la Ley 80 de 1993, y las normas que la reglamentan y adicionan, Decreto 1082 de 2015.',
                        ' DÉCIMA. -MORA O INCUMPLIMIENTO PARCIAL. En caso de mora o incumplimiento parcial de las obligaciones adquiridas por EL CONTRATISTA, de acuerdo con las cláusulas del presente contrato, podrá EL INSTITUTO, mediante Resolución motivada, imponer multas, las cuales deberán ser directamente proporcionales al valor del contrato y a los perjuicios que sufra EL INSTITUTO, sin exceder del cinco por mil (5 x 1.000) del valor del contrato cada vez que se impongan.',
                        ' DÉCIMA PRIMERA-CLÁUSULA PENAL PECUNIARIA. Sin perjuicio de lo dispuesto en las cláusulas anteriores, EL INSTITUTO podrá imponer al CONTRATISTA, en caso de declaratoria de caducidad o de incumplimiento como pena, una suma equivalente al diez por ciento (10%) del valor del contrato. El valor de la cláusula penal que se haga efectiva, se considera como pago parcial pero definitivo de los perjuicios causados al INSTITUTO.',
                        ' DECIMA SEGUNDA. -DE LA APLICACIÓN DE LA MULTA Y LA CLÁUSULA PENAL PECUNIARIA. Una vez ejecutoriados los actos administrativos que la imponen podrán ser tomados dichos valores del saldo a favor del CONTRATISTA o de las garantías constituidas. Si no fuere posible lo anterior, se cobrará por jurisdicción coactiva.',
                        ' DECIMA TERCERA. -DEL PROCEDIMIENTO PARA LA IMPOSICION DE LA MULTA: De conformidad con lo dispuesto en el artículo 86 de la Ley 1474 de 2011, en concordancia con los artículos 29 de la Constitución Política y 17 de la Ley 1150 de 2007 reglamentado por el Decreto 1082 de 2015, el procedimiento en caso de imposición de multas, sanciones o declaratoria de incumplimiento será el previsto en el artículo 86 de la ley.',
                        ' DECIMA CUARTA. -CESIÓN DEL CONTRATO. Los contratos de prestación de servicios estatales son "intuitupersona" y, en consecuencia, una vez celebrados no podrán cederse, salvo los casos en que medie autorización expedida por la Rectoría de la entidad, en acto administrativo debidamente sustentado.',
                        ' DÉCIMA QUINTA. -TERMINACIÓN DEL CONTRATO. - El presente contrato podrá darse por terminado cuando: a) Las partes de mutuo acuerdo decidan dar por terminado el contrato. b) Cuando de la aplicación de las causales establecidas en la cláusula sexta, opere la terminación anticipada del contrato. c) Cuando el contratista incumpla alguna de las obligaciones contractuales contraídas, sin perjuicio de realizar el proceso de aplicación de multas y/o de la aplicación de la cláusula penal pecuniaria. d) Cuando culmine el plazo de ejecución del contrato.',
                        ' DÉCIMA SEXTA. -CAUSALES DE SUSPENSIÓN DEL CONTRATO El presente contrato podrá suspenderse a) cuando el contratista por cualquier causal no pueda prestar el servicio para el cual fue contratado. Esta causal incluye enfermedad general, invalidez temporal, licencia de maternidad, licencia de paternidad y todas aquellas circunstancias de hecho y de derecho que no permitan la prestación adecuada de los servicios. b) Cuando el contratista no cumpla con los pagos al sistema general de seguridad social dentro del tiempo establecido por la Ley y que, no sea presentado de manera oportuna a la entidad Contratante. c) Por mutuo acuerdo de las partes.',
                        ' DÉCIMA SEPTIMA. -NATURALEZA, JURÍDICA DEL CONTRATO. El presente contrato está fundamentado en el contenido del artículo 32 de la Ley 80 de 1993, el artículo 2, numeral 4, literal h) y artículo tercero de la Ley 1150 de 2007, reglamentado por el Decreto 1082 de 2015; la Ley 527 de P-6240 DE 2022 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio de Salud y Protección Social No. 385 y 407 de 2020 y demás normas afines con la materia. Además, se celebra en consideración a las calidades personales del CONTRATISTA, para el desempeño de actividades transitorias, toda vez que el objeto del mismo no es posible llevarlo a cabo con personal de la planta de cargos. EL CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL INSTITUTO en consecuencia no adquiere ningún vínculo de carácter laboral ni administrativo con él.',
                        ' DÉCIMA OCTAVA. -INHABILIDADES E INCOMPATIBILIDADES. El presente contrato está sujeto a las inhabilidades e incompatibilidades contempladas en la Ley 80 de 1993 (modificada por ley 1150 de 2007) y EL CONTRATISTA, para todos los efectos legales de este contrato, declara que no está incluido dentro de dichas inhabilidades e incompatibilidades legales.',
                        ' DÉCIMA NOVENA. -SUPERVISIÓN: La Supervisión de este contrato estará a cargo del ' + supervisor.userCharge + ' o quien el INSTITUTO delegue, quien ejercerá actividades de supervisión y vigilancia técnica, administrativa y financiera del contrato. Es responsabilidad del supervisor verificar que EL CONTRATISTA haya adecuado sus afiliaciones al Sistema Integral de Seguridad Social en Salud y Pensiones, conforme a lo establecido en el presente contrato.',
                        ' VIGÉSIMA. -APROPIACIÓN PRESUPUESTAL. El pago de las sumas de dinero que el INSTITUTO queda obligado en razón de éste contrato, se subordina a la apropiación presupuestal que de ella se haga en el respectivo presupuesto.',
                        ' VIGÉSIMA PRIMERA. -IMPUTACIÓN DE GASTOS. Los gastos que demanden la legalización del presente contrato correrán a cargo del CONTRATISTA, y los que impliquen para el INSTITUTO el cumplimiento del mismo durante la presente vigencia fiscal se hace con cargo al certificado de compromiso No. ' + data.contractNumber + ', el cual hace parte integral de los Anexos de éste contrato.',
                        ' VIGÉSIMA SEGUNDA. -AFILIACIÓN AL SISTEMA GENERAL DE SEGURIDAD SOCIAL. Con el objeto de dar cumplimiento a lo preceptuado en Ley 100 de 1993 y la Ley 789 de 2002, los Decretos 1990 de 2016, 780 de 1996, 1273 de 2018, Ley 1955 del 25 de mayo de 2019 el CONTRATISTA para la suscripción del contrato deberá presentar constancia de afiliación al sistema integral de seguridad social en Salud, Pensiones y ARL como trabajador independiente. El artículo 1 del Decreto 1273 de 2018,',
                        'por medio del cual se modifica el artículo 2.2.1.1.1.7 del Decreto 780 de 2016, establece lo siguiente: “El pago de las cotizaciones al Sistema de Seguridad Social Integral de los trabajadores independientes se efectuará mes vencido, por periodos mensuales, a través de la Planilla Integrada de Liquidación de Aportes (PILA) y teniendo en cuenta los ingresos percibidos en el periodo de cotización, esto es, el mes anterior.”, atendiendo lo contemplado en el artículo 3.2.7.6 del Decreto 1273 de 2018, sobre “Plazos”. Así mismo el Decreto 1273 de 2018, establece: 1. El Ingreso Base de Cotización (IBC) corresponde como mínimo al 40% del valor mensualizado en cada contrato de prestación de servicios, sin incluir el Impuesto al Valor Agregado(IVA) cuando a ello haya lugar, y en ningún caso el IBC podrá ser inferior al salario mínimo mensual legal vigente ni superior a 25 veces el salario mínimo mensual legal vigente; 5. Cuando no haya lugar al pago de los servicios contratados, de conformidad con lo dispuesto para el efecto en el contrato, estará a cargo del contratista el pago de los',
                        'aportes al Sistema de Seguridad Social Integral y los intereses moratorios a que hubiere lugar; en estos eventos excepcionales, el contratista deberá acredita al contratante el pago del periodo correspondiente; 7. Al contratista le corresponde pagar mes vencido el valor de la cotización al Sistema General de Riesgos Laborales, cuando la afiliación sea por riesgo I,II o III, conforme la clasificación de actividades económicas establecidas en el Decreto 1607 de 2002 o la norma que lo modifique , adicione o sustituya; en tanto que el contratante deberá pagar el valor de la cotización mes vencido, cuando la afiliación del contratista por riesgo IV y V. PARÁGRAFO PRIMERO: De conformidad con lo establecido en el artículo 3.2.2.1. del Decreto 1990 de diciembre de 2016, ha modificado los plazos para la autoliquidación y el pago de los aportes al Sistema de Seguridad Social Integral y Aportes Parafiscales, así: Todos los aportantes a los Sistemas de Salud, Pensiones y Riesgos Laborales del Sistema de Seguridad Social Integral, así como aquellos a favor del Servicio Nacional del Aprendizaje -SENA-, del Instituto Colombiano de Bienestar Familiar -ICBF- y',
                        'de las Cajas de Compensación Familiar, efectuarán sus aportes utilizando la Planilla Integrada de Liquidación de Aportes -PILA-, bien sea en su modalidad electrónica o asistida, a más tardar en las fechas que se indican a continuación:',
                    ],
                    style: 'header',
                    bold: false
                },
                {
                    style: 'tableWorkers',
                    color: '#444',
                    margin: [10, 10, 10, 10],
                    table: {
                        widths: ['auto', 'auto'],
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
                                    style: 'tableData',
                                    aligment: 'center'
                                }, {
                                    text: '2°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '08 al 14',
                                    style: 'tableData',
                                    aligment: 'center'
                                }, {
                                    text: '3°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '15 al 21',
                                    style: 'tableData',
                                    aligment: 'center'
                                }, {
                                    text: '4°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '22 a 28',
                                    style: 'tableData',
                                },
                                {
                                    text: '5°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '29 al 35',
                                    style: 'tableData',
                                }, {
                                    text: '6°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '36 al 42',
                                    style: 'tableData',
                                }, {
                                    text: '7°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '43 al 49',
                                    style: 'tableData',
                                }, {
                                    text: '8°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '50 al 56',
                                    style: 'tableData',
                                }, {
                                    text: '9°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '57 al 63',
                                    style: 'tableData',
                                }, {
                                    text: '10°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '64 al 69',
                                    style: 'tableData',
                                }, {
                                    text: '11°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '70 al 75',
                                    style: 'tableData',
                                }, {
                                    text: '12°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '76 al 81 ',
                                    style: 'tableData',
                                }, {
                                    text: '13°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '82 al 87',
                                    style: 'tableData',
                                }, {
                                    text: '14°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '88 al 93',
                                    style: 'tableData',
                                }, {
                                    text: '15°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '94 al 99',
                                    style: 'tableData',
                                }, {
                                    text: '16°',
                                    style: 'tableData',
                                }
                            ],
                        ],
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    text: [
                        'PARÁGRAFO SEGUNDO: Una vez efectuado el pago, deberá remitir la constancia al ITM. Lo anterior para la verificación de la respectiva cancelación de aportes. En caso de no acreditar el pago en la fecha establecida, el ITM podrá realizar la  suspensión del contrato. PARÁGRAFO TERCERO: Los trabajadores independientes con contrato de prestación de  servicios personales, deberán continuar efectuando el pago de sus aportes a la seguridad social, directamente',
                        'mediante la planilla integrada de liquidación de aportes - PILA, en la forma en que lo han venido haciendo y en las fechas  establecidas en el artículo 3.2.2.2.1 del Decreto 780 de 2016.',
                        ' VIGÉSIMA. TERCERA. - CLÁUSULA DE INDEMNIDAD.  El contratista mantendrá indemne al Instituto, de cualquier reclamación proveniente de terceros que tenga como causa las actuaciones del contratista, de conformidad con la normatividad vigente.',
                        ' VIGÉSIMA CUARTA. - PAGO DE LOS  CONTRATOS. El ITM realizará los pagos que demande el convenio y/o contrato sujeto a la confirmación del ingreso de  los recursos transferidos por Municipio de Medellín a la cuenta bancaria del ITM donde son administrados los recursos.',
                        ' VIGÉSIMA QUINTA. - PUBLICIDAD EN EL SECOP. El presente contrato deberá ser publicado en el SECOP, con fundamento en lo dispuesto artículo 2.2.1.1.1.7.1 del Decreto 1082 de 2015.',
                        ' VIGÉSIMA SEXTA. - PERFECCIONAMIENTO Y DOCUMENTOS DEL CONTRATO. . De conformidad con del Artículo 41 de la Ley 80 de 1993  en concordancia con los protocolos institucionales adoptados en el marco de la emergencia de salud pública y la Ley 527  de 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio',
                        'de Salud y Protección Social No. 385 y 407 de 2020, el presente contrato se perfecciona con el acuerdo sobre el objeto y la contraprestación y la firma de este escrito mediante el acuse de recibido por correo electrónico del contratista suministrado por el contratista ' + data.contractorMail + ' quien certifica que es de su propiedad y uso exclusivo. Para la ejecución se requerirá la aprobación de la existencia de las disponibilidades presupuéstales',
                        'correspondientes. Para todos los efectos legales se entienden incorporados al presente contrato la Ley 80 de 1993 y normas concordantes, es decir, los decretos reglamentarios, así mismo los siguientes documentos anexos: 1) Carta de adjudicación del Rector 2) Certificado  de compromiso presupuestal 3) Formato único de hoja de vida para el Sector Público (Ley 190 de 1995); 4) Formato de  declaración de Rentas y Bienes 5) Autorización de consignación para pago; 6) Fotocopia de cédula de ciudadanía; 7)',
                        'Fotocopia Libreta Militar (en los casos que aplique) ; 8) Certificado de Antecedentes Disciplinarios; 9) Certificado de Responsabilidad Fiscal; 10) Certificado de la Policía Nacional; 11) Certificado de Medidas correctivas. 12) Certificado de afiliación a la seguridad social (salud y pensión) como independiente; 13) Fotocopia del Rut; 14) Fotocopia de los certificados que acrediten los estudios y experiencia laboral; 16) Examen pre-ocupacional.',
                    ],
                    style: 'header',
                    bold: false
                }

            ],
            styles: {
                header: {
                    fontSize: 12,
                    margin: [5, 5, 5, 5],
                    bold: true,
                    alignment: 'justify'
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black',
                    alignment: 'center',
                },
                tableWorkers: {
                    alignment: 'center',
                    color: 'black',
                    margin: [10, 10, 10, 10],
                },
                tableData: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 0, 10, 10],
                },
                title: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 10, 0, 0],
                },
            },
        };
        return documentMinute;
    }

    private documentMinuteWithoutPolice(data: MinutePdf, fechaLetras: any, valorLetras: any, totalContrato: any, dataProject: DataContract, supervisor: PersonalInCharge) {
        const documentMinute = {
            pageSize: 'A4',
            pageOrientation: 'FOLIO',
            pageMargins: [40, 80, 40, 60],
            header: {
                margin: [20, 10, 20, 10],
                image: this.headerImageBase64,
                fit: [540, 540],
            },
            footer: {
                margin: [0, 0, 10, 20],
                image: this.footerImageBase64,
                fit: [580, 580],
            },
            content: [
                {
                    margin: [10, 10, 10, 10],
                    text: ['\n\nCONTRATO DE PRESTACIÓN DE SERVICIOS' + ' P - ' + data.contractNumber + ' DE ' + new Date(dataProject.registerDate).getFullYear()],
                    style: 'header',
                    alignment: 'center',
                },
                {
                    margin: [10, 10, 10, 10],
                    text: [
                        'Entre los suscritos, de una parte, yolanda maria henao con cedula de ciudadania 43507013, actuando en calidad de jefe de oficina asesora juridica del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 del 10 de septiembre del 2020 por medio de la cual se delegan funciones en materia de contratación, en el marco de la ley 80',
                        'de 1993, leyes modificatorias y decretos reglamentarios del INSTITUTO TECNOLÓGICO METROPOLITANO - INSTITUCIÓN UNIVERSITARIA, adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7, debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, previa adjudicación del Rector del ITM, que en adelante se denominará INSTITUTO y de otra parte ' + data.contractorName + ' mayor de edad, identificado (a) con Cédula de Ciudadanía ' + data.contractorIdentification + ' de ' + data.contractorExpeditionPlace + ' que en adelante se denominará el CONTRATISTA, se ha convenido celebrar el presente contrato, que se regirá por las siguientes cláusulas:',
                        ' PRIMERA. -OBJETO DEL CONTRATO. ' + data.elementObject,
                        '. SEGUNDA: DURACIÓN DEL CONTRATO. El presente contrato tendrá una duración de ' + fechaLetras + ', contados a partir de la suscripción del contrato a traves de la la plataforma SECOP II. PARAGRAFO El presente contrato está sujeto a la ejecución del contrato interadministrativo No. ' + dataProject.contractNumber + ' DE ' + new Date().getFullYear() + ' . No tendrá lugar a la liquidación conforme al Artículo 60 ley 80 de 1993 modificado por el artículo 217 decreto 019 del 2012.',
                        ' TERCERA. - VALOR DEL CONTRATO Y FORMA DE PAGO. El valor del presente contrato se fija en la suma de ' + valorLetras + ' m.l ($ ' + totalContrato + ') El I.T.M. cancelará al CONTRATISTA, en pagos parciales correspondientes a la entrega previa del informe y/o producto. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARAGRAFO: En el evento en que el contratista no cumpla con las actividades y/o productos correspondientes al mes, el Instituto no cancelará los',
                        'honorarios de dicho mes; una vez se cuente con la totalidad de las actividades cumplidas, dicho pago será efectuado en la siguiente fecha de pago programada para el proyecto. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el supervisor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social.',
                        'PARAGRAFO: En el evento en que el contratista no cumpla con las actividades correspondientes y/o el lleno de la totalidad de los requisitos establecidos para el pago de los honorarios (cuenta de cobro, declaración juramentada, informe de gestion y pago de la seguridad social) en las fechas establecidas según el cronograma de pagos, el pago de honorarios correspondiente a dicho periodo se acumularan para el periodo inmediatamente siguiente.',
                        ' CUARTA. -OBLIGACIONES DEL CONTRATISTA. EL CONTRATISTA se obliga en forma especial a prestar el servicio objeto de este contrato en los términos señalados y específicamente a cumplir las siguientes OBLIGACIONES GENERALES: ' + data.generalObligations + ' OBLIGACIONES ESPECIFICAS: ' + data.specificObligations + 'El CONTRATISTA se obliga igualmente a responder civil y penalmente por sus acciones y omisiones en la actuación contractual, en los términos de la Ley (Artículos 52º Ley 80 de 1993).',
                        ' QUINTA. -DERECHOS Y DEBERES. Las partes declaran conocer y desarrollar los derechos y deberes consagrados en la Ley 80 de 1993 y cumplir las obligaciones específicas consagradas en este contrato.',
                        ' SEXTA. -MODIFICACIÓN, INTERPRETACIÓN Y TERMINACIÓN DEL CONTRATO. EL INSTITUTO tendrá la dirección general y la responsabilidad de ejercer control y vigilancia de la ejecución del contrato. En consecuencia, este contrato se rige por los principios de modificación unilateral, interpretación unilateral y terminación unilateral por parte del Instituto Tecnológico Metropolitano conforme a las disposiciones contenidas en los Artículos 14, 15, 16 y 17 de la Ley 80 de 1993 (modificado por ley 1150 de 2007), la cual para todos los efectos legales hace parte integral de este contrato.',
                        ' SÉPTIMA. -CADUCIDAD. EL INSTITUTO, podrá declarar la caducidad si se presentan algunos de los hechos constitutivos del incumplimiento de las obligaciones a cargo del contratista, que afecta de manera grave y directa la ejecución del contrato, y evidencie que puede conducir a su paralización. La Entidad por acto administrativo debidamente motivado lo dará por terminado y ordenará su liquidación en el estado en que se encuentre.',
                        ' OCTAVA. -EFECTOS DE LA CADUCIDAD. Declarada la caducidad, no habrá lugar a la indemnización para el contratista, quien se hará acreedor a las sanciones e inhabilidades previstas en la Ley 80 de 1993, y las normas que la reglamentan y adicionan, Decreto 1082 de 2015.',
                        ' NOVENA. -MORA O INCUMPLIMIENTO PARCIAL. En caso de mora o incumplimiento parcial de las obligaciones adquiridas por EL CONTRATISTA, de acuerdo con las cláusulas del presente contrato, podrá EL INSTITUTO, mediante Resolución motivada, imponer multas, las cuales deberán ser directamente proporcionales al valor del contrato y a los perjuicios que sufra EL INSTITUTO, sin exceder del cinco por mil (5 x 1.000) del valor del contrato cada vez que se impongan.',
                        ' DÉCIMA-CLÁUSULA PENAL PECUNIARIA. Sin perjuicio de lo dispuesto en las cláusulas anteriores, EL INSTITUTO podrá imponer al CONTRATISTA, en caso de declaratoria de caducidad o de incumplimiento como pena, una suma equivalente al diez por ciento (10%) del valor del contrato. El valor de la cláusula penal que se haga efectiva, se considera como pago parcial pero definitivo de los perjuicios causados al INSTITUTO.',
                        ' DECIMA PRIMERA. -DE LA APLICACIÓN DE LA MULTA Y LA CLÁUSULA PENAL PECUNIARIA. Una vez ejecutoriados los actos administrativos que la imponen podrán ser tomados dichos valores del saldo a favor del CONTRATISTA o de las garantías constituidas. Si no fuere posible lo anterior, se cobrará por jurisdicción coactiva.',
                        ' DECIMA SEGUNDA. -DEL PROCEDIMIENTO PARA LA IMPOSICION DE LA MULTA: De conformidad con lo dispuesto en el artículo 86 de la Ley 1474 de 2011, en concordancia con los artículos 29 de la Constitución Política y 17 de la Ley 1150 de 2007 reglamentado por el Decreto 1082 de 2015, el procedimiento en caso de imposición de multas, sanciones o declaratoria de incumplimiento será el previsto en el artículo 86 de la ley.',
                        ' DECIMA TERCERA. -CESIÓN DEL CONTRATO. Los contratos de prestación de servicios estatales son "intuitupersona" y, en consecuencia, una vez celebrados no podrán cederse, salvo los casos en que medie autorización expedida por la Rectoría de la entidad, en acto administrativo debidamente sustentado.',
                        ' DÉCIMA CUARTA. -TERMINACIÓN DEL CONTRATO. - El presente contrato podrá darse por terminado cuando: a) Las partes de mutuo acuerdo decidan dar por terminado el contrato. b) Cuando de la aplicación de las causales establecidas en la cláusula sexta, opere la terminación anticipada del contrato. c) Cuando el contratista incumpla alguna de las obligaciones contractuales contraídas, sin perjuicio de realizar el proceso de aplicación de multas y/o de la aplicación de la cláusula penal pecuniaria. d) Cuando culmine el plazo de ejecución del contrato.',
                        ' DÉCIMA QUINTA. -CAUSALES DE SUSPENSIÓN DEL CONTRATO El presente contrato podrá suspenderse a) cuando el contratista por cualquier causal no pueda prestar el servicio para el cual fue contratado. Esta causal incluye enfermedad general, invalidez temporal, licencia de maternidad, licencia de paternidad y todas aquellas circunstancias de hecho y de derecho que no permitan la prestación adecuada de los servicios. b) Cuando el contratista no cumpla con los pagos al sistema general de seguridad social dentro del tiempo establecido por la Ley y que, no sea presentado de manera oportuna a la entidad Contratante. c) Por mutuo acuerdo de las partes.',
                        ' DÉCIMA SEXTA. -NATURALEZA, JURÍDICA DEL CONTRATO. El presente contrato está fundamentado en el contenido del artículo 32 de la Ley 80 de 1993, el artículo 2, numeral 4, literal h) y artículo tercero de la Ley 1150 de 2007, reglamentado por el Decreto 1082 de 2015; la Ley 527 de P-6240 DE 2022 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio de Salud y Protección Social No. 385 y 407 de 2020 y demás normas afines con la materia. Además, se celebra en consideración a las calidades personales del CONTRATISTA, para el desempeño de actividades transitorias, toda vez que el objeto del mismo no es posible llevarlo a cabo con personal de la planta de cargos. EL CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL CONTRATISTA se obliga por su cuenta y riesgo, a título de contratista independiente. EL INSTITUTO en consecuencia no adquiere ningún vínculo de carácter laboral ni administrativo con él.',
                        ' DÉCIMA SEPTIMA. -INHABILIDADES E INCOMPATIBILIDADES. El presente contrato está sujeto a las inhabilidades e incompatibilidades contempladas en la Ley 80 de 1993 (modificada por ley 1150 de 2007) y EL CONTRATISTA, para todos los efectos legales de este contrato, declara que no está incluido dentro de dichas inhabilidades e incompatibilidades legales.',
                        ' DÉCIMA OCTAVA. -SUPERVISIÓN: La Supervisión de este contrato estará a cargo del ' + supervisor.userCharge + ' o quien el INSTITUTO delegue, quien ejercerá actividades de supervisión y vigilancia técnica, administrativa y financiera del contrato. Es responsabilidad del supervisor verificar que EL CONTRATISTA haya adecuado sus afiliaciones al Sistema Integral de Seguridad Social en Salud y Pensiones, conforme a lo establecido en el presente contrato.',
                        ' DÉCIMA NOVENA. -APROPIACIÓN PRESUPUESTAL. El pago de las sumas de dinero que el INSTITUTO queda obligado en razón de éste contrato, se subordina a la apropiación presupuestal que de ella se haga en el respectivo presupuesto.',
                        ' VIGÉSIMA. -IMPUTACIÓN DE GASTOS. Los gastos que demanden la legalización del presente contrato correrán a cargo del CONTRATISTA, y los que impliquen para el INSTITUTO el cumplimiento del mismo durante la presente vigencia fiscal se hace con cargo al certificado de compromiso No. ' + data.contractNumber + ', el cual hace parte integral de los Anexos de éste contrato.',
                        ' VIGÉSIMA PRIMERA. -AFILIACIÓN AL SISTEMA GENERAL DE SEGURIDAD SOCIAL. Con el objeto de dar cumplimiento a lo preceptuado en Ley 100 de 1993 y la Ley 789 de 2002, los Decretos 1990 de 2016, 780 de 1996, 1273 de 2018, Ley 1955 del 25 de mayo de 2019 el CONTRATISTA para la suscripción del contrato deberá presentar constancia de afiliación al sistema integral de seguridad social en Salud, Pensiones y ARL como trabajador independiente. El artículo 1 del Decreto 1273 de 2018,',
                        'por medio del cual se modifica el artículo 2.2.1.1.1.7 del Decreto 780 de 2016, establece lo siguiente: “El pago de las cotizaciones al Sistema de Seguridad Social Integral de los trabajadores independientes se efectuará mes vencido, por periodos mensuales, a través de la Planilla Integrada de Liquidación de Aportes (PILA) y teniendo en cuenta los ingresos percibidos en el periodo de cotización, esto es, el mes anterior.”, atendiendo lo contemplado en el artículo 3.2.7.6 del Decreto 1273 de 2018, sobre “Plazos”. Así mismo el Decreto 1273 de 2018, establece: 1. El Ingreso Base de Cotización (IBC) corresponde como mínimo al 40% del valor mensualizado en cada contrato de prestación de servicios, sin incluir el Impuesto al Valor Agregado(IVA) cuando a ello haya lugar, y en ningún caso el IBC podrá ser inferior al salario mínimo mensual legal vigente ni superior a 25 veces el salario mínimo mensual legal vigente; 5. Cuando no haya lugar al pago de los servicios contratados, de conformidad con lo dispuesto para el efecto en el contrato, estará a cargo del contratista el pago de los',
                        'aportes al Sistema de Seguridad Social Integral y los intereses moratorios a que hubiere lugar; en estos eventos excepcionales, el contratista deberá acredita al contratante el pago del periodo correspondiente; 7. Al contratista le corresponde pagar mes vencido el valor de la cotización al Sistema General de Riesgos Laborales, cuando la afiliación sea por riesgo I,II o III, conforme la clasificación de actividades económicas establecidas en el Decreto 1607 de 2002 o la norma que lo modifique , adicione o sustituya; en tanto que el contratante deberá pagar el valor de la cotización mes vencido, cuando la afiliación del contratista por riesgo IV y V. PARÁGRAFO PRIMERO: De conformidad con lo establecido en el artículo 3.2.2.1. del Decreto 1990 de diciembre de 2016, ha modificado los plazos para la autoliquidación y el pago de los aportes al Sistema de Seguridad Social Integral y Aportes Parafiscales, así: Todos los aportantes a los Sistemas de Salud, Pensiones y Riesgos Laborales del Sistema de Seguridad Social Integral, así como aquellos a favor del Servicio Nacional del Aprendizaje -SENA-, del Instituto Colombiano de Bienestar Familiar -ICBF- y',
                        'de las Cajas de Compensación Familiar, efectuarán sus aportes utilizando la Planilla Integrada de Liquidación de Aportes -PILA-, bien sea en su modalidad electrónica o asistida, a más tardar en las fechas que se indican a continuación:',
                    ],
                    style: 'header',
                    bold: false
                },
                {
                    style: 'tableWorkers',
                    color: '#444',
                    margin: [10, 10, 10, 10],
                    table: {
                        widths: ['auto', 'auto'],
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
                                    style: 'tableData',
                                    aligment: 'center'
                                }, {
                                    text: '2°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '08 al 14',
                                    style: 'tableData',
                                    aligment: 'center'
                                }, {
                                    text: '3°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '15 al 21',
                                    style: 'tableData',
                                    aligment: 'center'
                                }, {
                                    text: '4°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '22 a 28',
                                    style: 'tableData',
                                },
                                {
                                    text: '5°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '29 al 35',
                                    style: 'tableData',
                                }, {
                                    text: '6°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '36 al 42',
                                    style: 'tableData',
                                }, {
                                    text: '7°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '43 al 49',
                                    style: 'tableData',
                                }, {
                                    text: '8°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '50 al 56',
                                    style: 'tableData',
                                }, {
                                    text: '9°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '57 al 63',
                                    style: 'tableData',
                                }, {
                                    text: '10°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '64 al 69',
                                    style: 'tableData',
                                }, {
                                    text: '11°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '70 al 75',
                                    style: 'tableData',
                                }, {
                                    text: '12°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '76 al 81 ',
                                    style: 'tableData',
                                }, {
                                    text: '13°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '82 al 87',
                                    style: 'tableData',
                                }, {
                                    text: '14°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '88 al 93',
                                    style: 'tableData',
                                }, {
                                    text: '15°',
                                    style: 'tableData',
                                }
                            ],
                            [
                                {
                                    text: '94 al 99',
                                    style: 'tableData',
                                }, {
                                    text: '16°',
                                    style: 'tableData',
                                }
                            ],
                        ],
                    },
                },
                {
                    margin: [10, 10, 10, 10],
                    text: [
                        'PARÁGRAFO SEGUNDO: Una vez efectuado el pago, deberá remitir la constancia al ITM. Lo anterior para la verificación de la respectiva cancelación de aportes. En caso de no acreditar el pago en la fecha establecida, el ITM podrá realizar la  suspensión del contrato. PARÁGRAFO TERCERO: Los trabajadores independientes con contrato de prestación de  servicios personales, deberán continuar efectuando el pago de sus aportes a la seguridad social, directamente',
                        'mediante la planilla integrada de liquidación de aportes - PILA, en la forma en que lo han venido haciendo y en las fechas  establecidas en el artículo 3.2.2.2.1 del Decreto 780 de 2016. VIGÉSIMA. SEGUNDA. -CLÁUSULA DE INDEMNIDAD.  El contratista mantendrá indemne al Instituto, de cualquier reclamación proveniente de terceros que tenga como causa',
                        'las actuaciones del contratista, de conformidad con la normatividad vigente. VIGÉSIMA TERCERA. -PAGO DE LOS  CONTRATOS. El ITM realizará los pagos que demande el convenio y/o contrato sujeto a la confirmación del ingreso de  los recursos transferidos por Municipio de Medellín a la cuenta bancaria del ITM donde son administrados los recursos.  VIGÉSIMA CUARTA. - PUBLICIDAD EN EL SECOP. El presente contrato deberá ser publicado en el SECOP,',
                        'con fundamento en lo dispuesto artículo 2.2.1.1.1.7.1 del Decreto 1082 de 2015. VIGÉSIMA QUINTA. - PERFECCIONAMIENTO Y DOCUMENTOS DEL CONTRATO. . De conformidad con del Artículo 41 de la Ley 80 de 1993  en concordancia con los protocolos institucionales adoptados en el marco de la emergencia de salud pública y la Ley 527  de 1999, Decretos 417 del 17 de marzo de 2020 y 457 del 20 de marzo de 2020 y las Resoluciones del Ministerio',
                        'de Salud y Protección Social No. 385 y 407 de 2020, el presente contrato se perfecciona con el acuerdo sobre el objeto y la contraprestación y la firma de este escrito mediante el acuse de recibido por correo electrónico del contratista suministrado por el contratista ' + data.contractorMail + ' quien certifica que es de su propiedad y uso exclusivo. Para la ejecución se requerirá la aprobación de la existencia de las disponibilidades presupuéstales',
                        'correspondientes. Para todos los efectos legales se entienden incorporados al presente contrato la Ley 80 de 1993 y normas concordantes, es decir, los decretos reglamentarios, así mismo los siguientes documentos anexos: 1) Carta de adjudicación del Rector 2) Certificado  de compromiso presupuestal 3) Formato único de hoja de vida para el Sector Público (Ley 190 de 1995); 4) Formato de  declaración de Rentas y Bienes 5) Autorización de consignación para pago; 6) Fotocopia de cédula de ciudadanía; 7)',
                        'Fotocopia Libreta Militar (en los casos que aplique) ; 8) Certificado de Antecedentes Disciplinarios; 9) Certificado de Responsabilidad Fiscal; 10) Certificado de la Policía Nacional; 11) Certificado de Medidas correctivas. 12) Certificado de afiliación a la seguridad social (salud y pensión) como independiente; 13) Fotocopia del Rut; 14) Fotocopia de los certificados que acrediten los estudios y experiencia laboral; 16) Examen pre-ocupacional.',
                    ],
                    style: 'header',
                    bold: false
                }

            ],
            styles: {
                header: {
                    fontSize: 12,
                    margin: [5, 5, 5, 5],
                    bold: true,
                    alignment: 'justify'
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black',
                    alignment: 'center',
                },
                tableWorkers: {
                    alignment: 'center',
                    color: 'black',
                    margin: [10, 10, 10, 10],
                },
                tableData: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 0, 10, 10],
                },
                title: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 10, 0, 0],
                },
            },
        };
        return documentMinute;
    }

    private generateMinuteExtension(data: any, listConcat: any) {
        let dataProject = this.otherMinuteData.dataContract;
        let supervisor = this.otherMinuteData.personalInCharge.find(ct => ct.userChargeCode === CodeUser.SUPERVISOR)
        let plazo = this._shareService.calcularDiferencia(data.initialDateContract, data.finalDateContract);
        let fechaInicioContrato = this._shareService.transformDate(data.initialDateContract.toString());
        let fechaFinalContrato = this._shareService.transformDate(data.finalDateContract.toString());
        let valorLetras = this._shareService.numeroALetras(data.totalValueContract, 'PESOS');
        let fechaInicioAmpliacionContrato = this._shareService.transformDate(data.extensionInitialDate.toString());
        let fechaFinalAmpliacionContrato = this._shareService.transformDate(data.extensionFinalDate.toString());
        let plazoAmpliacion = this._shareService.calcularDiferencia(data.extensionInitialDate, data.extensionFinalDate);
        data.totalValueContract = this.addCommasToNumber(data.totalValueContract);
        if (plazoAmpliacion != null && fechaFinalAmpliacionContrato != null && fechaInicioAmpliacionContrato != null) {
            const minuteExtension = {
                pageSize: 'A4',
                pageOrientation: 'FOLIO',
                pageMargins: [40, 80, 40, 60],
                header: {
                    margin: [10, 10, 20, 10],
                    image: this.headerImageBase64,
                    fit: [500, 500],
                },
                footer: {
                    margin: [0, 0, 10, 20],
                    image: this.footerImageBase64,
                    fit: [500, 500],
                },
                content: [
                    {
                        text: 'INSTITUTO TECNOLOGICO METROPOLITANO',
                        bold: true,
                        margin: [0, 20, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        text: 'OTROSI No.' + data.consecutive + '  AL CONTRATO No. P-' + data.contractNumber + ' DE ' + new Date(dataProject.registerDate).getFullYear(),
                        bold: true,
                        margin: [0, 20, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            widths: ['*', '*'],
                            body: [
                                [
                                    { text: 'CONTRATO', bold: true },
                                    { text: 'P- ' + data.contractNumber + ' de ' + new Date(dataProject.registerDate).getFullYear() },
                                ],
                                [
                                    { text: 'CLASE DE CONTRATO', bold: true },
                                    { text: 'PRESTACION DE SERVICIOS' },
                                ],
                                [
                                    { text: 'CONTRATISTA', bold: true },
                                    { text: data.contractorName },
                                ],
                                [
                                    { text: 'OBJETO', bold: true },
                                    { text: data.object },
                                ],
                                [
                                    { text: 'VALOR INICIAL', bold: true },
                                    {
                                        text: valorLetras + ' M/L  ($' + data.totalValueContract + ')',
                                        alignment: 'right',
                                    },
                                ],
                                [{ text: 'PLAZO', bold: true },
                                { text: plazo }
                                ],
                                [
                                    {
                                        text: ' ',
                                        bold: true,
                                    },
                                    { text: ' ' },
                                ]
                                // [
                                //     { text: 'FECHA DE INICIO', bold: true },
                                //     fechaInicioContrato,
                                // ],
                                // [
                                //     { text: 'FECHA TERMINACION', bold: true },
                                //     fechaFinalContrato,
                                // ],
                                // [{ text: 'SUSPENSIÓN', bold: true }, 'N/A'],
                                // [
                                //     {
                                //         text: 'DURACION AMPLIACION ACTUAL:',
                                //         bold: true,
                                //     },
                                //     plazoAmpliacion,
                                // ],
                                // [
                                //     {
                                //         text: 'FECHA TERMINACION AMPLIACIÓN ACTUA:',
                                //         bold: true,
                                //     },
                                //     fechaFinalAmpliacionContrato,
                                // ]
                            ].concat(listConcat)
                        }
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'En la Ciudad de Medellín, en las instalaciones del ',
                                fontSize: 12,
                            },
                            {
                                text: 'EL INSTITUTO TECNOLÓGICO METROPOLITANO',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: ', se reunieron',
                                fontSize: 12,
                            },
                            {
                                text: supervisor.userName,
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: ' identificado con Cédula de Ciudadanía Nº ' + supervisor.userIdentification,
                                fontSize: 12,
                            },
                            {
                                text: 'actuando en calidad de ' + supervisor.userCharge + '- Asesora Jurídica del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 de 10 de septiembre de 2020  delegada para la contratación Administrativa de los convenios interadministrativos del INSTITUTO TECNOLÓGICO METROPOLITANO - INSTITUCIÓN UNIVERSITARIA',
                                fontSize: 12,
                                bold: true,
                                style: 'textStyle'
                            },
                            {
                                text: ' adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7 debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, ',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                            {
                                text: 'y ' + data.contractorName,
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: ' identificado (a) con cédula de ciudadanía ' + data.contractorIdentification + ' en calidad de contratista, con el fin de hacer la siguiente modificación al contrato de prestación de servicio No. P- ' + data.contractNumber + ' de ' + new Date(dataProject.registerDate).getFullYear() + ', previa las siguientes:',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                        ],
                    },
                    {
                        pageBreak: 'before',
                        text: 'CONSIDERACIONES',
                        bold: true,
                        margin: [0, 20, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: '1. De conformidad con el artículo 14 de la Ley 80 de 1993 en su parágrafo primero, las entidades estatales “tendrán la dirección general y la responsabilidad de ejercer el control y la vigilancia de la ejecución del contrato. En consecuencia, con el exclusivo objeto de evitar la paralización o la afectación grave de los servicios públicos a su cargo y asegurar la inmediata, continua y adecuada prestación, podrán, en los casos previstos en el numeral segundo de este artículo, interpretar los documentos contractuales y las estipulaciones en ellos convenidas, introducir modificaciones a lo contratado y, cuando las condiciones particulares de la prestación así lo exijan, terminar unilateralmente el contrato celebrado”. ',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                        ],
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: '2. En orden a lo dicho, el ' + fechaInicioContrato + ' las partes firmaron el Contrato de Prestación de Servicios No. P - ' + data.contractNumber + ' DE ' + new Date(dataProject.registerDate).getFullYear() + ' por un valor de ' + valorLetras + ' M/L ($ ' + data.totalValueContract + ' ) y un plazo de ejecución de ' + plazo + ', contados a partir del ' + fechaInicioContrato + ' fecha en la cual fue suscrita el acta de inicio de actividades',
                        fontSize: 12,
                        style: 'textStyle'
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: '3. Que es necesario ampliar  el contrato de prestación de servicios número P- ' + data.contractNumber + ' DE ' + new Date(dataProject.registerDate).getFullYear() + ' de conformidad con la necesidad que tiene la EMPRESAS ' + data.companyName + ' DE MEDELLIN S.A. al desarrollo de actividades y obligaciones en cumplimiento del alcance y el objeto del contrato interadministrativo No.  ' + dataProject.contractNumber + '/2021-2023 , y seguir con el desarrollo de actividades legales, técnicas y operativas. La ampliación del contrato de prestación de servicios  P- ' + data.contractNumber + ' de ' + new Date(dataProject.registerDate).getFullYear() + ' será por un período de ' + plazoAmpliacion + ' adicionales al término primigenio.',
                        fontSize: 12,
                        style: 'textStyle'
                    },
                    {
                        text: 'EN MÉRITO DE LO EXPUESTO LAS PARTES ACUERDAN:',
                        bold: true,
                        margin: [0, 20, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'CLÁUSULA PRIMERA. Modificar la cláusula segunda del contrato, en el sentido de ampliar el plazo de ejecución contractual en ' + plazoAmpliacion,
                                style: 'textStyle'
                            },
                            {
                                text: ', que se iniciarán a contar a partir del ' + fechaInicioAmpliacionContrato + ' y se extenderá hasta el  ' + fechaFinalAmpliacionContrato + ', según registro de ampliación No. 669/7543 , quedando así:',
                                style: 'textStyle'
                            },
                        ],
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: '““SEGUNDA. -DURACIÓN DEL CONTRATO. El presente contrato tendrá una duración ' + plazoAmpliacion + ' contados a partir de la suscripción del acta de inicio - la que se firmará una vez sea legalizado. PARAGRAFO El presente contrato está sujeto a la ejecución del contrato interadministrativo No. ' + dataProject.contractNumber + ' Una vez finalizado el contrato interadministrativo, habrá lugar a la terminación y liquidación de este.”',
                        style: 'textStyle'
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'CLÁUSULA SEGUNDA: ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: 'Continúan vigentes y de obligatoria observancia las demás cláusulas del contrato que no hayan sido modificadas en el presente OTROSI.',
                                fontSize: 12,
                            },
                        ],
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'CLÁUSULA TERCERA: ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: 'Las partes con la suscripción del presente OTROSI que da cuenta de la voluntad que les asiste, manifiestan que renuncian a cualquier reclamación presente y futura inherentes a la misma.',
                                fontSize: 12,
                            },
                        ],
                    },
                    // {
                    //     margin: [10, 10, 10, 10],
                    //     text: 'Para constancia se firma por las partes en la ciudad de Medellín',
                    //     fontSize: 12,
                    // },
                ],
                styles: {
                    textStyle: {
                        fontSize: 12,
                        bold: true,
                        alignment: 'justify'
                    },
                },
            };
            return minuteExtension;
        } else {
            if (this.headerImageBase64 == null || this.headerImageBase64 == '' || this.footerImageBase64 == null || this.footerImageBase64 == '') {
                swal.fire('', 'Error al cargar las imagenenes del pdf', 'warning');
            }
            else if (data.totalValueContract == null || data.totalValueContract == '') {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro el valor del contrato para el contratista ' + data.contractorName,
                    showConfirmButton: false,
                    timer: 1000
                });
            } else if (fechaInicioAmpliacionContrato != null || fechaInicioAmpliacionContrato == '') {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro la firma del juridico para el contratista ' + data.contractorName,
                    showConfirmButton: false,
                    timer: 1000
                });
            } else if (plazoAmpliacion == null || plazoAmpliacion == '') {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro la numero de la minuta para el contratista ' + data.contractorName,
                    showConfirmButton: false,
                    timer: 1500
                });

            }
        }
    }

    private generateAdditionMinute(data: any, listConcat: any[]): any {
        let dataProject = this.otherMinuteData.dataContract;
        let plazo = this._shareService.calcularDiferencia(data.initialDateContract, data.finalDateContract);
        let fechaInicioContrato = this._shareService.transformDate(data.initialDateContract.toString());
        let fechaFinalContrato = this._shareService.transformDate(data.finalDateContract.toString());
        let valorLetras = this._shareService.numeroALetras(data.initialValue, 'PESOS');
        data.totalValueContract = this.addCommasToNumber(data.initialValue);
        data.additionValue = this.addCommasToNumber(data.additionValue);
        data.unitValueContract = this.addCommasToNumber(data.unitValueContract);
        let d = dataProject.registerDate
        if (valorLetras != null && data.additionValue != null) {
            const documentMinuteAddition = {
                pageSize: 'A4',
                pageOrientation: 'FOLIO',
                pageMargins: [40, 70, 30, 60],
                header: {
                    margin: [20, 0, 20, 0],
                    image: this.headerImageBase64,
                    fit: [500, 500]
                },
                footer: {
                    margin: [70, -9, 20, 0],
                    image: this.footerImageBase64,
                    fit: [500, 500]
                },
                content: [
                    {
                        text: 'INSTITUTO TECNOLOGICO METROPOLITANO',
                        bold: true,
                        margin: [0, 15, 0, 15],
                        alignment: 'center',
                        fontSize: 14
                    },
                    {
                        text: 'OTROSI No.1  AL CONTRATO No. P- ' + data.contractNumber + ' DE ' + new Date(dataProject.registerDate).getFullYear(),
                        bold: true,
                        margin: [0, 15, 0, 15],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto'],
                            body: [
                                [
                                    { text: 'CONTRATO', bold: true },
                                    { text: 'P-' + data.contractNumber + ' de ' + new Date(dataProject.registerDate).getFullYear() },
                                ],
                                [
                                    { text: 'CLASE DE CONTRATO', bold: true },
                                    'PRESTACION DE SERVICIOS',
                                ],
                                [
                                    { text: 'CONTRATISTA', bold: true },
                                    data.contractorName,
                                ],
                                [

                                    { text: 'OBJETO', bold: true },
                                    'Prestación de servicios, como contratista independiente, sin vinculo laboral por su propia cuenta y riesgo, en la Gestión de Coordinador general de equipo de Interventoría en ejecución del Contrato CW153520/2021-2023 celebrado entre Empresas Varias de Medellín y el ITM',
                                ],
                                [
                                    { text: 'VALOR INICIAL', bold: true },
                                    {
                                        text: valorLetras + ' M/L  ($' + data.totalValueContract + ')',
                                        alignment: 'justify',
                                    },
                                ],
                                [{ text: 'PLAZO', bold: true }, plazo],
                                [
                                    { text: 'FECHA DE INICIO', bold: true },
                                    fechaInicioContrato,
                                ],
                                [
                                    { text: 'FECHA TERMINACION', bold: true },
                                    fechaFinalContrato,
                                ],
                                [{ text: 'SUSPENSIÓN', bold: true }, 'N/A'],
                                // [
                                //     {
                                //         text: 'VALOR ADICION ACTUAL:',
                                //         bold: true,
                                //     },
                                //     data.additionValue,
                                // ]
                            ].concat(listConcat)
                        }
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'En la Ciudad de Medellín, en las instalaciones del ',
                                fontSize: 12,
                            },
                            {
                                text: 'EL INSTITUTO TECNOLÓGICO METROPOLITANO',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: ', se reunieron',
                                fontSize: 12,
                            },
                            {
                                text: 'yolanda maria henao, ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: ' identificado con Cédula de Ciudadanía Nº 43507013',
                                fontSize: 12,
                            },
                            {
                                text: 'actuando en calidad de Jefe de Oficina- Asesora Jurídica del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 de 10 de septiembre de 2020  delegada para la contratación Administrativa de los convenios interadministrativos del INSTITUTO TECNOLÓGICO METROPOLITANO – INSTITUCIÓN UNIVERSITARIA',
                                fontSize: 12,
                                bold: true,
                                style: 'textStyle'
                            },
                            {
                                text: ' adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7 debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, ',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                            {
                                text: 'y ' + data.contractorName,
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: ' identificado (a) con cédula de ciudadanía ' + data.contractorIdentification + ' en calidad de contratista, con el fin de hacer la siguiente modificación al contrato de prestación de servicio No. P-7240 de 2022, previa las siguientes:',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                        ],
                    },
                    {
                        pageBreak: 'before',
                        text: 'CONSIDERACIONES',
                        bold: true,
                        margin: [0, 20, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: '1. De conformidad con el artículo 14 de la Ley 80 de 1993 en su parágrafo primero, las entidades estatales “tendrán la dirección general y la responsabilidad de ejercer el control y la vigilancia de la ejecución del contrato. En consecuencia, con el exclusivo objeto de evitar la paralización o la afectación grave de los servicios públicos a su cargo y asegurar la inmediata, continua y adecuada prestación, podrán, en los casos previstos en el numeral segundo de este artículo, interpretar los documentos contractuales y las estipulaciones en ellos convenidas, introducir modificaciones a lo contratado y, cuando las condiciones particulares de la prestación así lo exijan, terminar unilateralmente el contrato celebrado”. ',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                        ],
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: '2. En orden a lo dicho, el ' + fechaInicioContrato + ' las partes firmaron el Contrato de Prestación de Servicios No. P-' + data.contractNumber + ' de ' + new Date(dataProject.registerDate).getFullYear() + ', por un valor de SIETE MILLONES CIENTO SETENTA Y CINCO MIL CUATROCIENTOS SESENTA Y SIETE PESOS M/L ($ $ 7,175,467 ) y un plazo de ejecución de VEINTISIETE (27) DÍAS, contados a partir del 2 de noviembre de 2022 fecha en la cual fue suscrita el acta de inicio de actividades',
                        fontSize: 12,
                        style: 'textStyle'
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: '3. Que es necesario ampliar  el contrato de prestación de servicios número P-7240 de 2022 de conformidad con la necesidad que tiene la EMPRESAS VARIAS DE MEDELLIN S.A. al desarrollo de actividades y obligaciones en cumplimiento del alcance y el objeto del contrato interadministrativo No. ' + dataProject.contractNumber + ' , y seguir con el desarrollo de actividades legales, técnicas y operativas. La ampliación del contrato de prestación de servicios  P-3819 de 2022 será por un período de DOS (2) DÍAS adicionales al término primigenio.',
                        fontSize: 12,
                        style: 'textStyle'
                    },
                    {
                        text: 'EN MÉRITO DE LO EXPUESTO LAS PARTES ACUERDAN:',
                        bold: true,
                        margin: [0, 20, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'CLÁUSULA PRIMERA: Modificar la cláusula segunda del contrato, en el sentido de ampliar el plazo de ejecución contractual en DIEZ (10) DÍAS    que se iniciarán a contar a partir del 19/08/2022  y se extenderá hasta el 28/08/2022  la cual quedará así:',
                                fontSize: 12,
                                bold: true,
                                style: 'textStyle'
                            },
                        ],
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: '“SEGUNDA. -DURACIÓN DEL CONTRATO. El presente contrato tendrá una duración de ' + plazo + ',  contados a partir de la suscripción del acta de inicio- la que se firmará una vez sea legalizado. PARAGRAFO El presente contrato está sujeto a la ejecución del contrato interadministrativo No. ' + data.contractNumber + ' DE ' + new Date(data.initialDateContract).getFullYear() + ' . Una vez finalizado el contrato interadministrativo, habrá lugar a la terminación y liquidación de este.”',
                        fontSize: 12,
                        bold: true,
                        style: 'textStyle'
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'CLÁUSULA SEGUNDA: ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: ' Modificar la cláusula tercera del valor del contrato, en el sentido de adicionar el mismo en la suma $ ' + data.additionValue + ' con cargo al certificado de compromiso presupuestal 668/5358  de 2022 y, rubro presupuestal ' + data.rubroContract + ', la cual quedará así:',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                        ],
                    },
                    {
                        pageBreak: 'before',
                        margin: [15, 10, 10, 15],
                        text: '“TERCERA. -VALOR DEL CONTRATO Y FORMA DE PAGO. El valor del presente contrato se fija en la suma de  $ ' + data.unitValueContract + ' El I.T.M. cancelará al CONTRATISTA, en pagos parciales correspondientes a la entrega del informe en donde conste el cumplimiento de las actividades correspondientes a la prestación del servicio. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el interventor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARAGRAFO: En el evento en que el contratista no cumpla con las actividades correspondientes y/o el lleno de la totalidad de los requisitos establecidos para el pago de los honorarios (cuenta de cobro, declaración juramentada, informe de gestión y pago de la seguridad social) en las fechas establecidas según el cronograma de pagos, el pago de honorarios correspondiente a dicho periodo se acumulará para el periodo inmediatamente siguiente.”',
                        fontSize: 12,
                        bold: true,
                        style: 'textStyle'
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'CLÁUSULA TERCERA: ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: 'Continúan vigentes y de obligatoria observancia las demás cláusulas del contrato que no hayan sido modificadas en el presente OTROSI.',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                        ],
                    },
                    {
                        margin: [10, 10, 10, 10],
                        text: [
                            {
                                text: 'CLÁUSULA CUARTA: ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: ': Las partes con la suscripción del presente OTROSI que da cuenta de la voluntad que les asiste, manifiestan que renuncian a cualquier reclamación presente y futura inherentes a la misma.',
                                fontSize: 12,
                                style: 'textStyle'
                            },
                        ],
                    },
                    // {
                    //     margin: [10, 10, 10, 10],
                    //     text: 'Para constancia se firma por las partes en la ciudad de Medellín',
                    //     fontSize: 12,
                    // },
                ],
                styles: {
                    textStyle: {
                        fontSize: 12,
                        bold: true,
                        alignment: 'justify'
                    },
                },
            };
            return documentMinuteAddition;
        } else {
            if (this.headerImageBase64 == null || this.headerImageBase64 == '' || this.footerImageBase64 == null || this.footerImageBase64 == '') {
                swal.fire('', 'Error al cargar las imagenenes del pdf', 'warning');
            }
            else if (data.totalValueContract == null || data.totalValueContract == '') {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro el valor del contrato para el contratista ' + data.contractorName,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        }
    }

    private generateModifyMinute(data: OtherMinute, lisDataTable: any[]) {
        let dataProject = this.otherMinuteData.dataContract;
        let user = this.otherMinuteData.personalInCharge.find(ct => ct.userChargeCode === CodeUser.RECRUITER || ct.userChargeCode === CodeUser.SUPERVISORAREAC)
        let supervisor = this.otherMinuteData.personalInCharge.find(ct => ct.userChargeCode === CodeUser.SUPERVISOR)
        let plazo = this._shareService.calcularDiferencia(data.initialDateContract, data.finalDateContract);
        let fechaInicioContrato = this._shareService.transformDate(data.initialDateContract.toString());
        let fechaFinalContrato = this._shareService.transformDate(data.finalDateContract.toString());
        let valorLetras = this._shareService.numeroALetras(data.totalValueContract, 'PESOS');
        data.totalValueContract = this.addCommasToNumber(data.totalValueContract);
        data.unitValueContract = this.addCommasToNumber(data.unitValueContract);
        data.specificObligations = data.specificObligations.replaceAll('->', ' ');
        data.generalObligations = data.generalObligations.replaceAll('->', ' ');

        if (data.generalObligations != null) {
            const minutaModificacionMacro = {
                pageSize: 'A4',
                pageOrientation: 'FOLIO',
                pageMargins: [40, 80, 40, 60],
                header: {
                    margin: [20, 0, 20, 20],
                    image: this.headerImageBase64,
                    fit: [500, 500],
                },
                footer: {
                    margin: [40, 0, 10, 20],
                    image: this.footerImageBase64,
                    fit: [490, 480]
                },
                content: [
                    {
                        text: 'INSTITUTO TECNOLOGICO METROPOLITANO',
                        bold: true,
                        margin: [0, 10, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        text: 'OTROSI No. ' + data.numberModify + '  AL CONTRATO No. P- ' + data.contractNumber + ' DE ' + new Date(data.initialDateContract).getFullYear(),
                        bold: true,
                        margin: [0, 10, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            widths: ['*', '*'],
                            body: [
                                [
                                    { text: 'CONTRATO', bold: true },
                                    { text: 'P- ' + data.contractNumber + ' de ' + new Date(dataProject.registerDate).getFullYear() },
                                ],
                                [
                                    { text: 'CLASE DE CONTRATO', bold: true },
                                    { text: 'PRESTACION DE SERVICIOS' },
                                ],
                                [
                                    { text: 'CONTRATISTA', bold: true },
                                    { text: data.contractorName },
                                ],
                                [
                                    { text: 'OBJETO', bold: true },
                                    { text: data.object },
                                ],
                                [
                                    { text: 'VALOR INICIAL', bold: true },
                                    {
                                        text: valorLetras + ' M/L  ($' + data.totalValueContract + ')',
                                        alignment: 'justify',
                                    },
                                ],
                                [{ text: 'PLAZO', bold: true },
                                { text: plazo }
                                ],
                                [
                                    {
                                        text: ' ',
                                        bold: true,
                                    },
                                    { text: ' ' },
                                ]
                                // [
                                //     { text: 'FECHA DE INICIO', bold: true },
                                //     fechaInicioContrato,
                                // ],
                                // [
                                //     { text: 'FECHA TERMINACION', bold: true },
                                //     fechaFinalContrato,
                                // ],
                                // [{ text: 'SUSPENSIÓN', bold: true }, 'N/A'],
                                // [
                                //     {
                                //         text: 'DURACION AMPLIACION ACTUAL:',
                                //         bold: true,
                                //     },
                                //     plazoAmpliacion,
                                // ],
                                // [
                                //     {
                                //         text: 'FECHA TERMINACION AMPLIACIÓN ACTUA:',
                                //         bold: true,
                                //     },
                                //     fechaFinalAmpliacionContrato,
                                // ]
                            ].concat(lisDataTable)
                        }
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: [
                            {
                                text: 'En la Ciudad de Medellín, en las instalaciones del ',
                                fontSize: 12,
                            },
                            {
                                style: 'text',
                                text: 'EL INSTITUTO TECNOLÓGICO METROPOLITANO',
                                bold: true,
                                alignment: 'justify'
                            },
                            {
                                style: 'text',
                                text: ', se reunieron ',
                                alignment: 'justify'
                            },
                            {
                                text: 'yolanda maria henao, ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                style: 'text',
                                text: ' identificada con Cédula de Ciudadanía Nº 43507013',
                            },
                            {
                                style: 'text',
                                text: 'actuando en calidad de Jefe de Oficina- Asesora Jurídica del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 de 10 de septiembre de 2020  delegada para la contratación Administrativa de los convenios interadministrativos del INSTITUTO TECNOLÓGICO METROPOLITANO – INSTITUCIÓN UNIVERSITARIA',
                                bold: true,
                            },
                            {
                                text: ' adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7 debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, ',
                                fontSize: 12,
                            },
                            {
                                text: 'y ' + data.contractorName,
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                style: 'text',
                                text: ' identificado (a) con cédula de ciudadanía ' + data.contractorIdentification + ' en calidad de contratista, con el fin de hacer la siguiente modificación al contrato de prestación de servicio No. P-' + data.contractNumber + ' de ' + new Date(data.initialDateContract).getFullYear() + ', previa las siguientes:',
                            },
                        ],
                    },
                    {
                        text: 'CONSIDERACIONES',
                        bold: true,
                        margin: [0, 15, 0, 15],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        margin: [15, 15, 10, 10],
                        text: [
                            {
                                style: 'text',
                                text: '• De conformidad con el artículo 14 de la Ley 80 de 1993 en su parágrafo primero, las entidades estatales “tendrán la dirección general y la responsabilidad de ejercer el control y la vigilancia de la ejecución del contrato. En consecuencia, con el exclusivo objeto de evitar la paralización o la afectación grave de los servicios públicos a su cargo y asegurar la inmediata, continua y adecuada prestación, podrán, en los casos previstos en el numeral segundo de este artículo, interpretar los documentos contractuales y las estipulaciones en ellos convenidas, introducir modificaciones a lo contratado y, cuando las condiciones particulares de la prestación así lo exijan, terminar unilateralmente el contrato celebrado”. En orden a lo dicho, el 4 de junio de 2019 las partes firmaron el Contrato de Prestación No. ' + data.contractNumber + '  de 2019, por un valor de ' + valorLetras + '  M/L ($ ' + data.totalValueContract + ' ) y un plazo de ejecución de ' + plazo + ', contados a partir del ' + fechaInicioContrato + ', fecha en la cual fue suscrita el acta de inicio de actividades. ',
                            },
                        ],
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: '• Que al momento de realizar el contrato P-' + data.contractNumber + ' de ' + new Date(data.initialDateContract).getFullYear() + ', se indicaron las siguientes obligaciones específicas',
                        fontSize: 12,
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: [
                            {
                                text: 'OBLIGACIONES DEL CONTRATISTA: (…) ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                style: 'text',
                                text: 'OBLIGACIONES GENERALES: ' + data.generalObligations + 'OBLIGACIONES ESPECIFICAS: ' + data.specificObligations,
                            },
                        ],
                    },
                    {
                        style: 'text',
                        text: data.additionalText,
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: [
                            {
                                text: data.obligationType == '1' || data.obligationType == '3' ? 'OBLIGACIONES GENERALES' + ': (…) ' : null,
                                fontSize: 11,
                                bold: true,
                            },
                            {
                                style: 'text',
                                text: data.obligationType == '1' || data.obligationType == '3' ? data.generalObligations : null,
                            }
                        ]
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: [
                            {
                                text: data.obligationType == '2' || data.obligationType == '3' ? 'OBLIGACIONES ESPECIFICAS' + ': (…) ' : null,
                                fontSize: 11,
                                bold: true,
                            },
                            {
                                style: 'text',
                                text: data.obligationType == '2' || data.obligationType == '3' ? data.specificObligations : null,
                            }
                        ]
                    },
                    {
                        style: 'text',
                        text: 'Por lo expuesto, se hace necesario suscribir el presente otro si, modificando la cláusula cuarta del contrato.',
                    },
                    {
                        text: 'EN MÉRITO DE LO EXPUESTO LAS PARTES ACUERDAN:',
                        bold: true,
                        margin: [0, 20, 0, 20],
                        alignment: 'center',
                        fontSize: 14,
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: [
                            {
                                text: 'CLÁUSULA PRIMERA.',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: 'Modificar la cláusula cuarta del contrato de prestación de servicios P-' + data.contractNumber + ' de ' + new Date(data.initialDateContract).getFullYear() + ' que establece las ',
                                fontSize: 12,
                            },
                            {
                                text: 'OBLIGACIONES DEL CONTRATISTA ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: 'con base en lo expuesto en la parte motiva de esta actuación administrativa, las cuales quedaran así:',
                                fontSize: 12,
                            }
                        ],
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: '“CUARTA. -OBLIGACIONES DEL CONTRATISTA. ',
                        fontSize: 12,
                        bold: true,
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: 'se obliga en forma especial a prestar el servicio objeto de este contrato en los términos señalados en la propuesta presentada por el mismo y específicamente a cumplir las siguientes: ',
                        fontSize: 12,
                    },
                    {
                        style: 'text',
                        text: 'OBLIGACIONES GENERALES: ' + data.generalObligations + '”',
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: [
                            {
                                text: 'CLÁUSULA SEGUNDA: ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: 'Las demás cláusulas no tienen modificación.',
                                fontSize: 12,
                            },
                        ]
                    },
                    {
                        margin: [15, 10, 10, 15],
                        text: [
                            {
                                text: 'CLAUSULA TERCERA: ',
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                aligment: 'justify',
                                text: 'Las partes con la suscripción del presente OTROSI que da cuenta de la voluntad que les asiste, manifiestan que renuncian a cualquier reclamación presente y futura inherentes a la misma.',
                                fontSize: 12,
                            },
                        ]
                    },
                    // {
                    //     margin: [15, 10, 10, 10],
                    //     text: 'Para constancia se firma por las partes en la ciudad de Medellín, a los ' + fechaInicioContrato + '.',
                    //     fontSize: 12,
                    //     alignment: 'justify',
                    // },
                    // {
                    //     style: 'colums',
                    //     columns: [
                    //         {
                    //             style: 'columsRight',
                    //             text: 'EL INSTITUTO:'
                    //         },
                    //         {
                    //             style: 'columsRight',
                    //             text: 'EL CONTRATISTA:'
                    //         }
                    //     ]
                    // },
                    // {
                    //     style: 'colums',
                    //     columns: [
                    //         {
                    //             style: 'columsRight',
                    //             canvas: [{ type: 'line', x1: 0, y1: 1, x2: 300 - 2 * 40, y2: 1, lineWidth: 1 }]
                    //         },
                    //         {
                    //             style: 'columsRight',
                    //             canvas: [{ type: 'line', x1: 0, y1: 1, x2: 300 - 2 * 40, y2: 1, lineWidth: 1 }]
                    //         }
                    //     ]
                    // },
                    // {
                    //     style: 'colums',
                    //     columns: [
                    //         {
                    //             text: [
                    //                 {
                    //                     style: 'columsRight',
                    //                     text: 'yolanda maria henao\n',
                    //                 },
                    //                 {
                    //                     style: 'columsRight',
                    //                     text: 'C.C. 43.507.013',
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             text: [
                    //                 {
                    //                     style: 'columsRight',
                    //                     text: data.contractorName + '\n',
                    //                 },
                    //                 {
                    //                     style: 'columsRight',
                    //                     text: data.contractorIdentification,
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10],
                    },
                    title: {
                        bold: true,
                        fontSize: 12,
                        color: 'black',
                        alignment: 'center',
                    },
                    colums: {
                        margin: [15, 10, 10, 15],
                        alignment: 'justify',
                    },
                    columsRight: {
                        bold: true,
                        fontSize: 12,
                        color: 'black',
                        alignment: 'left',
                    },
                    text: {
                        fontSize: 12,
                        margin: [10, 10, 10, 10],
                        alignment: 'justify',
                    }
                }
            };
            return minutaModificacionMacro;
        } else {
            if (this.headerImageBase64 == null || this.headerImageBase64 == '' || this.footerImageBase64 == null || this.footerImageBase64 == '') {
                swal.fire('', 'Error al cargar las imagenenes del pdf', 'warning');
            }
            else if (data.totalValueContract == null || data.totalValueContract == '') {
                swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: '',
                    html: 'No se encontro el valor del contrato para el contratista ' + data.contractorName,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        }
        // if (this.documentGenerated.length > 0) {
        //     this.savePdfGenerated(this.documentGenerated, this.contractContractors.contractId, DocumentTypeFileCodes.APC, DocumentTypeCodes.OTROSI);
        // }
    }

    private generateAdditionMinuteTest() {
        this.otherMinuteData.getDataContractors = this.otherMinuteData.getDataContractors.map(objeto => {
            return { ...objeto, createPdf: false };
        });
        for (let index = 0; index < this.contractContractors.contractors.length; index++) {
            let dataListContractordesc = this.otherMinuteData.getDataContractors.filter(f => f.contractorId === this.contractContractors.contractors[index]).sort((a, b) => b.consecutive - a.consecutive)
            let dataListContractorasc = this.otherMinuteData.getDataContractors.filter(f => f.contractorId === this.contractContractors.contractors[index]).sort((a, b) => a.consecutive - b.consecutive)
            let data = dataListContractordesc[0];
            dataListContractorasc = dataListContractorasc.sort((a, b) => b.consecutive - a.consecutive);

            for (let index = 0; index < dataListContractorasc.length; index++) {
                if (!dataListContractorasc[index].createPdf) {
                    switch (dataListContractorasc[index].typeModify) {
                        case DocumentTypeFileCodes.ADC:
                            dataListContractorasc[index].createPdf = true;
                            this.fillIngTableAddition(dataListContractorasc, index, 2)
                            break;
                        case DocumentTypeFileCodes.APC:
                            dataListContractorasc[index].createPdf = true;
                            this.fillingTableExtension(dataListContractorasc, index, 2)
                            break;
                        case DocumentTypeFileCodes.AA:
                            let cont = 2;
                            for (let index1 = 0; index1 < cont; index1++) {
                                let adition = dataListContractorasc.find(f => f.typeModify == DocumentTypeFileCodes.ADC && f.createPdf == false)
                                if ((index1 == 0 && dataListContractorasc.find(f => f.createPdf == false) != null) || (dataListContractorasc.length > 1 && adition != null)) {
                                    if (index1 > 0 && dataListContractorasc.length > 1 && adition.createPdf == false) {
                                        cont++
                                        this.fillIngTableAddition(adition, index, 1)
                                        let dataIndex = dataListContractorasc.findIndex(f => f.id == adition.id);
                                        dataListContractorasc[dataIndex].createPdf = true;
                                    }

                                    if (index1 == 0) {
                                        this.fillIngTableAddition(dataListContractorasc, index, 2);
                                        dataListContractorasc[index].createPdf = true;
                                    }
                                } else {
                                    let extension = dataListContractorasc.find(f => f.typeModify == DocumentTypeFileCodes.APC && f.createPdf == false);
                                    if (index1 > 1 && dataListContractorasc.length > 1 && extension != null) {
                                        let dataIndexE = dataListContractorasc.findIndex(f => f.id == extension.id);
                                        cont++;
                                        this.fillingTableExtension(extension, index, 1)
                                        dataListContractorasc[dataIndexE].createPdf = true;

                                    }
                                    if (extension == null) {
                                        this.fillingTableExtension(dataListContractorasc, index, 2);
                                        dataListContractorasc[index].createPdf = true;
                                    }
                                }
                            }

                            break;
                        case DocumentTypeFileCodes.AM:
                            for (let index1 = 0; index1 < cont; index1++) {
                                let adition = dataListContractorasc.find(f => f.typeModify == DocumentTypeFileCodes.APC && f.createPdf == false)
                                if ((index1 == 0 && dataListContractorasc.find(f => f.createPdf == false) != null) || (dataListContractorasc.length > 1 && adition != null)) {
                                    if (index1 > 0 && dataListContractorasc.length > 1 && adition.createPdf == false) {
                                        cont++
                                        this.fillingTableExtension(adition, index, 1)
                                        let dataIndex = dataListContractorasc.findIndex(f => f.id == adition.id);
                                        dataListContractorasc[dataIndex].createPdf = true;
                                    }

                                    if (index1 == 0) {
                                        this.fillingTableExtension(dataListContractorasc, index, 2);
                                        dataListContractorasc[index].createPdf = true;

                                    }
                                } else {
                                    let extension = dataListContractorasc.find(f => f.typeModify == DocumentTypeFileCodes.APC && f.createPdf == false);
                                    if (index1 > 1 && dataListContractorasc.length > 1 && extension != null) {
                                        let dataIndexE = dataListContractorasc.findIndex(f => f.id == extension.id);
                                        cont++;
                                        this.fillingTableExtension(dataListContractorasc, index, 2)
                                        dataListContractorasc[dataIndexE].createPdf = true;

                                    }

                                    if (index1 == 1) {
                                        this.fillIngTableAddition(dataListContractorasc, index, 2);
                                        dataListContractorasc[index].createPdf = true;
                                    }
                                }
                            }

                            break;
                        case DocumentTypeFileCodes.AAM:
                            for (let index3 = 0; index3 < 3; index3++) {
                                if (index3 == 0) {
                                    this.fillIngTableAddition(dataListContractorasc, index, 1)

                                } else if (index == 1) {
                                    this.fillingTableExtension(dataListContractorasc, index, 2)
                                }
                                index++;
                            }

                            break;
                    }
                }

            }

            data.totalValueContract = this.addCommasToNumber(data.totalValueContract);
            data.unitValueContract = this.addCommasToNumber(data.unitValueContract);
            let docuemnt = null;

            // Función para comparar números o manejar 'ACTUAL'
            const compararNumeros = (a, b) => {
                if (a.number === 'ACTUAL') return 1; // 'ACTUAL' siempre va al final
                if (b.number === 'ACTUAL') return -1;
                return parseInt(a.number, 10) - parseInt(b.number, 10);
            };

            // Ordenar el array por el campo 'number' usando la función de comparación
            this.listaAddData = this.listaAddData.sort((a, b) => {
                // Primero ordenar por typeModify
                const typeModifyComparison = a.typeModify.localeCompare(b.typeModify);
                if (a.typeModify !== b.typeModify) {
                    return a.typeModify.localeCompare(b.typeModify);
                  }
                  if (a.number !== 'ACTUAL' && b.number !== 'ACTUAL') {
                    return parseInt(a.number, 10) - parseInt(b.number, 10);
                  }

                  return compararNumeros(a.number, b.number);

            });
            debugger
            this.listaAddData.forEach(element => {
                this.lisDataTable.push(element.data)
            });

            console.log(this.lisDataTable);
            switch (dataListContractorasc[dataListContractorasc.length - 1].typeModify) {
                case DocumentTypeFileCodes.APC:
                    docuemnt = this.generateMinuteExtension(data, this.lisDataTable);
                    break;
                case DocumentTypeFileCodes.ADC:
                    docuemnt = this.generateAdditionMinute(data, this.lisDataTable);
                    break;
                case DocumentTypeFileCodes.MC:
                    docuemnt = this.generateModifyMinute(data, this.lisDataTable);
                    break;

                default:
                    if (dataListContractorasc[0].typeModify == DocumentTypeFileCodes.AA || dataListContractorasc[0].typeModify == DocumentTypeFileCodes.AAM || dataListContractorasc[0].typeModify == DocumentTypeFileCodes.ADC) {
                        docuemnt = this.generateAdditionMinute(data, this.lisDataTable);
                    }
                    if (dataListContractorasc[0].typeModify == DocumentTypeFileCodes.AM || dataListContractorasc[0].typeModify == DocumentTypeFileCodes.APC) {
                        docuemnt = this.generateMinuteExtension(data, this.lisDataTable);
                    }
                    if (dataListContractorasc[0].typeModify == DocumentTypeFileCodes.MC) {
                        docuemnt = this.generateModifyMinute(data, this.lisDataTable);
                    }
                    break;
            }
            // const documentMinuteAddition = {
            //     pageSize: 'A4',
            //     pageOrientation: 'FOLIO',
            //     pageMargins: [40, 80, 40, 60],
            //     header: {
            //         margin: [30, 30, 30, 30],
            //         image: this.headerImageBase64,
            //         fit: [600, 600],
            //     },
            //     footer: {
            //         margin: [30, 30, 30, 30],
            //         image: this.footerImageBase64,
            //         fit: [600, 600],
            //     },
            //     content: [
            //         {
            //             text: 'INSTITUTO TECNOLOGICO METROPOLITANO',
            //             bold: true,
            //             margin: [0, 20, 0, 20],
            //             alignment: 'center',
            //             fontSize: 14,
            //         },
            //         {
            //             text: 'OTROSI No.1  AL CONTRATO No. P- ' + data.contractNumber + ' DE ' + new Date(dataProject.registerDate).getFullYear(),
            //             bold: true,
            //             margin: [0, 20, 0, 20],
            //             alignment: 'center',
            //             fontSize: 14,
            //         },
            //         {
            //             style: 'tableExample',
            //             table: {
            //                 headerRows: 1,
            //                 widths: ['auto', 'auto'],
            //                 body: [
            //                     [
            //                         { text: 'CONTRATO', bold: true },
            //                         { text: 'P-' + data.contractNumber + ' de ' + new Date(dataProject.registerDate).getFullYear() },
            //                     ],
            //                     [
            //                         { text: 'CLASE DE CONTRATO', bold: true },
            //                         'PRESTACION DE SERVICIOS',
            //                     ],
            //                     [
            //                         { text: 'CONTRATISTA', bold: true },
            //                         data.contractorName,
            //                     ],
            //                     [

            //                         { text: 'OBJETO', bold: true },
            //                         'Prestación de servicios, como contratista independiente, sin vinculo laboral por su propia cuenta y riesgo, en la Gestión de Coordinador general de equipo de Interventoría en ejecución del Contrato CW153520/2021-2023 celebrado entre Empresas Varias de Medellín y el ITM',
            //                     ],
            //                     [
            //                         { text: 'VALOR INICIAL', bold: true },
            //                         {
            //                             text: valorLetras + ' M/L  ($' + data.totalValueContract + ')',
            //                             alignment: 'right',
            //                         },
            //                     ],
            //                     [{ text: 'PLAZO', bold: true }, plazo],
            //                     [
            //                         { text: 'FECHA DE INICIO', bold: true },
            //                         fechaInicioContrato,
            //                     ],
            //                     [
            //                         { text: 'FECHA TERMINACION', bold: true },
            //                         fechaFinalContrato,
            //                     ],
            //                     [{ text: 'SUSPENSIÓN', bold: true }, 'N/A']
            //                     // [
            //                     //     {
            //                     //         text: 'VALOR ADICION ACTUAL:',
            //                     //         bold: true,
            //                     //     },
            //                     //     '$ ' + data.additionValue,
            //                     // ]
            //                 ].concat(this.lisDataTable),

            //             }
            //         },
            //         {
            //             margin: [10, 10, 10, 10],
            //             text: [
            //                 {
            //                     text: 'En la Ciudad de Medellín, en las instalaciones del ',
            //                     fontSize: 12,
            //                 },
            //                 {
            //                     text: 'EL INSTITUTO TECNOLÓGICO METROPOLITANO',
            //                     fontSize: 12,
            //                     bold: true,
            //                 },
            //                 {
            //                     text: ', se reunieron',
            //                     fontSize: 12,
            //                 },
            //                 {
            //                     text: user.userName + ', ',
            //                     fontSize: 12,
            //                     bold: true,
            //                 },
            //                 {
            //                     text: ' identificado con Cédula de Ciudadanía Nº ' + user.userIdentification,
            //                     fontSize: 12,
            //                 },
            //                 {
            //                     text: 'actuando en calidad de Jefe de Oficina- Asesora Jurídica del Instituto Tecnológico Metropolitano, según Resolución Rectoral de nombramiento No. 1155 del 24 de noviembre de 2021 y la resolución rectoral 000775 de 10 de septiembre de 2020  delegada para la contratación Administrativa de los convenios interadministrativos del INSTITUTO TECNOLÓGICO METROPOLITANO – INSTITUCIÓN UNIVERSITARIA',
            //                     fontSize: 12,
            //                     bold: true,
            //                     style: 'textStyle'
            //                 },
            //                 {
            //                     text: ' adscrita a la Alcaldía de Medellín con Nit. 800.214.750-7 debidamente autorizado por el Acuerdo 004 de 2011 del Consejo Directivo y Normas concordantes, ',
            //                     fontSize: 12,
            //                     style: 'textStyle'
            //                 },
            //                 {
            //                     text: 'y ' + data.contractorName,
            //                     fontSize: 12,
            //                     bold: true,
            //                 },
            //                 {
            //                     text: ' identificado (a) con cédula de ciudadanía ' + data.contractorIdentification + ' en calidad de contratista, con el fin de hacer la siguiente modificación al contrato de prestación de servicio No. P-7240 de 2022, previa las siguientes:',
            //                     fontSize: 12,
            //                     style: 'textStyle'
            //                 },
            //             ],
            //         },
            //         {
            //             pageBreak: 'before',
            //             text: 'CONSIDERACIONES',
            //             bold: true,
            //             margin: [0, 20, 0, 20],
            //             alignment: 'center',
            //             fontSize: 14,
            //         },
            //         {
            //             margin: [10, 10, 10, 10],
            //             text: [
            //                 {
            //                     text: '1. De conformidad con el artículo 14 de la Ley 80 de 1993 en su parágrafo primero, las entidades estatales “tendrán la dirección general y la responsabilidad de ejercer el control y la vigilancia de la ejecución del contrato. En consecuencia, con el exclusivo objeto de evitar la paralización o la afectación grave de los servicios públicos a su cargo y asegurar la inmediata, continua y adecuada prestación, podrán, en los casos previstos en el numeral segundo de este artículo, interpretar los documentos contractuales y las estipulaciones en ellos convenidas, introducir modificaciones a lo contratado y, cuando las condiciones particulares de la prestación así lo exijan, terminar unilateralmente el contrato celebrado”. ',
            //                     fontSize: 12,
            //                     style: 'textStyle'
            //                 },
            //             ],
            //         },
            //         {
            //             margin: [10, 15, 10, 10],
            //             text: '2. En orden a lo dicho, el ' + fechaInicioContrato + ' las partes firmaron el Contrato de Prestación de Servicios No. P-' + data.contractNumber + ' de ' + new Date(dataProject.registerDate).getFullYear() + ', por un valor de ' + valorLetras + ' M/L ($ ' + data.totalValueContract + ' ) y un plazo de ejecución de ' + plazo + ', contados a partir del ' + fechaInicioContrato + ' fecha en la cual fue suscrita el acta de inicio de actividades',
            //             fontSize: 12,
            //             style: 'textStyle'
            //         },
            //         {
            //             margin: [10, 15, 10, 10],
            //             text: '3. Que es necesario ampliar  el contrato de prestación de servicios número P-' + data.contractNumber + ' de 2022 de conformidad con la necesidad que tiene la EMPRESAS VARIAS DE MEDELLIN S.A. al desarrollo de actividades y obligaciones en cumplimiento del alcance y el objeto del contrato interadministrativo No.  CW153520/2021-2023 , y seguir con el desarrollo de actividades legales, técnicas y operativas. La ampliación del contrato de prestación de servicios  P-' + data.contractNumber + ' de 2022 será por un período de DOS (2) DÍAS adicionales al término primigenio.',
            //             fontSize: 12,
            //             style: 'textStyle'
            //         },
            //         {
            //             text: 'EN MÉRITO DE LO EXPUESTO LAS PARTES ACUERDAN:',
            //             bold: true,
            //             margin: [0, 20, 0, 20],
            //             alignment: 'center',
            //             fontSize: 14,
            //         },
            //         {
            //             margin: [10, 10, 10, 10],
            //             text: [
            //                 {
            //                     text: 'CLÁUSULA PRIMERA: Modificar la cláusula segunda del contrato, en el sentido de ampliar el plazo de ejecución contractual en DIEZ (10) DÍAS    que se iniciarán a contar a partir del 19/08/2022  y se extenderá hasta el 28/08/2022  la cual quedará así:',
            //                     fontSize: 12,
            //                     bold: true,
            //                     style: 'textStyle'
            //                 },
            //             ],
            //         },
            //         {
            //             margin: [15, 10, 10, 15],
            //             text: '“SEGUNDA. -DURACIÓN DEL CONTRATO. El presente contrato tendrá una duración de ' + plazo + '  contados a partir de la suscripción del acta de inicio- la que se firmará una vez sea legalizado. PARAGRAFO El presente contrato está sujeto a la ejecución del contrato interadministrativo No. ' + data.contractNumber + ' DE ' + new Date(data.initialDateContract).getFullYear() + ' . Una vez finalizado el contrato interadministrativo, habrá lugar a la terminación y liquidación de este.”',
            //             fontSize: 12,
            //             bold: true,
            //             style: 'textStyle'
            //         },
            //         {
            //             margin: [10, 10, 10, 10],
            //             text: [
            //                 {
            //                     text: 'CLÁUSULA SEGUNDA: ',
            //                     fontSize: 12,
            //                     bold: true,
            //                 },
            //                 {
            //                     text: ' Modificar la cláusula tercera del valor del contrato, en el sentido de adicionar el mismo en la suma $ ' + data.additionValue + ' con cargo al certificado de compromiso presupuestal 668/5358  de 2022 y, rubro presupuestal ' + data.rubroContract + ', la cual quedará así:',
            //                     fontSize: 12,
            //                     style: 'textStyle'
            //                 },
            //             ],
            //         },
            //         {
            //             margin: [15, 10, 10, 15],
            //             text: '“TERCERA. -VALOR DEL CONTRATO Y FORMA DE PAGO. El valor del presente contrato se fija en la suma de  $ ' + data.unitValueContract + ' El I.T.M. cancelará al CONTRATISTA, en pagos parciales correspondientes a la entrega del informe en donde conste el cumplimiento de las actividades correspondientes a la prestación del servicio. El pago se surtirá con base en los procedimientos internos, establecidos por la dependencia encargada, previo recibo a satisfacción expedido por el interventor, previa presentación de la factura o cuenta de cobro, adjuntando el comprobante del pago de aportes al Sistema de Seguridad Social. PARAGRAFO: En el evento en que el contratista no cumpla con las actividades correspondientes y/o el lleno de la totalidad de los requisitos establecidos para el pago de los honorarios (cuenta de cobro, declaración juramentada, informe de gestión y pago de la seguridad social) en las fechas establecidas según el cronograma de pagos, el pago de honorarios correspondiente a dicho periodo se acumulará para el periodo inmediatamente siguiente.”',
            //             fontSize: 12,
            //             bold: true,
            //             style: 'textStyle'
            //         },
            //         {
            //             pageBreak: 'before',
            //             margin: [10, 10, 10, 10],
            //             text: [
            //                 {
            //                     text: 'CLÁUSULA TERCERA: ',
            //                     fontSize: 12,
            //                     bold: true,
            //                 },
            //                 {
            //                     text: 'Continúan vigentes y de obligatoria observancia las demás cláusulas del contrato que no hayan sido modificadas en el presente OTROSI.',
            //                     fontSize: 12,
            //                     style: 'textStyle'
            //                 },
            //             ],
            //         },
            //         {
            //             margin: [10, 10, 10, 10],
            //             text: [
            //                 {
            //                     text: 'CLÁUSULA CUARTA: ',
            //                     fontSize: 12,
            //                     bold: true,
            //                 },
            //                 {
            //                     text: ': Las partes con la suscripción del presente OTROSI que da cuenta de la voluntad que les asiste, manifiestan que renuncian a cualquier reclamación presente y futura inherentes a la misma.',
            //                     fontSize: 12,
            //                     style: 'textStyle'
            //                 },
            //             ],
            //         },
            //         {
            //             margin: [10, 10, 10, 10],
            //             text: 'Para constancia se firma por las partes en la ciudad de Medellín',
            //             fontSize: 12,
            //         },
            //     ],
            //     styles: {
            //         textStyle: {
            //             fontSize: 12,
            //             bold: true,
            //             alignment: 'justify'
            //         },
            //     },
            // };
            let minute = {
                document: docuemnt,
                contractorName: data.contractorName,
                contractorId: data.contractorId,
                documentType: dataListContractorasc[0].typeModify
            }
            this.documentGenerated.push(minute);
        }
        if (this.documentGenerated.length > 0) {
            this.savePdfGenerated(this.documentGenerated, this.contractContractors.contractId, DocumentTypeCodes.OTROSI);
        }
    }

    hideComponent() {
        this.pdfGenerated.emit(false);
    }

    private getBase64Image(route: string, type: string, origin: string | null) {
        this._shareService.loadAndConvertImageToBase64(route)
            .then(base64Data => {
                if (type == 'HEADER') {
                    this.headerImageBase64 = base64Data;
                } else {
                    this.footerImageBase64 = base64Data;
                    if (this.footerImageBase64 != undefined && this.footerImageBase64 != null && origin != null) {
                        switch (origin) {
                            case DocumentTypeFileCodes.MNT:
                                this.generateMinutePDF();
                                break;
                            default:
                                this.generateAdditionMinuteTest();
                                break;
                        }
                    }
                }
            });

    }

    private getDocumentType() {
        this._upload
            .getDocumentType()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((response: any) => {
                this.typeDocs = response;
            });
    }
    private getMinuteType() {
        this._upload
            .getMinuteType()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((response: any) => {
                this.typeMinute = response;
            });
    }


    addCommasToNumber(value: number): string {
        return value.toLocaleString('es');
    }

    private async savePdfGenerated(pdfDocument: any[], contractId: string, anexo: string) {
        let registerFileLis: FileContractor[] = [];
        for (let index = 0; index < pdfDocument.length; index++) {
            let documentType = this.typeDocs.find(f => f.code === pdfDocument[index].documentType);
            let minuteType = null;
            minuteType = this.typeDocs.find(f => f.code === anexo)
            if (documentType == null) {
                documentType = this.typeMinute.find(f => f.code === pdfDocument[index].documentType)
            }
            let nombreDocumento = documentType.documentTypeDescription == null ? documentType.minuteTypeDescription : documentType.documentTypeDescription + pdfDocument[index].contractorName;
            let userId = this._auth.accessId;
            let date = this.currentDate;
            const pdf = pdfMake.createPdf(pdfDocument[index].document);
            const dataURL = await new Promise<string>((resolve) => {
                pdf.getDataUrl((dataURL) => resolve(dataURL));
            });
            // try {
            //     const dataURL = await new Promise<string>((resolve) => {
            //       pdf.getDataUrl((dataURL) => resolve(dataURL));
            //     });
            //     const registerFile: FileContractor = {
            //         userId: userId,
            //         contractorId: pdfDocument[index].contractorId,
            //         contractId: contractId,
            //         filesName: nombreDocumento,
            //         fileType: 'PDF',
            //         documentType: minuteType.id,
            //         descriptionFile: documentType.documentTypeDescription == null ? documentType.minuteTypeDescription : documentType.documentTypeDescription + ' generada',
            //         registerDate: date,
            //         modifyDate: date,
            //         filedata: dataURL.split('data:application/pdf;base64,')[1],
            //         monthPayment: null,
            //         folderId: null,
            //         origin: origin
            //     };
            //     registerFileLis.push(registerFile)
            //     // Hacer algo con dataURL si es necesario

            //     return dataURL;
            //   } catch (error) {
            //     // Manejar cualquier error que pueda ocurrir durante la obtención del dataURL
            //     console.error('Error al obtener el dataURL:', error);
            //     throw error; // Puedes lanzar el error nuevamente si es necesario
            //   }
            const registerFile: FileContractor = {
                userId: userId,
                contractorId: pdfDocument[index].contractorId,
                contractId: contractId,
                filesName: nombreDocumento,
                fileType: 'PDF',
                documentType: minuteType.id,
                descriptionFile: documentType.documentTypeDescription == null ? documentType.minuteTypeDescription : documentType.documentTypeDescription + ' generada',
                registerDate: date,
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
                this.hideComponent();
            },
                (response) => {
                    console.log(response);
                    swal.fire('Error', 'Error al Registrar la informacion!', 'error');
                    this.hideComponent();
                });
    }

    private fillIngTableAddition(dataListContractorasc: any, index: any, origin: any) {
        let md = null;
        let documentType = null;

        if (origin == 2) {
            documentType = dataListContractorasc[index].typeModify == DocumentTypeFileCodes.AA || dataListContractorasc[index].typeModify == DocumentTypeFileCodes.AAM || dataListContractorasc[index].typeModify == DocumentTypeFileCodes.ADMC ? DocumentTypeFileCodes.ADC : dataListContractorasc[index].typeModify

            let cantModify = this.listaAddData.filter(f => f.typeModify === documentType);
            md = cantModify.length > 1 ? cantModify[cantModify.length - 1].number : dataListContractorasc[index].consecutive > 1 ? cantModify.length > 0 ? cantModify[cantModify.length-1].number : 1 : 'ACTUAL';

            dataListContractorasc[index].additionValue = this.addCommasToNumber(dataListContractorasc[index].additionValue);

        } else {
            md = index > 0 ? dataListContractorasc.consecutive : 'ACTUAL';
            dataListContractorasc.additionValue = this.addCommasToNumber(dataListContractorasc.additionValue);
            documentType = dataListContractorasc.typeModify == DocumentTypeFileCodes.AA || dataListContractorasc.typeModify == DocumentTypeFileCodes.AAM || dataListContractorasc.typeModify == DocumentTypeFileCodes.ADMC ? DocumentTypeFileCodes.ADC : dataListContractorasc.typeModify

        }
        let aditional = origin == 2 ? dataListContractorasc[index].additionValue : dataListContractorasc.additionValue
        let row =
            [
                {
                    text: 'VALOR ADICION ' + md + ':',
                    bold: true,
                },
                { text: '$ ' + aditional },
            ];
        this.listaAddData.push({ typeModify: documentType, number: md,  data:row})

        // this.lisDataTable[this.lisDataTable.length] =
        //     [
        //         {
        //             text: ' ',
        //             bold: true,
        //         },
        //         { text: ' ' },
        //     ];

    }

    private fillingTableExtension(dataListContractorasc: any, index: any, origin: any) {
        let md = null;
        let plazoAmpliacion = null;
        let documentType = null;
        let modifyData = this.listaAddData.filter(f => f.typeModify == dataListContractorasc[index].typeModify)
        if (origin == 2) {
            plazoAmpliacion = this._shareService.calcularDiferencia(dataListContractorasc[index].extensionInitialDate, dataListContractorasc[index].extensionFinalDate);
            documentType = dataListContractorasc[index].typeModify == DocumentTypeFileCodes.AA || dataListContractorasc[index].typeModify == DocumentTypeFileCodes.AAM || dataListContractorasc[index].typeModify == DocumentTypeFileCodes.AM ? DocumentTypeFileCodes.APC : dataListContractorasc[index].typeModify

            modifyData = this.listaAddData.filter(f => f.typeModify == documentType)

            // md = modifyData.length > 1 ? modifyData[modifyData.length - 1].number : (dataListContractorasc[index].consecutive > 1 || modifyData.length > 0) && index > 0 ? modifyData[modifyData.length -1].number : 'ACTUAL';
            md = modifyData.length > 1 ? modifyData[modifyData.length - 1].number : dataListContractorasc[index].consecutive > 1  ? modifyData.length > 0 ? modifyData[modifyData.length-1].number : 1 : 'ACTUAL';

        } else {
            plazoAmpliacion = this._shareService.calcularDiferencia(dataListContractorasc.extensionInitialDate, dataListContractorasc.extensionFinalDate);
            documentType = dataListContractorasc.typeModify == DocumentTypeFileCodes.AA || dataListContractorasc.typeModify == DocumentTypeFileCodes.AAM || dataListContractorasc.typeModify == DocumentTypeFileCodes.AM ? DocumentTypeFileCodes.APC : dataListContractorasc.typeModify
            modifyData = this.listaAddData.filter(f => f.typeModify == documentType)

            md = modifyData.length > 1 ? modifyData[modifyData.length - 1].number : (dataListContractorasc[index].consecutive > 1 || modifyData.length > 0) && index > 0 ? modifyData[modifyData.length -1].number : 'ACTUAL';


        }
        let row =
            [
                {
                    text: 'DURACION AMPLIACION ' + md + ':',
                    bold: true,
                },
                { text: plazoAmpliacion },
            ];
        this.listaAddData.push({ typeModify: documentType, number: md,  data: row})

        // this.lisDataTable[this.lisDataTable.length] =
        //     [
        //         {
        //             text: ' ',
        //             bold: true,
        //         },
        //         { text: ' ' },
        //     ];

    }
    ngOnDestroy(): void {
        this._unsubscribe$.next(null);
        this._unsubscribe$.complete();
    }

}
