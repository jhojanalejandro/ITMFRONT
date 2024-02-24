import {
    Component,
    OnInit,
    Inject,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { AuthService } from 'app/core/auth/auth.service';
import { ContractorPayments } from 'app/modules/admin/dashboards/nomina/models/contractor-payments';
import { NominaService } from 'app/modules/admin/dashboards/nomina/service/nomina.service';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import {
    PaymentSecurity,
    PorcentageModel,
    VerifySheet,
} from '../../models/porcentage.model';
import { HomeContractorService } from '../../services/home-contractor.service';
import { FileContractor } from 'app/layout/common/models/file-contractor';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/service/upload-file.service';
import { DocumentTypeCode } from 'app/layout/common/enums/document-type/document-type';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';


import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';
import { ContractorService } from 'app/modules/admin/dashboards/contractual/service/contractor.service';
@Component({
    selector: 'app-contractor-payment-security',
    templateUrl: './contractor-payment-security-register.component.html',
    styleUrls: ['./contractor-payment-security-register.component.scss'],
})
export class ContractorPaymentSecurityRegisterComponent implements OnInit, OnDestroy {
    paymentsecurityData: PaymentSecurity;
    formContractorPaymentSecurity: FormGroup;
    contractId: string;
    monthYear: any;
    porcentageList: PorcentageModel[] = [];
    contractorPayment: ContractorPayments;
    base64Output: any;
    file: any = null; // Variable to store file
    selectedFiles: File[] = [];
    filesWithCheckbox: any[] = [];
    contractorFile: FileContractor;
    private readonly _unsubscribe$ = new Subject<void>();
    porcenterRisk: any = GlobalConst.PorcenterRisk;
    typeDoc: string;
    contractorIdentification: string;
    fileName: string;
    typeFile: string;
    verifySheet: VerifySheet={
        correctAfpPayment: false,
        correctArlPayment: false,
        correctDate: true,
        correctEpsPayment: false,
        correctIdentification: false,
        correctNumberSheet: false,
        correctSheet: false,
        verifySheet: false

    }
    date = new FormControl(moment());

    constructor(
        private _nominaService: NominaService,
        private _homeContractorService: HomeContractorService,
        private _auth: AuthService,
        private _uploadFileDataService: UploadFileDataService,
        public matDialogRef: MatDialogRef<ContractorPaymentSecurityRegisterComponent>,
        private _contractorListService: ContractorService,
        @Inject(MAT_DIALOG_DATA) public _data: any,
        private _formBuilder: FormBuilder
    ) {
        const pdfjsWorker =  import('pdfjs-dist/build/pdf.worker.entry');

            // Especifica la ruta al archivo del worker de PDF.js
            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
            //pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    }

    ngOnInit(): void {
        this._initData();
        this.gevalidateDocument();
    }

    private _initData(){
        this.contractId = this._data.contractId;

        this.formContractorPaymentSecurity = this._formBuilder.group({
            from: new FormControl(null, Validators.required),
            to: new FormControl(null, Validators.required),
            paymenteps: new FormControl(null, Validators.required),
            paymentArl: new FormControl(null, Validators.required),
            Paymentafp: new FormControl(null, Validators.required),
            afp: new FormControl({ value: null, disabled: true },Validators.required),
            arl: new FormControl({ value: null, disabled: true },Validators.required),
            eps: new FormControl({ value: null, disabled: true },Validators.required),
            observation: new FormControl(null, Validators.required),
            file: new FormControl(null, Validators.required),
            paymentPeriodDate: new FormControl(null, Validators.required),
            payrollNumber: new FormControl(null, Validators.required),
            ibc: new FormControl(null, Validators.required),
        });
        this.subscribeToValueChanges('paymenteps');
        this.subscribeToValueChanges('paymentArl');
        this.subscribeToValueChanges('Paymentafp');
        this.getDocumentType();
        this.getEconomicDataContractor();
        this.getHealtyContractor();
        this.getDataContractor();
    }
    addPaymentSecurity() {
        if(this.verifySheet.correctAfpPayment && this.verifySheet.correctEpsPayment && this.verifySheet.correctArlPayment && this.verifySheet.correctDate && this.verifySheet.correctNumberSheet && this.verifySheet.correctIdentification){
            this.verifySheet.correctSheet = true;
        }else{
            this.verifySheet.correctSheet = false;
        }
        let name = this.file.name.split('.');
        let datePayment = new Date(this.formContractorPaymentSecurity.value.paymentPeriodDate)
        this.contractorFile = {
            userId: null,
            contractorId: this._auth.accessId,
            contractId: this.contractId,
            filesName: name[0],
            documentType: this.typeDoc,
            fileType: name[1].toUpperCase(),
            descriptionFile: 'PLANILLA DE SEGURIDAD SOCIAL',
            registerDate: new Date(),
            modifyDate: new Date(),
            filedata: this.base64Output,
            monthPayment: datePayment.getFullYear()+ '/'+datePayment.getMonth(),
            folderId: null,
            anexo: false,
        };
        this.paymentsecurityData = {
            contractorPayments: this.contractorPayment.id,
            paymentEps: this.formContractorPaymentSecurity.value.paymenteps,
            paymentArl: this.formContractorPaymentSecurity.value.paymentArl,
            paymentPension: this.formContractorPaymentSecurity.value.Paymentafp,
            observation: this.formContractorPaymentSecurity.value.observation,
            registerDate: new Date(),
            consecutive: this.contractorPayment.consecutive,
            payrollNumber: this.formContractorPaymentSecurity.value.payrollNumber,
            paymentPeriodDate:
            this.formContractorPaymentSecurity.value.paymentPeriodDate,
            verifySheet: this.verifySheet.verifySheet,
            correctAfpPayment: this.verifySheet.correctAfpPayment,
            correctEpsPayment: this.verifySheet.correctEpsPayment,
            correctArlPayment: this.verifySheet.correctArlPayment,
            correctSheet: this.verifySheet.correctSheet,
            contractorFile: this.contractorFile,
        };
        this._nominaService
            .addContractorPaymentSecurity(this.paymentsecurityData)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((res) => {
                if(res.success){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        html: res.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    this.cerrar();
                }
            });
    }

    cerrar(): void {
        this.matDialogRef.close();
    }

    private getEconomicDataContractor() {
        this._nominaService
            .getContractorPayment(this._auth.accessId, this.contractId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((Response) => {
                this.contractorPayment = Response;
            });
    }

    private getHealtyContractor() {
        this._homeContractorService
            .getEmptityHealthContractor(this._auth.accessId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((Response) => {
                this.formContractorPaymentSecurity.patchValue({
                    afp: Response.data.afp,
                    arl: Response.data.afp,
                    eps: Response.data.eps,
                });
            });
    }

    calculateEps() {
        let porcentage = 12.5;
        let calculatePorcentagePayment =
            (this.contractorPayment.paymentcant * 40) / 100;
        const porcentajeCalculado =
            (calculatePorcentagePayment * porcentage) / 100;
        if (
            this.formContractorPaymentSecurity.value.paymenteps != null ||
            this.formContractorPaymentSecurity.value.paymenteps != ''
        ) {
            let payment = Number(
                this.formContractorPaymentSecurity.value.paymenteps
                    .toString()
                    .replace(/\./g, '')
            );
            if (payment < porcentajeCalculado) {
                this.verifySheet.correctEpsPayment = false;
                Swal.fire(
                    '',
                    'El valor pagado de SALUD no es correcto, es posible que la planilla sea devuelta',
                    'warning'
                );
            }else{
                this.verifySheet.correctEpsPayment = true;
            }
        }
    }

    calculateArl() {
        let porcentage = this.porcenterRisk.find(
            (f) => f.viewValue === this.contractorPayment.levelRisk
        ).value;
        let calculatePorcentagePayment =
            (this.contractorPayment.paymentcant * 40) / 100;
        const porcentajeCalculado =
            (calculatePorcentagePayment * porcentage) / 100;
        if (
            this.formContractorPaymentSecurity.value.paymentArl != null ||
            this.formContractorPaymentSecurity.value.paymentArl != ''
        ) {
            let payment = Number(
                this.formContractorPaymentSecurity.value.paymentArl
                    .toString()
                    .replace(/\./g, '')
            );
            if (payment < porcentajeCalculado) {
                this.verifySheet.correctArlPayment = false;
                Swal.fire(
                    '',
                    'El valor pagado de ARL no es correcto, es posible que la planilla sea devuelta',
                    'warning'
                );
            }else{
                this.verifySheet.correctArlPayment = true;
            }
        }
    }

    calculateafp() {
        let porcentage = 16;
        let calculatePorcentagePayment =
            (this.contractorPayment.paymentcant * 40) / 100;
        const porcentajeCalculado =
            (calculatePorcentagePayment * porcentage) / 100;
        if (
            this.formContractorPaymentSecurity.value.Paymentafp != null ||
            this.formContractorPaymentSecurity.value.Paymentafp != ''
        ) {
            if (Number(this.formContractorPaymentSecurity.value.Paymentafp.toString().replace(/\./g,'')) < porcentajeCalculado) {
                this.verifySheet.correctAfpPayment = false;
                Swal.fire(
                    '',
                    'El valor pagado de afp no es correcto, es posible que la planilla sea devuelta',
                    'warning'
                );
            }else{
                this.verifySheet.correctAfpPayment = true;
            }
        }
    }

    addCommasToNumber(value: number): string {
        return value.toLocaleString('es');
    }
    subscribeToValueChanges(controlName: string): void {
        this.formContractorPaymentSecurity
            .get(controlName)
            .valueChanges.subscribe((value) => {
                this.formatNumberWithCommas(controlName, value);
            });
    }

    formatNumberWithCommas(controlName: string, value: number): void {
        const control = this.formContractorPaymentSecurity.get(controlName);
        const previousValue = control.value;
        // Remover puntos del valor anterior para evitar puntos duplicados
        const numericValue = Number(value.toString().replace(/\./g, ''));
        const formattedValue = this.addCommasToNumber(numericValue);

        // Si el valor formateado es diferente al valor en el control, actualizar el control
        if (formattedValue !== previousValue) {
            control.patchValue(formattedValue, { emitEvent: false });
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

    onFileSelected(event: any): void {
        this.filesWithCheckbox = [];
        this.file = event.target.files[0];

        this.fileName = this.file.name.split('.')[0].toUpperCase();
        this.typeFile = this.file.name.split('.')[1].toUpperCase();
        this.filesWithCheckbox.push(this.file);
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        this.convertFile(this.file).subscribe((base64) => {
            this.base64Output = base64;
        });
        if (this.file) {
            for (let index = 1; index <= 3; index++) {
                switch (index) {
                    case 1:
                        // this.readPdf(this.file,this.contractorIdentification,'documento');
                        this.readPdf(this.file,'1000189631','documento');
                        break;
                    case 2:
                        // this.readPdf(this.file,this.formContractorPaymentSecurity.value.payrollNumber,'numero planilla');
                        this.readPdf(this.file,'8621483217','numero planilla');
                        break;
                    case 3:
                        this.readPdf(this.file,this.formContractorPaymentSecurity.value.paymentPeriodDate,'periodo');
                        break;
                }
            }
        }
    }

    private getDocumentType() {
        this._uploadFileDataService
            .getDocumentType()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((res) => {
                if (res != null) {
                    this.typeDoc = res.find(
                        (f) => f.code === DocumentTypeCode.PLANILLA
                    ).id;
                }
            });
    }

    //este metodo es para leer cuando se va a buscar por un campo especifico
    async readPdf(file: File,fieldFilter: string,typeFilter: string): Promise<void> {
        const pdfData = new Uint8Array(await this.readFile(file));
        const pdfDocument = await pdfjsLib.getDocument({ data: pdfData })
            .promise;

        // Realiza una búsqueda de texto en el PDF
        // const searchText = 'Número Planillas';

        const searchResults = await this.searchTextInPdf(
            pdfDocument,
            fieldFilter,
            typeFilter
        );

        // Procesa los resultados de la búsqueda
        console.log(searchResults);
    }

    //para buscar campo especifico
    async readFile(file: File): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as ArrayBuffer);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    }
    extractTextFromPage(pageText: any): string {
        // Implementa la lógica para procesar el texto de la página aquí
        // Puedes unir los elementos de texto en un solo texto o realizar operaciones específicas
        const textItems = pageText.items.map((item) => item.str);
        // Una forma simple de unir los elementos de texto en un solo texto
        const pageTextString = textItems.join(' ');
        return pageTextString;
    }
    //para buscar campo especififco
    async searchTextInPdf(
        pdfDocument: any,
        searchText: string,
        typeFilter: string
    ): Promise<any[]> {
        const numPages = pdfDocument.numPages;
        const searchResults = [];

        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            const page = await pdfDocument.getPage(pageNumber);
            const pageText = await page.getTextContent();
            if(pageText.items.length > 0){
                this.verifySheet.verifySheet = true;
            }else{
                this.verifySheet.verifySheet = false;
            }
            for (const textItem of pageText.items) {

                if (textItem.str.includes(searchText)) {
                    // Si encuentra la palabra clave, agrega el resultado
                    switch (typeFilter) {
                        case 'documento':
                            this.verifySheet.correctIdentification = true;
                            break;
                        case 'numero planilla':
                            this.verifySheet.correctNumberSheet = true;
                            break;
                        // case 'periodo':
                        //     this.verifySheet.correctDate = true;
                        //     break

                    }
                    searchResults.push({
                        page: pageNumber,
                        text: textItem.str,
                    });
                }
            }
        }
        return searchResults;
    }

    async getContentAfterTitle(
        pdfDocument: any,
        pageNumber: number
    ): Promise<string> {
        const page = await pdfDocument.getPage(pageNumber);
        const pageText = await page.getTextContent();
        let content = '';
        for (let i = 0; i < pageText.items.length; i++) {
            const textItem = pageText.items[i];
            if (
                textItem.str === 'Número Planilla' &&
                i + 1 < pageText.items.length
            ) {
                // Si encuentra el título, obtiene el contenido siguiente
                content = pageText.items[i + 1].str;
                break;
            }
        }
        console.log('getContentAfterTitle', content);

        return content;
    }


    private getDataContractor() {
        this._homeContractorService
            .getContarctorById(this._data.contractorId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((res) => {
                this.contractorIdentification = res.identificacion
            });
    }


    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value;
        this.monthYear = normalizedYear.year();
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
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

    private gevalidateDocument() {
        this._contractorListService
            .getValidateDocumentUploadEndpoint(this._data.contractId, this._data.contractorId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((resp) => {
                if (!resp.activateTermContract && !resp.activateTermPayments) {
                    Swal.fire(
                        '',
                        'ya ha terminado la fecha de entrega, comunicate con el personal encargado, para habilitar la  carga de documentos!',
                        'warning'
                    );
                    this.cerrar();
                }
                if (!resp.activateTermPayments) {
                    Swal.fire(
                        '',
                        'Carga de documentos DESHABILITADA!',
                        'warning'
                    );
                    this.cerrar();
                }
            }
            );
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next(null);
        this._unsubscribe$.complete();
    }
}
