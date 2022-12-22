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
import { AdicionFormComponent } from './adicion-form/adicion-form.component';
import { ContractorDataRegisterComponent } from './register-data-contractor/register-data-contractor.component';
import { MinutaContratoComponent } from './create-pdf/minuta-contrato/minuta-contrato.component';
import { CuentaCobroComponent, } from '../../../apps/home-contractor/cuenta-cobro/cuenta-cobro.component';
import { MinutaAdicion1Component } from './create-pdf/minuta-adicion1/minuta-adicion1.component';
import { MinutaAdicion2Component } from './create-pdf/minuta-adicion2/minuta-adicion2.component';
import { MinutaAdicionComponent } from './create-pdf/minuta-adicion/minuta-adicion.component';
import { EstudioPrevioComponent } from './create-pdf/estudio-previo/estudio-previo.component';


@NgModule({
    declarations: [
        ContractorListComponent,
        ContractorDataRegisterComponent,
        AdicionFormComponent,
        MinutaContratoComponent, 
        MinutaAdicion1Component, MinutaAdicion2Component,
         MinutaAdicionComponent, EstudioPrevioComponent
    ],
    imports     : [
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
export class ContractorListModule
{
}
