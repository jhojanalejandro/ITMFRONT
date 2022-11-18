import { Route } from '@angular/router';
import { ContractorListComponent } from './contractor-list.component';
// import { UploadDataResolver } from 'app/modules/admin/dashboards/project/upload-data.resolvers';
// 

export const contractorListRoutes: Route[] = [
    {
        path     : '',
        component: ContractorListComponent,
        // resolve  : {
        //     data: UploadDataResolver
        // }
    }
];
