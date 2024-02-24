import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { DenseLayoutModule } from 'app/layout/layouts/vertical/dense/dense.module';
import { SharedModule } from 'app/shared/shared.module';
import { LayoutContractorComponent } from './layout-contractor.component';
import { DenseContractorLayoutModule } from './vertical/dense-contractor/dense-contractor.module';

const layoutContractorModules = [
    // Empty
    EmptyLayoutModule,

    DenseContractorLayoutModule

];

@NgModule({
    declarations: [
        LayoutContractorComponent
    ],
    imports     : [
        SharedModule,
        ...layoutContractorModules
    ],
    exports     : [
        LayoutContractorComponent,
        ...layoutContractorModules
    ]
})
export class LayoutContractorModule
{
}
