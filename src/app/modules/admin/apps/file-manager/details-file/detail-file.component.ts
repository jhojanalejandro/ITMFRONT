import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerService } from 'app/modules/admin/apps/file-manager/file-manager.service';
import { Item } from 'app/modules/admin/apps/file-manager/file-manager.types';
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { FileListComponent } from '../list-file/file-list.component';

@Component({
    selector       : 'detail-file',
    templateUrl    : './detail-file.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailFileComponent implements OnInit, OnDestroy
{
    item: any;
    id: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _listComponent: FileListComponent,
        private _fileManagerService: FileManagerService,
        private _router: Router,
        private _authService: AuthService
    ){}

    ngOnInit(): void
    {
        debugger
        //this.numberWin = this.router.snapshot.paramMap.get('number') || 'null';
        // Open the drawer
        this._listComponent.matDrawer.open();

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.id = item.id;
                console.log('archivo', item);
                debugger
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
            return CryptoJS.AES.encrypt(JSON.stringify(data), GlobalCont.encryptSecretKey).toString();
        } catch (e) {
            console.log(e);
        }
    }


    async getUserById() {
        (await this._authService.getUserById(this.id)).subscribe((Response) => {
        //   this.userName = Response.userName
        //   this.lastName = Response.lastName
        //   this.identificationCard = Response.identificationCard
        });
    }

    // async getFilesBy() {
    //     (await this._authService.getUserById(this.userId)).subscribe((Response) => {
    //     //   this.userName = Response.userName
    //     //   this.lastName = Response.lastName
    //     //   this.identificationCard = Response.identificationCard
    //     });
    // }

}
