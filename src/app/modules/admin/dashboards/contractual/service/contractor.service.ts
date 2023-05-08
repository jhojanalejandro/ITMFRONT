import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, retry, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { ContractContractors, Contractor } from '../models/contractor';
import { ChargeAccount } from 'app/modules/admin/apps/home-contractor/models/pdfDocument';

@Injectable({
    providedIn: 'root'
})
export class ContractorService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _contractorsByContract: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    get _contractors$(): Observable<Contractor[]> {
        return this._contractorsByContract.asObservable();
    }

    getContractorByIdProject(id: string | null = null) {
        let urlEndPoint = this.apiUrl + environment.GetByContractorIdFolderEndpoint;
        return this._httpClient.get(urlEndPoint + id).pipe(
            tap((response: any) => {
                response.forEach(element => {
                    if(element.habilitado){
                        element.habilitado = 'habilitado'
                    }else{
                        element.habilitado = 'deshabilitado'
                    }
                    if(element.proccess){
                        element.proccess = 'en proceso'
                    }else{
                        element.proccess = 'en espera'
                    }
                    
                });
                this._contractorsByContract.next(response);
            })
        );
    }

    getPaymentContractor(contractId: string, contractorId: string) {
        let urlEndPoint = this.apiUrl;
        const params = new HttpParams()
            .set('contractId', contractId)
            .set('contractorId', contractorId);
        return this._httpClient.get(urlEndPoint + 'Contractor/GetPaymentsContractorList', { params: params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            })
        );
    }

    sendmailsAccounts(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.sendMails;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }
    DeleteContractor(id: any) {
        let urlEndpointGenerate = this.apiUrl + environment.DeleteContractorByIdEndpoint;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate + id);
    }

    addProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    getPaymentAccount(contractorId: string, contractId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId)
        let urlEndPoint = this.apiUrl + environment.GetPdChargeAccountGetById;
        return this._httpClient.get<ChargeAccount>(urlEndPoint, { params: params });
    }

    getContractorByContract(contractorId: string) {
        let urlEndPoint = this.apiUrl + environment.GetContractsByContractors;
        return this._httpClient.get<any>(urlEndPoint + contractorId);
    }


    getDataMinute(contractId: ContractContractors) {
        let urlEndPoint = this.apiUrl + environment.GetBillByContractIdEndpoint;
        return this._httpClient.post<any>(urlEndPoint, contractId);
    }

    addNewnessContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.AddnewnessContractor;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data)
            .pipe(retry(0));
    }

}
