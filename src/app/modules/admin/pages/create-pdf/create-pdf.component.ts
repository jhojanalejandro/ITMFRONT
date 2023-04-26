import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import { documentMinutaAdicion, documentMinutaAmpliacion, documentPreviousStudy, documentMinutaAdicion1YAmpliacion1 } from './dataPdf';

@Component({
    selector: 'app-create-pdf',
    templateUrl: './create-pdf.component.html',
    styleUrls: ['./create-pdf.component.scss']
})
export class CreatePdfComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
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
}
