import { Route } from '@angular/router';
import { ContractListComponent } from './contracts-list.component';
// import { UploadDataResolver } from 'app/modules/admin/dashboards/project/upload-data.resolvers';
// 

export const uploadDataRoutes: Route[] = [
    {
        path     : '',
        component: ContractListComponent,
        // resolve  : {
        //     data: UploadDataResolver
        // }
    }
];
