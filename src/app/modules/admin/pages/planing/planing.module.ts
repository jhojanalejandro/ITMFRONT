import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { PlaningRoutes } from './planing.routing';
import { ContrtactsComponent } from './contracts/contracts.component';
import { EconomicChartComponent } from './economic-chart/economic-chart.component';
import { EconomicChartListComponent } from './economic-chart/list/economic-chart-list.component';

import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';
import { AddComponentsComponent } from './componentes/components.component';
import { ComponentesFormComponent } from './componentes/componentes-form/componentes-form.component';
import { DialogChangePercentajeComponent } from './componentes/DialogChangePercentaje/DialogChangePercentaje.component';
import { RegisterProjectFolderComponent } from './componentes/register-project-folder/register-project-folder.component';
import { ActividadFormComponent } from './componentes/actividad-form/actividad-form.component';
import { ElementCardComponent } from './element/element.component';


@NgModule({
    declarations: [
        EconomicChartComponent,
        EconomicChartListComponent,
        ContrtactsComponent,
        AddComponentsComponent,
        ElementCardComponent,
        ComponentesFormComponent,
        ActividadFormComponent,
        DialogChangePercentajeComponent,
        RegisterProjectFolderComponent
    ],
    imports     : [
        RouterModule.forChild(PlaningRoutes),
        AngularmaterialModule,
        SharedModule
    ]
})
export class PlaningModule
{
}
