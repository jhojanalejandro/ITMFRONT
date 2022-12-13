import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HomeContractorService } from './home-contractor.service';
import { UploadFileContractorComponent } from './upload-file-contractor/upload-file.component';
import { saveAs } from "file-saver";
import JSZip from 'jszip';

@Component({
  selector: 'home-contractor',
  templateUrl: './home-contractor.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContractorComponent implements OnInit, OnDestroy {
  id: any;
  data: any;
  userName: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
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

  /**
   * Constructor
   */
  constructor(
    private _contractorService: HomeContractorService,
    private _matDialog: MatDialog,
    private auth: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
  ) {
  }

  /**
* On init
*/
  ngOnInit(): void {
    this.userName = this.auth.accessName
  }
  openDialog() {
    const dialogRef = this._matDialog.open(UploadFileContractorComponent, {
      autoFocus: false,
      data: {
        idUser: this.auth.accessId,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.getDataContractor(this.id);
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

  ngAfterContentChecked() {
    this.cdref.detectChanges();
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

    // const dialogRef =  this._matDialog.open(UploadDataContractoDataComponent, {
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
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


  getFilesFolder = async (id: any)=> {
    this._contractorService.getFileById(id).pipe(takeUntil(this._unsubscribeAll))
    .subscribe((Response: any) => {
        const jszip = new JSZip();
        Response.filedata = 'data:application/pdf;base64,'+Response.filedata
        var binary = atob(Response.filedata.split(',')[1]);
        var array = [];
        for (let j = 0; j < binary.length; j++) {
            array.push(binary.charCodeAt(j));
        }
        let pdf = new Blob([new Uint8Array(array)], {
            type: 'application/pdf'
        });
        jszip.folder("pruebaCarpeta").file(`${Response.filesName}.pdf`, pdf);
        jszip.generateAsync({ type: 'blob' }).then(function (content) {
          // see FileSaver.js
          saveAs(content, 'pruebaDescarga.zip');
      });
  })
}

}
