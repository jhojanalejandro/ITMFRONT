import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ContractContractors } from "app/modules/admin/dashboards/contractual/models/contractor";
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

    getcommitteeRequestData(contractors: ContractContractors) {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetCommitteeRequestdEndpoint;
        return this._httpClient.post<any>(urlEndpointGenerate, contractors);
    }
    getPreviusStudy(contractors: ContractContractors) {

        let urlEndpointGenerate =
            this.apiUrl + environment.GetPreviusStudyContractIdEndpoint;
        return this._httpClient.post<any>(urlEndpointGenerate, contractors);
    }
}