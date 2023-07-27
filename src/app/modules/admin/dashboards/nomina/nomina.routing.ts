import { Route } from '@angular/router';
import { NominaComponent } from 'app/modules/admin/dashboards/nomina/nomina.component';
import { CollectionAccountsListComponent } from './collection-accounts-list/collection-accounts-list.component';
import { CollectionAccountsItemFResolver } from './collection-accounts-list/collection-accounts-list.resolvers';
import { ContractorPaymentListComponent } from './contractor-payment-list/contractor-payment-list.component';

export const nominaRoutes: Route[] = [
    {
        path: '',
        component: NominaComponent,
        // resolve  : {
        //     data: NominaResolver
        // }
    },
    {
        path: ':type/:contractId',
        component: CollectionAccountsListComponent,
        resolve: {
            data: CollectionAccountsItemFResolver
        }
    },
    {
        path: 'payment-contractor/:contractId/:ContractorId',
        component: ContractorPaymentListComponent,
    },
];
