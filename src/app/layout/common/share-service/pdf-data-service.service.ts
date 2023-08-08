import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ContractContractors } from "app/modules/admin/dashboards/contractual/models/contractor";
import { MinuteExtension, PreviusStudy } from "app/modules/admin/dashboards/contractual/models/generate-pdf";
import { environment } from "environments/environment";
import { Observable, catchError } from "rxjs";
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class PdfDataService {

    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    getDataMinuteExtension(contractors: ContractContractors) {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetPdMinteExtension;
        return this._httpClient.post<any>(urlEndpointGenerate, contractors).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    getDataMinuteMacroContract(contractId: any) {
        const params = new HttpParams()
            .set('contractId', contractId);
        let urlEndpointGenerate =
            this.apiUrl + environment.GetPdMinteExtension;
        return this._httpClient.get<any>(urlEndpointGenerate, { params });
    }

    getcommitteeRequestData(contractors: ContractContractors) {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetCommitteeRequestdEndpoint;
        return this._httpClient.post<any>(urlEndpointGenerate, contractors);
    }
    getPreviusStudy(contractors: ContractContractors): Observable<PreviusStudy[]> {

        let urlEndpointGenerate =
            this.apiUrl + environment.GetPreviusStudyContractIdEndpoint;
        return this._httpClient.post<PreviusStudy[]>(urlEndpointGenerate, contractors);
    }

    // Método para manejar errores (opcional)
    private handleError(error: any): Observable<any> {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: error.error.message,
            showConfirmButton: false,
            timer: 2000
        });
        return new Observable<any>();
    }
}