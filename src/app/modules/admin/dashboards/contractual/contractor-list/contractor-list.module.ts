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


@NgModule({
    declarations: [
        ContractorListComponent,
        ContractorDataHiringComponent,
        ModificacionFormComponent,
        MinutaContratoComponent,
        NewnessContractorComponent,
        GeneratePdfComponent
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
