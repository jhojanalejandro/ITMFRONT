import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
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
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContractorPaymentRegisterComponent } from './payroll-register/contractor-payment-register.component';
import { ContractorService } from '../../contractual/service/contractor.service';
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
  listId: any[] = [];
  disableElement: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  elements: Elements[];
  componentes: Componente[];
  configForm: FormGroup;
  componentselectId: any;
  elementselectId: any;
  paymentData: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'nombre', 'identificacion', 'correo', 'telefono', 'fechaNacimiento', 'componenteId', 'elementId', 'acciones'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  enterAnimationDuration: any = '2000ms';
  exitAnimationDuration: string = '1500ms';

  constructor(
    private _contractorList: ContractorService,
    private _matDialog: MatDialog,
    private auth: AuthService,
    private _cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private routerActivate: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService

  ) {
  }
  columnas = [
    { title: 'NOMBRE', name: 'nombre' },
    { title: 'CEDULA', name: 'identificacion' },
    { title: 'CORREO', name: 'correo' },
    { title: 'TELEFONO', name: 'telefono' },
    { title: 'FECHA NACIMIENTO', name: 'fechaNacimiento' },
    { title: '', name: 'componenteId' },
    { title: '', name: 'elementId' },
    { title: '', name: 'acciones' }
  ]

  /**
* On init
*/
  ngOnInit(): void {
    this.userName = this.auth.accessName
    this.contractId = this.routerActivate.snapshot.paramMap.get('id') || 'null';
    this.getDataContractor(this.contractId);
    this.configForm = this._formBuilder.group({
      title: 'Eliminar Registro',
      message: '¿Estás seguro de que desea eliminar este contacto de forma permanente? <span class="font-medium">Esta acción no se puede deshace!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Eliminar',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancelar'
        })
      }),
      dismissible: true
    });
  }
  registerPayment(data: any) {
    if (this.selection.selected.length > 0 || data != null) {
      if (data == null) {
        data = { id: 0, contractId: null, componenteId: null, elementId: null }
        this.selection.selected.forEach(element => {
          this.listId.push(element.id);
        });
      }
      const dialogRefPayment = this._matDialog.open(ContractorPaymentRegisterComponent, {
        width: '900px',
        disableClose: true,
        autoFocus: false,
        data: {
          payment: this.paymentData,
          idUser: this.auth.accessId,
          id: data.id,
          nombre: data.nombre,
          idContractors: this.listId,
          contractId: this.contractId
        }
      });
      dialogRefPayment.afterClosed().subscribe((result) => {
        if (result) {
          this.getDataContractor(this.contractId);
        }
        this.listId = [];
      });
    } else {
      swal.fire('Ei', 'Debes seleccionar registros!', 'warning');

    }
  }

  historicalPayment(item: any) {
    this._router.navigate(['/dashboards/nomina/payment/Contractor/' + this.contractId+'/' + item.id], { relativeTo: this.routerActivate });
    this._cdref.markForCheck();

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
    this._cdref.detectChanges();
  }


  //metodo de filtrar los datos de las columnas
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.dataSource.sort = this.recentTransactionsTableMatSort;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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


  async getDataContractor(id: any) {
    (await this._contractorList.getContractorByIdProject(id)).subscribe((Response) => {
      this.dataSource = new MatTableDataSource(Response);
      this.dataSource.sort = this.sort;
      this.dataSource.data = Response;


    });

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    //esta validacion nos permite mostrar y ocltar los detalles de una operacion
    //console.log('data', this.selection.selected);

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
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._contractorList.DeleteContractor(element.id).subscribe((res) => {
          if (res) {
            swal.fire('Bien', 'informacion Eliminada Exitosamente!', 'success');

          }
          this.getDataContractor(this.contractId);

        },
          (response) => {
            // Set the alert
            swal.fire('Error', 'Error al Registrar la informacion!', 'error');
          });
      }
    });
  }
  SendMailsAccounts() {

    // this.selection.selected.forEach(element => {

    // });
    let ids: any = { 'idContrato': this.contractId, 'idContratistas': this.selection.selected }
    this._contractorList.sendmailsAccounts(ids).subscribe((Response) => {
      console.log(Response);

    });

  }


}
