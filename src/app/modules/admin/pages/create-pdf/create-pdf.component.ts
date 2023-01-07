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

    public downloadAsPDFs() {
        //const pdfTable = this.pdfTable.nativeElement;
        //var html = htmlToPdfmake(pdfTable.innerHTML);
        for (let index = 0; index < this.listaObligaciones.length; index++) {
            this.listaData[index] = [ [
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
        debugger
        console.log(this.listaData);
        
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
                                    text: this.nombre,
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
                                    text: new Date(),
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
                            this.listaData,


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
                { text: '\n\n VALOR DEL PERIODO A COBRAR: \t\t\t VALOR'},
                { text: '\n\n Para constancia se firma en Medellín a los 23 días del mes de septiembre del año 2022'},
                {text: '\n\n' },{canvas: [{ type: 'line', x1: 0, y1: 1, x2: 350-2*40, y2: 1, lineWidth: 1, margin: [5,0] }]} ,
                {text:  ' JHOJAN ALEJANDRO HERNANDEZ YEPES\n' }, 
                {text: 'CEDULA N: \t' + '\n'},
                {text: 'Contratista ITM' }

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
