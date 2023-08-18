import { Route } from '@angular/router';
import { NominaComponent } from 'app/modules/admin/dashboards/nomina/nomina.component';
import { CollectionAccountsListComponent } from './components/collection-accounts-list/collection-accounts-list.component';
import { CollectionAccountsItemFResolver } from './components/collection-accounts-list/collection-accounts-list.resolvers';
import { ContractorListPayrollComponent } from './components/contractor-list-payroll/contractor-list-payroll.component';


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
        path: 'lista-contratistas/:contractId/:contractname',
        component: ContractorListPayrollComponent,
    },
];
