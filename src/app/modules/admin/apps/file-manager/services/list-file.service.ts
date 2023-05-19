import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class FileListManagerService
{
    // Private
    private _item: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);
    private _itemD: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);

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

  

    get itemD$(): Observable<DataFile>
    {
        return this._itemD.asObservable();
    }

    get item$(): Observable<DataFile>
    {
        return this._item.asObservable();
    }

    /**
     * Get item by id
     */
    getItemById(contractId: string | null = null,contractorId: any | null = null, folderId: string| null = null): Observable<DataFile>
    {
        const params = new HttpParams()
        .set('contractorId', contractorId)
        .set('folderId', folderId)
        .set('contractId', contractId);
        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl+ environment.GetAllFileByFolderEndpoint;
        return this._httpClient.get<any>(urlEndPoint, {params: params}).pipe(
            tap((items) => {
                // Update the item
                const item = [...items.files] = items || null;
                this._item.next(item);
                
            }),
            switchMap((item) => {

                if ( !item )
                {
                    return throwError('Could not found the item with id of ' + contractorId + '!');
                }

                return of(item);
            })
        );
    }

    UpdateContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }
  
}
