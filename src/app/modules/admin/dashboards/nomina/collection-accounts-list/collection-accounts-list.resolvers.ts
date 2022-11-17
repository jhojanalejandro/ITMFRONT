import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Item } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { NominaService } from '../nomina.service';
import { CollectionAccountsService } from './collection-accounts-list.service';

@Injectable({
    providedIn: 'root'
})
export class FileManagerItemsCResolver implements Resolve<any>
{
    /**
    * Constructor
    */
    constructor(private _fileManagerService: CollectionAccountsService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item> {
        return this._fileManagerService.getItemById();
    }
}


@Injectable({
    providedIn: 'root'
})
export class CollectionAccountsItemFResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fileManagerService: CollectionAccountsService
    ) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item> {
        return this._fileManagerService.getItemById(route.paramMap.get('contractId'))
            .pipe(
                // Error here means the requested task is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl('/apps/file-manager/file/contractor/');

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}





