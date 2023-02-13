import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreatePdfComponent } from './create-pdf.component';
import { RouterModule } from '@angular/router';
import { createPdfRoutes } from './create-pdf.routing';
import { SharedModule } from 'app/shared/shared.module';
import { MinutaContratoComponent } from './minuta-contrato/minuta-contrato.component';
import { CuentaCobroComponent } from './cuenta-cobro/cuenta-cobro.component';
import { MinutaAdicion1Component } from './minuta-adicion1/minuta-adicion1.component';
import { MinutaAdicion2Component } from './minuta-adicion2/minuta-adicion2.component';
import { MinutaAdicionComponent } from './minuta-adicion/minuta-adicion.component';
import { EstudioPrevioComponent } from './estudio-previo/estudio-previo.component';



@NgModule({
  declarations: [CreatePdfComponent, MinutaContratoComponent, CuentaCobroComponent, MinutaAdicion1Component, MinutaAdicion2Component, MinutaAdicionComponent, EstudioPrevioComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(createPdfRoutes),
    SharedModule
  ],
  providers: [DatePipe]

})
export class CreatePdfModule { }
