import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { IFileContractor } from 'app/layout/common/models/file-contractor';
import { DetailFileContractor } from 'app/modules/admin/apps/home-contractor/models/fileContractor';

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
    UploadFileContractor(formdata: IFileContractor) {
        let urlEndpointGenerate = this.apiUrl+ environment.addFileEndpoint;
         return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    addDetailFile(formdata: DetailFileContractor) {
        let urlEndpointGenerate = this.apiUrl+ environment.addDetailFileEndpoint;
         return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    UploadFileBillContractors(formdata: IFileContractor) {
        let urlEndpointGenerate = this.apiUrl+ environment.addFileBillsEndpoint;
         return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

}
