import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HomeContractorService } from './home-contractor.service';
import { UploadFileContractorComponent } from './upload-file-contractor/upload-file.component';
import { saveAs } from "file-saver";
import JSZip from 'jszip';

import html2canvas from 'html2canvas';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContractorListService } from '../../dashboards/contractual/contractor-list/contractor-list.service';
import { Contractor } from '../../dashboards/contractual/contractor-list/models/contractort';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'home-contractor',
  templateUrl: './home-contractor.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContractorComponent implements OnInit, OnDestroy {
  dataCuenta: Contractor;
  id: any;
  userName: any;
  cuentaCobro: boolean = false;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  raffleName: any;
  contratos: any;
  configForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  accountBalanceOptions: ApexOptions;

  /**
   * Constructor
   */
  constructor(
    private _contractorService: HomeContractorService,
    private _matDialog: MatDialog,
    private _auth: AuthService,
    private _contractorListService: ContractorListService,
  ) {
  }

  /**
* On init
*/
  ngOnInit(): void {
    this.userName = this._auth.accessName
    this.getDataContractor();
  }
  openDialog() {
    const dialogRef = this._matDialog.open(UploadFileContractorComponent, {
      autoFocus: false,
      data: {
        idUser: this._auth.accessId,
        contractId: this.dataCuenta.contractId,
        contractorId: this.dataCuenta.id,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.getDataContractor(this.id);
      }
    });
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  getFilesFolder = async (id: any) => {
    this._contractorService.getFileById(id).pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Response: any) => {
        const jszip = new JSZip();
        Response.filedata = 'data:application/pdf;base64,' + Response.filedata
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


  public downloadAsPDFs() {

    let data = document.getElementById('htmlData');

    const pdfTable = this.pdfTable.nativeElement;

    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();

  }

  async getDataContractor() {
    (await this._contractorListService.getContractorById(this._auth.accessId)).subscribe((Response) => {
      this.dataCuenta = Response;
    });
  }
  getAccount(){
    this.cuentaCobro = true;
  }
}
