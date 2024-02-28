import { Route } from '@angular/router';
import { ContractListComponent } from './contract-list.component';
import { ContractResolver } from './contract.resolvers';
// import { UploadDataResolver } from 'app/modules/admin/dashboards/project/upload-data.resolvers';
//

export const uploadDataRoutes: Route[] = [
    {
        path     : '',
        component: ContractListComponent,
        resolve  : {
            contract  : ContractResolver
        }
    }
];
