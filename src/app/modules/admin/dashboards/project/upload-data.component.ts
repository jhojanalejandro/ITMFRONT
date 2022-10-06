import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { UploadDataService } from './upload-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ProjectFolderComponent } from './register-project-folder/register-project-folder.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
@Component({
    selector       : 'upload',
    styleUrls: ['./upload-data.component.scss'],
    templateUrl    : './upload-data.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDataComponent implements OnInit, OnDestroy
{
    selectContract: any;
    data: any;
    userName: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<any>;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    accountBalanceOptions: ApexOptions;
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['id','companyName','projectName','registerDate','action'];
    columnsToDisplay: string[] = this.displayedColumns.slice();

    /**
     * Constructor
     */
    constructor(
        private _uploadData: UploadDataService,
        private _matDialog: MatDialog,
        private auth: AuthService,
        private cdref: ChangeDetectorRef,
        private _liveAnnouncer: LiveAnnouncer,   
        private _router:  Router
    )
    {
    }
    columnas = [ 
        {title: 'secuencia', name: 'id'},
        {title: 'NOMBRE EMPRESA', name: 'companyName'},
        {title: 'NOMBRE PROYECTO', name: 'projectName'},
        {title: 'FECHA REGISTRO', name: 'registerDate'},
        // {title: 'FECHA MODIFICACION', name: 'modifyDate'},
        {title: 'ACCIONES', name: 'action'},    
    ]
    ngOnInit(): void
    {
        this.getContractsData();
        this.userName = this.auth.accessName.toUpperCase();
        console.log(GlobalCont.numeroALetras(58225,'PESOS'));
        
        
    }

    openDialog(route: any,data: any) {
        //this.validateDinamycKey();
        switch(route){
            case 'registerFolder':
            const dialogRefPrroject = this._matDialog.open(ProjectFolderComponent);
            dialogRefPrroject.afterClosed().subscribe(datos => {
              if(datos){      
                this.getContractsData();
                // console.log('datos ',datos);               
              }               
            });
            break
            case 'editData':
              const dialogRef =  this._matDialog.open(ProjectFolderComponent, {
                autoFocus: false,
                data     : {
                    data
                }
              });
              dialogRef.afterClosed().subscribe((result) => {
                if(result){
                  this.getContractsData();
                }
              }); 
            break
            case 'upload':
              const dialogUpload =  this._matDialog.open(UploadFileComponent, {
                autoFocus: false,
                data     : {
                    show: true
                }
              });
              dialogUpload.afterClosed().subscribe((result) => {
                if(result){
                    
                }
              });   
            break
            case 'registerData':
              this._router.navigate(['/dashboards/lista-contratistas/'+ data.id]);

          break

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
      selectRowFull(data: any, type: any) { 
      if(type === 'register'){
      }

    }
   
    getContractsData(){
              // Get the data
      this._uploadData.getAllContract().pipe(takeUntil(this._unsubscribeAll))
        .subscribe((Response) => {
          this.dataSource= new MatTableDataSource(Response);
          this.dataSource.sort= this.sort;
          this.dataSource.data = Response;  
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
   


}
