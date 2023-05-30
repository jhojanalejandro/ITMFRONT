import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PdfDataService {
  
    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    getDataMinuteExtension(contractId: any,contractorId: string) {
        const params = new HttpParams()
        .set('contractorId', contractorId)
        .set('contractId', contractId);
        let urlEndpointGenerate =
            this.apiUrl + environment.GetPdMinteExtension;
        return this._httpClient.get<any>(urlEndpointGenerate, {params});
    }

    getDataMinuteMacroContract(contractId: any) {
        const params = new HttpParams()
        .set('contractId', contractId);
        let urlEndpointGenerate =
            this.apiUrl + environment.GetPdMinteExtension;
        return this._httpClient.get<any>(urlEndpointGenerate, {params});
    }
}