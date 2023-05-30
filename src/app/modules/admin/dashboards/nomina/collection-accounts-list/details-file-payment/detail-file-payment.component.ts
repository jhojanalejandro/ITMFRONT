import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { FileListManagerService } from 'app/modules/admin/apps/file-manager/services/list-file.service';
import { CollectionAccountsListComponent } from '../collection-accounts-list.component';


@Component({
    selector       : 'detail-file-payment',
    templateUrl    : './detail-file-payment.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailFilePaymentComponent implements OnInit, OnDestroy
{
    userName: any;
    item: any;
    id: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _listComponent: CollectionAccountsListComponent,
        private _fileManagerService: FileListManagerService,
        private _router: Router,
    ){}

    ngOnInit(): void
    {
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
                // Mark for check
                this._changeDetectorRef.markForCheck();
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
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._listComponent.matDrawer.close();
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
        this._router.navigate(['apps/archivo/'+ this.id]);
    }
    encryptData(data) {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), GlobalConst.encryptSecretKey).toString();
        } catch (e) {
            console.log(e);
        }
    }

}
