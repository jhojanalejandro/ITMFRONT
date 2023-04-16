import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { EconomicContractor } from '../models/economic-data-contractor';

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
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }


    DeleteContractorPayment(id: any) {
        let urlEndPoint = this.apiUrl + environment.DeleteContractorPaymentsEndpoint;
        return this._httpClient.get<any>(urlEndPoint + id);
    }
    getAllEconomicDataContractor(){
        let urlEndPoint = this.apiUrl+ environment.GetAllEconomicDataContractorEndpoint;
        return this._httpClient.get<any>(urlEndPoint);
    }  
    
    getAllContractorPayment(){
        let urlEndPoint = this.apiUrl+ environment.GetAllContractorPaymentsEndpoint;
        return this._httpClient.get<any>(urlEndPoint);
    }  
    getByIdContractorPayments(id: any){
        let urlEndPoint = this.apiUrl+ environment.GetByIdContractorPaymentsEndpoint;
        return this._httpClient.get<any>(urlEndPoint + id);
    }  

    getAllContractPayments(): Observable<any> {
        let urlEndPoint = this.apiUrl + environment.GetAllProjectFolderEndpoint;
        return this._httpClient.get(urlEndPoint).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
    getByIdEconomicDataContractor(id: any) {
        let urlEndPoint = this.apiUrl + environment.GetByIdEconomicDataContractorEndpoint;
        return this._httpClient.post<EconomicContractor[]>(urlEndPoint, id);
    }
    
    UpdateEconomicContractorPayment(formdata: any) {
        let urlEndpointGenerate = this.apiUrl + environment.UpdateEconomicDataContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }
    
}
