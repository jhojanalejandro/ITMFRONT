import { Component } from '@angular/core';
import { HistoryContractorComponent } from '../../history-contractor.component';

@Component({
    selector   : 'hiring-data-list',
    templateUrl: './hiring-data-list.html'
})
export class HiringDataListComponent
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
