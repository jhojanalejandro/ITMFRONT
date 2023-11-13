import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { maintainersListComponent } from './maintainers-list.component';
import { RubroListComponent } from './components/rubro-list/rubro-list.component';
import { CpcListComponent } from './components/cpc-list/cpc-list.component';
import { maintainersListRoutes } from './maintainers-list.routing';
import { BanksListComponent } from './components/banks-list/banks-list.component';
import { MaintainerRegisterComponent } from './components/maintainer-register/maintainer-register.component';

@NgModule({
    declarations: [
        maintainersListComponent,
        RubroListComponent,
        CpcListComponent,
        BanksListComponent,
        MaintainerRegisterComponent
    ],
    imports     : [
        RouterModule.forChild(maintainersListRoutes),
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        
    ]
})
export class MaintainersListModule
{
}
