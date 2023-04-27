import { Route } from '@angular/router';
import { ContrtactsComponent } from './contracts/contracts.component';
import { AddComponentsComponent } from './componentes/components.component';
import { PlaningComponent } from './planing.component';
import { ContractsPlaningResolver } from './planing.resolvers';

export const PlaningRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'cuadroEconomico'
    },
    {
        path     : 'cuadroEconomico/:tipo',
        component: PlaningComponent,
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
