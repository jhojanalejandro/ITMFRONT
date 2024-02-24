import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { DataFile } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CollectionAccountsService } from './collection-accounts-list.service';
import Swal from 'sweetalert2';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { DetailFile, DocumentTypeFile, FileContractor } from 'app/layout/common/models/file-contractor';
import { CategoryFile, DocumentTypeCode, DocumentTypeCodes } from 'app/layout/common/enums/document-type/document-type';
import { GenericService } from 'app/modules/admin/generic/generic.service';
import { UploadFileContractComponent } from 'app/modules/admin/apps/file-manager/components/upload-file-contract/upload-file-contract.component';
import { UploadFileDataService } from '../../../contractual/service/upload-file.service';
import { FileListManagerService } from 'app/modules/admin/apps/file-manager/services/list-file.service';
import { AuthService } from 'app/core/auth/auth.service';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-collection-accounts-list',
  templateUrl: './collection-accounts-list.component.html',
  styleUrls: ['./collection-accounts-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CollectionAccountsListComponent implements OnInit {
  labelPosition: 'before' | 'after' = 'after';
  date = new FormControl(moment());
  dateDocument: Date;
  selection = new SelectionModel<any>(true, []);
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  items: any;
  value: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  searchInputControl: FormControl = new FormControl();
  filteredStreets: Observable<string[]>;
  type: any;
  contractId: any;
  dateSearch: any;
  tipoDocumentos: DocumentTypeFile[] = [];
  contratos: any;
  statusFileLoad: any;
  statusFileCreate: any;
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
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _collectionAccounts: CollectionAccountsService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _matDialog: MatDialog,
    private _gerenicService: GenericService,
    private _fileManagerService: FileListManagerService,
    private _uploadService: UploadFileDataService,
    private _auth: AuthService,
    private _uploadFileDataService: UploadFileDataService
  ) { }

  ngOnInit(): void {
    this.contractId = this._activatedRoute.snapshot.paramMap.get('contractId') || 'null';
    this.getData();
    this.getDocumentType();
    this.getContractsData();
    this.getStatusFile();
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

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
    //this.validateDinamycKey();
    const dialogRef = this._matDialog.open(UploadFileContractComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        show: false,
        contractorId: this.contractId
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
    this._collectionAccounts.item$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((item: DataFile) => {
        this.items = item;
        if(this.items.length > 0){
            this.items = this.items.map(file => ({
                ...file,
                statusFile: file.statusFile.toLowerCase()
            }));
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

  tipoSeleeccionado(event: any, type: string) {

    if (this.dateSearch === null || this.dateSearch === undefined) {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      this.dateSearch = year + '/' + month;

    }
    if (type == 'contract') {
      this.contractId = event.value;
    } else {
      this.type = event.value
    }
    this._collectionAccounts.getItemByTypeAndDate(this.type, this.contractId, this.dateSearch).subscribe((res) => {
      if (res != null) {
        this.items.files = res;
      } else {
        this.items.files = []
      }
      this._changeDetectorRef.detectChanges();
      this._changeDetectorRef.markForCheck();
    },
      (response) => {
        console.log(response);

        Swal.fire('Error', 'Error al Mostrar la informacion!', 'error');
      });
  }

  chosenMonthHandler = (normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) => {
    const ctrlValue = this.date.value;
    let month = normalizedMonth.month() + 1;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);

    datepicker.close();
    this.dateSearch += '/' + month;
    this._collectionAccounts.getItemByTypeAndDate(this.type, this.contractId, this.dateSearch).subscribe((res) => {
      if (res != null) {
        this.items.files = res;
      } else {
        this.items.files = []
      }
      this._changeDetectorRef.detectChanges();
      this._changeDetectorRef.markForCheck();
    },
      (response) => {
        Swal.fire('Error', 'Error al Mostrar la informacion!', 'error');
      });
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.dateSearch = normalizedYear.year();
    this.date.setValue(ctrlValue);
  }

  private getDocumentType() {
    this._uploadFileDataService
      .getDocumentType()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {

        if (res != null) {
          this.tipoDocumentos = res.filter(f => f.code === DocumentTypeCode.CUENTACOBRO || f.code === DocumentTypeCode.PLANILLA || f.code === DocumentTypeCode.INFORMEEJECUCIÓN);
        }
      }
      );
  }

  private getStatusFile() {
    this._fileManagerService.getStatusFile()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((item: any) => {
            this.statusFileLoad = item.filter(f => f.category === CategoryFile.CGD);
            this.statusFileCreate = item.filter(f => f.category === CategoryFile.CRAD);
            this.statusFileCreate = this.statusFileCreate.map(status => ({
                ...status,
                id: status.id.toLowerCase()
            }));
        });
}


updateFileFileGenerated(event: any, file: FileContractor) {
    this.detailFile.fileId = file.id;
    this.detailFile.registerDate = new Date();
    this.detailFile.passed = true;
    this.detailFile.statusFileId = event.value;
    this.detailFile.userId = this._auth.accessId;
    this.detailFile.contractId = this.contractId;
    // this.detailFile.contractorId = this.contractorId;
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

  getContractsData() {
    // Get the data
    this._gerenicService.getAllContract(true, 'Contractual')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.contratos = data;

      });
  }
}
