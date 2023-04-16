import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HomeContractorService } from './services/home-contractor.service';
import { UploadFileContractorComponent } from './components/upload-file-contractor/upload-file.component';
import { saveAs } from "file-saver";
import JSZip from 'jszip';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContractorService } from '../../dashboards/contractual/service/contractor.service';
import { Router } from '@angular/router';
import { PaymentAccount } from '../../dashboards/contractual/models/paymentAccount';
import { ContractsContractor } from './models/fileContractor';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'home-contractor',
  templateUrl: './home-contractor.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContractorComponent implements OnInit, OnDestroy {
  dataCuenta: PaymentAccount;
  contractIdList: any[] = [];
  minutesDocumentPdf: File;
  contractSelected: string;
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
    private _router: Router,
    private _contractorListService: ContractorService,
  ) {
  }

  /**
* On init
*/
  ngOnInit(): void {
    this.userName = this._auth.accessName
    this.getContract();
  }
  openDialog() {
    debugger
    const dialogRef = this._matDialog.open(UploadFileContractorComponent, {
      autoFocus: false,
      data: {
        idUser: this._auth.accessId,
        contractId: this.contractSelected,
        contractorId: this._auth.accessId,
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

  private getDataContractor() {
    this._contractorListService.getPaymentAccount(this._auth.accessId, this.contractSelected).subscribe((Response) => {
      debugger
      if (Response != null) {
        this.dataCuenta = Response;
      }
    });
  }

  getContract() {
    this._contractorListService.getContractorByContract(this._auth.accessId).subscribe((Response) => {
      this.contractIdList = Response;
    });
  }
  getAccount() {
    this.cuentaCobro = true;
  }
  signOut(): void {
    this._router.navigate(['/sign-out']);
  }

  getContracts(event) {
    this.getDataContractor();
  }
  descargarCuenta() {
    this._contractorListService.getContractorByContract(this._auth.accessId).subscribe((Response) => {
      this.contractIdList = Response;
    });

  }
  
  descargarActa() {
    this._contractorService.GetMinutesPdfContractor(this._auth.accessId, this.contractSelected).subscribe((Response) => {
      this.minutesDocumentPdf = Response;
    });
  }

  downloadPdf(base64String, fileName) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
  }

  onClickDownloadPdf(){
    let base64String = "your-base64-string";
    this.downloadPdf(base64String,"sample");
  }
}
