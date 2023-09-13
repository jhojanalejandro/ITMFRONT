import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PlaningRoutes } from './planing.routing';
import { ContrtactsComponent } from './contracts/contracts.component';
import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';
import { AddComponentsComponent } from './componentes/components.component';
import { ComponentesFormComponent } from './componentes/componentes-form/componentes-form.component';
import { DialogChangePercentajeComponent } from './componentes/DialogChangePercentaje/DialogChangePercentaje.component';
import { RegisterContractFolderComponent } from './componentes/register-project-folder/register-project-folder.component';
import { ActividadFormComponent } from './componentes/actividad-form/actividad-form.component';
import { ElementCardComponent } from './element/element.component';
import { PlaningComponent } from './planing.component';
import { OptionTypeDataComponent } from './componentes/option-type-data/option-type-data.component';
import { MinutaContratoMacroComponent } from './componentes/minuta-contrato/minuta-contrato.component';


@NgModule({
    declarations: [
        PlaningComponent,
        ContrtactsComponent,
        AddComponentsComponent,
        ElementCardComponent,
        ComponentesFormComponent,
        ActividadFormComponent,
        DialogChangePercentajeComponent,
        RegisterContractFolderComponent,
        OptionTypeDataComponent,
        MinutaContratoMacroComponent
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
