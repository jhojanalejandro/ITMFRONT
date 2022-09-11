import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AngularmaterialModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        AngularmaterialModule,
        ReactiveFormsModule
    ]
})
export class SharedModule
{
}
