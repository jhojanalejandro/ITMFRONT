import { Route } from '@angular/router';
import { HomeContractorComponent } from './home-contractor.component';

export const contractorRoutes: Route[] = [
    {
        path     : 'contratista',
        component: HomeContractorComponent,
        // resolve  : {
        //     data: ViabilityResolver
        // }
    }
];
