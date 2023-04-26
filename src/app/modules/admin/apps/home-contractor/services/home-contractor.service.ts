import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { ExecutionReport } from '../models/pdfDocument';

@Injectable({
    providedIn: 'root'
})
export class HomeContractorService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

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
    
    addProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    UpdateProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }


    UploadFileContractor(formdata: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addFileEndpoint;
         return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    getFileById(idC: any | null = null): Observable<any>
    {
        let arr = idC.split('/');
        const params = new HttpParams()
        .set('contractorId', arr[0] )
        .set('contractId', arr[1]);
        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl+ environment.GetAllFileByContractEndpoint;
        return this._httpClient.get<any>(urlEndPoint, {params: params}).pipe(
            tap((items) => {
                // Update the item
                const item = [...items.files] = items || null;
                return item;
                
            }),
            switchMap((item) => {

                if ( !item )
                {
                    return throwError('Could not found the item with id of ' + idC + '!');
                }

                return of(item);
            })
        );
    }

    GetMinutesPdfContractor(contractorId: string, contractId: string) {
        const params = new HttpParams()
        .set('contractorId', contractorId)
        .set('contractId', contractId);
        let urlEndpointGenerate = this.apiUrl+ environment.GetMinutesPdf;
         return this._httpClient.get<File>(urlEndpointGenerate, {params: params});
    }

    getExecutionReport(contractorId: string, contractId: string) {
        const params = new HttpParams()
        .set('contractorId', contractorId )
        .set('contractId', contractId)
        let urlEndPoint = this.apiUrl + environment.GetPdfDataExecutionReport;
        return this._httpClient.get<ExecutionReport>(urlEndPoint, {params: params});
    }

}

