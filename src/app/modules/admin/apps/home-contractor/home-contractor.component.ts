import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { HomeContractorService } from './home-contractor.service';
import { UploadDataContractoDataComponent } from './data-viability/upload-data-contractor.component';

@Component({
    selector       : 'home-contractor',
    templateUrl    : './home-contractor.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContractorComponent implements OnInit, OnDestroy
{
    id: any;
    data: any;
    userName: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    raffleName: any;
    contratos: any;
    configForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    accountBalanceOptions: ApexOptions;
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['nombre','apellido','documentodeidentificacion','correo','telefono','nacionalidad','fechanacimiento','acciones'];
    columnsToDisplay: string[] = this.displayedColumns.slice();

    /**
     * Constructor
     */
    constructor(
        private _contractorService: HomeContractorService,
        private _matDialog: MatDialog,
        private auth: AuthService,
        private cdref: ChangeDetectorRef,
        private _liveAnnouncer: LiveAnnouncer,   
        private router: ActivatedRoute,  
    )
    {
    }
    columnas = [ 
        {title: 'NOMBRE', name: 'nombre'},
        {title: 'APELLIDO', name: 'apellido'},
        {title: 'CEDULA', name: 'documentodeidentificacion'},
        {title: 'CORREO', name: 'correo'},
        {title: 'TELEFONO', name: 'telefono'},
        {title: 'NACIONALIDAD', name: 'nacionalidad'},
        {title: 'FECHA NACIMIENTO', name: 'fechanacimiento'},
        {title: 'ACCIONES', name: 'acciones'}
    ]

            /**
       * On init
       */
    ngOnInit(): void
    {
      this.userName = this.auth.accessName
      this.id = this.router.snapshot.paramMap.get('id') || 'null';
      this.getDataContractor(this.id);
    }
    openDialog(route: any,data: any) {
        //this.validateDinamycKey();
        switch(route){
            case 'registerData':
              const dialogRef =  this._matDialog.open(UploadDataContractoDataComponent, {
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
        
        const dialogRef =  this._matDialog.open(UploadDataContractoDataComponent, {
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
      (await this._contractorService.getByIdFile(id)).subscribe((Response) => {
        this.dataSource= new MatTableDataSource(Response);
        this.dataSource.sort= this.sort;
        this.dataSource.data = Response;  
      });

    }


}
