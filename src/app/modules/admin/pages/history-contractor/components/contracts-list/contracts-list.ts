import { Component, OnInit } from '@angular/core';
import { HistoryContractorComponent } from '../../history-contractor.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'contracts-list',
    templateUrl: './contracts-list.html'
})
export class ContractsListComponent implements OnInit {
    /**
     * Constructor
     */
    contractorId: string;
    constructor(private _guidesComponent: HistoryContractorComponent,
        private router: ActivatedRoute) {
    }
    ngOnInit(): void {
        this.contractorId = this.router.snapshot.paramMap.get('contractorId') || 'null';
    }

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._guidesComponent.matDrawer.toggle();
    }
}
