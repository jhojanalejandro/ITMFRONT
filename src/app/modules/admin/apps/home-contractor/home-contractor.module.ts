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
import { HomeContractorComponent } from './home-contractor.component';
import { UploadDataContractoDataComponent } from './data-viability/upload-data-contractor.component';
import { contractorRoutes } from './home-contractor.routing';


@NgModule({
    declarations: [
        HomeContractorComponent,
        UploadDataContractoDataComponent
    ],
    imports     : [
        RouterModule.forChild(contractorRoutes),
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
export class HomeContractorModule
{
}
