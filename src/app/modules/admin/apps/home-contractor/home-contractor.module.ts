import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { HomeContractorComponent } from './home-contractor.component';
import { contractorRoutes } from './home-contractor.routing';
import { FuseCardModule } from '@fuse/components/card';
import { UploadFileContractorComponent } from './upload-file-contractor/upload-file.component';


@NgModule({
    declarations: [
        HomeContractorComponent,
        UploadFileContractorComponent

    ],
    imports     : [
        RouterModule.forChild(contractorRoutes),
        MatDividerModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        FuseCardModule,
        NgApexchartsModule,
        SharedModule
    ]
})
export class HomeContractorModule
{
}
