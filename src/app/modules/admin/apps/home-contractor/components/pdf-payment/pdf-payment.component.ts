import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { ChargeAccount, ExecutionReport } from '../../models/pdfDocument';
import { ShareService } from 'app/layout/common/share-service/share-service.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as pdf from 'pdf-parse';

@Component({
    selector: 'app-cuenta-cobro',
    templateUrl: './pdf-payment.component.html',
})
export class PdfPaymentComponent implements OnInit, OnDestroy {
    @ViewChild('pdfTable') pdfTable: ElementRef;
    @Input() chargeAccountData: ChargeAccount;
    @Input() executionReportData: ExecutionReport;
    @Input() typeGenerator: string;

    @Output() onGeneratePdf = new EventEmitter<boolean>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    valueInitialDate: string = '';
    date: Date = new Date();
    valueLetter: any;
    listaData: any[] = [];
    contador: number = 0;
    specificObligation: any;
    data: any[] = [];
    fechaInicio: Date = new Date();

    // dataCuenta: Contractor = { tipoContratacion: '', codigo: '', convenio: '', fechaInicio: '', fechaFin: '', nombre: '', apellido: '', identificacion: '', lugarExpedicion: '', fechaNacimiento: new Date(), direccion: '', departamento: '', municipio: '', telefono: '', celular: '', correo: '', cuentaBancaria: '', tipoCuenta: '', entidadCuentaBancaria: '', from: new Date(), to: new Date(),uniTValue: 0, company: ''}

    constructor(
        private datepipe: DatePipe,
        private _shareService: ShareService
    ) { }

    ngOnInit(): void {
        this.valueLetter = this._shareService.numeroALetras(
            this.chargeAccountData.totalValue,
            'PESOS'
        );
        if (this.chargeAccountData != null && this.typeGenerator == 'charge') {
            this.downloadPDFChargeAccount();
            this.onGeneratePdf.emit(false);
        } else if (
            this.typeGenerator == 'report' &&
            this.executionReportData != null
        ) {
            this.downloadPDFInforme();
            this.onGeneratePdf.emit(false);
        } else {
            this.downloadPDFInforme();
            this.downloadPDFChargeAccount();
            this.onGeneratePdf.emit(false);
        }

    }

    public downloadPDF() {
        let data = document.getElementById('pdfTable');

        html2canvas(data).then((canvas) => {
            const pdfTable = this.pdfTable.nativeElement;

            var html = htmlToPdfmake(pdfTable.innerHTML);
            const documentDefinition = {
                header: {
                    // columns: [
                    //   {
                    //     image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABACAMAAABvJxYMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUAAAAMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVv////Mb2P8AAAA/XRSTlMAAAIBAyF5qY0jBBEiOE9lipiip6uo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',
                    //     height: 50,
                    //     width: 150,
                    //     // alignment: 'center'
                    //   },
                    // ],
                },
                footer: function (currentPage, pageCount) {
                    return [
                        {
                            text:
                                'Page ' +
                                currentPage.toString() +
                                ' of ' +
                                pageCount,
                            alignment: 'center',
                        },
                    ];
                },
                content: html, //pdf is all the data i use to generate pdf
            };
            pdfMake.createPdf(documentDefinition).download('CuentaDeCobre.pdf');
        });
    }
    private downloadPDFChargeAccount() {
        let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
        this.validateValuesPDFChargeAccount();
        this.valueLetter = this._shareService.numeroALetras(
            this.chargeAccountData.totalValue,
            'PESOS'
        );
        const documentDefinition = {
            content: [
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: [200, 150, '*'],
                        body: [
                            [
                                {
                                    rowSpan: 2,
                                    text: 'CUENTA DE COBRO',
                                    style: 'title',
                                },
                                {
                                    text: 'FECHA DE COBRO',
                                    style: 'tableHeader',
                                    alignment: 'center',
                                },
                                {
                                    text: 'NÚMERO',
                                    style: 'tableHeader',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text: '',
                                    alignment: 'center',
                                },
                                {
                                    text: latest_date,
                                    alignment: 'center',
                                },
                                {
                                    text: this.chargeAccountData
                                        .chargeAccountNumber,
                                    alignment: 'center',
                                },
                            ] /*  */,
                        ],
                    },
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: [200, 150, '*'],
                        body: [
                            [
                                {
                                    colSpan: 2,
                                    text: 'EL INSTITUTO TECNOLÓGICO METROPOLITANO',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: 'NIT: 800.214.750-7',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    colSpan: 2,
                                    text: 'DIRECCIÓN: Calle 73 No. 76A-354',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: 'TELÉFONO: 4403208',
                                    alignment: 'center',
                                },
                            ] /*  */,
                        ],
                    },
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['*', '*', '*', '*', '*', '*'],
                        body: [
                            [
                                {
                                    colSpan: 6,
                                    text: 'DEBE A:',
                                    alignment: 'center',
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
                                    text: 'NOMBRE:',
                                    style: 'marginb',
                                },
                                {
                                    colSpan: 5,
                                    text: this.chargeAccountData.contractorName,
                                    style: 'marginb',
                                    alignment: 'center',
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
                                    colSpan: 6,
                                    text: 'INSCRITO EN EL RÉGIMEN SIMPLIFICADO DEL IVA',
                                    alignment: 'center',
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
                                    text: 'CÉDULA:',
                                    style: 'marginb',
                                },
                                {
                                    text: this.chargeAccountData
                                        .contractorIdentification,
                                    alignment: 'center',
                                    style: 'marginb',
                                },
                                {
                                    text: 'DV',
                                    alignment: 'center',
                                    style: 'marginb',
                                },
                                {
                                    text: '8',
                                    alignment: 'center',
                                    style: 'marginb',
                                },
                                {
                                    text: 'EXPEDIDA EN:',
                                    alignment: 'center',
                                    style: 'marginb',
                                },
                                {
                                    text: this.chargeAccountData
                                        .expeditionIdentification,
                                    alignment: 'center',
                                    style: 'marginb',
                                },
                            ],
                            [
                                {
                                    text: 'DIRECCIÓN:',
                                },
                                {
                                    colSpan: 3,
                                    text: this.chargeAccountData.direction,
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                    alignment: 'center',
                                },
                                {
                                    text: 'TELÉFONO:',
                                    alignment: 'center',
                                },
                                {
                                    text: this.chargeAccountData.phoneNumber,
                                    alignment: 'center',
                                },
                            ],
                        ],
                    },
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: [78, '*', '*'],
                        body: [
                            [
                                {
                                    text: 'CONCEPTO:',
                                },
                                {
                                    colSpan: 2,
                                    text:
                                        'Contrato de prestación de servicios como ' +
                                        this.chargeAccountData.elementName,
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: 'CONTRATO:',
                                    style: 'marginb',
                                },
                                {
                                    text:
                                        'N° - ' +
                                        this.chargeAccountData.contractNumber,
                                    style: 'marginb',
                                    alignment: 'center',
                                },
                                {
                                    text: this.chargeAccountData.contractName,
                                    style: 'marginb',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text: 'PERIODO:',
                                },
                                {
                                    colSpan: 2,
                                    text:
                                        'del ' +
                                        this.chargeAccountData
                                            .periodExecutedInitialDate +
                                        ' al ' +
                                        this.chargeAccountData
                                            .periodExecutedFinalDate,
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: 'VALOR:',
                                },
                                {
                                    colSpan: 2,
                                    text: this.chargeAccountData.totalValue,
                                    alignment: 'left',
                                },
                                {
                                    text: '',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text: 'EN LETRAS:',
                                },
                                {
                                    colSpan: 2,
                                    text: this.valueLetter,
                                    alignment: 'left',
                                },
                                {
                                    text: '',
                                    alignment: 'center',
                                },
                            ],
                        ],
                    },
                },
                { text: '\n\nFIRMA: ' },
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0,
                            y1: 1,
                            x2: 300 - 2 * 40,
                            y2: 1,
                            lineWidth: 1,
                            margin: [5, 0],
                        },
                    ],
                },
                { text: this.chargeAccountData.contractorName },
                {
                    text:
                        'C.C : \t' +
                        this.chargeAccountData.contractorIdentification,
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
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
                marginb: {
                    fontSize: 12,
                    margin: [0, 10, 0, 0],
                    alignment: 'bottom',
                },
            },
        };
        let test = pdfMake
            .createPdf(documentDefinition)
            .download(
                this.chargeAccountData.contractorName + 'CUENTADECOBRO.pdf'
            );
        console.log(test);
        this.onGeneratePdf.emit(false);
    }

    private downloadPDFInforme() {
        this.validateValuesPDFInforme();
        let day = this.datepipe.transform(this.date, 'dd');
        let month = this.datepipe.transform(this.date, 'MM');
        let year = this.datepipe.transform(this.date, 'YYYY');

        let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');

        let plazo = this._shareService.calcularDiferencia(
            this.executionReportData.contractInitialDate,
            this.executionReportData.contractFinalDate
        );
        this.specificObligation =
            this.executionReportData.specificObligations.split('->');
        for (let index = 0; index < this.specificObligation.length; index++) {
            this.listaData[index] = [
                {
                    text: this.specificObligation[index],
                },
                {
                    text: '',
                    alignment: 'center',
                },
                {
                    text: 'Correos electrónicos',
                    alignment: 'center',
                },
            ];
        }
        const documentDefinition = {
            content: [
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    colSpan: 2,
                                    text: 'INFORME DE EJECUCIÓN MENSUAL OFICINA UNIDAD ESTRATEGICA DE NEGOCIOS ITM',
                                    style: 'tableHeader',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: 'NOMBRE DEL CONTRATISTA',
                                    style: 'tableHeader',
                                },
                                {
                                    text: this.executionReportData
                                        .contractorName,
                                },
                            ],
                            [
                                {
                                    text: 'NÚMERO DEL CONTRATO',
                                    style: 'tableHeader',
                                },
                                {
                                    text: this.executionReportData
                                        .contractNumber,
                                },
                            ],
                            [
                                {
                                    text: 'FECHA DE INICIO',
                                    style: 'tableHeader',
                                },
                                {
                                    text: this.valueInitialDate,
                                },
                            ],
                            [
                                {
                                    text: 'PLAZO',
                                    style: 'tableHeader',
                                },
                                {
                                    text: plazo,
                                },
                            ],
                            [
                                {
                                    text: 'OBJETO',
                                    style: 'tableHeader',
                                },
                                {
                                    text: [
                                        'Prestación de servicios como contratista',
                                        'independiente, sin vínculo laboral por su propia cuenta',
                                        'y riesgo para realizar la gestión de Apoyo asistencial',
                                        'de logística y procesos administrativos en ejecución',
                                        'del Contrato Interadministrativo No. 4600094924 de',
                                        '2022, celebrado entre el Distrito Especial de Ciencia',
                                        'Tecnología e Innovación de Medellín y el',
                                        'Departamento Administrativo de Planeación',
                                    ],
                                },
                            ],
                            [
                                {
                                    text: 'VALOR DEL CONTRATO',
                                    style: 'tableHeader',
                                },
                                {
                                    text: this.executionReportData.totalValue,
                                },
                            ],
                            [
                                {
                                    text: 'SUPERVISOR ITM',
                                    style: 'tableHeader',
                                },
                                {
                                    text: this.executionReportData
                                        .supervisorContract,
                                },
                            ],
                        ],
                    },
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                {
                                    text: 'OBLIGACIONES ESPECIFICAS SEGÚN CONTRATO',
                                    alignment: 'center',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'EJECUCION O DESARROLLO DE LAS OBLIGACIONES ESPECIFICAS SEGÚN CONTRATO',
                                    alignment: 'center',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'EVIDENCIAS DE LAS OBLIGACIONES CENTRALES DEL CONTRATO',
                                    alignment: 'center',
                                    style: 'tableHeader',
                                },
                            ],
                        ].concat(this.listaData),
                    },
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    rowSpan: 12,
                                    text: 'OBSERVACIONES (En caso de tenerlas)',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                        ],
                    },
                },
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    rowSpan: 12,
                                    text: 'DIFICULTADES (En caso de tenerlas)',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: '',
                                },
                            ],
                        ],
                    },
                },
                {
                    text:
                        '\n\n PERIODO EJECUTADO: \t\t\t' +
                        'del ' +
                        this.executionReportData.periodExecutedInitialDate +
                        ' al ' +
                        this.executionReportData.periodExecutedFinalDate,
                },
                {
                    text:
                        '\n\n VALOR DEL PERIODO A COBRAR: \t\t\t' +
                        this.executionReportData.totalValue,
                },
                {
                    text:
                        '\n\n Para constancia se firma en Medellín a los  ' +
                        day +
                        ' días del mes  ' +
                        month +
                        ' del año  ' +
                        year +
                        ' \n\n',
                },
                { text: '\n\n' },
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0,
                            y1: 1,
                            x2: 350 - 2 * 40,
                            y2: 1,
                            lineWidth: 1,
                            margin: [5, 0],
                        },
                    ],
                },
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0,
                            y1: 1,
                            x2: 350 - 2 * 40,
                            y2: 1,
                            lineWidth: 1,
                            margin: [15, 15, 5, 5],
                        },
                    ],
                },
                { text: this.executionReportData.contractorName + '\n' },
                {
                    text:
                        'C.C :' +
                        this.executionReportData.contractorIdentification +
                        ' \t' +
                        '\n',
                },
                { text: 'Contratista ITM' },
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
            .download(
                this.executionReportData.contractorName +
                'REPORTEDEEJECUCION.pdf'
            );
        console.log(test);
        this.onGeneratePdf.emit(false);
    }

    private transformDate(value: string): string {
        const meses = [
            'enero',
            'febrero',
            'marzo',
            'abril',
            'mayo',
            'junio',
            'julio',
            'agosto',
            'septiembre',
            'octubre',
            'noviembre',
            'diciembre',
        ];

        const fecha = new Date(value);
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();

        return `${dia} de ${mes} del ${año}`;
    }

    private validateValuesPDFInforme() {
        this.executionReportData.totalValue = Number(
            this.executionReportData.totalValue
        ).toFixed(0);
        this.valueInitialDate = this.transformDate(
            this.executionReportData.contractInitialDate.toString()
        );
        this.executionReportData.periodExecutedInitialDate = this.transformDate(
            this.executionReportData.periodExecutedInitialDate
        );
        this.executionReportData.periodExecutedFinalDate = this.transformDate(
            this.executionReportData.periodExecutedFinalDate
        );
        this.executionReportData.totalValue = (+this.executionReportData
            .totalValue).toLocaleString();
    }
    private validateValuesPDFChargeAccount() {
        this.chargeAccountData.totalValue = Number(
            this.chargeAccountData.totalValue
        ).toFixed(0);
        this.chargeAccountData.periodExecutedInitialDate = this.transformDate(
            this.chargeAccountData.periodExecutedInitialDate
        );
        this.chargeAccountData.periodExecutedFinalDate = this.transformDate(
            this.chargeAccountData.periodExecutedFinalDate
        );
        this.chargeAccountData.totalValue = (+this.chargeAccountData
            .totalValue).toLocaleString();
    }

    downloadWordFile(base64: any) {
        // Decodifica la cadena base64 en un ArrayBuffer.
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Crea un Blob a partir del ArrayBuffer decodificado.
        const blob = new Blob([byteArray], { type: 'application/msword' });

        // Crea una URL de datos para el Blob.
        const url = window.URL.createObjectURL(blob);

        // Crea un enlace de descarga y simula un clic en él para iniciar la descarga.
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento.docx'; // Nombre del archivo para la descarga
        document.body.appendChild(a);
        a.click();

        // Limpia la URL de datos y elimina el enlace de descarga.
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.complete();
        this._unsubscribeAll.next(true);
    }
}
