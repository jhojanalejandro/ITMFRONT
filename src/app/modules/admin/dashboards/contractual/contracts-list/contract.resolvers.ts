import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GenericService } from 'app/modules/admin/generic/generic.service';
import { ModuloEnum } from 'app/layout/common/enums/modulo-enum/modulo';

@Injectable({
    providedIn: 'root'
})
export class ContractResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _gerenicService: GenericService) {
    }
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(): Observable<any[]> {
        return this._gerenicService.getAllContract(true, ModuloEnum.CONTARCTUAL);
    }
}


