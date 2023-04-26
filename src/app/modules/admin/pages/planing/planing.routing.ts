import { Route } from '@angular/router';
import { EconomicChartComponent } from './economic-chart/economic-chart.component';
import { ContrtactsComponent } from './contracts/contracts.component';
import { ContractsPlaningResolver } from './economic-chart/economic-chart.resolvers';
import { EconomicChartListComponent } from './economic-chart/list/economic-chart-list.component';
import { AddComponentsComponent } from './componentes/components.component';

export const PlaningRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'cuadroEconomico'
    },
    {
        path     : 'cuadroEconomico/:tipo',
        component: EconomicChartComponent,
        children : [
            {
                path     : '',
                component: ContrtactsComponent,
                resolve  : {
                    products  : ContractsPlaningResolver
                },
                runGuardsAndResolvers: 'always'
            },

 
        ]
    },
    {
        path      : 'contratos/:tipo',
        component: ContrtactsComponent,
        resolve  : {
            products  : ContractsPlaningResolver
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path      : 'Componentes/:id/:projectName',
        component: AddComponentsComponent
    },
];
