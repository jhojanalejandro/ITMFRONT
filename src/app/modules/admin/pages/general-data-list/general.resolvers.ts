import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralListService } from './services/general-list.service';

@Injectable({
    providedIn: 'root'
})
export class HistoryContractsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _generalService: GeneralListService) {
    }
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
        return this._generalService.getProjectRegistered();
        
    }
}



@Injectable({
    providedIn: 'root'
})
export class HistoryContractorResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _generalService: GeneralListService) {
    }
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
        return this._generalService.getHistoryContractor();
        
    }
}
