import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { ExecutionReport } from '../models/pdfDocument';
import { Bank, EntityHealth } from '../models/mater.model';

@Injectable({
    providedIn: 'root'
})
export class HomeContractorService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    UpdateContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.UpdateContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    getFileById(contractor: string, contract: string): Observable<any> {
        const params = new HttpParams()
            .set('contractorId', contractor)
            .set('contractId', contract);
        let urlEndPoint = this.apiUrl + environment.GetAllFileByContractEndpoint;
        return this._httpClient.get<any>(urlEndPoint, { params: params }).pipe(
            tap((items) => {
                // Update the item
                const item = [...items.files] = items || null;
                return item;

            }),
            switchMap((item) => {

                if (!item) {
                    return throwError('No se pudo encontrar el artículo con id ' + contract + '!');
                }

                return of(item);
            })
        );
    }

    GetMinutesPdfContractor(contractorId: string, contractId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId);
        let urlEndpointGenerate = this.apiUrl + environment.GetMinutesPdf;
        return this._httpClient.get<File>(urlEndpointGenerate, { params: params });
    }

    getExecutionReport(contractorId: string, contractId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId)
        let urlEndPoint = this.apiUrl + environment.GetPdfDataExecutionReport;
        return this._httpClient.get<ExecutionReport>(urlEndPoint, { params: params });
    }

    saveContractorPersonalInformation(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.SaveDataContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    getBanks(): Observable<Bank[]> {
        let urlEndPoint =  this.apiUrl +environment.GetBanksContractEndpoint;
        return this._httpClient.get<Bank[]>(urlEndPoint);
    }


    getEmptityHealthContractor(contractorId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
        let urlEndPoint = this.apiUrl + environment.GetEmptityHealthContractorEndpoint;
        return this._httpClient.get<IResponse>(urlEndPoint, { params: params });
    }


    getContarctorById(contractorId: string): Observable<any> {
        const params = new HttpParams()
        .set('contractorId', contractorId)
        let urlEndPoint = this.apiUrl + environment.GetContractorByIdEndpoint;

        return this._httpClient.get<any>(urlEndPoint, { params: params }).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getPersonalDataContractor(contractorId: string, contractId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId)
        let urlEndPoint = this.apiUrl + environment.GetPersonalDataEndpoint;
        return this._httpClient.get<ExecutionReport>(urlEndPoint, { params: params });
    }

}

