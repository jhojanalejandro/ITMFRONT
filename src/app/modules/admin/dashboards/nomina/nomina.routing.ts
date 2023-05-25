import { Route } from '@angular/router';
import { NominaComponent } from 'app/modules/admin/dashboards/nomina/nomina.component';
import { CollectionAccountsListComponent } from './collection-accounts-list/collection-accounts-list.component';
import { CollectionAccountsItemFResolver } from './collection-accounts-list/collection-accounts-list.resolvers';
import { DetailFilePaymentComponent } from './collection-accounts-list/details-file-payment/detail-file-payment.component';
import { ContractorListComponent } from './contractor-list/contractor-list.component';
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
        },
        children: [
            {
                path: 'details/file/:id',
                component: DetailFilePaymentComponent
            }
        ]
    },
    {
        path: 'lista/contratistas/:id',
        component: ContractorListComponent,
    },
    {
        path: 'payment/Contractor/:contractId/:ContractorId',
        component: ContractorPaymentListComponent,
    },
];
