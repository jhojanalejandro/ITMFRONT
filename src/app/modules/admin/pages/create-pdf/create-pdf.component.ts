import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import domToImage from 'dom-to-image';
import moment from 'moment';
import jspdf from 'jspdf';
import { Observable, ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-create-pdf',
  templateUrl: './create-pdf.component.html',
  styleUrls: ['./create-pdf.component.scss']
})
export class CreatePdfComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('dataToExport', { static: false }) public dataToExport: ElementRef;
  pdfName: any = 'prueba';
  file: any;
  docDefinition: any;
  base64Output: any;
  minuta: boolean;
  estudioPrevio: boolean;
  cuentaCobro: boolean;
  minutaAdicion: boolean;
  constructor() { }

  ngOnInit(): void {
    this.createPdf();
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


  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('application/pdf ');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'pdf', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    });
  }
  public downloadAsPDFs() {

    let data = document.getElementById('htmlData');

    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('../../../../../assets/images/flags/LOGO_ITM.png')  // 'image/jpeg' for lower quality output.
      let pdf = new jspdf('l', 'mm', 'a4');
      pdf.setFontSize(12);
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
      const pdfTable = this.pdfTable.nativeElement;

      var html = htmlToPdfmake(pdfTable.innerHTML);

      const documentDefinition = { content: html };
      pdfMake.createPdf(documentDefinition).download();
      var data;
      pdfMake.createPdf(documentDefinition).getDataUrl(function (dataURL) {
        data = dataURL;
      })
    });


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

  exportAsPDF() {
    let data = document.getElementById('divId');
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
      let pdf = new jspdf('l', 'cm', 'a4');
      pdf.setFontSize(12);
      //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
      pdf.save('Filename.pdf');
    });
  }
  public downloadAsPDF() {
    const doc = new jsPDF();
    //get table html
    const pdfTable = this.pdfTable.nativeElement;
    //html to pdf format
    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();


  }

  convertFile(): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(this.file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  async createPdf() {
    this.docDefinition = {
      content: [
        {
          image: await this.getBase64ImageFromURL("../../../../assets/images/flags/LOGO_ITM.png")
          
        },
      ]
    }
    this.file = this.docDefinition.content[0].image;
  }
  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

}
