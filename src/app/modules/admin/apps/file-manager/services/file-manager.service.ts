import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { DataFile, Item } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash-es';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable({
    providedIn: 'root'
})
export class FileManagerService {
    // Private

    private _itemDF: BehaviorSubject<DataFile | null> = new BehaviorSubject(null);

    private _items: BehaviorSubject<Item | null> = new BehaviorSubject(null);

    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for items
     */
    get items$(): Observable<Item> {
        return this._items.asObservable();
    }


    get itemDF$(): Observable<DataFile> {
        return this._itemDF.asObservable();
    }



    getItemByIdDetailFolder(id: any | null = null): Observable<DataFile> {

        //const datos: any={IdContractor: arr[0], IdFolder: arr[1]}
        let urlEndPoint = this.apiUrl + environment.GetByIdContractFolderEndpoint;
        return this._httpClient.get<any>(urlEndPoint + id).pipe(
            tap((items) => {
                // Update the item
                const item = items.folder = items || null;
                this._itemDF.next(item);

            }),
            switchMap((item) => {

                if (!item) {
                    return throwError('No se pudo encontrar item con id' + id + '!');
                }

                return of(item);
            })
        );
    }


    getAllFolder(): Observable<Item> {
        let urlEndPoint = this.apiUrl + environment.GetAllContractFolderEndpoint;
        return this._httpClient.get<Item>(urlEndPoint).pipe(
            tap((response: any) => {
                
                let items = cloneDeep(response);

                const folders = items.folders;

                // Sort the folders and files alphabetically by filename
                folders.sort((a, b) => a.companyName.localeCompare(b.companyName));
                // Figure out the path and attach it to the response
                // Prepare the empty paths array
                const pathItems = cloneDeep(response);
                const path = [];

                // Prepare the current folder
                let currentFolder = null;

                // // Get the current folder and add it as the first entry
                // if (folderId) {
                //     currentFolder = pathItems.find(item => item.id === folderId);
                //     path.push(currentFolder);
                // }

                // Start traversing and storing the folders as a path array
                // until we hit null on the folder id
                while (currentFolder?.id) {
                    currentFolder = pathItems.find(item => item.id === currentFolder.id);
                    if (currentFolder) {
                        path.unshift(currentFolder);
                    }
                }
                const data =
                {
                    folders,
                    path
                }
                this._items.next(data);

            })
        );

    }


    addFolderContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addFolderFileContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }


    UpdateContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.UpdateContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

}
