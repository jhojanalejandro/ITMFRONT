import { Route } from '@angular/router';
import { ContractorListComponent } from './contractor-list.component';
import { ContractorsDataResolver } from './contractor-list.resolvers';

export const contractorListRoutes: Route[] = [
    {
        path     : '',
        component: ContractorListComponent,
        resolve  : {
            data: ContractorsDataResolver
        }
    }
];
