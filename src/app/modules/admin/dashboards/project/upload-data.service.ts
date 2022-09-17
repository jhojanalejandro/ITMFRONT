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


    // async addContractor(data: any ): Promise<Observable<IResponse>>{
    //     let urlEndpointupdate = this.apiUrl + environment.addContractorEndpoint;
    //     return await  this._httpClient.post<IResponse>(urlEndpointupdate, data);
    // }
    getAllUser(): Observable<any>
    {
        let urlEndPoint = this.apiUrl+ environment.getAllUserEndpoint;
        return  this._httpClient.get(urlEndPoint).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    addContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    async getDepartments(){
        let urlEndPoint = environment.getDepartmentsColombia;
        return await this._httpClient.get<any>(urlEndPoint);
    }

    async getTicketsUser(id: any){
        let urlEndPoint = this.apiUrl+ environment.getByIdTicketUserEndpoint;
        return await this._httpClient.get<any>(urlEndPoint + id);
    }
}
