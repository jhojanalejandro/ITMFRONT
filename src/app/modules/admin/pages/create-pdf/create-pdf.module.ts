import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreatePdfComponent } from './create-pdf.component';
import { RouterModule } from '@angular/router';
import { createPdfRoutes } from './create-pdf.routing';
import { SharedModule } from 'app/shared/shared.module';
import { MinutaContratoComponent } from './minuta-contrato/minuta-contrato.component';
import { MinutaAdicion1Component } from './minuta-adicion1/minuta-adicion1.component';
import { MinutaAdicionComponent } from './minuta-adicion/minuta-adicion.component';
import { EstudioPrevioComponent } from './estudio-previo/estudio-previo.component';



@NgModule({
  declarations: [CreatePdfComponent, MinutaContratoComponent, MinutaAdicion1Component, MinutaAdicionComponent, EstudioPrevioComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(createPdfRoutes),
    SharedModule
  ],
  providers: [DatePipe]

})
export class CreatePdfModule { }
