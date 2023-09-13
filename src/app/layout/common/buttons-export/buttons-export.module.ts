import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsExportComponent } from './buttons-export.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    ButtonsExportComponent
  ],
  declarations: [ButtonsExportComponent]
})
export class ButtonsExportModule { }
