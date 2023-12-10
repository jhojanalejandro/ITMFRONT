import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { ContractorListComponent } from './contractor-list.component';
import { contractorListRoutes } from './contractor-list.routing';
import { ButtonsExportModule } from 'app/layout/common/buttons-export/buttons-export.module';
import { ContractorDataHiringComponent } from './components/data-hiring-contractor/data-hiring-contractor.component';
import { GeneratePdfComponent } from './components/generate-pdf/generate-pdf.component';
import { AssignmentUserComponent } from './components/assigmentUser/assignment-user.component';
import { ShareComponentsModule } from '../../share-components/share-components.module';
import { HistoryInnabilityComponent } from './components/history-innability/history-innability.component';


@NgModule({
    declarations: [
        ContractorListComponent,
        ContractorDataHiringComponent,
        GeneratePdfComponent,
        AssignmentUserComponent,
        HistoryInnabilityComponent,
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
export class ContractorListModule {
}
