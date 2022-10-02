import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { IProjectFolder } from 'app/layout/common/models/project-folder';
import { AuthService } from 'app/core/auth/auth.service';
import { interval, Subject,takeUntil } from 'rxjs';
import { UploadDataService } from 'app/modules/admin/dashboards/project/upload-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-register-contractor',
    templateUrl: './show-file.component.html',
    styleUrls: ['./show-file.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ShowFileComponent implements OnInit {
  shortLink: string = "";
  file: File = null; // Variable to store file
  contratos: any;    pdfFilePath = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  id: any;
  constructor(
    private _upload: UploadDataService,
    private authService: AuthService,
    private router: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id') || 'null';

    this.getFile(this.id);
  }


  async getFile(id: any) {
    (await this._upload.getByIdFile(id)).subscribe((response) => {
        if(response != null){         
      
        }
      });
  }


}
