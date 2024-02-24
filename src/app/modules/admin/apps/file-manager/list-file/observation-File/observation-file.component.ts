import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { DetailFileContractor } from 'app/layout/common/models/file-contractor';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/service/upload-file.service';
import { AuthService } from 'app/core/auth/auth.service';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'app-observation-file',
    templateUrl: './observation-file.component.html',
    styleUrls: ['./observation-file.component.scss'],
    animations: fuseAnimations
})
export class ObservationFileComponent implements OnInit, OnDestroy {
    loading: boolean = false; // Flag variable
    file: any = null; // Variable to store file
    indeterminate = false;
    showAlert: boolean = false;
    registerDate = new Date();
    disableButton: boolean = false;
    filteredOptions: Observable<string[]>;
    observationForm: FormGroup;
    motivos: string[] = [
        'Información Incompleta',
        'Error en la información',
        'Error Ortografico',
    ];
    permission: boolean = false;
    observationfile: any;
    alert: { type: FuseAlertType; message: string } = {
        type: 'warn',
        message: ''
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    timerInterval: any = null;

    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
            ['clean']
        ]
    };
    constructor(
        private _uploadService: UploadFileDataService,
        public matDialogRef: MatDialogRef<ObservationFileComponent>,
        private _formBuilder: FormBuilder,
        private _auth: AuthService,
        @Inject(MAT_DIALOG_DATA) private _data
    ) { }

    ngOnInit(): void {
        this.permission = this._auth.validateRoll(CodeUser.JURIDICO, null);
        if (!this.permission) {
            Swal.fire('', 'No tienes permisos para aprobar documentos!', 'warning');
        } else {

        }
        this.observationfile = this._data.files;
        this.observationForm = this._formBuilder.group({
            motivo: new FormControl(null, Validators.required),
            observation: new FormControl(null, Validators.required),
            termDate: new FormControl(null, Validators.required),
        });
        this.filteredOptions =
            this.observationForm.controls.motivo.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
    }

    cerrar(): void {
        this.matDialogRef.close();
    }

    mostrarSweetAlert(): void {
        if (this.observationForm.invalid) {
            this.alert = {
                type: 'error',
                message: 'ERROR EN LA INFORMACION'
            };
            this.showAlert = true;
            return
        }
        Swal.fire({
            // title: 'Enviando...!',
            html: 'Espera: <b></b> Enviando Correos....',
            imageUrl: 'assets/images/flags/sendMail.gif',
            imageWidth: 600,
            imageHeight: 150,
            imageAlt: 'Custom image',
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            // timer: 3600000,
            timerProgressBar: true,
            width: 600,
            color: '#716add',

            didOpen: () => {
                //Swal.showLoading();

                const b = Swal.getHtmlContainer()?.querySelector('b');
                this.AddObservationFile();
                // this.timerInterval = setInterval(() => {
                //     const timerLeft = Swal.getTimerLeft();
                //     if (b) {
                //         b.textContent = timerLeft ? timerLeft.toString() : ''; // Verifica si timerLeft es null o undefined
                //     }
                // }, 100);
            },
            willClose: () => {
                clearInterval(this.timerInterval);
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer');
            }
        });
    }

    AddObservationFile() {
        debugger
        if (this.observationForm.invalid) {
            this.matDialogRef.close(true);
            this.alert = {
                type: 'error',
                message: 'ERROR EN LA INFORMACION'
            };
            this.showAlert = true;
            return
        }
        let detailFile: DetailFileContractor = {
            fileId: this._data.id,
            observation: this.observationForm.value.observation,
            reasonRejection: this.observationForm.value.motivo,
            files: this.observationfile,
            registerDate: new Date(),
            passed: false,
            statusFileId: this._data.statusFile,
            contractId: this._data.contractId,
            contractorId: this._data.contractorId,
            userId: this._data.userId,
            termDate: this.observationForm.value.termDate
        }
        this.observationForm.disable();

        this._uploadService.addObservationDetailFile(detailFile)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '',
                        html: 'Información actualizada Exitosamente!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.matDialogRef.close(true);
                }
            },
                (response) => {
                    this.observationForm.enable();
                    console.log(response);
                    Swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
                });
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.motivos.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }
    validarCampo(event) {
        if (this.observationForm.value.motivo != null && this.observationForm.value.observation != null) {
            this.disableButton = false;
        } else {
            this.disableButton = true;

        }
    }



    ngOnDestroy(): void {
        this._unsubscribeAll.complete();
        this._unsubscribeAll.next(true);
    }
}
