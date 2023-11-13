import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, retry, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class ContractorPaymentService {
    private _contractorsByContract: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    getPaymentContractor(contractId: string, contractorId: string) {
        let urlEndPoint = this.apiUrl;
        const params = new HttpParams()
            .set('contractId', contractId)
            .set('contractorId', contractorId);
        let urlEndpointGenerate = this.apiUrl + environment.GetPaymentsContractorListEndpoint;

        return this._httpClient.get<IResponse>(urlEndPoint + urlEndpointGenerate, { params: params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            })
        );
    }

    getPaymentAccount(contractorId: string, contractId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId)
        let urlEndPoint = this.apiUrl + environment.GetPdChargeAccountGetById;
        return this._httpClient.get<IResponse>(urlEndPoint, { params: params });
    }

    getContractorPostContractual(contractId: string) {
        const params = new HttpParams()
            .set('contractId', contractId);
        let urlEndPoint = this.apiUrl + environment.GetContractorPaymentSecurityEndpoint;
        return this._httpClient.get<IResponse>(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            }),
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    getContractorPayments(contractorId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId);
        let urlEndPoint = this.apiUrl + environment.GetPaymentsContractorEndpoint;
        return this._httpClient.get<IResponse>(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            }),
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    getContractorNomina(contractId: string) {
        const params = new HttpParams()
            .set('contractId', contractId);
        let urlEndPoint = this.apiUrl + environment.GetContractorNominaEndpoint;
        return this._httpClient.get<IResponse>(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            }),
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    GetNewnessContractor(contractorId: string, contractId) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId);
        let urlEndPoint = this.apiUrl + environment.GetNewnessContractorEndpoint;
        return this._httpClient.get<IResponse>(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            }),
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    // Método para manejar errores (opcional)
    private handleError(error: any): Observable<any> {
        let errorResponse = null;
        if(error.error.message == null){
            errorResponse = error.error
        }else{
            errorResponse = error.error.message
        }
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: errorResponse,
            showConfirmButton: false,
            timer: 2500
        });
        return new Observable<any>();
    }
}
