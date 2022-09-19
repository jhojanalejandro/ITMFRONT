import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { UploadDataComponent } from 'app/modules/admin/dashboards/project/upload-data.component';
import { projectRoutes } from 'app/modules/admin/dashboards/project/upload-data.routing';
import { ContractorRegisterComponent } from './register-contractor/register-contractor.component';
import { ProjectFolderComponent } from './register-project-folder/register-project-folder.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
    declarations: [
        UploadDataComponent,
        ContractorRegisterComponent,
        ProjectFolderComponent,
        UploadFileComponent
    ],
    imports     : [
        RouterModule.forChild(projectRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        SharedModule
    ]
})
export class ProjectModule
{
}
