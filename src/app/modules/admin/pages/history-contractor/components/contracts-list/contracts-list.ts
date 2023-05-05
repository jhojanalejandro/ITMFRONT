import { Component } from '@angular/core';
import { HistoryContractorComponent } from '../../history-contractor.component';

@Component({
    selector   : 'contracts-list',
    templateUrl: './contracts-list.html'
})
export class ContractsListComponent
{
    /**
     * Constructor
     */
    constructor(private _guidesComponent: HistoryContractorComponent)
    {
    }

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void
    {
        // Toggle the drawer
        this._guidesComponent.matDrawer.toggle();
    }
}
