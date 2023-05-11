import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { HomeContractorService } from './services/home-contractor.service';
import { UploadFileContractorComponent } from './components/upload-file-contractor/upload-file.component';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContractorService } from '../../dashboards/contractual/service/contractor.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ChargeAccount, ExecutionReport } from './models/pdfDocument';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'home-contractor',
    templateUrl: './home-contractor.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeContractorComponent implements OnInit, OnDestroy {
    viewFilesContract: boolean = false;
    viwFilesGenerated: boolean = false;
    filesCharged: boolean = false;
    fileContractorList: any;
    chargeAccountData: PaymentAccount;
    executionReportData: ExecutionReport;
    contractIdList: any[] = [];
    minutesDocumentPdf: File;
    contractSelected: string = null;
    id: any;
    userName: any;
    chargeAccount: boolean = false;
    executionReport: boolean = false;
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
        private _contractorListService: ContractorService
    ) {}

    /**
     * On init
     */
    ngOnInit(): void {
        this.userName = this._auth.accessName;
        this.getContract();
    }
    openDialog() {
        const dialogRef = this._matDialog.open(UploadFileContractorComponent, {
            autoFocus: false,
            data: {
                idUser: this._auth.accessId,
                contractId: this.contractSelected,
                contractorId: this._auth.accessId,
            },
        });
        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result) {
                    // this.getDataContractor(this.id);
                }
            });
    }
    changeToViewFilesContract() {
        this.viewFilesContract = true;
        this.getFilesUserByContract();
    }

    getFilesFolder = async (id: any) => {
        this._contractorService
            .getFileById(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((Response: any) => {
                const jszip = new JSZip();
                Response.filedata =
                    'data:application/pdf;base64,' + Response.filedata;
                var binary = atob(Response.filedata.split(',')[1]);
                var array = [];
                for (let j = 0; j < binary.length; j++) {
                    array.push(binary.charCodeAt(j));
                }
                let pdf = new Blob([new Uint8Array(array)], {
                    type: 'application/pdf',
                });
                jszip
                    .folder('pruebaCarpeta')
                    .file(`${Response.filesName}.pdf`, pdf);
                jszip.generateAsync({ type: 'blob' }).then(function (content) {
                    // see FileSaver.js
                    saveAs(content, 'pruebaDescarga.zip');
                });
            });
    };

    public downloadAsPDFs() {
        let data = document.getElementById('htmlData');

        const pdfTable = this.pdfTable.nativeElement;

        var html = htmlToPdfmake(pdfTable.innerHTML);

        const documentDefinition = { content: html };
        pdfMake.createPdf(documentDefinition).download();
    }

    getDataContractor() {
        if (this.contractSelected != null) {
            this.getChargeAccount();
            this.getExecutionReport();
        } else {
            swal.fire('', 'No has seleccionado contrato!', 'warning');
        }
    }

    private getContract() {
        this._contractorListService
            .getContractorByContract(this._auth.accessId)
            .subscribe((Response) => {
                this.contractIdList = Response;
            });
    }

    private getFilesUserByContract() {
        this._contractorListService
            .getFilesContractorByContractId(
                this._auth.accessId,
                this.contractSelected
            )
            .subscribe((Response: any) => {
                if (Response.length > 0) {
                    this.fileContractorList = Response;
                    return (this.filesCharged = true);
                }
                if (Response.length <= 0) {
                    this.filesCharged = false;
                    return (this.fileContractorList = []);
                }
            });
    }

    private getChargeAccount() {
        if (this.contractSelected != null) {
            this._contractorListService
                .getPaymentAccount(this._auth.accessId, this.contractSelected)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((Response) => {
                    if (Response != null) {
                        this.chargeAccountData = Response;
                        this.chargeAccount = true;
                    }
                });
        } else {
            swal.fire('', 'No has seleccionado contrato!', 'warning');
        }
    }

    private getExecutionReport() {
        if (this.contractSelected != null) {
            this._contractorService
                .getExecutionReport(this._auth.accessId, this.contractSelected)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((Response) => {
                    if (Response != null) {
                        this.executionReportData = Response;
                        this.chargeAccount = true;
                    }
                });
        } else {
            swal.fire('', 'No has seleccionado contrato!', 'warning');
        }
    }
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }

    descargarCuenta() {
        this._contractorListService
            .getContractorByContract(this._auth.accessId)
            .subscribe((Response) => {
                this.contractIdList = Response;
            });
    }

    descargarActa() {
        this._contractorService
            .GetMinutesPdfContractor(this._auth.accessId, this.contractSelected)
            .subscribe((Response) => {
                this.minutesDocumentPdf = Response;
            });
    }

    downloadPdf(base64String, fileName) {
        const source = `data:application/pdf;base64,${base64String}`;
        const link = document.createElement('a');
        link.href = source;
        link.download = `${fileName}.pdf`;
        link.click();
    }

    onClickDownloadPdf(b64Dada: string, fileName: string) {
        let base64String = b64Dada;
        this.downloadPdf(base64String, fileName);
    }
    onGeneratePdf(e: any) {
        this.chargeAccount = e;
        this.executionReport = e;
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
