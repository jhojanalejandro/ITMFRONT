import { Route } from '@angular/router';
import { GuidesComponent } from 'app/modules/admin/docs/guides/guides.component';
import { PrerequisitesComponent } from 'app/modules/admin/docs/guides/getting-started/prerequisites/prerequisites';
import { ServingComponent } from 'app/modules/admin/docs/guides/getting-started/serving/serving';
import { ContractsComponent } from './getting-started/contracts/contracts.component';
import { FileManagerFolderResolver } from '../../apps/file-manager/file-manager.resolvers';


export const guidesRoutes: Route[] = [
    {
        path     : '',
        component: GuidesComponent,
        children : [
            {
                path      : '',
                pathMatch : 'full',
                redirectTo: 'getting-started'
            },
            {
                path    : 'getting-started',
                children: [
                    {
                        path      : '',
                        pathMatch : 'full',
                        redirectTo: 'contratos'
                    },
                    {
                        path     : 'contratos',
                        component: ContractsComponent,
                        resolve  : {
                            item: FileManagerFolderResolver
                        },
                    },
                    {
                        path     : 'prerequisites',
                        component: PrerequisitesComponent
                    },
                    {
                        path     : 'serving',
                        component: ServingComponent
                    }
                ]
            }
        ]
    }
];
