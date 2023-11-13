import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class MaintainerService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }


    addMaintainer(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addContractorPaymentsEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError)
        );
    }


    DeleteContractorPayment(id: any) {
        let urlEndPoint = this.apiUrl + environment.DeleteContractorPaymentsEndpoint;
        return this._httpClient.get<any>(urlEndPoint + id);
    }

    getAllContractorPayment() {
        let urlEndPoint = this.apiUrl + environment.GetAllContractorPaymentsEndpoint;
        return this._httpClient.get<any>(urlEndPoint);
    }

    UpdateEconomicContractorPayment(formdata: any) {
        let urlEndpointGenerate = this.apiUrl + environment.UpdateEconomicDataContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata).pipe(
            catchError(this.handleError)
        );
    }

    addContractorPaymentSecurity(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addContractorPaymentSecurityEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError)
        );
    }

    addRubroType(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.SaveRubroEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError)
        );
    }

    addCpcType(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.SaveCpcTypeEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError)
        );
    }

    addBank(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.SaveSaveBankEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<any> {
        console.log(error);
        
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
