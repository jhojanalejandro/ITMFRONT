import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeContractorService } from './home-contractor.service';

@Injectable({
    providedIn: 'root'
})
export class HomeContractorResolver implements Resolve<any>
{

    constructor(private _financeService: HomeContractorService)
    {
    }

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
