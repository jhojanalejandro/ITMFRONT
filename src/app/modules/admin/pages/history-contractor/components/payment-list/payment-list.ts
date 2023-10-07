import { Component } from '@angular/core';
import { HistoryContractorComponent } from '../../history-contractor.component';

@Component({
    selector   : 'payment-list',
    templateUrl: './payment-list.html'
})
export class PaymentListComponent
{
    /**
     * Constructor
     */
    constructor(private _guidesComponent: HistoryContractorComponent)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void
    {
        // Toggle the drawer
        this._guidesComponent.matDrawer.toggle();
    }
}
