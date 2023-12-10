import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { contractorListRoutes } from './post-contractual-list.routing';
import { ButtonsExportModule } from 'app/layout/common/buttons-export/buttons-export.module';
import { PostContractualListComponent } from './post-contractual-list.component';
import { ContractorPaymentRegisterComponent } from '../components/payroll-register/contractor-payment-register.component';
import { ShareComponentsModule } from '../../share-components/share-components.module';




@NgModule({
    declarations: [
        PostContractualListComponent,
        ContractorPaymentRegisterComponent,
    ],
    imports: [
        RouterModule.forChild(contractorListRoutes),
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        ButtonsExportModule,
        ShareComponentsModule
    ]
})
export class PostContractualListModule {
}
