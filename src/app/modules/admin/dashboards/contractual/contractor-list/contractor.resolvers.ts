import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ContractorService } from '../service/contractor.service';

@Injectable({
    providedIn: 'root'
})
export class ContractorResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: ContractorService) {
    }
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
        return this._inventoryService.getContractorsByIdProject(route.paramMap.get('id'));
    }
}


