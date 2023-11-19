import { Route } from '@angular/router';
import { HistoryContractorComponent } from './history-contractor.component';
import { HiringDataListComponent } from './components/hiring-data-list/hiring-data-list';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { ServingComponent } from './components/serving/serving';


export const historyContractorRoutes: Route[] = [
    {
        path     : ':contractorId',
        component: HistoryContractorComponent,
        children : [
            {
                path      : '',
                pathMatch : 'full',
                redirectTo: 'opcion'
            },
            {
                path    : 'opcion',
                children: [
                    {
                        path      : '',
                        pathMatch : 'full',
                        redirectTo: 'contratos'
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
