import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class UploadFileDataService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }


    UploadFileExcel(formdata: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addExcelContractorEndpoint;
         return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }
    UploadFileContractor(formdata: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addFileEndpoint;
         return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

}