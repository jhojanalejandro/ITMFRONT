import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FileListManagerService } from '../../services/list-file.service';
import { UploadFileContractComponent } from '../upload-file-contract/upload-file-contract.component';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { GenericService } from 'app/modules/admin/generic/generic.service';


@Component({
    selector: 'file-list-contract',
    templateUrl: './file-list-contract.component.html',
})
export class FileListContractComponent implements OnInit, OnDestroy {
    checked = false;
    indeterminate = false;
    posicion: any = 'revisar';
    labelPosition: 'aprobado' | 'rechazado' | 'revisar' = this.posicion;
    disabled = false;
    aprobado: any = 'checked';
    selection = new SelectionModel<any>(true, []);
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    items: any;
    value: any;
    searchText: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: FormControl = new FormControl();
    filteredStreets: Observable<DataFile[]>;
    contractId: string;
    folderId: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileListManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
        private _auth: AuthService,
        private _generic: GenericService
    ) { }

    ngOnInit(): void {
        this.contractId = this._activatedRoute.snapshot.paramMap.get('contractId') || 'null';
        this.folderId = this._activatedRoute.snapshot.paramMap.get('folderId') || 'null';
        this.getData();
        this._fileManagerService.setContractId(this.contractId);
        this._fileManagerService.setFolderId(this.folderId);
        this.validatreSessionpPanel(false);

    }

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
    private _filter2(value: string): DataFile[] {
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
    }

    uploadFile() {
        const dialogRef = this._matDialog.open(UploadFileContractComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                show: false,
                contractId: this.contractId,
                folderId: this.folderId,
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getData();
            }
        });
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.selection.selected.length;
        console.log(this.selection.selected);

        //esta validacion nos permite mostrar y ocltar los detalles de una operacion
        return numSelected === numRows;

    }
    masterToggle() {
        if (this.isAllSelected()) {

            this.selection.clear();
            return;
        }

        //    this.selection.select(...this.dataSource.data);
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }

        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;

    }

    selectRow($event: any, dataSource: any) {
        if ($event.checked) {
            this.value = dataSource;
            console.log(this.value);

        }
    }
    getData() {

        this.filteredStreets = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'number' ? value : value.numbers)),
            map(numbers => (numbers ? this._filter(numbers) : this.items)),
        );

        this.filteredStreets = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter2(value)),
        );

        // Get the item
        this._fileManagerService.getFileByContract(this.contractId, this.folderId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: any) => {
                this.items = item;
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

    validatreSessionpPanel(activateSession: boolean) {

        const uploadFile = {
            activateSession: activateSession,
            panelCode: 'FLMG',
            userId: this._auth.accessId,
            startSessionDate: new Date(),
            activate: activateSession,
            finalSessionDate: activateSession ? null : new Date(),
            contractId: this.contractId,
        };
        this._generic.validateSessionPanel(uploadFile).subscribe((res) => {
            if (res) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '',
                    html: res.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        },
            (response) => {
                console.log(response);
                Swal.fire('Error', 'Error al Registrar la informacion!', 'error');
            });
    }


    ngOnDestroy(): void {
        this.validatreSessionpPanel(false);
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


}
