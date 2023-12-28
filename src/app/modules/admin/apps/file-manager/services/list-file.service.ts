import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, switchMap, take, tap, throwError } from 'rxjs';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import Swal from 'sweetalert2';
import { ContractContractors } from 'app/modules/admin/dashboards/contractual/models/contractor';

@Injectable({
    providedIn: 'root'
})
export class FileListManagerService {
    // Private
    contractId: string;
    contractorName: string;
    folderId: string;
    contractorId: string;
    private _listFileContractor: BehaviorSubject<DataFile[] | null> = new BehaviorSubject(null);
    private _listFileContract: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);
    private _file: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);
    private _statusFile: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);

    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    setContractorName(valor: any) {
        this.contractorName = valor;
    }

    getContractorName() {
        return this.contractorName;
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

    get getfile$(): Observable<DataFile> {
        return this._file.asObservable();
    }


    get getStatusfile$(): Observable<DataFile> {
        return this._file.asObservable();
    }

    getFileByContractor(contractId: string | null = null, contractorId: any | null = null, folderId: string | null = null): Observable<DataFile[]> {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('folderId', folderId)
            .set('contractId', contractId);
        let urlEndPoint = this.apiUrl + environment.GetAllFileByFolderContractorEndpoint;
        return this._httpClient.get<DataFile[]>(urlEndPoint, { params: params }).pipe(
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


    getFileByContractorToDownload(contractId: string | null = null, contractorId: any | null = null, folderId: string | null = null): Observable<DataFile[]> {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('folderId', folderId)
            .set('contractId', contractId);
        let urlEndPoint = this.apiUrl + environment.GetFileContractorByFolderToDownloadEndpoint;
        return this._httpClient.get<DataFile[]>(urlEndPoint, { params: params }).pipe(
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


    getFileByFileId(id: any): Observable<DataFile> {
        let urlEndPoint = this.apiUrl + environment.GetByIdFileEndpoint;
        return this._httpClient.get(urlEndPoint + id).pipe(
            take(1),
            tap((item: any) => {
                this._file.next(item);
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

    DeleteFile(fileId: any) {

        let urlEndpointGenerate = this.apiUrl + environment.DeleteFileEndpoint;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate + fileId).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    getStatusFile(): Observable<any> {
        let urlEndPoint = this.apiUrl + environment.GetStatusFileEndpoint;
        return this._httpClient.get(urlEndPoint).pipe(
            tap((statusFile: any) => {
                this._statusFile.next(statusFile);
            })
        );
    }


    getFileDownload(contractContractors: ContractContractors): Observable<DataFile> {

        let urlEndPoint = this.apiUrl + environment.GetFileDonwloadContractualEndpoint;
        return this._httpClient.post<any>(urlEndPoint, contractContractors ).pipe(
            tap((items) => {
                this._listFileContractor.next(items);
            })
        );
    }

    private handleError(error: any): Observable<any> {
        // Implementa el manejo de errores aquí, si es necesario
        // Por ejemplo, puedes mostrar un mensaje de error en la consola o en una ventana modal
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: error.error.message,
            showConfirmButton: false,
            timer: 2500
        });
        return new Observable<any>();
    }

}
