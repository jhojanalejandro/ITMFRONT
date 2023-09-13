import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html'
})
export class ShowFileComponent implements OnInit {
  PathReportString: any;
  getFile: any;
  fileName: string;
  pdfDescomprimido: Uint8Array;
  id: any;
  pdfData: any;
  pdfLoading: boolean = true;
  pdfUrl: any;
  constructor(
    private sanitizer: DomSanitizer,
    public matDialogRef: MatDialogRef<ShowFileComponent>,
    @Inject(MAT_DIALOG_DATA) private _data
  ) {
    this.id = this._data.id;
    this.getFile = this._data.fileData;
    this.fileName = this._data.fileName;
    // Convierte el contenido base64 en un Blob
    const byteCharacters = atob(this.getFile);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Crea una URL temporal para el Blob
    this.pdfUrl = URL.createObjectURL(blob);

    // this.file = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${this.getFile}`);

    // this.getFile = `data:application/pdf;base64,${this.getFile}`;

    // const base64String = this.getFile;// Tu cadena Base64 aquí
  }

  ngOnInit(): void {
    this.id = this._data.id;
    this.getFile = this._data.fileData;
    this.fileName = this._data.fileName;

    this.pdfData = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + this.getFile);
    // this.getFile = this.getFile.split('data:application/pdf;base64,')

    // this.PathReportString = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(this.getFile) as any).changingThisBreaksApplicationSecurity;

    // top.document.getElementById('ifrm').setAttribute("src", this.PathReportString);

  }

  closeModal(): void {
    this.matDialogRef.close(true);
  }



}