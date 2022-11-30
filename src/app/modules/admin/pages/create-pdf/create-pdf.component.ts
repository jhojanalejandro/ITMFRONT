import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import domToImage from 'dom-to-image';
import moment from 'moment';
@Component({
  selector: 'app-create-pdf',
  templateUrl: './create-pdf.component.html',
  styleUrls: ['./create-pdf.component.scss']
})
export class CreatePdfComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('dataToExport', { static: false }) public dataToExport: ElementRef;
  pdfName: any = 'prueba';
  constructor() { }

  ngOnInit(): void {
  }
  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    const pdfTable = this.pdfTable.nativeElement;

    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();

  }

  public downloadAsPdf(): void {
    const width = this.dataToExport.nativeElement.clientWidth;
    const height = this.dataToExport.nativeElement.clientHeight + 40;
    let orientation = '';
    let imageUnit = 'pt';
    if (width > height) {
      orientation = 'l';
    } else {
      orientation = 'p';
    }
    domToImage
      .toPng(this.dataToExport.nativeElement, {
        width: width,
        height: height
      })
      .then(result => {
        let jsPdfOptions: any = {
          orientation: orientation,
          unit: imageUnit,
          format: [width + 50, height + 220]
        };
        const pdf = new jsPDF(jsPdfOptions);
        pdf.setFontSize(12);
        pdf.setTextColor('#2585fe');
        // pdf.text(this.pdfName.value ? this.pdfName.value.toUpperCase() : ''.toUpperCase(), 25, 75);
        pdf.setFontSize(12);
        pdf.setTextColor('#131523');
        pdf.text('Report date: ' + moment().format('ll'), 25, 115);
        pdf.addImage(result, 'PNG', 25, 185, width, height);
        pdf.save('nombrepdf' + '.pdf');
      })
      .catch(error => {
      });
  }



}
