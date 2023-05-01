import { Route } from '@angular/router';
import { GeneralListContractorsComponent } from './general-list-contractor/general-list-contractors.component';
import { GeneralListContractComponent } from './general-list-contract/general-list-contract.component';
import { HistoryContractorResolver, HistoryContractsResolver } from './general.resolvers';

export const GeneralListRoutes: Route[] = [
    {
        path      : 'lista-general-contratistas',
        component: GeneralListContractorsComponent,
        resolve  : {
            contract  : HistoryContractorResolver
        },

    },
    {
        path      : 'lista-general-contratos',
        component: GeneralListContractComponent,
        resolve  : {
            contract  : HistoryContractsResolver
        },
    },

];
