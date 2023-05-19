import { Route } from '@angular/router';
import { ShowFileComponent } from './show-file.component';

export const ShowFileRoutes: Route[] = [
    {
        path     : '',
        component: ShowFileComponent,
        // resolve      : {
        //     item: DetailFileManagerItemFResolver
        // }
    }

];
