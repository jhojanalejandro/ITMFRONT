import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import { authSignInRoutes } from 'app/modules/auth/sign-in/sign-in.routing';
import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';

@NgModule({
    declarations: [
        AuthSignInComponent
    ],
    imports     : [
        RouterModule.forChild(authSignInRoutes),
        AngularmaterialModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule
    ]
})
export class AuthSignInModule
{
}
