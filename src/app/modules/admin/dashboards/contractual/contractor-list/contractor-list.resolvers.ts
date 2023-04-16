import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ContractorService } from '../service/contractor.service';
import { Contractor } from '../models/contractor';


@Injectable({
    providedIn: 'root'
})
export class ContractorsDataResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _inventoryService: ContractorService,
        private _router: Router
    ) {
    }

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contractor[]> {
        return this._inventoryService.getContractorByIdProject(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested product is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContractorsResolver implements Resolve<any>
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
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any[]>> {
        return  this._inventoryService.getContractorByIdProject();
    }
}


