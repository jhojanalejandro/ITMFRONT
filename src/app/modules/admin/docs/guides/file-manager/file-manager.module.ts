import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { FileManagerComponents } from './file-manager.component';
import { FileManagerDetailsComponents } from './details/details.component';
import { FileManagerListComponents } from './list/list.component';
import { fileManagerRoutes } from './file-manager.routing';

@NgModule({
    declarations: [
        FileManagerComponents,
        FileManagerDetailsComponents,
        FileManagerListComponents
    ],
    imports     : [
        RouterModule.forChild(fileManagerRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTooltipModule,
        SharedModule
    ]
})
export class FileManagerModules
{
}
