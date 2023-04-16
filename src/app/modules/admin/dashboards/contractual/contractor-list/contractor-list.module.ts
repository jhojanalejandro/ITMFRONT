import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { ContractorListComponent } from './contractor-list.component';
import { contractorListRoutes } from './contractor-list.routing';
import { ButtonsExportModule } from 'app/layout/common/buttons-export/buttons-export.module';
import { ModificacionFormComponent } from './components/modificacion-form/modificacion-form.component';
import { ContractorDataRegisterComponent } from './components/register-data-contractor/register-data-contractor.component';
import { MinutaContratoComponent } from './components/minuta-contrato/minuta-contrato.component';
import { MinutaAdicionComponent } from './components/minuta-adicion/minuta-adicion.component';
import { MinutaAdicion2Component } from './components/minuta-adicion-ampliacion/minuta-adicion-ampliacion.component';
import { MinutaAmpliacionComponent } from './components/minuta-ampliacion/minuta-adicion.component';
import { EstudioPrevioComponent } from './components/estudio-previo/estudio-previo.component';
import { ActaSupervisionComponent } from './components/acta-supervision/acta-supervision.component';
import { NewnessContractorComponent } from './components/newness-contractor/newness-contractor.component';


@NgModule({
    declarations: [
        ContractorListComponent,
        ContractorDataRegisterComponent,
        ModificacionFormComponent,
        MinutaContratoComponent,
        MinutaAdicionComponent, 
        MinutaAdicion2Component,
        MinutaAmpliacionComponent, 
        EstudioPrevioComponent,
        ActaSupervisionComponent,
        NewnessContractorComponent
    ],
    imports: [
        RouterModule.forChild(contractorListRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        ButtonsExportModule
    ]
})
export class ContractorListModule {
}
