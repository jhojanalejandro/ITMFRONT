import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { PaymentAccount } from 'app/modules/admin/dashboards/contractual/models/paymentAccount';
import { DatePipe } from '@angular/common';
import { Elements } from 'app/modules/admin/pages/planing/models/planing-model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-cuenta-cobro',
    templateUrl: './pdf-payment.component.html',
    styleUrls: ['./pdf-payment.component.scss']
})
export class PdfPaymentComponent implements OnInit {
    @ViewChild('pdfTable') pdfTable: ElementRef;
    @Input('dataCuenta') dataCuenta: PaymentAccount;
    date: Date = new Date();
    valueLetter: any;
    contrato: string = '0654651';
    listaData: any[] = [];
    contador: number = 0;

    data: any[] = [];
    fechaInicio: Date = new Date();
    listaObligaciones: Elements[] = [{
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
    // dataCuenta: Contractor = { tipoContratacion: '', codigo: '', convenio: '', fechaInicio: '', fechaFin: '', nombre: '', apellido: '', identificacion: '', lugarExpedicion: '', fechaNacimiento: new Date(), direccion: '', departamento: '', municipio: '', telefono: '', celular: '', correo: '', cuentaBancaria: '', tipoCuenta: '', entidadCuentaBancaria: '', from: new Date(), to: new Date(),uniTValue: 0, company: ''}

    constructor(private datepipe: DatePipe) {
    }

    ngOnInit(): void {
        debugger
        this.downloadPDFInforme();
        this.valueLetter = GlobalConst.numeroALetras(this.dataCuenta.paymentcant, 'PESOS')

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
    public downloadPDFCuentaCobro() {
        let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
        this.valueLetter = GlobalConst.numeroALetras(this.dataCuenta.paymentcant, 'PESOS')
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
                            [{
                                text: '',
                                alignment: 'center',
                            }, {
                                text: latest_date,
                                alignment: 'center',
                            }, {
                                text: '3',
                                alignment: 'center',
                            },],/*  */

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
                                }
                            ],/*  */
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
                                }
                            ],
                            [
                                {
                                    text: 'NOMBRE:',
                                },
                                {
                                    colSpan: 5,
                                    text: this.dataCuenta.nombre,
                                    style: 'tableHeader',
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
                                }
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
                                },
                                {
                                    text: this.dataCuenta.identificacion,
                                    alignment: 'center',
                                },
                                {
                                    text: 'DV',
                                    alignment: 'center',
                                },
                                {
                                    text: '8',
                                    alignment: 'center',
                                },
                                {
                                    text: 'EXPEDIDA EN:',
                                    alignment: 'center',
                                },
                                {
                                    text: this.dataCuenta.lugarExpedicion,
                                    alignment: 'center'
                                },
                            ],
                            [
                                {
                                    text: 'DIRECCIÓN:',
                                },
                                {
                                    colSpan: 3,
                                    text: this.dataCuenta.direccion,
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
                                    text: this.dataCuenta.telefono,
                                    alignment: 'center'
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
                                    text: 'Contrato de prestación de servicios como contratista para el desarrollo de aplicativo para automatización del proceso de contratación',
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                },
                            ],
                            [
                                {
                                    text: 'CONTRATO:',
                                },
                                {
                                    text: 'N° - ' + this.contrato,
                                    style: 'tableHeader',
                                    alignment: 'center',
                                },
                                {
                                    text: this.dataCuenta.convenio,
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text: 'PERIODO:',
                                },
                                {
                                    colSpan: 2,
                                    text: '29 de agosto al 30 de agosto del 2022',
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
                                    text: this.dataCuenta.paymentcant,
                                    alignment: 'center',
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
                                    alignment: 'center',
                                },
                                {
                                    text: '',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    colSpan: 3,
                                    text: 'Favor consignar en la cuenta de ' + this.dataCuenta.tipoCuenta + this.dataCuenta.entidadCuentaBancaria + ' N° ' + this.dataCuenta.cuentaBancaria,
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                }
                            ],
                        ],
                    },
                },
                { text: '\n\nFIRMA: ' }, { canvas: [{ type: 'line', x1: 0, y1: 1, x2: 300 - 2 * 40, y2: 1, lineWidth: 1, margin: [5, 0] }] },
                { text: this.dataCuenta.nombre }, { text: 'CEDULA N: \t' + this.dataCuenta.identificacion }
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
            .download('Filenames.pdf');
        console.log(test);
    }

    public downloadPDFInforme() {
        let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
        for (let index = 0; index < this.listaObligaciones.length; index++) {
            this.listaData[index] = [
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
                                }
                            ],
                            [
                                {
                                    text: 'NOMBRE DEL CONTRATISTA',
                                    style: 'tableHeader',
                                }, {
                                    text: this.dataCuenta.nombre,
                                }
                            ],
                            [
                                {
                                    text: 'NÚMERO DEL CONTRATO',
                                    style: 'tableHeader',
                                }, {
                                    text: this.contrato,
                                }
                            ],
                            [
                                {
                                    text: 'FECHA DE INICIO',
                                    style: 'tableHeader',
                                }, {
                                    text: latest_date,
                                }
                            ],
                            [
                                {
                                    text: 'PLAZO',
                                    style: 'tableHeader',
                                }, {
                                    text: '3 MESES Y VEINTICINCO DÍAS',
                                }
                            ],
                            [
                                {
                                    text: 'OBJETO',
                                    style: 'tableHeader',
                                }, {
                                    text: ['Prestación de servicios como contratista',
                                        'independiente, sin vínculo laboral por su propia cuenta',
                                        'y riesgo para realizar la gestión de Apoyo asistencial',
                                        'de logística y procesos administrativos en ejecución',
                                        'del Contrato Interadministrativo No. 4600094924 de',
                                        '2022, celebrado entre el Distrito Especial de Ciencia',
                                        'Tecnología e Innovación de Medellín y el',
                                        'Departamento Administrativo de Planeación']
                                }
                            ],
                            [
                                {
                                    text: 'VALOR DEL CONTRATO',
                                    style: 'tableHeader',
                                }, {
                                    text: '3 MESES Y VEINTICINCO DÍAS',
                                }
                            ],
                            [
                                {
                                    text: 'SUPERVISOR ITM',
                                    style: 'tableHeader',
                                }, {
                                    text: 'DIEGO ALEJANDRO MARÍN CIFUENTES',
                                }
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
                { text: '\n\n PERIODO EJECUTADO: \t\t\t del 29 de agosto al 30 de agosto: ' },
                { text: '\n\n VALOR DEL PERIODO A COBRAR: \t\t\t VALOR' },
                { text: '\n\n Para constancia se firma en Medellín a los 23 días del mes de septiembre del año 2022' },
                { text: '\n\n' }, { canvas: [{ type: 'line', x1: 0, y1: 1, x2: 350 - 2 * 40, y2: 1, lineWidth: 1, margin: [5, 0] }] },
                { text: ' JHOJAN ALEJANDRO HERNANDEZ YEPES\n' },
                { text: 'CEDULA N: \t' + '\n' },
                { text: 'Contratista ITM' }

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
            .download('Filenames.pdf');
        console.log(test);
    }
}
