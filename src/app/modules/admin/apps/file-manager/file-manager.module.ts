import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { fileManagerRoutes } from 'app/modules/admin/apps/file-manager/file-manager.routing';
import { FileManagerComponent } from 'app/modules/admin/apps/file-manager/file-manager.component';
import { FileManagerDetailsComponent } from 'app/modules/admin/apps/file-manager/details/details.component';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FileListComponent } from './list-file/file-list.component';
import { ListFolderContractorComponent } from './list-folder-contractor/list-folder-contractor.component';
import { DetailFolderComponent } from './details-file/detail-folder.component';
import { ListFolderFileContractorComponent } from './list-folder-file-contractor/list-folder-file-contractor.component';

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerDetailsComponent,
        FileManagerListComponent,
        ListFolderFileContractorComponent,
        ListFolderContractorComponent,
        FileListComponent,
        DetailFolderComponent
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
