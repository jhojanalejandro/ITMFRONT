import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { GeneralListRoutes } from './general.routing';
import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';
import { GeneralListContractorsComponent } from './general-list-contractor/general-list-contractors.component';
import { GeneralListContractComponent } from './general-list-contract/general-list-contract.component';


@NgModule({
    declarations: [
        GeneralListContractorsComponent,
        GeneralListContractComponent,
    ],
    imports     : [
        RouterModule.forChild(GeneralListRoutes),
        AngularmaterialModule,
        SharedModule
    ]
})
export class GeneralListModule
{
}
