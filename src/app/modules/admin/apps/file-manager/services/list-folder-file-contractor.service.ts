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
export class ListFolderFileContractorService
{
    // Private

    private _itemsFC: BehaviorSubject<ItemsC | null> = new BehaviorSubject(null);
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

    get itemsFC$(): Observable<ItemsC>
    {
        return this._itemsFC.asObservable();
    }


    get itemD$(): Observable<Item>
    {
        return this._itemD.asObservable();
    }

    getAllFolderFileContractor(contractId: string | null = null,contractorId: string | null = null): Observable<Item[]>
    {
        const params = new HttpParams()
        .set('contractorId', contractorId)
        .set('contractId', contractId);
        let urlEndPoint = this.apiUrl+ environment.GetFolderFileContractorEndpoint;
        return  this._httpClient.get<Items>(urlEndPoint, {params: params}).pipe(
            tap((response: any) => {
        // Clone the items
        for (let index = 0; index < response.length; index++) {
            response[index].type = 'folder';
        }
        let items = cloneDeep(response);
        // See if a folder id exist
        let folderId;
        if(response.length > 0){
            folderId = response[0].contractorId;
        }else{
            folderId = 0;
        }
        // Filter the items by folder id. If folder id is null,
        // that means we want to root items which have folder id
        // of null
        items = items.filter(item => item.contractorId === folderId);
        
        // Separate the items by folders and files
        const folders = items.filter(item => item.type === 'folder');
        // Sort the folders and files alphabetically by filename
        folders.sort((a, b) => a.folderName.localeCompare(b.folderName));
        // Figure out the path and attach it to the response
        // Prepare the empty paths array
        const pathItems = cloneDeep(response);
        const path = [];

        // Prepare the current folder
        let currentFolder = null;

        // Get the current folder and add it as the first entry
        if ( folderId )
        {
            currentFolder = pathItems.find(item => item.contractorId === folderId);
            path.push(currentFolder);
        }
        // Start traversing and storing the folders as a path array
        // until we hit null on the folder id
        while ( currentFolder?.folderId )
        {
            currentFolder = pathItems.find(item => item.contractorId === currentFolder.folderId);
            if ( currentFolder )
            {
                path.unshift(currentFolder);
            }
        }
        const data = 
            {
                folders,
                path
            }
            this._itemsFC.next(data);
                
            })
        ); 
        

    
    }

    getItemByIdDetailFolderContractor(id: any | null = null): Observable<Item>
    {    
        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl+ environment.GetByIdFolderFileContractorEndpoint;
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
    
    addFolderContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.addFolderFileContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    
    UpdateProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }
  
}
