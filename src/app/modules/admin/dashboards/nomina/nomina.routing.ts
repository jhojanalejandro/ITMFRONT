import { Route } from '@angular/router';
import { NominaComponent } from 'app/modules/admin/dashboards/nomina/nomina.component';
import { CollectionAccountsListComponent } from './components/collection-accounts-list/collection-accounts-list.component';
import { CollectionAccountsItemFResolver } from './components/collection-accounts-list/collection-accounts-list.resolvers';
import { PayrollContractualListComponent } from './components/payroll-contractor-list/payroll-contractor-list.component';
import { DetailFilePaymentComponent } from './components/collection-accounts-list/details-file-payment/detail-file-payment.component';
import { DetailFileContractResolver } from '../../apps/file-manager/components/details-file-contract/detail-file-contract.resolvers';


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
                children : [
            {
                path         : 'details/file-payroll/:id',
                component    : DetailFilePaymentComponent,
                resolve      : {
                    item: DetailFileContractResolver
                },
                // canDeactivate: [CanDeactivateFileManagerDetails]
            }
        ],
        resolve: {
            data: CollectionAccountsItemFResolver
        }
    },
    {
        path: 'lista-contratistas/:contractId/:contractname',
        component: PayrollContractualListComponent
    },
];
