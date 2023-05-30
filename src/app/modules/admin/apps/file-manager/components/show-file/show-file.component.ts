import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { interval, Subject,takeUntil } from 'rxjs';
import { UploadDataService } from 'app/modules/admin/dashboards/contractual/service/upload-data.service';
import { ActivatedRoute } from '@angular/router';
import { FileListManagerService } from '../../services/list-file.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-register-contractor',
    templateUrl: './show-file.component.html',
    styleUrls: ['./show-file.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ShowFileComponent implements OnInit {
  shortLink: string = "";
  PathReportString: any;
  getFile: any;
  file: File = null; // Variable to store file
  contratos: any;    pdfFilePath = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  id: any;
  constructor(
    private _upload: UploadDataService,
    private _fileManagerService: FileListManagerService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer
    ) {}

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id') || 'null';

    this._fileManagerService.filesContract$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((item: any) => {
        this.id = item.id;
        // Open the drawer in case it is closed
        this.getFile = item.filedata;
        // this.getFile = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,'+this.getFile);
    });

    this.PathReportString = 'data:application/pdf;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(this.getFile) as any).changingThisBreaksApplicationSecurity;
      
    top.document.getElementById('ifrm').setAttribute("src", this.PathReportString);
    // this.getFile = `data:application/pdf;base64,${this.getFile}`;
    // const link = document.createElement("a");
    // link.href = this.getFile;
    // link.download = `${this.getFile}.pdf`
    // link.click();
    console.log(this.PathReportString);
    
  }

  // downloadPdf(base64String, fileName) {
  //   this.getFile = `data:application/pdf;base64,${base64String}`;
  //   const link = document.createElement("a");
  //   link.href = source;
  //   link.download = `${fileName}.pdf`
  //   link.click();
  // }
  // onClickDownloadPdf(){
  //   let base64String = "your-base64-string";
  //   this.downloadPdf(base64String,"sample");
  // }
  showPdf() {
    const pdfInBase64 = this.getFile;
    const newBlob = new Blob([pdfInBase64], {type: 'application/pdf'});
    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //   window.navigator.msSaveOrOpenBlob(newBlob); // For IE browser
    // }
    const linkElement = document.createElement('a');
    const url = URL.createObjectURL(newBlob);
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', 'sample.pdf');
    const clickEvent = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
     'cancelable': false
    });
    linkElement.dispatchEvent(clickEvent);
  }



}
