import { Component, Input, OnInit } from '@angular/core';
import { ButtonsExportService } from './buttons-export.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-buttons-export',
    templateUrl: './buttons-export.component.html',
    styleUrls: ['./buttons-export.component.scss'],
})
export class ButtonsExportComponent implements OnInit {
    @Input() idContrato: number;
    constructor(private _service: ButtonsExportService) { }

    ngOnInit() { }

    exportarViabilidad() {
        this._service.getReport(this.idContrato).subscribe(
            (res) => {
                var downloadURL = window.URL.createObjectURL(res);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "Viabilidad";
                link.click();
                if (res) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Documento descargado.',
                        showConfirmButton: false,
                        timer: 1500
                      })
                }
            },
            (response) => {
                console.log(response);
                swal.fire('', 'Error al descargar la informacion!', 'error');
            }
        );
    }

    exportarCdp() {
        this._service.getReportCdp(this.idContrato).subscribe(
            (res) => {
                var downloadURL = window.URL.createObjectURL(res);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "SOLICITUD CDP- DAP";
                link.click();
                if (res) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Documento descargado.',
                        showConfirmButton: false,
                        timer: 1500
                      })
                }
            },
            (response) => {
                swal.fire('', '', 'error');
            }
        );
    }

    exportarPaa() {
        this._service.getReportPpa(this.idContrato).subscribe(
            (res) => {
                var downloadURL = window.URL.createObjectURL(res);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "SOLICITUD PAA";
                link.click();
                if (res) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Documento descargado.',
                        showConfirmButton: false,
                        timer: 1500
                      })
                }
            },
            (response) => {
                console.log(response);
                swal.fire('', 'Error al descargar la informacion!', 'error');
            }
        );
    }

    exportarDap() {
        this._service.getReportDap(this.idContrato).subscribe(
            (res) => {
                var downloadURL = window.URL.createObjectURL(res);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = "SOLICITUD CONTRATACIÓN DAP";
                link.click();
                if (res) {
                   Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Documento descargado.',
                        showConfirmButton: false,
                        timer: 1500
                      })
                }
            },
            (response) => {
                console.log(response);
                swal.fire('', 'Error al descargar la informacion!', 'error');
            }
        );
    }
}
