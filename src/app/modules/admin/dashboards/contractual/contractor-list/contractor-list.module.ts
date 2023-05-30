import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { ContractorListComponent } from './contractor-list.component';
import { contractorListRoutes } from './contractor-list.routing';
import { ButtonsExportModule } from 'app/layout/common/buttons-export/buttons-export.module';
import { ModificacionFormComponent } from './components/modificacion-form/modificacion-form.component';
import { ContractorDataRegisterComponent } from './components/register-data-contractor/register-data-contractor.component';
import { MinutaContratoComponent } from './components/minutas-contrato/minuta-contrato.component';
import { EstudioPrevioComponent } from './components/estudio-previo/estudio-previo.component';
import { ActaSupervisionComponent } from './components/acta-supervision/acta-supervision.component';
import { NewnessContractorComponent } from './components/newness-contractor/newness-contractor.component';


@NgModule({
    declarations: [
        ContractorListComponent,
        ContractorDataRegisterComponent,
        ModificacionFormComponent,
        MinutaContratoComponent,
        EstudioPrevioComponent,
        ActaSupervisionComponent,
        NewnessContractorComponent
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
