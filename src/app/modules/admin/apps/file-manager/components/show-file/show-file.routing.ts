import { Route } from '@angular/router';
import { DetailFileManagerItemFResolver } from '../details-file/detail-file.resolvers';
import { CanDeactivateFileManagerDetails } from '../../file-manager.guards';
import { FileManagerItemFResolver } from '../../list-file/file-list.resolvers';
import { ShowFileComponent } from './show-file.component';

export const ShowFileRoutes: Route[] = [
    {
        path     : '',
        component: ShowFileComponent,
        resolve      : {
            item: DetailFileManagerItemFResolver
        }
    }

];
