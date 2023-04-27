import { Route } from '@angular/router';
import { GeneralListContractorsComponent } from './general-list-contractor/general-list-contractors.component';

export const GeneralListRoutes: Route[] = [
    {
        path      : 'contratos/lista-general-contratistas',
        component: GeneralListContractorsComponent,
    },
    {
        path      : 'contratos/lista-general-contratos',
        component: GeneralListContractorsComponent,
    },
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'cuadroEconomico'
    // },
    // {
    //     path     : 'cuadroEconomico/:tipo',
    //     component: EconomicChartComponent,
    //     children : [
    //         {
    //             path     : '',
    //             component: ContrtactsComponent,
    //             resolve  : {
    //                 products  : ContractsPlaningResolver
    //             },
    //             runGuardsAndResolvers: 'always'
    //         },

 
    //     ]
    // },


];
