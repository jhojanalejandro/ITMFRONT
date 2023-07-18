import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { DetailFile, DocumentTypeFile, Files, FileContractor, DetailFileContractor } from 'app/layout/common/models/file-contractor';

@Injectable({
    providedIn: 'root'
})
export class UploadFileDataService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }


    UploadFileExcel(formdata: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addExcelContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    UploadCdpFileExcel(formdata: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addExcelCdpEndpoint;
        return this._httpClient.post(urlEndpointGenerate, formdata, { responseType: 'text' });
    }

    UploadFileContractor(formdata: FileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    UploadFileContract(formdata: Files) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileContractEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    addDetailFile(formdata: DetailFileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.addDetailFileEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    UploadFileBillContractors(formdata: FileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileBillsEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    getDocumentType() {
        let urlEndpointGenerate = this.apiUrl + environment.GetDocumentTypeEndpoint;
        return this._httpClient.get<DocumentTypeFile[]>(urlEndpointGenerate);
    }


    updateStatusFileContractor(detail: DetailFile) {
        let urlEndpointGenerate = this.apiUrl + environment.addDetailFileEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, detail);
    }

    UploadElementFileExcel(formdata: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addExcelElementEndpoint;
        return this._httpClient.post(urlEndpointGenerate, formdata, { responseType: 'text' });
    }

    getMinuteType() {
        let urlEndpointGenerate = this.apiUrl + environment.GetMinuteTypeContractEndpoint;
        return this._httpClient.get<any[]>(urlEndpointGenerate);
    }

}
