import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { FileListComponent } from '../../list-file/file-list.component';
import { FileListManagerService } from '../../services/list-file.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'detail-file',
    templateUrl: './detail-file.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailFileComponent implements OnInit, OnDestroy {
    userName: any;
    item: any;
    id: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    configForm: FormGroup;
    contractorId: string;
    folderId: string;
    contractId: string;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _listComponent: FileListComponent,
        private _fileManagerService: FileListManagerService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) { }

    ngOnInit(): void {
        //this.numberWin = this.router.snapshot.paramMap.get('number') || 'null';
        // Open the drawer
        this._listComponent.matDrawer.open();

        // Get the item
        this._fileManagerService.filesContract$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: DataFile) => {
                this.id = item.id;
                // Open the drawer in case it is closed
                this._listComponent.matDrawer.open();

                // Get the item
                this.item = item;
                this.userName = this._authService.accessName;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.configForm = this._formBuilder.group({
            title: 'Eliminar Registro',
            message: '¿Estás seguro de que desea eliminar este archivo de forma permanente? <span class="font-medium">Esta acción no se puede deshace!</span>',
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
        this.contractorId = this._fileManagerService.getContractorId();
        this.folderId = this._fileManagerService.getFolderId();
        this.contractId = this._fileManagerService.getContractId();

    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._listComponent.matDrawer.close();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    openDialog() {
        //this.validateDinamycKey();
        this._router.navigate(['apps/archivo/' + this.id]);
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
                this._fileManagerService.DeleteFile(this.id).subscribe((res) => {
                    if (res) {
                        swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Información Eliminada Exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.closeDrawer();
                        this._router.navigate(['/apps/file-manager/file/contractor/' + this.contractId + '/' + this.contractorId+ '/'+  this.folderId]);
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    }
                },
                    (response) => {
                        console.log(response);
                        swal.fire('Error', 'Error al Eliminar la informacion!', 'error');
                    });
            }
        });

    }


}
