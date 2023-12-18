import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileComponent } from 'app/modules/admin/dashboards/contractual/upload-file/upload-file.component';
import { FileListManagerService } from '../services/list-file.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ObservationFileComponent } from './observation-File/observation-file.component';
import { DetailFile, FileContractor } from 'app/layout/common/models/file-contractor';
import { DetailFileOption } from 'app/layout/common/enums/detail-file-enum/detail-file-enum';
import { AuthService } from 'app/core/auth/auth.service';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/service/upload-file.service';
import { CategoryFile, DocumentTypeCodes } from 'app/layout/common/enums/document-type/document-type';
import { DataFile } from '../file-manager.types';
import { RollCodeEnum } from 'app/layout/common/enums/userEnum/route-image';


@Component({
    selector: 'file-list',
    templateUrl: './file-list.component.html',
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
    statusFileLoad: any;
    statusFileCreate: any;

    value: any;
    searchText: any;
    folderName: string;
    permission: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: FormControl = new FormControl();
    filteredStreets: Observable<string[]>;
    contractorId: string;
    contractId: string;
    folderId: string;
    disableButnObservation: boolean = true;
    filesObservation : FileContractor[] = [];
    detailFile: DetailFile = {
        fileId: null,
        registerDate: new Date(),
        reason: null,
        observation: null,
        statusFileId: null,
        passed: false,
        userId: null,
        contractId: '',
    }
    contarctorName: string = '';

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _uploadService: UploadFileDataService,
        private _fileManagerService: FileListManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
        private _auth: AuthService
    ) { }

    ngOnInit(): void {
        this._auth.userPresence$.subscribe(({ code, rol, presente }) => {
            if (presente && rol == RollCodeEnum.JURIDICO ,code ) {
              alert('¡Otro usuario con los mismos parámetros está presente en este componente!');
            }
          });
        //   this.userPresenceService.setUserPresence(Math.floor(10000 + Math.random() * 90000), this._auth.a, true);

        const isAuthenticated = this._auth.isAuthenticatedUser();
        this.permission = this._auth.validateRoll(CodeUser.JURIDICO, null);
        // this.getAdmins();
        if (!this.permission) {
            Swal.fire('', 'No tienes permisos para aprobar documentos!', 'warning');
        } else {
            if (isAuthenticated) {
                Swal.fire('', 'Hay otro usuario juridico interactuando!', 'warning');
            }else{
                this._auth.setAuthenticated(true);
            }
        }
        this.getStatusFile();
        this.contractorId = this._activatedRoute.snapshot.paramMap.get('contractorId') || 'null';
        this.contractId = this._activatedRoute.snapshot.paramMap.get('contractId') || 'null';
        this.folderId = this._activatedRoute.snapshot.paramMap.get('folderId') || 'null';
        this.folderName = this._activatedRoute.snapshot.paramMap.get('folderName') || 'null';
        this.contarctorName = this._activatedRoute.snapshot.paramMap.get('name') || 'null';

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

    addObservationFile(){
        let code = this.statusFileLoad.find(f => f.code === DetailFileOption.REMITIDO)
        const dialogRef = this._matDialog.open(ObservationFileComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
                files: this.filesObservation,
                statusFile: code.id,
                contractId:this.contractId,
                contractorId: this.contractorId,
                userId: this._auth.accessId
            }
        });
        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        html: 'Información actualizada Exitosamente!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
    }
    updateFile(event: any, file: FileContractor) {
        let code = this.statusFileLoad.find(f => f.code === DetailFileOption.REMITIDO)
        if (code.id === event.value) {
            this.disableButnObservation = false;
            this.filesObservation = this.filesObservation.filter(objeto => objeto.id !== file.id);

           this.filesObservation.push(file)
        } else {
            this.filesObservation = this.filesObservation.filter(objeto => objeto.id !== file.id);
            if(this.filesObservation.length > 0){
                this.disableButnObservation = false;
            }else{
                this.disableButnObservation = true;
            }
        }

        this.detailFile.fileId = file.id;
        this.detailFile.registerDate = new Date();
        this.detailFile.passed = true;
        this.detailFile.statusFileId = event.value;
        this.detailFile.userId = this._auth.accessId;
        this.detailFile.contractId = this.contractId;
        this.detailFile.contractorId = this.contractorId;

        this._uploadService.updateStatusFileContractor(this.detailFile)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    Swal.fire({
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
                    Swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
                });

    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.selection.selected.length;
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
            .subscribe((files: DataFile[]) => {
                this.items = files.map(file => {
                    if (file.categoryCode === CategoryFile.CGD) {
                      return { ...file, disabled: false }; // Modifica el campo "nombre"
                    }else{
                        return { ...file, disabled: true }; // Modifica el campo "nombre"
                    }
                  });
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
                this.statusFileLoad = item.filter(f => f.category === CategoryFile.CGD);
                this.statusFileCreate = item.filter(f => f.category === CategoryFile.CRAD);
            });
    }

    updateFileFileGenerated(event: any, file: FileContractor) {
        this.detailFile.fileId = file.id;
        this.detailFile.registerDate = new Date();
        this.detailFile.passed = true;
        this.detailFile.statusFileId = event.value;
        this.detailFile.userId = this._auth.accessId;
        this.detailFile.contractId = this.contractId;
        this.detailFile.contractorId = this.contractorId;
        if (file.documentTypeCode === DocumentTypeCodes.SOLICITUDCOMITE) {
            this._uploadService.updateStatusFileCommitteeContractor(this.detailFile)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    Swal.fire({
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
                    Swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
                });
        }else{
            this._uploadService.updateStatusFileContractor(this.detailFile)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    Swal.fire({
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
                    Swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
                });
        }

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // this._auth.setUserPresence(this.nombre, this.rol, false);

    }

}
