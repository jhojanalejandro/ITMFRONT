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
import { HistoryContractorComponent } from './history-contractor.component';
import { historyContractorRoutes } from './history-contractor.routing';
import { ContractsListComponent } from './components/contracts-list/contracts-list';
import { PaymentListComponent } from './components/payment-list/payment-list';
import { HiringDataListComponent } from './components/hiring-data-list/hiring-data-list';
import { ServingComponent } from './components/serving/serving';


@NgModule({
    declarations: [
        HistoryContractorComponent,
        ContractsListComponent,
        PaymentListComponent,
        HiringDataListComponent,
        ServingComponent,
    ],
    imports     : [
        RouterModule.forChild(historyContractorRoutes),
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
export class HistoryContractorModule
{
}
