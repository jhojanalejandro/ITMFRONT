import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { fileManagerRoutes } from 'app/modules/admin/apps/file-manager/file-manager.routing';
import { FileManagerComponent } from 'app/modules/admin/apps/file-manager/file-manager.component';
import { FileManagerDetailsComponent } from 'app/modules/admin/apps/file-manager/components/details/details.component';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FileListComponent } from './list-file/file-list.component';
import { ListFolderContractorComponent } from './list-folder-contractor/list-folder-contractor.component';
import { DetailFileComponent } from './components/details-file/detail-file.component';
import { ListFolderFileContractorComponent } from './list-folder-file-contractor/list-folder-file-contractor.component';
import { DetailsFolderFileContractorComponent } from './components/details-folder-contractor/details-folder-contractor.component';
import { DetailFileContractComponent } from './components/details-file-contract/detail-file-contract.component';
import { ObservationFileComponent } from './list-file/observation-File/observation-file.component';
import { RegisterFolderContractorComponent } from './components/register-folder-contractor/register-folder-contractor.component';

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerDetailsComponent,
        FileManagerListComponent,
        ListFolderFileContractorComponent,
        ListFolderContractorComponent,
        FileListComponent,
        DetailFileComponent,
        DetailsFolderFileContractorComponent,
        RegisterFolderContractorComponent,
        DetailFileContractComponent,
        ObservationFileComponent
    ],
    imports     : [
        RouterModule.forChild(fileManagerRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTooltipModule,
        SharedModule,
        Ng2SearchPipeModule
    ]
})
export class FileManagerModule
{
}
