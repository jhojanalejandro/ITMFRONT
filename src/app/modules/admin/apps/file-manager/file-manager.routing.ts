import { Route } from '@angular/router';
import { CanDeactivateFileManagerDetails } from 'app/modules/admin/apps/file-manager/file-manager.guards';
import { FileManagerComponent } from 'app/modules/admin/apps/file-manager/file-manager.component';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { FileManagerDetailsComponent } from 'app/modules/admin/apps/file-manager/details/details.component';
import { FileManagerFolderResolver, FileManagerItemResolver, FileManagerItemsResolver } from 'app/modules/admin/apps/file-manager/file-manager.resolvers';
import { ListFolderContractorComponent } from './list-folder-contractor/list-folder-contractor.component';
import { ListFolderFileContractorComponent } from './list-folder-file-contractor/list-folder-file-contractor.component';
import { FileManagerFolderCResolver } from './list-folder-contractor/list-folder.resolvers';
import { FileListComponent } from './list-file/file-list.component';

export const fileManagerRoutes: Route[] = [
    {
        path     : '',
        component: FileManagerComponent,
        children : [
            {
                path     : 'folders/:folderId',
                component: FileManagerListComponent,
                resolve  : {
                    item: FileManagerFolderResolver
                },
                children : [
                    {
                        path         : 'details/:id',
                        component    : FileManagerDetailsComponent,
                        resolve      : {
                            item: FileManagerItemResolver
                        },
                        canDeactivate: [CanDeactivateFileManagerDetails]
                    }
                ]
            },
            {
                path     : '',
                component: FileManagerListComponent,
                resolve  : {
                    items: FileManagerItemsResolver
                },
                children : [
                    {
                        path         : 'details/:id',
                        component    : FileManagerDetailsComponent,
                        resolve      : {
                            item: FileManagerItemResolver
                        },
                        canDeactivate: [CanDeactivateFileManagerDetails]
                    }
                ]
            },
            {
                path     : 'folders/file/contractor/:contractorId',
                component: ListFolderFileContractorComponent,

            },
            {
                path     : 'folders/contractor/:folderId',
                component: ListFolderContractorComponent,
                resolve  : {
                    item: FileManagerFolderCResolver
                },
            },
            {
                path     : 'file/contractor/:fileId',
                component: FileListComponent,
                resolve  : {
                    item: FileManagerFolderCResolver
                },
            }
        ]
    }
];
