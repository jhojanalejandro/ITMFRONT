import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { DetailFileContractor } from 'app/layout/common/models/file-contractor';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/upload-file/service/upload-file.service';

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
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _uploadService: UploadFileDataService,
    public matDialogRef: MatDialogRef<ObservationFileComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data
  ) { }

  ngOnInit(): void {    
    this.formFile = this._formBuilder.group({
      motivo: new FormControl(null, Validators.required),
      observation: new FormControl(null, Validators.required),
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

  AddDetailFile() {
    let detailFile: DetailFileContractor = {
        fileId: this._data.id,
        observation: this.formFile.value.observation,
        reason: this.formFile.value.motivo,
        files: null,
        registerDate: new Date(),
        passed: false

    }
    this._uploadService.addDetailFile(detailFile)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      if (res) {
        swal.fire({
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
        console.log(response);
        swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.motivos.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  validarCampo(event){
    if(this.formFile.value.motivo != null &&  this.formFile.value.observation != null){
        this.disableButton = false;
    }else{
      this.disableButton = true;

    }
  }

  UpdateDetailFile() {
    let detailFile: DetailFileContractor = {
        fileId: this._data.id,
        observation: this.formFile.value.observation,
        reason: this.formFile.value.motivo,
        files: null,
        registerDate: new Date(),
        passed: false
    }
    this._uploadService.addDetailFile(detailFile)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
      if (res) {
        swal.fire({
          position: 'center',
          icon: 'success',
          title: '',
          html: 'Información actualizada Exitosamente!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
      (response) => {
        swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.next(true);
}
}
