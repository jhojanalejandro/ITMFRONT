import { Component, Input, OnInit } from '@angular/core';
import { ButtonsExportService } from './buttons-export.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { ShareService } from '../share-service/share-service.service';
import { RouteImageEnum } from '../enums/route-image/route-image';

@Component({
    selector: 'app-buttons-export',
    templateUrl: './buttons-export.component.html',
    styleUrls: ['./buttons-export.component.scss'],
})
export class ButtonsExportComponent implements OnInit {
    @Input() contractId: string;
    @Input() showNomina: boolean;
    private readonly _unsubscribe$ = new Subject<void>();
    itmImageBase64: string = null;

    constructor(private _service: ButtonsExportService, private _shareService: ShareService) { }

    ngOnInit() {
        this.getBase64Image();
     }

    generarReporte() {
        let generateReport = {
            contractId: this.contractId,
            typeStatus: 1,
            status: 1
        }
        this._service.generateReport(generateReport)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(
                (res) => {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "Reporte";
                    link.click();
                    if (res) {
                        Swal.fire({
                            position: 'center',
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

    exportarSolicitudCdp() {
        this._service.getReportCdp(this.contractId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(
                (res) => {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "SOLICITUD CDP- DAP";
                    link.click();
                    if (res) {
                        Swal.fire({
                            position: 'center',
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
        this._service.getReportPpa(this.contractId).subscribe(
            (res) => {

                if (res) {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "SOLICITUD PAA";
                    link.click();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Documento descargado.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: '',
                        html: 'Información de los contratista incompleta',
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
        this._service.getReportDataCdp(this.contractId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(
                (res) => {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "EXPORTAR CDP";
                    link.click();
                    if (res) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Documento descargado.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                },
                (response) => {
                    swal.fire('', 'La información esta incompleta para generar el documento!', 'error');
                }
            );
    }

    generateSatisfactionReportate() {
        this._service.generateReportSatisfaction(this.contractId, this.itmImageBase64)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(
                (res) => {
                    var downloadURL = window.URL.createObjectURL(res);
                    var link = document.createElement('a');
                    link.href = downloadURL;
                    link.download = "REPORTE SATISFACCIÓN";
                    link.click();
                    if (res) {
                        Swal.fire({
                            position: 'center',
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

    private getBase64Image() {
        this._shareService.loadAndConvertImageToBase64(RouteImageEnum.LOGOITM)
            .then(base64Data => {
                this.itmImageBase64 = base64Data;
                
            })
            .catch(error => {
                console.error('Error al cargar y convertir la imagen:', error);
            });
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next(null);
        this._unsubscribe$.complete();
    }

}
