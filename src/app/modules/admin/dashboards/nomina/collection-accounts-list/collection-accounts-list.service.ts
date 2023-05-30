import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class CollectionAccountsService
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
    getItemByTypeAndDate(type: any | null = null,contractId: any | null = null, date : any | null = null): Observable<DataFile>
    {
        if(type === 'documentos'){
            type = 'Cuenta De Cobro';
        }
        if(date === null){
            let month = new Date().getMonth() + 1;
            let year = new Date().getFullYear();
            date = year + '/' + month;
        }
        const params = new HttpParams()
        .set('contractId', contractId )
        .set('type', type)
        .set('date',date);
        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl+ environment.GetAllFileByDatePayment;
        return this._httpClient.get<any>(urlEndPoint,{params: params}).pipe(
            tap((items) => {
                // Update the item
                const item = [...items.files] = items || null;
                this._item.next(item);
                
            }),
            switchMap((item) => {

                if ( !item )
                {
                    return throwError(' No se pudo encontrar el información con id de' + contractId + '!');
                }

                return of(item);
            })
        );
    }

    getItemByIdDetail(id: any | null = null): Observable<DataFile>
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
                    return throwError('No se pudo encontrar el artículo con id' + id + '!');
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
