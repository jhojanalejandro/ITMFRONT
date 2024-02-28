import { Route } from '@angular/router';
import { ContractorListComponent } from './contractor-list.component';
import { ContractorResolver } from './contractor.resolvers';

export const contractorListRoutes: Route[] = [
    {
        path     : '',
        component: ContractorListComponent,
        resolve  : {
            contract  : ContractorResolver
        },
    }
];
