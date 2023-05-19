import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';
import { IgxTreeModule } from 'igniteui-angular';

const ds = [
    CommonModule,
    FormsModule,
    AngularmaterialModule,
    ReactiveFormsModule,
    IgxTreeModule
    
]

@NgModule({
    imports: [
        ds
    ],
    exports: [
      
        ...ds,
    ],
})
export class SharedModule {}
