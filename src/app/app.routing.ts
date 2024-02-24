import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { LayoutContractorComponent } from './layout/layouts/layout-contractor.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/inicio'},

    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboards/inicio'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: '', children: [
                {path: 'inicio', loadChildren: () => import('app/modules/admin/apps/home-contractor/home-contractor.module').then(m => m.HomeContractorModule)},
            ]},
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'dashboards', children: [
                {path: 'inicio', loadChildren: () => import('app/modules/admin/dashboards/contractual/contracts-list/contracts-lis.module').then(m => m.ContractListModule)},
                {path: 'lista-contratistas/:id/:contractname', loadChildren: () => import('app/modules/admin/dashboards/contractual/contractor-list/contractor-list.module').then(m => m.ContractorListModule)},
                {path: 'nomina', loadChildren: () => import('app/modules/admin/dashboards/nomina/nomina.module').then(m => m.NominaModule)},
                {path: 'pre-nomina-lista-contratistas/:id/:contractname', loadChildren: () => import('app/modules/admin/dashboards/post-contractual/post-contractual-list/post-contractual-list.module').then(m => m.PostContractualListModule)},

            ]},

            // Apps
            {path: 'apps', children: [
                {path: 'file-manager', loadChildren: () => import('app/modules/admin/apps/file-manager/file-manager.module').then(m => m.FileManagerModule)},
                {path: 'maintainers-list', loadChildren: () => import('app/modules/admin/apps/maintainers-list/maintainers-lis.module').then(m => m.MaintainersListModule)}
            ]},

            // Pages
            {path: 'paginas', children: [
                {path: 'crear-pdf', loadChildren: () => import('app/modules/admin/pages/create-pdf/create-pdf.module').then(m => m.CreatePdfModule)},

                // Error
                {path: 'error', children: [
                    {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
                    {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module)}
                ]},


                // Settings
                {path: 'configuraciones', loadChildren: () => import('app/modules/admin/pages/settings/settings.module').then(m => m.SettingsModule)},
            ]},

            // Documentation
            {path: 'docs', children: [
                {path: 'ecommerce', loadChildren: () => import('app/modules/admin/pages/planing/planing.module').then(m => m.PlaningModule)},

                // Guides
                {path: 'general', loadChildren: () => import('app/modules/admin/pages/general-data-list/general.module').then(m => m.GeneralListModule)},
                {path: 'history', loadChildren: () => import('app/modules/admin/pages/history-contractor/history-contractor.module').then(m => m.HistoryContractorModule)}

            ]},

            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
