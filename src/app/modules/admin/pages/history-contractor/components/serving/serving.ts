import { Component } from '@angular/core';
import { HistoryContractorComponent } from '../../history-contractor.component';

@Component({
    selector   : 'serving',
    templateUrl: './serving.html'
})
export class ServingComponent
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
