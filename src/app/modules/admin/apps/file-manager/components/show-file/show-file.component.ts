import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { interval, Subject, takeUntil } from 'rxjs';
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/service/upload-data.service';
import { ActivatedRoute } from '@angular/router';
import { FileListManagerService } from '../../services/list-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-register-contractor',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.scss'],
})
export class ShowFileComponent implements OnInit {
  shortLink: string = "";
  PathReportString: any;
  getFile: any;
  fileName: string;
  file: any; // Variable to store file
  contratos: any; 
  pdfDescomprimido: Uint8Array;
  fileDecode: any;
  id: any;
  constructor(
    private sanitizer: DomSanitizer,
    public matDialogRef: MatDialogRef<ShowFileComponent>,
    @Inject(MAT_DIALOG_DATA) private _data
  ) { 
    this.id = this._data.id;
    this.getFile = this._data.fileData;    
    this.fileName = this._data.fileName;    

    // this.file = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${this.getFile}`);

    // this.getFile = `data:application/pdf;base64,${this.getFile}`;

    // const base64String = this.getFile;// Tu cadena Base64 aquí
  }

  ngOnInit(): void {
    this.id = this._data.id;
    this.getFile = this._data.fileData;    
    this.fileName = this._data.fileName;    

    // this.getFile = this.getFile.split('data:application/pdf;base64,')
    
    this.PathReportString = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(this.getFile) as any).changingThisBreaksApplicationSecurity;

    top.document.getElementById('ifrm').setAttribute("src", this.PathReportString);
    
  }

  showPdf() {
    const pdfInBase64 = this.getFile;
    const newBlob = new Blob([pdfInBase64], { type: 'application/pdf' });
    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //   window.navigator.msSaveOrOpenBlob(newBlob); // For IE browser
    // }
    const linkElement = document.createElement('a');
    const url = URL.createObjectURL(newBlob);
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', 'sample.pdf');
    const clickEvent = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': false
    });
    linkElement.dispatchEvent(clickEvent);
  }

  async descomprimirPDF() {
    try {
      // Decodificar el contenido en base64 para obtener el Uint8Array del PDF comprimido
      const pdfBytesComprimido = Uint8Array.from(atob(this.getFile), c => c.charCodeAt(0));

      // Descomprimir el PDF utilizando pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBytesComprimido);
      this.pdfDescomprimido = await pdfDoc.save();
      // Ahora tienes el PDF descomprimido en this.pdfDescomprimido
      console.log('PDF descomprimido:', this.pdfDescomprimido);
    } catch (error) {
      console.error('Error al descomprimir el PDF:', error);
    }
  }

  closeModal(): void {
    this.matDialogRef.close(true);
  }



}