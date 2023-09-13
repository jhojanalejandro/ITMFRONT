import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { ButtonsExportModule } from 'app/layout/common/buttons-export/buttons-export.module';
import { ModificacionFormComponent } from './components/modificacion-form/modificacion-form.component';
import { ContractorPaymentRegisterComponent } from './components/payroll-register/contractor-payment-register.component';
import { TermFileContractComponent } from './components/term-file-contract/term-file-contract.component';
import { DetailContractorComponent } from './components/detail-contractor/detail-contractor.component';
import { postContractualcontractorListRoutes } from './post-contractual-contractor-list.routing';
import { PostContractualContractorListComponent } from './post-contractual-contractor-list.component';


@NgModule({
    declarations: [
        PostContractualContractorListComponent,
        ModificacionFormComponent,
        ContractorPaymentRegisterComponent,
        TermFileContractComponent,
        DetailContractorComponent
    ],
    imports: [
        RouterModule.forChild(postContractualcontractorListRoutes),
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        ButtonsExportModule
    ]
})
export class PostContractualContractorListModule {
}
