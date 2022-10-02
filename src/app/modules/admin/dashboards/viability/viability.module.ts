import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { viabilityRoutes } from 'app/modules/admin/dashboards/viability/viability.routing';
import { ViabilityDataComponent } from './data-viability/viability-data.component';
import { ViabilityComponent } from './viability.component';

@NgModule({
    declarations: [
        ViabilityComponent,
        ViabilityDataComponent
    ],
    imports     : [
        RouterModule.forChild(viabilityRoutes),
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        NgApexchartsModule,
        SharedModule
    ]
})
export class ViabilityModule
{
}