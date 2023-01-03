import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { NominaComponent } from 'app/modules/admin/dashboards/nomina/nomina.component';
import { nominaRoutes } from 'app/modules/admin/dashboards/nomina/nomina.routing';
import { ContractorPaymentRegisterComponent } from './contractor-list/payroll-register/contractor-payment-register.component';
import { CollectionAccountsListComponent } from './collection-accounts-list/collection-accounts-list.component';
import { ContractorListComponent } from './contractor-list/contractor-list.component';
import { DetailFilePaymentComponent } from './collection-accounts-list/details-file-payment/detail-file-payment.component';

@NgModule({
    declarations: [
        NominaComponent,
        ContractorPaymentRegisterComponent,
        CollectionAccountsListComponent,
        ContractorListComponent,
        DetailFilePaymentComponent
    ],
    imports     : [
        RouterModule.forChild(nominaRoutes),
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        NgApexchartsModule,
        SharedModule
    ]
})
export class NominaModule
{
}
