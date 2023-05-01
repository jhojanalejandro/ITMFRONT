import { Route } from '@angular/router';
import { GuidesComponent } from './guides.component';
import { IntroductionComponent } from './getting-started/introduction/introduction';
import { PrerequisitesComponent } from './getting-started/prerequisites/prerequisites';
import { InstallationComponent } from './getting-started/installation/installation';
import { ServingComponent } from './getting-started/serving/serving';
import { DirectoryStructureComponent } from './development/directory-structure/directory-structure';
import { ComponentStructureComponent } from './development/component-structure/component-structure';
import { DeploymentComponent } from './development/deployment/deployment';
import { UpdatingComponent } from './development/updating/updating';
import { StarterKitComponent } from './development/starter-kit/starter-kit';

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
                        redirectTo: 'introduction'
                    },
                    {
                        path     : 'introduction',
                        component: IntroductionComponent
                    },
                    {
                        path     : 'prerequisites',
                        component: PrerequisitesComponent
                    },
                    {
                        path     : 'installation',
                        component: InstallationComponent
                    },
                    {
                        path     : 'serving',
                        component: ServingComponent
                    }
                ]
            },
            {
                path    : 'development',
                children: [
                    {
                        path      : '',
                        pathMatch : 'full',
                        redirectTo: 'structure'
                    },
                    {
                        path     : 'directory-structure',
                        component: DirectoryStructureComponent
                    },
                    {
                        path     : 'component-structure',
                        component: ComponentStructureComponent
                    },
                    {
                        path     : 'starter-kit',
                        component: StarterKitComponent
                    },
                    {
                        path     : 'deployment',
                        component: DeploymentComponent
                    },
                    {
                        path     : 'updating',
                        component: UpdatingComponent
                    }
                ]
            },
        ]
    }
];
