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

    export(id: any) {
        let urlEndPoint = this.apiUrl + environment.exportarViabilidad;
        return this._httpClient.get<any>(urlEndPoint);
    }

    getReport(): Observable<Blob> {
      let urlEndPoint = this.apiUrl + environment.exportarViabilidad;
      const httpOptions = {
        responseType: 'blob' as 'json'
      };
      return this._httpClient.get<any>( urlEndPoint, httpOptions);
    }
}
