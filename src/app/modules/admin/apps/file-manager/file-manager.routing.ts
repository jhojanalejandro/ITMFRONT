import { Route } from '@angular/router';
import { CanDeactivateFileManagerDetails } from 'app/modules/admin/apps/file-manager/file-manager.guards';
import { FileManagerComponent } from 'app/modules/admin/apps/file-manager/file-manager.component';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { FileManagerDetailsComponent } from 'app/modules/admin/apps/file-manager/components/details/details.component';
import { FileManagerFolderResolver, FileManagerItemResolver, FileManagerItemsResolver } from 'app/modules/admin/apps/file-manager/file-manager.resolvers';
import { ListFolderContractorComponent } from './list-folder-contractor/list-folder-contractor.component';
import { ListFolderFileContractorComponent } from './list-folder-file-contractor/list-folder-file-contractor.component';
import { FileManagerFolderCResolver, FileManagerItemResolverFile } from './list-folder-contractor/list-folder.resolvers';
import { FileListComponent } from './list-file/file-list.component';
import { FileManagerFolderCFResolver } from './list-folder-file-contractor/list-folder-file.resolvers';
import { FileManagerItemFResolver } from './list-file/file-list.resolvers';
import { DetailFileComponent } from './components/details-file/detail-file.component';
import { DetailFileManagerItemFResolver } from './components/details-file/detail-file.resolvers';
import { DetailsFolderFileContractorComponent } from './components/details-folder-contractor/details-folder-contractor.component';
import { DetailFolderContractorItemFResolver } from './components/details-folder-contractor/detail-folder-contractor.resolvers';
import { DetailFileContractComponent } from './components/details-file-contract/detail-file-contract.component';

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
                path     : 'folders/file/:contractId/:contractorId',
                component: ListFolderFileContractorComponent,
                resolve  : {
                    item: FileManagerFolderCFResolver
                },
                children : [
                    {
                        path         : 'folder/details/:id',
                        component    : DetailsFolderFileContractorComponent,
                        resolve      : {
                            item: DetailFolderContractorItemFResolver
                        },
                        canDeactivate: [CanDeactivateFileManagerDetails]
                    }
                ]
            },
            {
                path     : 'folders/contractors/:folderId',
                component: ListFolderContractorComponent,
                resolve  : {
                    item: FileManagerFolderCResolver
                    , FileManagerItemResolverFile
                },
                children : [
                    {
                        path         : 'details/file/:id',
                        component    : DetailFileContractComponent,
                        resolve      : {
                            item: DetailFileManagerItemFResolver
                        },
                        canDeactivate: [CanDeactivateFileManagerDetails]
                    }
                ]
            },
            {
                path     : 'file/contractor/:contractId/:contractorId/:folderId',
                component: FileListComponent,
                resolve  : {
                    item: FileManagerItemFResolver
                },
                children : [
                    {
                        path         : 'details/file/:id',
                        component    : DetailFileComponent,
                        resolve      : {
                            item: DetailFileManagerItemFResolver
                        },
                        canDeactivate: [CanDeactivateFileManagerDetails]
                    }
                ]
            }
        ]
    }
];
