import { Route } from '@angular/router';
import { EconomicChartComponent } from './economic-chart/economic-chart.component';
import { ContrtactsComponent } from './contracts/contracts.component';
import { InventoryProductsResolver } from './economic-chart/economic-chart.resolvers';
import { EconomicChartListComponent } from './economic-chart/list/economic-chart-list.component';

export const PlaningRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'cuadroEconomico'
    },
    {
        path     : 'cuadroEconomico',
        component: EconomicChartComponent,
        children : [
            {
                path     : '',
                component: EconomicChartListComponent,
                resolve  : {
                    products  : InventoryProductsResolver
                }
            },
 
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    },
    {
        path      : 'contratos',
        component: ContrtactsComponent
    },
];
