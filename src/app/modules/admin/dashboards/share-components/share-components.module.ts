import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { ButtonsExportModule } from 'app/layout/common/buttons-export/buttons-export.module';
import { NewnessContractorComponent } from './newness-contractor/newness-contractor.component';
import { TermFileContractComponent } from './term-file-contract/term-file-contract.component';
import { DetailContractorComponent } from './detail-contractor/detail-contractor.component';
import { ModificacionFormComponent } from './modificacion-form/modificacion-form.component';
import { MinutaContratoComponent } from './minutas-contrato/minuta-contrato.component';


@NgModule({
    declarations: [
        NewnessContractorComponent,
        TermFileContractComponent,
        DetailContractorComponent,
        ModificacionFormComponent,
        MinutaContratoComponent
    ],
    imports: [
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        ButtonsExportModule
    ],
    exports: [
        NewnessContractorComponent,
        TermFileContractComponent,
        DetailContractorComponent,
        ModificacionFormComponent,
        MinutaContratoComponent
    ]
    
})
export class ShareComponentsModule {
}
