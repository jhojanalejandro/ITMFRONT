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
export class FileManagerService
{
    // Private

    private _itemDF: BehaviorSubject<Item | null> = new BehaviorSubject(null);

    private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);

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
    get items$(): Observable<Items>
    {
        return this._items.asObservable();
    }
  

    get itemDF$(): Observable<Item>
    {
        return this._itemDF.asObservable();
    }



    getItemByIdDetailFolder(id: any | null = null): Observable<Item>
    {
        
        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl+ environment.GetByIdProjectFolderEndpoint;
        return this._httpClient.get<any>(urlEndPoint + id).pipe(
            tap((items) => {
                // Update the item
                const item = items.folder = items || null;
                this._itemDF.next(item);
                
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

  
    getAllFolder(folderIds: string | null = null): Observable<Item[]>
    {
        const params = new HttpParams()
        .set('inProgress', false )
        .set('tipoModulo', 'planeacion')
        let urlEndPoint = this.apiUrl+ environment.GetAllProjectFolderEndpoint;
        return  this._httpClient.get<Items>(urlEndPoint, {params: params}).pipe(
            tap((response: any) => {
        // this._items.next(response);
        // Clone the items
        for (let index = 0; index < response.length; index++) {
            response[index].folderId = null;
            response[index].type = 'folder';
            
        }
        let items = cloneDeep(response);

        // See if a folder id exist
        const folderId = folderIds ?? null;

        // Filter the items by folder id. If folder id is null,
        // that means we want to root items which have folder id
        // of null
        items = items.filter(item => item.folderId === folderId);

        // Separate the items by folders and files
        const folders = items.filter(item => item.type === 'folder');
        const files = items.filter(item => item.type !== 'folder');

        // Sort the folders and files alphabetically by filename
        folders.sort((a, b) => a.companyName.localeCompare(b.companyName));
        files.sort((a, b) => a.companyName.localeCompare(b.companyName));
        // Figure out the path and attach it to the response
        // Prepare the empty paths array
        const pathItems = cloneDeep(response);
        const path = [];

        // Prepare the current folder
        let currentFolder = null;

        // Get the current folder and add it as the first entry
        if ( folderId )
        {
            currentFolder = pathItems.find(item => item.id === folderId);
            path.push(currentFolder);
        }

        // Start traversing and storing the folders as a path array
        // until we hit null on the folder id
        while ( currentFolder?.folderId )
        {
            currentFolder = pathItems.find(item => item.id === currentFolder.folderId);
            if ( currentFolder )
            {
                path.unshift(currentFolder);
            }
        }
        const data = 
            {
                folders,
                files,
                path
            }
            this._items.next(data);
                
            })
        ); 

    
    }


    addFolderContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addFolderFileContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    
    UpdateProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }
  
}
