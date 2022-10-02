import { Route } from '@angular/router';
import { UploadDataComponent } from './upload-data.component';
// import { UploadDataResolver } from 'app/modules/admin/dashboards/project/upload-data.resolvers';
// 

export const uploadDataRoutes: Route[] = [
    {
        path     : '',
        component: UploadDataComponent,
        // resolve  : {
        //     data: UploadDataResolver
        // }
    }
];
