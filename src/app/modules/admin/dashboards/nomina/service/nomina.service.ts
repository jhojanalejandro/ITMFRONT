import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { EconomicContractor } from '../models/economic-data-contractor';
import Swal from 'sweetalert2';
import { ContractorPayments } from '../models/contractor-payments';

@Injectable({
    providedIn: 'root'
})
export class NominaService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

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


    getContractorPayment(contractorId: string, contractId) {
        const params = new HttpParams()
        .set('contractorId', contractorId)
        .set('contractId', contractId);
        let urlEndPoint = this.apiUrl + environment.GetPaymentByIdContractAndContractorEndpoint;
        return this._httpClient.get<ContractorPayments>(urlEndPoint, {params}).pipe(
            catchError(this.handleError)
        );
    }

    addContractorPaymentSecurity(contractorPaymentSecurity: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addContractorPaymentSecurityEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, contractorPaymentSecurity).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<any> {
        console.log(error);
        debugger
        let errorShow = null;
        if(error.error.message == null){
            errorShow = error.error
        }else{
            errorShow = error.error.message
        }
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: errorShow,
            showConfirmButton: false,
            timer: 2000
        });
        return new Observable<any>();
    }
}
