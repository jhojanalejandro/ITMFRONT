import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/service/upload-data.service';
import Swal from 'sweetalert2';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ContractList } from '../models/planing-model';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterContractFolderComponent } from '../componentes/register-project-folder/register-project-folder.component';
import { PlaningService } from '../service/planing.service';
import { OptionTypeDataComponent } from '../componentes/option-type-data/option-type-data.component';

@Component({
  selector: 'contracts',
  styleUrls: ['./contracts.component.scss'],
  templateUrl: './contracts.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContrtactsComponent implements OnInit, OnDestroy,AfterViewInit {
  userName: any;
  configForm: FormGroup;
  generateMinute: boolean = false; 
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  contracts: ContractList[] = [];
  typeContract: string;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  showcontracts: boolean = false;
  displayedColumns: string[] = ['numberProject', 'project', 'companyName', 'projectName', 'valorContrato', 'statusContract', 'contractorsCant', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _uploadData: UploadDataService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _planingService: PlaningService,
    private _matDialog: MatDialog,
    private auth: AuthService,
    private _router: Router,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private _formBuilder: FormBuilder,
    private router: ActivatedRoute,

  ) {
    this.typeContract = this.router.snapshot.paramMap.get('tipo') || null;
    if (this.typeContract === 'register') {
      this.showcontracts = true;

    } else if (this.typeContract === 'economic') {
      this.showcontracts = false;
    }

  }
  columnas = [
    { title: 'NÚMERO CONTRATO', name: 'numberProject' },
    { title: 'PROYECTO', name: 'project' },
    { title: 'NOMBRE EMPRESA', name: 'companyName' },
    { title: 'NOMBRE PROYECTO', name: 'projectName' },
    { title: 'VALOR CONTRATO', name: 'valorContrato' },
    { title: 'CANTIDAD CONTRATISTA', name: 'contractorsCant' },
    { title: 'ESTADO', name: 'statusContract' },
    { title: 'ACCIONES', name: 'action' },
  ]
  ngOnInit(): void {
    this.getContracts();
    this.userName = this.auth.accessName.toUpperCase();
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
  private getContracts() {
    this._planingService._contractList$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.contracts = response;
        this.dataSource = new MatTableDataSource(
          this.contracts
        );
        this.dataSource.sort = this.sort;
        this.getContractsData();
        this.cdref.detectChanges();
      });

  }

  SaveContract() {
    const dialogRefProject = this._matDialog.open(RegisterContractFolderComponent, {
      disableClose: true,
      autoFocus: false,
    });
    dialogRefProject.afterClosed().subscribe(datos => {
      if (datos) {
        this.reloadResolve();
      }
    });
  }

  UpdateDataContract(data: any) {
    const dialogRef = this._matDialog.open(RegisterContractFolderComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        data
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reloadResolve();
      }
    });
  }

  SaveOptions() {
    const dialogRefOption = this._matDialog.open(OptionTypeDataComponent, {
      disableClose: true,
      autoFocus: false,
    });
    dialogRefOption.afterClosed().subscribe(datos => {
      if (datos) {
        this.getContracts();
      }
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  getContractsData() {
    for (let index = 0; index < this.contracts.length; index++) {
      if (this.contracts[index].valorContrato === 0 || this.contracts[index].valorContrato === null) {
        this.contracts[index].valorContrato = 0;
      }
      if (this.contracts[index].contractorsCant === 0 || this.contracts[index].contractorsCant === null) {
        this.contracts[index].contractorsCant = 0;
      }
    }
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

  openConfirmationDelete(element: any): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._uploadData.finalContract(element.id).subscribe((res) => {
          if (res) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '',
              html: 'Información Eliminada Exitosamente!',
              showConfirmButton: false,
              timer: 1500
            });
          }
          this.getContractsData();
        },
          (response) => {
            console.log(response);
            Swal.fire('Error', 'Error al Eliminar la informacion!', 'error');
          });
      }
    });
  }

  addComponent(data: any) {
    this._router.navigateByUrl("/docs/ecommerce/Componentes/" + data.id + '/' + data.projectName);
  }

  generarMinuta(){
    this.generateMinute = true;
  }
  reloadResolve() {
    const currentUrl: any = this._router.url;
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigateByUrl(currentUrl);
    });
  }


} 