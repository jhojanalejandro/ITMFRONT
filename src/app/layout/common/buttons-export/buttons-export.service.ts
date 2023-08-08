import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
})
export class ButtonsExportService {
    apiUrl: any = environment.apiURL;
    constructor(private _httpClient: HttpClient) {}

    generateReport(idContrato: string): Observable<Blob> {
      let urlEndPoint = this.apiUrl + environment.exportarViabilidad;
      const httpOptions = {
        responseType: 'blob' as 'json'
      };
      return this._httpClient.get<any>( urlEndPoint + idContrato, httpOptions);
    }
    getReportDataCdp(idContrato: string): Observable<Blob> {
      let urlEndPoint = this.apiUrl + environment.exportarCdp;
      const httpOptions = {
        responseType: 'blob' as 'json'
      };
      return this._httpClient.get<any>( urlEndPoint + idContrato, httpOptions);
    }
    getReportPpa(idContrato: string): Observable<Blob> {
      let urlEndPoint = this.apiUrl + environment.exportarPpa;
      const httpOptions = {
        responseType: 'blob' as 'json'
      };
      return this._httpClient.get<any>( urlEndPoint+ idContrato, httpOptions);
    }
    getReportCdp(idContrato: string): Observable<Blob> {
      let urlEndPoint = this.apiUrl + environment.exportarSoicitudCdp;
      const httpOptions = {
        responseType: 'blob' as 'json'
      };
      return this._httpClient.get<any>( urlEndPoint + idContrato, httpOptions);
    }

    getElementsContract(idContrato: string): Observable<Blob> {
      let urlEndPoint = this.apiUrl + environment.exportElements;
      const httpOptions = {
        responseType: 'blob' as 'json'
      };
      return this._httpClient.get<any>( urlEndPoint + idContrato, httpOptions);
    }
}
