import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';
import {MatTreeModule} from '@angular/material/tree';
import { IgxTreeModule } from 'igniteui-angular';

const ds = [
    MatTreeModule,
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
