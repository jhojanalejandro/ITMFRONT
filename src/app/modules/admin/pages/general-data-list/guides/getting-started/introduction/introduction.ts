import { Component } from '@angular/core';
import { GuidesComponent } from '../../guides.component';

@Component({
    selector   : 'introduction',
    templateUrl: './introduction.html'
})
export class IntroductionComponent
{
    /**
     * Constructor
     */
    constructor(private _guidesComponent: GuidesComponent)
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
