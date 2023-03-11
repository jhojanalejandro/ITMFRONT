import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { HomeContractorComponent } from './home-contractor.component';
import { contractorRoutes } from './home-contractor.routing';
import { FuseCardModule } from '@fuse/components/card';
import { UploadFileContractorComponent } from './components/upload-file-contractor/upload-file.component';
import { PdfPaymentComponent } from './components/pdf-payment/pdf-payment.component';
import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../dashboards/nomina/collection-accounts-list/collection-accounts-list.component';


@NgModule({
    declarations: [
        HomeContractorComponent,
        UploadFileContractorComponent,
        PdfPaymentComponent

    ],
    imports: [
        RouterModule.forChild(contractorRoutes),
        AngularmaterialModule,
        MatSortModule,
        FuseCardModule,
        NgApexchartsModule,
        SharedModule
    ],
    providers: [DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class HomeContractorModule {
}
