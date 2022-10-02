import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Item, Items } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash-es';

@Injectable({
    providedIn: 'root'
})
export class FileManagerService
{
    // Private
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);
    private _itemsGet: BehaviorSubject<Items | null> = new BehaviorSubject(null);
    folderIdget: number;
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

    /**
     * Getter for item
     */
    get item$(): Observable<Item>
    {
        return this._item.asObservable();
    }

    /**
     * Get items
     */
    getItems(folderId: string | null = null): Observable<Item[]>
    {
        
        return this._httpClient.get<Items>('api/apps/file-manager', {params: {folderId}}).pipe(
            tap((response: any) => {     
                debugger         
                this._items.next(response);
            })
        );
    }

    /**
     * Get item by id
     */
    getItemById(id: string): Observable<Item>
    {
        return this._items.pipe(
            take(1),
            map((items) => {

                // Find within the folders and files
                const item = [...items.folders, ...items.files].find(value => value.id === id) || null;

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
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
        if(folderIds == null){
            let urlEndPoint = this.apiUrl+ environment.GetAllProjectFolderEndpoint;
            return  this._httpClient.get<Items>(urlEndPoint).pipe(
                tap((response: any) => {
            // this._items.next(response);
            // Clone the items
            for (let index = 0; index < response.length; index++) {
                response[index].folderId = null;
                response[index].type = 'folder';
                
            }
            debugger
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
        }else{
            this.folderIdget = Number(folderIds);
            let urlEndPoint = this.apiUrl+ environment.GetByIdFolderContractorEndpoint;
            return  this._httpClient.get<Items>(urlEndPoint+this.folderIdget).pipe(
                tap((response: any) => {
            // this._items.next(response);
            // Clone the items
            for (let index = 0; index < response.length; index++) {
                response[index].type = 'folder';
                response[index].companyName = response[index].documentodeidentificacion
                response[index].projectName = response[index].nombre + response[index].apellido 
            }
            let items = cloneDeep(response);
            debugger
            // See if a folder id exist
            const folderId = response[0].id;
    
            // Filter the items by folder id. If folder id is null,
            // that means we want to root items which have folder id
            // of null
            items = items.filter(item => item.id === folderId);
            
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

    
    }

    getAllFolders(): Observable<any>
    {
        let urlEndPoint = this.apiUrl + environment.GetAllProjectFolderEndpoint;
        return  this._httpClient.get(urlEndPoint).pipe(
        tap((response: any) => {
                
        for (let index = 0; index < response.length; index++) {
            response[index].folderId = response[index].id;
            response[index].type = 'folder';
        }
        
        this._items.next(response);

    })
    );
    }
}
