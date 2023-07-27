import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { maintainersListComponent } from './maintainers-list.component';
import { RubroListComponent } from './components/rubro-list/rubro-list.component';
import { CpcListComponent } from './components/cpc-list/cpc-list.component';
import { maintainersListRoutes } from './maintainers-list.routing';
import { BanksListComponent } from './components/banks-list/banks-list.component';

@NgModule({
    declarations: [
        maintainersListComponent,
        RubroListComponent,
        CpcListComponent,
        BanksListComponent
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
