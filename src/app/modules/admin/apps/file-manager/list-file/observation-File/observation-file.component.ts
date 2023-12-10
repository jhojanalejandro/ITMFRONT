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
  encapsulation: ViewEncapsulation.None,
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
  formFile: FormGroup;
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
    const isAuthenticated = this._auth.isAuthenticatedUser();
    this.permission = this._auth.validateRoll(CodeUser.JURIDICO, null);
    // this.getAdmins();
    if (!this.permission) {
      Swal.fire('', 'No tienes permisos para aprobar documentos!', 'warning');
    } else {
      if (isAuthenticated) {
        Swal.fire('', 'Hay otro usuario juridico interactuando!', 'warning');
      } else {
        this._auth.setAuthenticated(true);
      }
    }
    this.observationfile = this._data.files;
    this.formFile = this._formBuilder.group({
      motivo: new FormControl(null, Validators.required),
      observation: new FormControl(null, Validators.required),
      termDate: new FormControl(null, Validators.required),
    });
    this.filteredOptions =
      this.formFile.controls.motivo.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
  }

  cerrar(): void {
    this.matDialogRef.close();
  }

  AddObservationFile() {
    if (this.formFile.invalid) {
      this.alert = {
        type: 'error',
        message: 'ERROR EN LA INFORMACION'
      };
      this.showAlert = true;
      return
    }
    let detailFile: DetailFileContractor = {
      fileId: this._data.id,
      observation: this.formFile.value.observation,
      reasonRejection: this.formFile.value.motivo,
      files: this.observationfile,
      registerDate: new Date(),
      passed: false,
      statusFileId: this._data.statusFile,
      contractId: this._data.contractId,
      contractorId: this._data.contractorId,
      userId: this._data.userId,
      termDate: this.formFile.value.termDate
    }
    this.formFile.disable();

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
          this.formFile.enable();
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
    if (this.formFile.value.motivo != null && this.formFile.value.observation != null) {
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
