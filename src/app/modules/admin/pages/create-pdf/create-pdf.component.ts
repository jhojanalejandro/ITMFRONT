import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import jspdf from 'jspdf';
import { Observable, ReplaySubject } from 'rxjs';
@Component({
    selector: 'app-create-pdf',
    templateUrl: './create-pdf.component.html',
    styleUrls: ['./create-pdf.component.scss'],
})
export class CreatePdfComponent implements OnInit {
    //@ViewChild('pdfTable') pdfTable: ElementRef;

    ngOnInit(): void {}

    public downloadAsPDFs() {
        //const pdfTable = this.pdfTable.nativeElement;
        //var html = htmlToPdfmake(pdfTable.innerHTML);

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
                            ['', '02/01/2023', '3'],
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
                            ['', '02/01/2023', '3'],
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
