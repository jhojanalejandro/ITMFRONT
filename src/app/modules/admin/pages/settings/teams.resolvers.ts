import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { FileManagerService } from 'app/modules/admin/apps/file-manager/services/file-manager.service';
import { Item } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class TeamsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _auth: AuthService)
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
    resolve(): Observable<Item[]>
    {
        return this._auth.getTeams();
    }
}

