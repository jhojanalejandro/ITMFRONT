import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Item, Items, ItemsC } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash-es';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class ListFolderContractorService
{
    // Private

    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);

    private _itemsC: BehaviorSubject<ItemsC | null> = new BehaviorSubject(null);

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

    /**
     * Getter for items
     */

    get itemsC$(): Observable<ItemsC>
    {
        return this._itemsC.asObservable();
    }

    get item$(): Observable<Item>
    {
        return this._item.asObservable();
    }


    getItemById(idC: any): Observable<Item>
    {
        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl+ environment.GetAllFileContractByIdEndpoint;
        return this._httpClient.get<any>(urlEndPoint+ idC).pipe(
            tap((items) => {
                // Update the item
                const item = [...items.files] = items || null;
                this._item.next(item);
                
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


    getAllFolderContractor(folderIds: string | null = null): Observable<Item[]>
    {
        let urlEndPoint = this.apiUrl+ environment.GetByContractorIdFolderEndpoint;
        return  this._httpClient.get<ItemsC>(urlEndPoint+folderIds).pipe(
            tap((response: any) => {
        // Clone the items
        for (let index = 0; index < response.length; index++) {
            response[index].type = 'folder';
            response[index].contractId = folderIds;
        }

        let items = cloneDeep(response);        
        // Separate the items by folders and files
        const folders = items.filter(item => item.type === 'folder');

        // Sort the folders and files alphabetically by filename
        folders.sort((a, b) => a.nombre.localeCompare(b.nombre));
        // Figure out the path and attach it to the response
        // Prepare the empty paths array
        const pathItems = cloneDeep(response);
        const path = [];

        // Prepare the current folder
        let currentFolder = pathItems;

        // Start traversing and storing the folders as a path array
        // until we hit null on the folder id
        while ( currentFolder?.contractId )
        {
            currentFolder = pathItems.find(item => item.contractId === currentFolder.folderId);
            if ( currentFolder )
            {
                path.unshift(currentFolder);
            }
        }
        const data = 
            {
                folderIds,
                folders,
                path
            }
            this._itemsC.next(data);
                
            })
        ); 
        

    
    }

  
}
