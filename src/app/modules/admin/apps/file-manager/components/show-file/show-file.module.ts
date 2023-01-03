
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ShowFileComponent } from './show-file.component';
import { ShowFileRoutes } from './show-file.routing';

@NgModule({
    declarations: [
        ShowFileComponent
    ],
    imports     : [
        RouterModule.forChild(ShowFileRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTooltipModule,
        SharedModule,
        PdfViewerModule,
        Ng2SearchPipeModule

    ]
})
export class ShowFileModule
{
}
