import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { ContractorListService } from './contractor-list.service';
import { MatDialog } from '@angular/material/dialog';
import { ContractorDataRegisterComponent } from '../register-data-contractor/register-data-contractor.component';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';


@Component({
    selector       : 'contractor-list',
    styleUrls: ['./contractor-list.component.scss'],
    templateUrl    : './contractor-list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorListComponent implements OnInit, OnDestroy
{
    id: any;
    data: any;
    userName: any;
    value: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    contratos: any;
    configForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    accountBalanceOptions: ApexOptions;
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['select','nombreCompleto','documentoDeIdentificacion','correo','telefono','nacionalidad','fechaNacimiento','acciones'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    enterAnimationDuration: any = '2000ms';
    exitAnimationDuration: string = '1500ms';
    /**
     * Constructor
     */
    constructor(
        private _contractorList: ContractorListService,
        private _matDialog: MatDialog,
        private auth: AuthService,
        private cdref: ChangeDetectorRef,
        private _liveAnnouncer: LiveAnnouncer,   
        private router: ActivatedRoute,  
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService

    )
    {
    }
    columnas = [ 
        {title: 'NOMBRE', name: 'nombreCompleto'},
        {title: 'CEDULA', name: 'documentoDeIdentificacion'},
        {title: 'CORREO', name: 'correo'},
        {title: 'TELEFONO', name: 'telefono'},
        {title: 'NACIONALIDAD', name: 'nacionalidad'},
        {title: 'FECHA NACIMIENTO', name: 'fechaNacimiento'},
        {title: '', name: 'acciones'}
    ]

            /**
       * On init
       */
    ngOnInit(): void
    {
      this.userName = this.auth.accessName
      this.id = this.router.snapshot.paramMap.get('id') || 'null';
      this.getDataContractor(this.id);
      this.configForm = this._formBuilder.group({
        title      : 'Remove contact',
        message    : 'Are you sure you want to remove this contact permanently? <span class="font-medium">This action cannot be undone!</span>',
        icon       : this._formBuilder.group({
            show : true,
            name : 'heroicons_outline:exclamation',
            color: 'warn'
        }),
        actions    : this._formBuilder.group({
            confirm: this._formBuilder.group({
                show : true,
                label: 'Remove',
                color: 'warn'
            }),
            cancel : this._formBuilder.group({
                show : true,
                label: 'Cancel'
            })
        }),
        dismissible: true
    });
    }
    openDialog(route: any,data: any) {
        //this.validateDinamycKey();
        switch(route){
            case 'registerData':
              const dialogRef =  this._matDialog.open(ContractorDataRegisterComponent, {
                width: '90%',
                autoFocus: false,
                data     : {
                    idUser: this.auth.accessId,
                    data
                }
              });
              dialogRef.afterClosed().subscribe((result) => {
                if(result){
                  this.getDataContractor(this.id);
                }
              }); 
            break
        //     case 'resultadosQr':
        //         this._router.navigate(['lista/resultados/qr'], { skipLocationChange: true });

        //    break

        }
    }
        
    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
          this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
          this._liveAnnouncer.announce('Sorting cleared');
        }
      }
      //metodo para animmación de columnas, para que se puedan mover de manera horizontal 
        drop(event: CdkDragDrop<string[]>){
            moveItemInArray(this.columnsToDisplay, event.previousIndex, event.currentIndex);
        }
  
      ngAfterContentChecked() {
        this.cdref.detectChanges();
       }
  

        //metodo de filtrar los datos de las columnas
        applyFilter(event: Event) {
            const filterValue = (event.target as HTMLInputElement).value;
            this.dataSource.filter = filterValue.trim().toLowerCase();  
          }
  
      ngAfterViewInit(): void
      {
          // Make the data source sortable
          this.dataSource.sort = this.recentTransactionsTableMatSort;
      }
  
      ngOnDestroy(): void
      {
          // Unsubscribe from all subscriptions
          this._unsubscribeAll.next(null);
          this._unsubscribeAll.complete();
      }
      selectRowFull(data: any) { 
        
        // const dialogRef =  this._matDialog.open(ContractorDataRegisterComponent, {
        //     autoFocus: false,
        //     data     : {
        //         idUser: this.auth.accessId,
        //         data
        //     }
        //   });
        //   dialogRef.afterClosed().subscribe((result) => {
        //     if(result){
        //       this.getDataContractor(this.id);
        //     }
        // }); 
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
   

    async getDataContractor(id: any) {
      (await this._contractorList.getByIdProject(id)).subscribe((Response) => {
        this.dataSource= new MatTableDataSource(Response);
        this.dataSource.sort= this.sort;
        this.dataSource.data = Response;  
      });

    }
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      console.log(this.selection.selected);
      
     //esta validacion nos permite mostrar y ocltar los detalles de una operacion
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
          console.log(this.value);
            
        }
      }
      openConfirmationDelete(element: any): void
      {
          // Open the dialog and save the reference of it
          const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
  
          // Subscribe to afterClosed from the dialog reference
          dialogRef.afterClosed().subscribe((result) => {
            if(result == 'confirmed'){
              this._contractorList.DeleteContractor(element.id).subscribe((res) => {   
                if(res){
                  swal.fire('informacion Eliminada Exitosamente!', '', 'success');
 
                }
                this.getDataContractor(this.id);

            },
            (response) => {
              // Set the alert
              swal.fire('Error al Registrar la informacion!', '', 'error');
            });
            }
              console.log("resultado",result);
          });
      }


}
