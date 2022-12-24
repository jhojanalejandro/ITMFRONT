import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import jspdf from 'jspdf';

import domToImage from 'dom-to-image';
import moment from 'moment';
import { Observable, ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-minuta-contrato',
  templateUrl: './minuta-contrato.component.html',
  styleUrls: ['./minuta-contrato.component.scss']
})
export class MinutaContratoComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
  file: any;
  docDefinition: any;
  base64Output: any;
  constructor() { }

  ngOnInit(): void {
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

  
  async createPdf() {
    this.docDefinition = {
      content: [
        {
          image: await this.getBase64ImageFromURL("../../../../assets/images/flags/LOGO_ITM.png")
          
        },
      ]
    }
    this.file = this.docDefinition.content[0].image;
    console.log(this.docDefinition.content[0].image);
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
