import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Item, ItemsC } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, switchMap, Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FolderContractorComponent } from './register-folder-contractor/register-folder-contractor.component';
import { ListFolderFileContractorService } from './list-folder-file-contractor.service';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FileListManagerService } from '../list-file/list-file.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
    selector: 'list-folder-file-contractor',
    templateUrl: './list-folder-file-contractor.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListFolderFileContractorComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: any;
    fileList: Blob;
    searchText: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: FormControl = new FormControl();
    filteredStreets: Observable<string[]>;
    folderId: any;
    ruta: any;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: ListFolderFileContractorService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private router: ActivatedRoute,
        private _matDialog: MatDialog,
        private _fileService: FileListManagerService,
        private sanitizer: DomSanitizer

    ) { }

    ngOnInit(): void {
        this.getData();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    Files(id: any) {
        this._router.navigate(['/apps/file-manager/folders/agreement/', id], { relativeTo: this._activatedRoute });
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
        return item.id || index;
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
        const filterValue = number;

        return this.items.filter(option => option === number);
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // let studentObj =  this.dataRandom.find(t=>t.fullname ===event);
        this.items.filter = filterValue;
        // return this.dataRandom.number.find(number => number === event)
    }

    openDialog() {
        const dialogRef = this._matDialog.open(FolderContractorComponent, {
            autoFocus: false,
            data: {
                contractorId: this.folderId,
                folderName: 'vacio'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getData();
            }
        });
    }

    onChange(event) {
        // reader.onload = () => {
        //     this.file = reader.result;
        // };
    }
    getData() {
        this.folderId = this.router.snapshot.paramMap.get('contractorId') || 'null';

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
        this._fileManagerService.itemsFC$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: ItemsC) => {
                this.items = items;
                if (items.folders.length > 0) {
                    this.ruta = this.items.folders[0].contractorId + '/';
                }
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

    }

    getFilesFolder = async (id: any)=> {
        this._fileService.getItemById(id).pipe(takeUntil(this._unsubscribeAll))
        .subscribe((Response: any) => {
            const jszip = new JSZip();
            for (let i = 0; i < Response.length; i++) {
                Response[i].filedata = 'data:application/pdf;base64,'+Response[i].filedata
                var binary = atob(Response[i].filedata.split(',')[1]);
                var array = [];
                for (let j = 0; j < binary.length; j++) {
                    array.push(binary.charCodeAt(j));
                }
                let pdf = new Blob([new Uint8Array(array)], {
                    type: 'application/pdf'
                });
                jszip.folder("pruebaCarpeta").file(`${Response[i].filesName}.pdf`, pdf);
                if (i === (Response.length - 1)) {
                    jszip.generateAsync({ type: 'blob' }).then(function (content) {
                        // see FileSaver.js
                        saveAs(content, 'pruebaDescarga.zip');
                    });
                }
            }
      })
    }

    download = async () => {
        const zip = new JSZip();
        // create a file

        zip.file("hello.txt", "Hello[p my)6cxsw2q");
        // oops, cat on keyboard. Fixing !
        zip.file("hello.txt", "Hello World\n");

        // create a file and a folder
        zip.file("nested/hello.txt", "Hello World\n");
        // same as
        zip.folder("nested").file("hello.txt", "Hello World\n");
        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // see FileSaver.js
                saveAs(content, "example.zip");
            });
    };

}
