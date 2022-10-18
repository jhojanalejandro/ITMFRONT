import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActaComiteComponent } from './acta-comite.component';
import { RouterModule } from '@angular/router';
import { routesComite } from './acta-comite.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routesComite),
  ],
  declarations: [ActaComiteComponent]
})
export class ActaComiteModule { }
