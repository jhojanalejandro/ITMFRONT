import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { DenseLayoutModule } from 'app/layout/layouts/vertical/dense/dense.module';
import { SharedModule } from 'app/shared/shared.module';
import { LayoutContractorComponent } from './layouts/layout-contractor.component';
import { DenseContractorLayoutModule } from './layouts/vertical/dense-contractor/dense-contractor.module';

const layoutModules = [
    // Empty
    EmptyLayoutModule,

    DenseLayoutModule,

];

@NgModule({
    declarations: [
        LayoutComponent,
    ],
    imports     : [
        SharedModule,
        ...layoutModules
    ],
    exports     : [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule
{
}
