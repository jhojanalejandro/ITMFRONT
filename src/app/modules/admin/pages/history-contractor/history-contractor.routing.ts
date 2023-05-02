import { Route } from '@angular/router';
import { HistoryContractorComponent } from './history-contractor.component';
import { HiringDataListComponent } from './components/hiring-data-list/hiring-data-list';
import { PaymentListComponent } from './components/payment-list/payment-list';
import { ContractsListComponent } from './components/contracts-list/contracts-list';
import { ServingComponent } from './components/serving/serving';


export const historyContractorRoutes: Route[] = [
    {
        path     : '',
        component: HistoryContractorComponent,
        children : [
            {
                path      : '',
                pathMatch : 'full',
                redirectTo: 'options'
            },
            {
                path    : 'options',
                children: [
                    {
                        path      : '',
                        pathMatch : 'full',
                        redirectTo: 'contratos'
                    },
                    {
                        path     : 'contratos/:contractorId',
                        component: ContractsListComponent
                    },
                    {
                        path     : 'pagos/:contractorId',
                        component: PaymentListComponent
                    },
                    {
                        path     : 'datos-contratacion/:contractorId',
                        component: HiringDataListComponent
                    },
                    {
                        path     : 'serving/:contractorId',
                        component: ServingComponent
                    }
                ]
            }
        ]
    }
];
