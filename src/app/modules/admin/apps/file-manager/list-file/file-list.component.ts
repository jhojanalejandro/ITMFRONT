import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import swal from 'sweetalert2';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileComponent } from 'app/modules/admin/dashboards/contractual/upload-file/upload-file.component';
import { FileListManagerService } from '../services/list-file.service';
import { SelectionModel } from '@angular/cdk/collections';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/upload-file/upload-file.service';
import { ObservationFileComponent } from './observation-File/observation-file.component';
import { DetailFile, FileContractor } from 'app/layout/common/models/file-contractor';
import { DetailFileOption } from 'app/layout/common/enums/detail-file-enum/detail-file-enum';


@Component({
    selector: 'file-list',
    templateUrl: './file-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListComponent implements OnInit, OnDestroy {
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
    statusFile: any;
    value: any;
    searchText: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: FormControl = new FormControl();
    filteredStreets: Observable<string[]>;
    contractorId: string;
    contractId: string;
    folderId: string;
    detailFile: DetailFile = {
        fileId: null,
        registerDate: new Date(),
        reason: null,
        observation: null,
        statusFileId: null,
        passed: false,
    }
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _uploadService: UploadFileDataService,
        private _fileManagerService: FileListManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getStatusFile();
        this.contractorId = this._activatedRoute.snapshot.paramMap.get('contractorId') || 'null';
        this.contractId = this._activatedRoute.snapshot.paramMap.get('contractId') || 'null';
        this.folderId = this._activatedRoute.snapshot.paramMap.get('folderId') || 'null';
        this.getData();
        this._fileManagerService.setContractId(this.contractId);
        this._fileManagerService.setContractorId(this.contractorId);
        this._fileManagerService.setFolderId(this.folderId);
    }

    getId(id: any) {
        this.contractorId = id;
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
    uploadFile() {
        //this.validateDinamycKey();
        const dialogRef = this._matDialog.open(UploadFileComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                show: false,
                split: true,
                contractorId: this.contractorId,
                contractId: this.contractId,
                folderId: this.folderId,
                typeFilePayment: 'Otros'
            }
        });
        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result) {
                    this.getData();
                }
            });
    }

    onChange(event: any, file: FileContractor) {
        debugger
        let code = this.statusFile.find(f => f.code === DetailFileOption.REMITIDO)
        if (code.id === event.value) {
            const dialogRef = this._matDialog.open(ObservationFileComponent, {
                disableClose: true,
                autoFocus: false,
                data: file
            });
            dialogRef.afterClosed()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (result) {
                        swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Información actualizada Exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
        } else {
            this.detailFile.fileId = file.id;
            this.detailFile.registerDate = new Date();
            this.detailFile.passed = true;
            this.detailFile.statusFileId = event.value;
            
            this._uploadService.updateStatusFileContractor(this.detailFile)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res) => {
                    if (res) {
                        swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: 'Información actualizada Exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                },
                    (response) => {
                        console.log(response);

                        swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
                    });
        }

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

        this._fileManagerService.getFileByContractor(this.contractId, this.contractorId, this.folderId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: any) => {
                this.items = item;
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

    private getStatusFile() {
        this._fileManagerService.getStatusFile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: any) => {
                this.statusFile = item;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
