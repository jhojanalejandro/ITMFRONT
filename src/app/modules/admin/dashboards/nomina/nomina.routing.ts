import { Route } from '@angular/router';
import { NominaComponent } from 'app/modules/admin/dashboards/nomina/nomina.component';
import { CollectionAccountsListComponent } from './collection-accounts-list/collection-accounts-list.component';
import { CollectionAccountsItemFResolver } from './collection-accounts-list/collection-accounts-list.resolvers';

export const nominaRoutes: Route[] = [
    {
        path     : '',
        component: NominaComponent,
        // resolve  : {
        //     data: NominaResolver
        // }
    },
    {
        path     : 'cuentasDeCobro/:contractId',
        component: CollectionAccountsListComponent,
        resolve  : {
            data: CollectionAccountsItemFResolver
        }
    }
];
