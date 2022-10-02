import { Route } from '@angular/router';
import { ViabilityComponent } from 'app/modules/admin/dashboards/viability/viability.component';
import { ViabilityResolver } from 'app/modules/admin/dashboards/viability/viability.resolvers';

export const viabilityRoutes: Route[] = [
    {
        path     : '',
        component: ViabilityComponent,
        // resolve  : {
        //     data: ViabilityResolver
        // }
    }
];
