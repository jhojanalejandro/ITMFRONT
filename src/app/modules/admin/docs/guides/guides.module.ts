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
import { GuidesComponent } from 'app/modules/admin/docs/guides/guides.component';
import { PrerequisitesComponent } from 'app/modules/admin/docs/guides/getting-started/prerequisites/prerequisites';
import { ServingComponent } from 'app/modules/admin/docs/guides/getting-started/serving/serving';

import { guidesRoutes } from 'app/modules/admin/docs/guides/guides.routing';
import { ContractsComponent } from './getting-started/contracts/contracts.component';

@NgModule({
    declarations: [
        GuidesComponent,
        ContractsComponent,
        PrerequisitesComponent,
        ServingComponent,
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
