import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NominaService } from 'app/modules/admin/dashboards/nomina/nomina.service';

@Injectable({
    providedIn: 'root'
})
export class NominaResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _financeService: NominaService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._financeService.getData();
    }
}
