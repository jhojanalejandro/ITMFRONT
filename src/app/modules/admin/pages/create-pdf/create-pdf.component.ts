import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { documentMinutaAdicion, documentMinutaAmpliacion, documentPreviousStudy, documentMinutaAdicion1YAmpliacion1, documentSolicitudComite } from './dataPdf';
import { LocationStrategy } from '@angular/common';

@Component({
    selector: 'app-create-pdf',
    templateUrl: './create-pdf.component.html',
    styleUrls: ['./create-pdf.component.scss']
})
export class CreatePdfComponent implements OnInit {
    constructor(private location: LocationStrategy) {}
    image: string= '../../../../../assets/images/imagesPdf/footerPdfMinutaAmpliacion.jpg'
    ngOnInit(): void {
        let imag = this.getRelativeImagePath('images/imagesPdf/footerPdfMinutaAmpliacion.jpg');
        let r = this.convertImageToBase64('../../../../../assets/images/imagesPdf/footerPdfMinutaAmpliacion.jpg');

    }

    getRelativeImagePath(imageName: string): string {
        const basePath = this.location.getBaseHref();
        return `${basePath}/${imageName}`;
      }
    convertImageToBase64(imagePath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    resolve(base64);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = (error) => {
                reject(error);
            };
            xhr.open('GET', imagePath);
            xhr.responseType = 'blob';
            xhr.send();
        });
    }
    downloadExpancionMinute() {
        let data = documentMinutaAmpliacion;
        this.downloadAsPDFs(data, 'MINUTA DE AMPLIACIÓN');
    }

    downloadAditionMinute() {
        let data = documentMinutaAdicion;
        this.downloadAsPDFs(data, 'MINUTA DE ADICIÓN');
    }

    downloadAdition1AndExpancion1Minute() {
        let data = documentMinutaAdicion1YAmpliacion1;
        this.downloadAsPDFs(data, 'MINUTA DE ADICIÓN');
    }

    downloadPreviousStudy() {
        let data = documentPreviousStudy;
        this.downloadAsPDFs(data, 'ESTUDIO PREVIO');
    }

    downloadAsPDFs(data: any, nameDocument: string) {
        return pdfMake.createPdf(data).download(nameDocument);
    }

    downloadsolicitudComite() {
        let data = documentSolicitudComite;
        this.downloadAsPDFs(data, 'SOLICITUD COMITE');
    }
}
