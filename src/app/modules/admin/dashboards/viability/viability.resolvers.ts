import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ViabilityService } from 'app/modules/admin/dashboards/viability/viability.service';

@Injectable({
    providedIn: 'root'
})
export class ViabilityResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _financeService: ViabilityService)
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
