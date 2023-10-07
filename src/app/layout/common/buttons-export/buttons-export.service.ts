import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ButtonsExportService {
  apiUrl: any = environment.apiURL;
  constructor(private _httpClient: HttpClient) { }

  generateReport(generateReport: any): Observable<any> {
    let urlEndPoint = this.apiUrl + environment.GenrateReportContractEndpoint;
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this._httpClient.post<any>(urlEndPoint, generateReport,httpOptions);
  }
  getReportDataCdp(idContrato: string): Observable<Blob> {
    let urlEndPoint = this.apiUrl + environment.exportarCdp;
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this._httpClient.get<any>(urlEndPoint + idContrato, httpOptions);
  }
  getReportPpa(idContrato: string): Observable<Blob> {
    let urlEndPoint = this.apiUrl + environment.exportarPpa;
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this._httpClient.get<any>(urlEndPoint + idContrato, httpOptions);
  }
  getReportCdp(idContrato: string): Observable<Blob> {
    let urlEndPoint = this.apiUrl + environment.exportarSoicitudCdp;
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this._httpClient.get<any>(urlEndPoint + idContrato, httpOptions);
  }

  getElementsContract(idContrato: string): Observable<Blob> {
    let urlEndPoint = this.apiUrl + environment.exportElements;
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this._httpClient.get<any>(urlEndPoint + idContrato, httpOptions);
  }

  generateReportSatisfaction(contractId: any, base64: string): Observable<any> {
    let urlEndPoint = this.apiUrl + environment.GenerateSatisfactionReportEndpoint;
    let generateSatisfaccion = {
      contractId: contractId,
      base64: base64
    }
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this._httpClient.post<any>(urlEndPoint, generateSatisfaccion, httpOptions);
  }
}
