import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import swal from 'sweetalert2';
import { UploadDataService } from '../../../service/upload-data.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { IHiringData } from '../../../models/hiring-data';
import { Elements } from 'app/modules/admin/pages/planing/models/planing-model';
import { PlaningService } from 'app/modules/admin/pages/planing/service/planing.service';
import { MinuteExtension } from '../../../models/generate-pdf';
import { FileContractor } from 'app/layout/common/models/file-contractor';
import { UploadFileDataService } from '../../../upload-file/upload-file.service';
import { AuthService } from 'app/core/auth/auth.service';
import { ShareService } from 'app/layout/common/share-service/share-service.service';
import { RouteImageEnum } from 'app/layout/common/enums/route-image/route-image';

@Component({
  selector: 'app-generate-pdf',
  templateUrl: './generate-pdf.component.html',
  styleUrls: ['./generate-pdf.component.scss']
})
export class EstudioPrevioComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @Input() contractorId: string;
  @Input() contractId: string;
  @Input() generateType: string;
  valueLetter: any;
  currentDate: string;
  year = new Date('YYYY');
  file: any;
  docDefinition: any;
  base64Output: any;
  headerImageBase654: any;
  footerImageBase654: any;
  itmImageBase654: any;

  constructor(
    private _shareService: ShareService,
    private _auth: AuthService

  ) { }

  ngOnInit(): void {

    switch (this.generateType) {
      case 'minuteExtension':

        break;
      case 'minuteModify':

        break;
      case 'minuteExtension':

        break;
      default:
        break;
    }

    this._shareService.loadAndConvertImageToBase64(RouteImageEnum.ALCALDIA)
    .then(base64Data => {
        this.base64Image = base64Data;
    })
    .catch(error => {
        console.error('Error al cargar y convertir la imagen:', error);
    });
    this.currentDate = this._shareService.getCurrentDate();

  }

  private generatePreviusStudy() {

  }

  private generateCommitteeRequest() {
    const documentSolicitudComite = {
      pageSize: 'A4',
      pageOrientation: 'FOLIO',
      pageMargins: [40, 80, 40, 60],
      header: {
          margin: [50, 20,0,30],
          table: {
              color: '#444',
              style: 'tableHeader',
              widths: [100, 170, 'auto', 70, 70],
              headerRows: 3,
              body: [
                  [
                      {
                          rowSpan: 3,
                          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABACAMAAABvJxYMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC/VBMVEUAAAAMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVsMIVv////Mb2P8AAAA/XRSTlMAAAIBAyF5qY0jBBEiOE9lipiip6uo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',
                          style: 'title',
                          fit: [100, 100],
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
                      text: 'Remito para su estudio las hojas de vida de los proponentes contratistas para el apoyo integral en la ejecución del Contrato Interadministrativo 4600096644 de 2023, cuyo objeto es Contrato interadministrativo para la implementación de estrategias de promoción de la convivencia y fortalecimiento del Gobierno Local en la ciudad.',
                      fontSize: 10,
                      alignment: 'justify'
                  },
                  {
                      text: ' 4600095169',
                      fontSize: 11,
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
                      fontSize: 11,
                  },
              ],
          },
  
          {
              margin: [10, 10, 10, 10],
              table: {
                  widths: [115, 100, 130,115],
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
                      ],
                      [
                          {
                              text: 'Maicol Yepes',
                              style: 'fontPeque',
                          },
                          {
                              text: '1000189631',
                              style: 'fontPeque',
                          },
                          {
                              text: 'Prestación de servicios como contratista independiente, sin vínculo laboral por su propia cuenta y riesgo para realizar la gestion de Enlace Convive La Noche en ejecución del Contrato Interadministrativo No. 4600096644 de 2023, celebrado  entre el Distrito Especial de Ciencia, Tecnología e Innovación de Medellín , Secretaría de Seguridad y Convivencia y el ITM.',
                              style: 'fontPeque',
                          },
                          {
                              text: 'Tecnólogo en cualquier área. con experiencia laboral de un (1) año',
                              style: 'fontPeque',
                          },
                      ],
                  ],
              },
          },
          {             
              margin: [10, 0, 0, 0],
              text: '\n\nFIRMA:' },
          { 
              margin: [10, 0, 0, 0],
              text: 'contractorName' 
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
          title: {
              bold: true,
              fontSize: 13,
              color: 'black',
              alignment: 'center',
          },
          memo: {
              bold: true,
              fontSize: 13,
              color: 'black',
              alignment: 'center',
              margin: [0, 20, 0, 0],
          },
          title2: {
              bold: true,
              fontSize: 10,
              color: 'black',
              alignment: 'center',
          },
          titleTable1: {
              bold: true,
              fontSize: 8,
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
          },
      },
  
      defaultStyle: {
          // alignment: 'justify'
      },
  };

  }




}
