import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EconomicChartService } from '../service/economic-chart.service';

@Injectable({
    providedIn: 'root'
})
export class ContractsPlaningResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: EconomicChartService) {
    }
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
        return this._inventoryService.getProjectData();
    }
}


