import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { FileManagerService } from 'app/modules/admin/apps/file-manager/services/file-manager.service';
import { DataFile, Item } from 'app/modules/admin/apps/file-manager/file-manager.types';


@Injectable({
    providedIn: 'root'
})
export class FileManagerFolderResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fileManagerService: FileManagerService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item>
    {
        return this._fileManagerService.getAllFolder()
                   .pipe(
                       // Error here means the requested task is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class FileManagerItemResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fileManagerService: FileManagerService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DataFile>
    {
        return this._fileManagerService.getItemByIdDetailFolder(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested task is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}
