import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class ContractorListService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    sendmailsAccounts(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.sendMails;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }
    DeleteContractor(id: any) {
        let urlEndpointGenerate = this.apiUrl + environment.DeleteContractorByIdEndpoint;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate + id);
    }

    async getDepartments() {
        let urlEndPoint = environment.getDepartmentsColombia;
        return await this._httpClient.get<any>(urlEndPoint);
    }

    addProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

}
