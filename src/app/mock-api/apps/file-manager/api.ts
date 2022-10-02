import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api/mock-api.service';
import { items, items as itemsData } from 'app/mock-api/apps/file-manager/data';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileManagerMockApi
{
    private _items: any[] = items;
    apiUrl: any = environment.apiURL;
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _httpClient: HttpClient)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        this._fuseMockApiService
        .onGet('api/apps/file-manager/search')
        .reply(({request}) => {
            // Get the search query
            const query = request.params.get('query');

            // Clone the contacts
            let items = cloneDeep(this._items);

            // If the query exists...
            if ( query )
            {
                // Filter the contacts
                items = items.filter(item => item.name && item.name.toLowerCase().includes(query.toLowerCase()));
            }
+
            // Sort the contacts by the name field by default
            items.sort((a, b) => a.name.localeCompare(b.name));

            // Return the response
            return [200, items];
        });
        // -----------------------------------------------------------------------------------------------------
        // @ Items - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/file-manager')
            .reply(({request}) => {
    
                                    // Clone the items
                let items = cloneDeep(this._items);

                // See if a folder id exist
                const folderId = request.params.get('folderId') ?? null;

                // Filter the items by folder id. If folder id is null,
                // that means we want to root items which have folder id
                // of null
                items = items.filter(item => item.folderId === folderId);
                debugger
                // Separate the items by folders and files
                const folders = items.filter(item => item.type === 'folder');
                const files = items.filter(item => item.type !== 'folder');
                debugger
                // Sort the folders and files alphabetically by filename
                folders.sort((a, b) => a.name.localeCompare(b.name));
                files.sort((a, b) => a.name.localeCompare(b.name));
                // Figure out the path and attach it to the response
                // Prepare the empty paths array
                const pathItems = cloneDeep(this._items);
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

                return [
                    200,
                    {
                        folders,
                        files,
                        path
                    }
                ];                          
  
            });
    }


}
