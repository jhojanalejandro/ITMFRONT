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
    @ViewChild('pdfTable') pdfTable: ElementRef;
    @ViewChild('dataToExport', { static: false })
    public dataToExport: ElementRef;
    pdfName: any = 'prueba';
    file: any;
    docDefinition: any;
    base64Output: any;
    minuta: boolean;
    estudioPrevio: boolean;
    cuentaCobro: boolean;
    minutaAdicion: boolean;
    constructor() {}

    ngOnInit(): void {
        this.createPdf();
    }

    public downloadPDF() {
        let data = document.getElementById('pdfTable');

        html2canvas(data).then((canvas) => {
            const pdfTable = this.pdfTable.nativeElement;

            var html = htmlToPdfmake(pdfTable.innerHTML);
            const documentDefinition = {
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
            pdfMake.createPdf(documentDefinition).download();
        });
    }

    public downloadAsPDFs() {

        let data = document.getElementById('pdfTable');

        html2canvas(data).then(canvas => {
        //   let pdf = new jspdf('l', 'mm', 'a4');
        //   pdf.setFontSize(12);

          const pdfTable = this.pdfTable.nativeElement;
    
          var html = htmlToPdfmake(pdfTable.innerHTML);
    
          const documentDefinition = { content: html };
          pdfMake.createPdf(documentDefinition).download('Filenames.pdf');
          var data;
          pdfMake.createPdf(documentDefinition).getDataUrl(function (dataURL) {
            data = dataURL;
          })
        });
      }
    exportAsPDF() {
        let data = document.getElementById('pdfTable');
        html2canvas(data).then((canvas) => {
            const contentDataURL = canvas.toDataURL('image/png'); // 'image/jpeg' for lower quality output.
            let pdf = new jspdf('l', 'cm', 'a4');
            pdf.setFontSize(12);
            //Generates PDF in landscape mode
            // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
            pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
            pdf.save('Filename.docx');
        });
    }

    convertFile(): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsBinaryString(this.file);
        reader.onload = (event) =>
            result.next(btoa(event.target.result.toString()));
        return result;
    }

    async createPdf() {
        this.docDefinition = {
            content: [
                {
                    image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/flags/LOGO_ITM.png'
                    ),
                },
            ],
        };
        this.file = this.docDefinition.content[0].image;
    }
    getBase64ImageFromURL(url) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');

            img.onload = () => {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                var dataURL = canvas.toDataURL('image/png');

                resolve(dataURL);
            };

            img.onerror = (error) => {
                reject(error);
            };

            img.src = url;
        });
    }

    get
}
