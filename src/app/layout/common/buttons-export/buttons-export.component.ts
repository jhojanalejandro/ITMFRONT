import { Component, Input, OnInit } from '@angular/core';
import { ButtonsExportService } from './buttons-export.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-buttons-export',
    templateUrl: './buttons-export.component.html',
    styleUrls: ['./buttons-export.component.scss'],
})
export class ButtonsExportComponent implements OnInit {
    @Input() contractId: string;
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private _service: ButtonsExportService) { }

    ngOnInit() { }

    generarReporte() {
        this._service.generateReport(this.contractId)
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
                }else{
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
                console.log(response);
                swal.fire('', 'Error al descargar la informacion!', 'error');
            }
        );
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next(null);
        this._unsubscribe$.complete();
      }
    
}
