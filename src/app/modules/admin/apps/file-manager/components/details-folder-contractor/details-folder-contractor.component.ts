import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { ListFolderFileContractorComponent } from '../../list-folder-file-contractor/list-folder-file-contractor.component';
import { ListFolderContractorService } from '../../services/list-folder-contractor.service';
import { FileListManagerService } from '../../services/list-file.service';
import { FileManagerService } from '../../services/file-manager.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector       : 'details-folder-contractor',
    templateUrl    : './details-folder-contractor.component.html',
    encapsulation  : ViewEncapsulation.None,
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsFolderFileContractorComponent implements OnInit, OnDestroy
{
    item: any;
    userName: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    folderId: string = null;
    contractId: string;
    configForm: FormGroup;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: ListFolderFileContractorComponent,
        private _listFolderService: ListFolderContractorService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _authService: AuthService,
        private _fileManagerListService: FileListManagerService,
        private _fileManagerService: FileManagerService,
        private _formBuilder: FormBuilder,
    ){}

    ngOnInit(): void
    {
        // Open the drawer
        this._fileManagerListComponent.matDrawer.open();

        // Get the item
        this._listFolderService.fileContractor$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: any) => {
                // Open the drawer in case it is closed
                this._fileManagerListComponent.matDrawer.open();
                // Get the item
                this.item = item;
                this.folderId = item.id
                this.item.type = 'carpeta';
                this.item.userId = this._authService.accessId;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            this.configForm = this._formBuilder.group({
                title: 'Eliminar Registro',
                message: '¿Estás seguro de que desea eliminar el registro de forma permanente? <span class="font-medium">Esta acción no se puede deshace!</span>',
                icon: this._formBuilder.group({
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warn'
                }),
                actions: this._formBuilder.group({
                    confirm: this._formBuilder.group({
                        show: true,
                        label: 'Eliminar',
                        color: 'warn'
                    }),
                    cancel: this._formBuilder.group({
                        show: true,
                        label: 'Cancelar'
                    })
                }),
                dismissible: true
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._fileManagerListComponent.matDrawer.close();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    openDialog() {
        //this.validateDinamycKey();
        this._router.navigate(['apps/archivo/'+ this.item.id]);
    }
    encryptData(data) {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), GlobalConst.encryptSecretKey).toString();
        } catch (e) {
            console.log(e);
        }
    }

    openConfirmationDelete(): void {
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this._fileManagerService.deleteFolder(this.folderId).subscribe((res) => {
                    if (res) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Información Eliminada Exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.closeDrawer();
                        this._router.navigate(['/apps/file-manager/file/contractor/' + this.contractId + '/' + this.folderId] );
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    }
                },
                    (response) => {
                        console.log(response);
                        Swal.fire('Error', 'Error al Eliminar la informacion!', 'error');
                    });
            }
        });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
