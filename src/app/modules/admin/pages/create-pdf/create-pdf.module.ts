import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePdfComponent } from './create-pdf.component';
import { RouterModule } from '@angular/router';
import { createPdfRoutes } from './create-pdf.routing';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [CreatePdfComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(createPdfRoutes),
    SharedModule
  ]
})
export class CreatePdfModule { }
