import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class HomeContractorService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/finance').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    async getByIdFile(id: any){
        let urlEndPoint = this.apiUrl+ environment.GetByIdFileEndpoint;
        return await this._httpClient.get<any>(urlEndPoint + id);
    }  
    addContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    async getDepartments(){
        let urlEndPoint = environment.getDepartmentsColombia;
        return await this._httpClient.get<any>(urlEndPoint);
    }
    
    addProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    UpdateProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    getAllContract(): Observable<any>
    {
        let urlEndPoint = this.apiUrl+ environment.GetAllProjectFolderEndpoint;
        return  this._httpClient.get(urlEndPoint).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    UploadFileContractor(formdata: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addFileEndpoint;
         return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

}
