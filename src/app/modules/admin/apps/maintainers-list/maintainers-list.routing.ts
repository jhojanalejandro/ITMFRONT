import { Route } from '@angular/router';
import { maintainersListComponent } from './maintainers-list.component';
// import { UploadDataResolver } from 'app/modules/admin/dashboards/project/upload-data.resolvers';
// 

export const maintainersListRoutes: Route[] = [
    {
        path     : '',
        component: maintainersListComponent,
        // resolve  : {
        //     data: UploadDataResolver
        // }
    }
];
