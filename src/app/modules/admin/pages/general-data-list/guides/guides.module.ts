import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { GuidesComponent } from './guides.component';
import { IntroductionComponent } from './getting-started/introduction/introduction';
import { PrerequisitesComponent } from './getting-started/prerequisites/prerequisites';
import { ServingComponent } from './getting-started/serving/serving';
import { InstallationComponent } from './getting-started/installation/installation';
import { DirectoryStructureComponent } from './development/directory-structure/directory-structure';
import { ComponentStructureComponent } from './development/component-structure/component-structure';
import { StarterKitComponent } from './development/starter-kit/starter-kit';
import { DeploymentComponent } from './development/deployment/deployment';
import { UpdatingComponent } from './development/updating/updating';
import { guidesRoutes } from './guides.routing';


@NgModule({
    declarations: [
        GuidesComponent,
        IntroductionComponent,
        PrerequisitesComponent,
        InstallationComponent,
        ServingComponent,
        DirectoryStructureComponent,
        ComponentStructureComponent,
        StarterKitComponent,
        DeploymentComponent,
        UpdatingComponent,
    ],
    imports     : [
        RouterModule.forChild(guidesRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTreeModule,
        FuseHighlightModule,
        FuseAlertModule,
        FuseNavigationModule,
        FuseScrollResetModule,
        SharedModule
    ]
})
export class GuidesModule
{
}
