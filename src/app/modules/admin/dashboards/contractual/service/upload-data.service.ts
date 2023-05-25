import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class UploadDataService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    addHiringContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addHiringEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }
    
    addContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    UpdateCostContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    DeleteContract(id: any) {
        let urlEndpointGenerate = this.apiUrl + environment.DeleteContractFolderEndpoint;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate, id);
    }

}
