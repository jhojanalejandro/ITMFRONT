import {
    Component,
    OnInit,
    Inject,
    ViewEncapsulation,
    ChangeDetectorRef,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { DocumentTypeFile, FileContractor } from 'app/layout/common/models/file-contractor';
import { DocumentTypeCodes } from 'app/layout/common/enums/document-type/document-type';
import { fuseAnimations } from '@fuse/animations';
import { ContractorService } from 'app/modules/admin/dashboards/contractual/service/contractor.service';
import { Contractor } from 'app/modules/admin/dashboards/contractual/models/contractor';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/service/upload-file.service';
const moment = _rollupMoment || _moment;
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
    parse: {
      dateInput: 'MM/YYYY',
    },
    display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
@Component({
    selector: 'app-upload-file-contractor',
    templateUrl: './upload-file-contractor.component.html',
    styleUrls: ['./upload-file-contractor.component.scss'],
        providers: [DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class UploadFileContractorComponent implements OnInit, OnDestroy {
    date = new FormControl(new Date(),Validators.required);
    @ViewChild('signInNgForm') uploadNgForm: NgForm;
    monthYear: any;
    shortLink: string = '';
    loading: boolean = false; // Flag variable
    file: any = null; // Variable to store file
    indeterminate = false;
    showAlert: boolean = false;
    registerDate = new Date();
    typeDocs: DocumentTypeFile[] = [];
    dataContractor: Contractor;
    base64Output: any;
    numberOfTicks = 0;
    formFile: FormGroup;
    title: string = 'Cargar Archivos Contratación'
    showDate: boolean = false;
    nominaShow: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private ref: ChangeDetectorRef,
        private _uploadFileDataService: UploadFileDataService,
        private _auth: AuthService,
        private _contractorListService: ContractorService,
        public matDialogRef: MatDialogRef<UploadFileContractorComponent>,
        @Inject(MAT_DIALOG_DATA) private _data,
        private _formBuilder?: FormBuilder,
    ) {
        setInterval(() => {
            this.numberOfTicks++;
            // require view to be updated
            this.ref.detectChanges();
            this.ref.markForCheck();
        }, 1000);
    }

    ngOnInit(): void {
        swal.fire(
            '',
            'Si cargas un archivo y lo guardas, no podras modificar, ni volver a cargarlo',
            'question'
        );
        this.formFile = this._formBuilder.group({
            file: new FormControl(null, Validators.required),
            filesName: new FormControl(null),
            typeDoc: new FormControl(null, Validators.required),
            description: new FormControl(null)
        });
        this.getDaTaContractor();
    }

    onChange(event) {
        this.file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        this.convertFile(this.file).subscribe((base64) => {
            this.base64Output = base64;
        });
    }

    cerrar(): void {
        this.matDialogRef.close();
    }

    addFileContractor(event) : void{
        if (this.formFile.invalid) {
            return;
        }
        let name = this.file.name.split('.')
        const registerFile: FileContractor = {
            contractorId: this._auth.accessId,
            contractId: this._data.contractId,
            filesName: name[0],
            documentType: this.formFile.value.typeDoc,
            fileType: name[1].toUpperCase(),
            descriptionFile: this.formFile.value.description,
            registerDate: this.registerDate,
            modifyDate: this.registerDate,
            filedata: this.base64Output,
            monthPayment: this.date.value.getFullYear().toString() + '/'+this.date.value.getMonth() +1,
            userId: null,
            folderId: null,
            anexo: false
        };
        this.formFile.disable();
        if(this.nominaShow){
            this._uploadFileDataService
            .SaveFileContractorPayment(registerFile)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (res) => {
                    if (res.success) {
                        swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: res.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        this.ref.detectChanges();
                        this.ref.markForCheck();
                        this.matDialogRef.close();
                    }
                },
                (response) => {
                    this.formFile.enable();
                    // Set the alert
                    swal.fire(
                        'Error',
                        'Error al Registrar la informacion!',
                        'error'
                    );
                    // Show the alert
                    this.showAlert = true;
                }
            );
        }else{
            this._uploadFileDataService
            .UploadFileContractor(registerFile)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (res) => {
                    if (res.success) {
                        swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '',
                            html: res.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        this.ref.detectChanges();
                        this.ref.markForCheck();
                        this.matDialogRef.close();
                    }
                },
                (response) => {
                    this.formFile.enable();
                    // Set the alert
                    swal.fire(
                        'Error',
                        'Error al Registrar la informacion!',
                        'error'
                    );
                    // Show the alert
                    this.showAlert = true;
                }
            );
        }

    }

    convertFile(file: File): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event) =>
            result.next(btoa(event.target.result.toString()));
        return result;
    }

    chosenMonthHandler(
        normalizedMonth: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = this.date.value;
        let month = normalizedMonth.month() + 1;
        ctrlValue.month(normalizedMonth.month());
        this.monthYear += '/' + month;
        this.date.setValue(ctrlValue);
        datepicker.close();
    }

    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value;
        this.monthYear = normalizedYear.year();
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
    }

    typeDocumentSelected(event: any) {
        let type = this.typeDocs.find(f => f.id === event.value).code
        if (type === DocumentTypeCodes.CUENTACOBRO || type === DocumentTypeCodes.PLANILLA || type === DocumentTypeCodes.INFORMEEJECUCIÓN) {
            this.showDate = true;
        } else {
            this.showDate = false;
        }
    }
    private getDocumentType(filter: boolean) {
        this._uploadFileDataService
            .getDocumentType()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res != null) {
                    this.typeDocs = res;
                    this.gevalidateDocument();
                }
            }
            );
    }

    private getDaTaContractor(): any {
        this._contractorListService
            .getContractorByIdProject(this._data.contractId,this._data.contractorId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp) => {
                this.dataContractor = resp;
                if (resp != null) {
                    this.getDocumentType(true);
                } else {
                    this.getDocumentType(false);
                }
            }
            );
        return this.dataContractor;
    }

    private gevalidateDocument() {
        this._contractorListService
            .getValidateDocumentUploadEndpoint(this._data.contractId, this._data.contractorId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp) => {
                if (!resp.activateTermContract && !resp.activateTermPayments) {
                    swal.fire(
                        '',
                        'ya ha terminado la fecha de entrega, comunicate con el personal encargado, para habilitar la  carga de documentos!',
                        'warning'
                    );
                    this.cerrar();
                }
                if (resp.dct && resp.hv && resp.secop && resp.exam && !resp.activateTermPayments) {
                    swal.fire(
                        '',
                        'ya se cargaron los tres documentos no puedes cargar mas!',
                        'warning'
                    );
                    this.cerrar();
                }
                if (resp.activateTermContract && !resp.activateTermPayments) {
                    this.typeDocs = this.typeDocs.filter(f => f.code == DocumentTypeCodes.EXAMENESPREOCUPACIONALES || f.code == DocumentTypeCodes.HOJADEVIDA || f.code == DocumentTypeCodes.REGISTROSECOP || f.code == DocumentTypeCodes.DOCUMENTOSCONTRATACION)
                    if (resp.hv) {
                        this.typeDocs = this.typeDocs.filter(f => f.code != DocumentTypeCodes.HOJADEVIDA)
                    }
                    if (resp.exam) {
                        this.typeDocs = this.typeDocs.filter(f => f.code != DocumentTypeCodes.EXAMENESPREOCUPACIONALES)

                    }
                    if (resp.secop) {
                        this.typeDocs = this.typeDocs.filter(f => f.code != DocumentTypeCodes.REGISTROSECOP)
                    }
                    if (resp.dct) {
                        this.typeDocs = this.typeDocs.filter(f => f.code != DocumentTypeCodes.DOCUMENTOSCONTRATACION)
                    }
                }
                else if(resp.activateTermPayments){
                    this.nominaShow = true;
                    this.title = 'Cargar Archivos Nomina'
                    this.typeDocs = this.typeDocs.filter(f =>  f.code == DocumentTypeCodes.INFORMEEJECUCIÓN || f.code == DocumentTypeCodes.CUENTACOBRO);
                }
            }
            );
        return this.dataContractor;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.complete();
        this._unsubscribeAll.next(true);
    }
}
