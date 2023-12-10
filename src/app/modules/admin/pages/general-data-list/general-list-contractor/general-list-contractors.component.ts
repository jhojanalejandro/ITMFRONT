import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormControl,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {
    Subject,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ContractFolders } from '../../planing/models/planing-model';
import { GeneralListService } from '../services/general-list.service';

@Component({
    selector: 'general-list-contractors',
    templateUrl: './general-list-contractors.component.html',
    styleUrls: ['./general-list-contractors.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class GeneralListContractorsComponent
    implements OnInit, AfterViewInit, OnDestroy {
    selectContract: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['nombre', 'identificacion', 'fechaNacimiento', 'direccion', 'telefono', 'correo', 'action'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    registerDate = new Date();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    TotalCost: any;
    SubTotal: number;
    operatingExpenses: any;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: ContractFolders | null = null;
    tagsEditMode: boolean = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _generalService: GeneralListService,
        private _router: Router,
        private _liveAnnouncer: LiveAnnouncer,
    ) {

    }

    ngOnInit(): void {
        this._generalService._historyContractor$
        .subscribe(response => {
            this.dataSource = new MatTableDataSource(
                response
            );
            this.dataSource.sort = this.sort;
        });
    }
    columnas = [
        { title: 'NOMBRE', name: 'nombre' },
        { title: 'CEDULA', name: 'identificacion' },
        { title: 'FECHA NACIMIENTO', name: 'fechaNacimiento' },
        { title: 'DIRECCIÓN', name: 'direccion' },
        { title: 'TELEFONO', name: 'telefono' },
        { title: 'CORREO', name: 'correo' },
        { title: 'OPCIÓN', name: 'action' },
    ]
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    navigateDetail(data: any) {
        this._router.navigate(["/docs/history/"+data.id+"/opcion"]);
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }
    /**
 * Track by function for ngFor loops
 *
 * @param index
 * @param item
 */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.columnsToDisplay, event.previousIndex, event.currentIndex);
    }


}
