import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { ContractorListComponent } from './contractor-list.component';
import { contractorListRoutes } from './contractor-list.routing';
import { ButtonsExportModule } from 'app/layout/common/buttons-export/buttons-export.module';
import { ModificacionFormComponent } from './components/modificacion-form/modificacion-form.component';
import { ContractorDataHiringComponent } from './components/data-hiring-contractor/data-hiring-contractor.component';
import { MinutaContratoComponent } from './components/minutas-contrato/minuta-contrato.component';
import { NewnessContractorComponent } from './components/newness-contractor/newness-contractor.component';
import { GeneratePdfComponent } from './components/generate-pdf/generate-pdf.component';
import { ContractorPaymentRegisterComponent } from './components/payroll-register/contractor-payment-register.component';
import { AssignmentUserComponent } from './components/assigmentUser/assignment-user.component';
import { TermFileContractComponent } from './components/term-file-contract/term-file-contract.component';
import { DetailContractorComponent } from './components/detail-contractor/detail-contractor.component';
import { DatePipe } from '@angular/common';


@NgModule({
    declarations: [
        ContractorListComponent,
        ContractorDataHiringComponent,
        ModificacionFormComponent,
        MinutaContratoComponent,
        NewnessContractorComponent,
        GeneratePdfComponent,
        ContractorPaymentRegisterComponent,
        AssignmentUserComponent,
        TermFileContractComponent,
        DetailContractorComponent
    ],
    imports: [
        RouterModule.forChild(contractorListRoutes),
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        ButtonsExportModule
    ]
})
export class ContractorListModule {
}
