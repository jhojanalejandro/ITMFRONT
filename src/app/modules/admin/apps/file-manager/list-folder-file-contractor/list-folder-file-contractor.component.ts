import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from 'app/modules/admin/apps/file-manager/file-manager.service';
import { Item, Items } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, switchMap, Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileComponent } from 'app/modules/admin/dashboards/project/upload-file/upload-file.component';



@Component({
    selector       : 'list-folder-file-contractor',
    templateUrl    : './list-folder-file-contractor.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListFolderFileContractorComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: any;
    searchText: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: FormControl = new FormControl();
    filteredStreets: Observable<string[]>;
    idFolder: any;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private router: ActivatedRoute
    ){}

    ngOnInit(): void
    {   
        this.idFolder = this.router.snapshot.paramMap.get('folderId') || 'null';

        this.filteredStreets = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'number' ? value : value.numbers)),
            map(numbers => (numbers ? this._filter(numbers) : this.items)),
            );

          this.filteredStreets = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter2(value)),
          );
        // Get the items
        this._fileManagerService.getAllFolderFileContractor()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items) => {
                this.items = items;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.selectedItem = item;
                // Mark for check
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
            console.log('items',this.items.folders);
         
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    Files(id: any){
        this._router.navigate(['/apps/file-manager/folders/agreement/',id], {relativeTo: this._activatedRoute});
    }
    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    
    private _normalizeValue(value: string): string {
        return value.toString().replace(/[0-9]/g, '');
    }
    private _filter2(value: string): string[] {
        if(this.items != null){
            const filterValue = this._normalizeValue(value);
            return this.items.filter(street => this._normalizeValue(street).includes(filterValue));
        }
    }

    private _filter(number: any): any[] {
        const filterValue = number;
        
        return this.items.filter(option => option=== number);
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // let studentObj =  this.dataRandom.find(t=>t.fullname ===event);
        this.items.filter = filterValue;
        // return this.dataRandom.number.find(number => number === event)
    }

    // getAllfolders(){
    //     this._fileManagerService.getAllFolder()
    //     .pipe(takeUntil(this._unsubscribeAll))
    //     .subscribe((data) => {
           
    //         console.log('cambio',this.items.folders);
            
    // });
    // }
}
