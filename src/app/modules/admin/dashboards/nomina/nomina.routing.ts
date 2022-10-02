import { Route } from '@angular/router';
import { NominaComponent } from 'app/modules/admin/dashboards/nomina/nomina.component';
import { NominaResolver } from 'app/modules/admin/dashboards/nomina/nomina.resolvers';

export const nominaRoutes: Route[] = [
    {
        path     : '',
        component: NominaComponent,
        // resolve  : {
        //     data: NominaResolver
        // }
    }
];
