import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
import { FileManagerService } from 'app/modules/admin/apps/file-manager/file-manager.service';
import { Item } from 'app/modules/admin/apps/file-manager/file-manager.types';
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector       : 'file-manager-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy
{
    item: any;
    userName: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: FileManagerListComponent,
        private _fileManagerService: FileManagerService,
        private _router: Router,
        private _authService: AuthService
    ){}

    ngOnInit(): void
    {
        //this.numberWin = this.router.snapshot.paramMap.get('number') || 'null';
        // Open the drawer
        this._fileManagerListComponent.matDrawer.open();

        // Get the item
        this._fileManagerService.itemDF$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: any) => {
                // Open the drawer in case it is closed
                this._fileManagerListComponent.matDrawer.open();
                // Get the item
                this.item = item;
                this.item.type = 'carpeta'; 
                this.item.userId = this.getUserById(this.item.userId);

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
            return CryptoJS.AES.encrypt(JSON.stringify(data), GlobalCont.encryptSecretKey).toString();
        } catch (e) {
            console.log(e);
        }
    }


    async getUserById(id: any) {
        
        (await this._authService.getUserById(id)).subscribe((Response) => {
        return this.userName = Response.userName
        //   this.lastName = Response.lastName
        //   this.identificationCard = Response.identificationCard
        });
    }

    // async getFilesBy() {
    //     (await this._authService.getUserById(this.item[0].idUser)).subscribe((Response) => {
    //     this.userName = Response.userName
    //       this.lastName = Response.lastName
    //       this.identificationCard = Response.identificationCard
    //     });
    // }

}
