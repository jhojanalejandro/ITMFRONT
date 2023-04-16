import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import swal from 'sweetalert2';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ContractorDataRegisterComponent } from './components/register-data-contractor/register-data-contractor.component';
import { ModificacionFormComponent } from './components/modificacion-form/modificacion-form.component';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { ContractorService } from '../service/contractor.service';
import { MatPaginator } from '@angular/material/paginator';
import { ContractContractors } from '../models/contractor';
import { NewnessContractorComponent } from './components/newness-contractor/newness-contractor.component';
import { Componente, Elements } from 'app/modules/admin/pages/planing/models/planing-model';


@Component({
  selector: 'contractor-list',
  styleUrls: ['./contractor-list.component.scss'],
  templateUrl: './contractor-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorListComponent implements OnInit, OnDestroy {
  contractId: string;
  data: any;
  userName: any;
  value: any;
  minuta: boolean;
  estudioPrevio: boolean;
  cuentaCobro: boolean;
  minutaAdicion: boolean;
  disableElement: boolean = true;
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  elements: Elements[];
  componentes: Componente[];
  listId: any[] = [];
  contractors: any;
  configForm: FormGroup;
  componentselectId: any;
  elementselectId: any;
  contractContractors: ContractContractors = { contractId: null, contractors: [] };
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'nombre', 'identificacion', 'correo', 'telefono', 'fechaNacimiento', 'acciones'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  enterAnimationDuration: any = '2000ms';
  exitAnimationDuration: string = '1500ms';
  visibleOption: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
    private _contractorListService: ContractorService,
    private _genericService: GenericService,
    private _matDialog: MatDialog,
    private auth: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private router: ActivatedRoute,
    private _formBuilder: FormBuilder,
  ) {
    this.getDataContractor();
  }
  columnas = [
    { title: 'NOMBRE', name: 'nombre' },
    { title: 'CEDULA', name: 'identificacion' },
    { title: 'CORREO', name: 'correo' },
    { title: 'TELEFONO', name: 'telefono' },
    { title: 'FECHA NACIMIENTO', name: 'fechaNacimiento' },
    { title: '', name: 'acciones' }
  ]

  /**
* On init
*/
  ngOnInit(): void {
    this.userName = this.auth.accessName
    this.contractId = this.router.snapshot.paramMap.get('id') || 'null';
    this.configForm = this._formBuilder.group({
      title: 'Remove contact',
      message: 'Are you sure you want to remove this contact permanently? <span class="font-medium">This action cannot be undone!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel'
        })
      }),
      dismissible: true
    });
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  //metodo para animmación de columnas, para que se puedan mover de manera horizontal 
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnsToDisplay, event.previousIndex, event.currentIndex);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }


  //metodo de filtrar los datos de las columnas
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.recentTransactionsTableMatSort;
  }

  selectRowFull(data: any) {
    console.log(data);
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


  async getDataContractor() {
    this.contractors = this._contractorListService._contractors$;
    this.dataSource = new MatTableDataSource(
      this.contractors.source._value
    );
  }
  isAllSelected() {
    if(this.selection.selected.length > 1){
      this.visibleOption = true;
    }else{
      this.visibleOption = false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);

  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
  }

  //metodo que obtiene las columnas seleccionadas de la grid
  selectRow($event: any, dataSource: any) {
    if ($event.checked) {
      this.value = dataSource;
    }
  }

  openConfirmationDelete(element: any): void {
    const dialogRef = this._matDialog.open(NewnessContractorComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        id: null,
        contractId: this.contractId,
        contractorId: element.id,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDataContractor();
      }
      this.selection.clear();
    });
  }

  SendMailsAccounts() {
    let ids: any = { 'idContrato': this.contractId, 'idContratistas': this.selection.selected }
    this._contractorListService.sendmailsAccounts(ids)
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((Response) => {
      console.log(Response);

    });

  }

  modificacionContrato(data: any) {
    const dialogModificacion = this._matDialog.open(ModificacionFormComponent, {
      width: '900px',
      disableClose: true,
      autoFocus: false,
      data: {
        idUser: this.auth.accessId,
        data
      }
    });
    dialogModificacion.afterClosed()
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((result) => {
      if (result) {
        this.getDataContractor();
      }
    });
  }
  registrarDatosContratacion(data: any) {
    if (data == null) {
      data = { id: null, contractId: null, componenteId: null, elementId: null }
      this.selection.selected.forEach(element => {
        this.listId.push(element.id);
      });
    }
    const dialogRef = this._matDialog.open(ContractorDataRegisterComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        idUser: this.auth.accessId,
        contractId: this.contractId,
        id: data.id,
        componenteId: data.componenteId,
        elementId: data.elementId,
        idContractors: this.listId
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDataContractor();
      }
      this.selection.clear();
      this.listId = [];
    });

  }

  generarMinuta(data: any = null) {
    if (data != null) {
      this.contractContractors.contractors = [data.id];
    } else {
      this.selection.selected.forEach(element => {
        this.contractContractors.contractors.push(element.id);
      });
    }
    this.contractContractors.contractId = this.contractId
    this.minuta = true;

  }
  generarEstudiosPrevios(data: any = null) {
    this.contractContractors.contractors = [data.id];
    this.contractContractors.contractId = this.contractId
    this.estudioPrevio = true;
  }

  activateContarct() {
    this._genericService.UpdateStateProjectFolder(this.contractId)
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((resp) => {
      if (resp) {
        swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Bien',
          html: 'Contrato activado exitosamente!',
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        swal.fire('Error', 'Error al activar el contrato! a falta de información', 'error');
      }
    },
      (response) => {
        // Set the alert
        console.log(response);

        swal.fire('Error', 'Error al activar el contrato!', 'error');
      })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
