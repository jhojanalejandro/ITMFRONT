import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { UploadDataService } from './upload-data.service';
import { ContractorRegister } from './register-contractor/register-contractor.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
    selector       : 'upload',
    styleUrls: ['./upload-data.component.scss'],
    templateUrl    : './upload-data.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDataComponent implements OnInit, OnDestroy
{
    data: any;
    userName: any;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    raffleName: any;
    configForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    accountBalanceOptions: ApexOptions;
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['userName','lastName','identificationCard','userEmail','country', 'department','municipality','TicketCount'];
    columnsToDisplay: string[] = this.displayedColumns.slice();

    /**
     * Constructor
     */
    constructor(
        private _uploadData: UploadDataService,
        private authService: AuthService,
        private _matDialog: MatDialog,
        private router: Router,
        private cdref: ChangeDetectorRef,
        private _liveAnnouncer: LiveAnnouncer,     
    )
    {
    }

    columnas = [ 
        {title: 'NOMBRE', name: 'userName'},
        {title: 'APELLIDO', name: 'lastName'},
        {title: 'CEDULA', name: 'identificationCard'},
        {title: 'CORREO', name: 'userEmail'},
        {title: 'PAIS', name: 'country'},
        {title: 'DEPARTAMENTO', name: 'department'},
        {title: 'MUNICIPIO', name: 'municipality'},
        {title: 'Cantidad de boletos', name: 'TicketCount'}
      ]

    /**
     * On init
     */

    openDialog(route: any) {
        //this.validateDinamycKey();
        switch(route){
            case 'register':
            const dialogRef = this._matDialog.open(ContractorRegister);
            dialogRef.afterClosed().subscribe(datos => {
              if(datos){      
                // console.log('datos ',datos);               
              }               
            });
            break
        //     case 'addRafle':
        //         const dialogRefs = this.dialog.open(AddRaffleComponent);
        //         dialogRefs.afterClosed().subscribe((result) => {

        //         });
        //     break
        //     case 'winTicket':
        //         const dialogWin = this.dialog.open(WinTicketComponent);
        //         dialogWin.afterClosed().subscribe(datos => {
        //             if(datos != 'vacio'){
        //                 this.dataRandom = datos; 
        //                 this.divShow = true;  
        //             }
                                           
        //         });
        //     break
        //     case 'raffleList':
        //         this._router.navigate(['lista/rifas']);
        //     break
        //     case 'ticketList':
        //         this._router.navigate(['lista/boletos']);
        //     break
        //     case 'style':
        //         this._router.navigate(['juega'], { skipLocationChange: true });
        //     break
        //     case 'resultados':
        //          this._router.navigate(['lista/resultados']);

        //     break
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
  
      /**
       * On init
       */
      ngOnInit(): void
      {
          this.getUserData();
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
  
      /**
       * On destroy
       */
      ngOnDestroy(): void
      {
          // Unsubscribe from all subscriptions
          this._unsubscribeAll.next(null);
          this._unsubscribeAll.complete();
      }
  
    
      selectRowFull(userId: any) {    
          this.router.navigateByUrl('pages/usuario/detalle/' + userId.id)
    }
   
    getUserData(){
              // Get the data
              this._uploadData.getAllUser()
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe((data) => {
                      
                for (let index = 0; index < data.length; index++) {
                  this.getTicketUser(data[index].id, index);
                }   
                this.dataSource= new MatTableDataSource(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort= this.sort;
                this.dataSource.data = data;  
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
   
      async getTicketUser(id: any, po: any) {
          (await this._uploadData.getTicketsUser(id)).subscribe((Response) => {
              this.dataSource.data[po].TicketCount =  Response.length;
          });
  
      }


}
