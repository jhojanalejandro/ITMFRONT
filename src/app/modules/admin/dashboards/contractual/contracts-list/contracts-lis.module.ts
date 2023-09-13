import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { ContractListComponent } from 'app/modules/admin/dashboards/contractual/contracts-list/contracts-list.component';
import { uploadDataRoutes } from 'app/modules/admin/dashboards/contractual/contracts-list/contracts-list.routing';
import { UploadFileComponent } from '../upload-file/upload-file.component';

@NgModule({
    declarations: [
        ContractListComponent,
        UploadFileComponent
    ],
    imports     : [
        RouterModule.forChild(uploadDataRoutes),
        NgApexchartsModule,
        TranslocoModule,
        SharedModule
    ]
})
export class ContractListModule
{
}
