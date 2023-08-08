import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { EconomicContractor } from '../models/economic-data-contractor';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class NominaService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    /**
 * Getter for data
 */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    addContractorPayments(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addContractorPaymentsEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError)
        );
    }


    DeleteContractorPayment(id: any) {
        let urlEndPoint = this.apiUrl + environment.DeleteContractorPaymentsEndpoint;
        return this._httpClient.get<any>(urlEndPoint + id);
    }
    getAllEconomicDataContractor() {
        let urlEndPoint = this.apiUrl + environment.GetAllEconomicDataContractorEndpoint;
        return this._httpClient.get<any>(urlEndPoint);
    }

    getAllContractorPayment() {
        let urlEndPoint = this.apiUrl + environment.GetAllContractorPaymentsEndpoint;
        return this._httpClient.get<any>(urlEndPoint);
    }
    
    getByIdContractorPayments(id: any) {
        let urlEndPoint = this.apiUrl + environment.GetByIdContractorPaymentsEndpoint;
        return this._httpClient.get<any>(urlEndPoint + id);
    }


    getByIdEconomicDataContractor(economicData: any) {
        let urlEndPoint = this.apiUrl + environment.GetByIdEconomicDataContractorEndpoint;
        return this._httpClient.post<EconomicContractor[]>(urlEndPoint, economicData).pipe(
            catchError(this.handleError)
        );
    }

    UpdateEconomicContractorPayment(formdata: any) {
        let urlEndpointGenerate = this.apiUrl + environment.UpdateEconomicDataContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata).pipe(
            catchError(this.handleError)
        );
    }

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
