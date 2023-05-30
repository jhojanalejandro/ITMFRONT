import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { AnyAaaaRecord } from 'dns';

@Injectable({
    providedIn: 'root'
})
export class FileListManagerService {
    // Private
    contractId: string;
    folderId: string;
    contractorId: string;
    private _listFileContractor: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);
    private _listFileContract: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);
    private _filesContract: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);

    private _itemD: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);

    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    setContractId(valor: any) {
        this.contractId = valor;
    }

    getContractId() {
        return this.contractId;
    }

    setFolderId(valor: any) {
        this.folderId = valor;
    }

    getFolderId() {
        return this.folderId;
    }

    
    getContractorId() {
        return this.contractorId;
    }

    setContractorId(valor: any) {
        this.contractorId = valor;
    }

    get filesContract$(): Observable<DataFile> {
        return this._filesContract.asObservable();
    }

    getFileByContractor(contractId: string | null = null, contractorId: any | null = null, folderId: string | null = null): Observable<DataFile> {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('folderId', folderId)
            .set('contractId', contractId);
        let urlEndPoint = this.apiUrl + environment.GetAllFileByFolderContractorEndpoint;
        return this._httpClient.get<any>(urlEndPoint, { params: params }).pipe(
            tap((items) => {
                this._listFileContractor.next(items);

            }),
            switchMap((item) => {

                if (!item) {
                    return throwError('No se pudo encontrar item con id of ' + contractorId + '!');
                }

                return of(item);
            })
        );
    }

    getFileByContract(contractId: string | null = null, folderId: string | null = null): Observable<DataFile[]> {
        const params = new HttpParams()
            .set('folderId', folderId)
            .set('contractId', contractId);
        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl + environment.GetAllFileByFolderContractEndpoint;
        return this._httpClient.get<any>(urlEndPoint, { params: params }).pipe(
            tap((items) => {
                // Update the item
                const item = [...items.files] = items || null;
                this._listFileContract.next(item);

            }),
            switchMap((item) => {

                if (!item) {
                    return throwError('No se pudo encontrar el item con id' + contractId + '!');
                }

                return of(item);
            })
        );
    }


    getFileContractById(id: any): Observable<DataFile> {
        let urlEndPoint = this.apiUrl + environment.GetByIdFileEndpoint;
        return this._httpClient.get(urlEndPoint + id).pipe(
            take(1),
            tap((item: any) => {
                this._filesContract.next(item);
            }),
            switchMap((item) => {

                if (!item) {
                    return throwError('No se pudo encontrar el item con id ' + id + '!');
                }

                return of(item);
            })
        );
    }


    UpdateContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.UpdateContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    DeleteFile(id: any) {
        const params = new HttpParams()
            .set('fileId', id)
        let urlEndpointGenerate = this.apiUrl + environment.DeleteFileEndpoint;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate + id);
    }

    getStatusFile(): Observable<any> {
        let urlEndPoint = this.apiUrl + environment.GetStatusFileEndpoint;
        return this._httpClient.get(urlEndPoint).pipe(
            tap((statusFile: any) => {
                this._filesContract.next(statusFile);
            })
        );
    }

}
