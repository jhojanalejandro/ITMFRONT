import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { DetailFile, DocumentTypeFile, Files, FileContractor, DetailFileContractor } from 'app/layout/common/models/file-contractor';
import Swal from 'sweetalert2';

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
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata).pipe(
            catchError(this.handleError) 
        );
    }

    UploadFileContractor(formdata: FileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    UploadFileContractorTest(formdata: FileContractor): Promise<any> {
        let urlEndpointGenerate = this.apiUrl + environment.addFileEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata).toPromise();
    }

    UploadFileContract(formdata: Files) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileContractEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    addDetailFile(formdata: DetailFileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.addDetailFileEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    UploadFileBillContractors(formdata: FileContractor[]) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileBillsEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata).pipe(
            catchError(this.handleError)
        );
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
    addObservationDetailFile(formdata: DetailFileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.CreateDetailObservationEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    UploadFileMinuteGenrateContract(formdata: FileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileBillsEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    
    UploadFileCommitteeContractors(formdata: FileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.SaveCommitteeContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata).pipe(
            catchError(this.handleError)
        );
    }

    
    updateStatusFileCommitteeContractor(detail: DetailFile) {
        let urlEndpointGenerate = this.apiUrl + environment.saveDetailFileCommitteeEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, detail).pipe(
            catchError(this.handleError)
        );
    }

    UploadFileShareContractor(formdata: FileContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileShareEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    // Método para manejar errores (opcional)
    private handleError(error: any): Observable<any> {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: error.error.message,
            showConfirmButton: false,
            timer: 3000
        });
        return new Observable<any>();
    }
}
