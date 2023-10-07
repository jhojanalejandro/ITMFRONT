import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'planing',
    templateUrl    : './planing.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaningComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
