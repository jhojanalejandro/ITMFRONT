import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Item, Items, ItemsC } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash-es';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class FileListManagerService
{
    // Private
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _itemD: BehaviorSubject<Item | null> = new BehaviorSubject(null);

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

  

    get itemD$(): Observable<Item>
    {
        return this._itemD.asObservable();
    }

    get item$(): Observable<Item>
    {
        return this._item.asObservable();
    }

    /**
     * Get item by id
     */
    getItemById(contractId: string | null = null,contractorId: any | null = null, folderId: string| null = null): Observable<Item>
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

    getItemByIdDetail(id: any | null = null): Observable<Item>
    {
        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl+ environment.GetByIdFileEndpoint;
        return this._httpClient.get<any>(urlEndPoint + id).pipe(
            tap((items) => {
                // Update the item
                const item = items.files = items || null;
                this._itemD.next(item);
                
            }),
            switchMap((item) => {

                if ( !item )
                {
                    return throwError('Could not found the item with id of ' + id + '!');
                }

                return of(item);
            })
        );
    }


    UpdateProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }
  
}
