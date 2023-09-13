import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PlaningService } from './service/planing.service';

@Injectable({
    providedIn: 'root'
})
export class ContractsPlaningResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PlaningService) {
    }
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
        return this._inventoryService.getContractActivateList();
    }
}


