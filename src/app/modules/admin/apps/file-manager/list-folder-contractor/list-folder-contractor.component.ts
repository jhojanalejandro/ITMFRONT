import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ListFolderContractorService } from '../services/list-folder-contractor.service';
import { RegisterFolderComponent } from '../components/register-folder/register-folder.component';
import { UploadFileContractComponent } from '../components/upload-file-contract/upload-file-contract.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'list-folder-contractor',
    templateUrl: './list-folder-contractor.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListFolderContractorComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    fileSelect: any;
    items: any;
    searchText: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: FormControl = new FormControl();
    filteredStreets: Observable<string[]>;
    contractId: string = null;
    selection = new SelectionModel<any>(true, []);
    contractorListId: any[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: ListFolderContractorService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getData();
    }

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        if (item > 0) {
            return item.id || index;
        }
    }

    private _normalizeValue(value: string): string {
        return value.toString().replace(/[0-9]/g, '');
    }
    private _filter2(value: string): string[] {
        if (this.items != null) {
            const filterValue = this._normalizeValue(value);
            return this.items.filter(street => this._normalizeValue(street).includes(filterValue));
        }
    }

    private _filter(number: any): any[] {
        return this.items.filter(option => option === number);
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // let studentObj =  this.dataRandom.find(t=>t.fullname ===event);
        this.items.filter = filterValue;
        // return this.dataRandom.number.find(number => number === event)
    }

    getData() {
        this.contractId = this._activatedRoute.snapshot.paramMap.get('folderId') || 'null';

        this.filteredStreets = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'number' ? value : value.numbers)),
            map(numbers => (numbers ? this._filter(numbers) : this.items)),);

        this.filteredStreets = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter2(value)),
        );
        // Get the items
        this._fileManagerService.folderContract$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: any) => {
                this.items = items;
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    route(route: any, name: string) {
        this._router.navigate(['/apps/file-manager/folders/files/' + this.contractId + '/contratista/' + route + '/' + name]);
    }

    crearCarpeta() {
        const dialogRef = this._matDialog.open(RegisterFolderComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                contractId: this.contractId,
                folderName: 'vacio',
                folderTypeCode: 'CTT'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.reloadResolve();
            }
        });
    }

    reloadResolve() {
        const currentUrl: any = this._router.url;
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this._router.navigateByUrl(currentUrl);
        });
    }

    uploadFile() {
        this.selection.selected.forEach((element) => {
            this.contractorListId.push(element.id);
        });
        const dialogRef = this._matDialog.open(UploadFileContractComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                origin: 'share',
                contractId: this.contractId,
                show: false,
                contractorsId: this.contractorListId
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.reloadResolve();
            }
        });
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.Id + 1
        }`;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.items.folders.length;
        return numSelected === numRows;
    }

    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.items.folders);
    }
    
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
