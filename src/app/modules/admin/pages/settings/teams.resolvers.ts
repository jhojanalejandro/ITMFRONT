import { Injectable } from '@angular/core';
import {  Resolve } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
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
    resolve(): Observable<DataFile[]>
    {
        return this._auth.getTeams();
    }
}

