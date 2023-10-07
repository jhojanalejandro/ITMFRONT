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
import { DatePipe, DecimalPipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DetailFilePaymentComponent } from './components/collection-accounts-list/details-file-payment/detail-file-payment.component';
import { CollectionAccountsListComponent, MY_FORMATS } from './components/collection-accounts-list/collection-accounts-list.component';
import { ContractorListPayrollComponent } from './components/contractor-list-payroll/contractor-list-payroll.component';
import { ModificacionPayrollComponent } from './components/contractor-list-payroll/components/modificacion-form/modificacion-form.component';

@NgModule({
    declarations: [
        NominaComponent,
        CollectionAccountsListComponent,
        DetailFilePaymentComponent,
        ContractorListPayrollComponent,
        ModificacionPayrollComponent
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
    ],
    providers: [DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class NominaModule
{
}
