import { Route } from '@angular/router';
import { CanDeactivateFileManagerDetails } from 'app/modules/admin/apps/file-manager/file-manager.guards';
import { FileManagerComponent } from 'app/modules/admin/apps/file-manager/file-manager.component';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { FileManagerDetailsComponent } from 'app/modules/admin/apps/file-manager/details/details.component';
import { FileManagerFolderResolver, FileManagerItemResolver, FileManagerItemsResolver } from 'app/modules/admin/apps/file-manager/file-manager.resolvers';
import { ShowFileComponent } from './show-file.component';

export const ShowFileRoutes: Route[] = [
    {
        path     : '',
        component: ShowFileComponent
    }

];
