import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { map, Observable, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { IDetailFile, IFileContractor } from 'app/layout/common/models/file-contractor';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { GenericService } from 'app/modules/admin/generic/generic.services';
import { UploadFileDataService } from 'app/modules/admin/dashboards/contractual/upload-file/upload-file.service';

@Component({
  selector: 'app-observation-file',
  templateUrl: './observation-file.component.html',
  styleUrls: ['./observation-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ObservationFileComponent implements OnInit {
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  tipoArchivos: any = GlobalConst.tipoArchivo;
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
    private ref: ChangeDetectorRef,
    private _uploadService: UploadFileDataService,
    public matDialogRef: MatDialogRef<ObservationFileComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data
  ) { }

  ngOnInit(): void {
    console.log(this._data);
    
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
    let detailFile: IDetailFile = {
        fileId: this._data.id,
        observation: this.formFile.value.observation,
        motivo: this.formFile.value.motivo
    }
    this._uploadService.addDetailFile(detailFile).subscribe((res) => {
      if (res) {
        swal.fire('Bien', 'informacion Actualizada Exitosamente!', 'success');
      }
    },
      (response) => {
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
    let detailFile: IDetailFile = {
        fileId: this._data.id,
        observation: this.formFile.value.observation,
        motivo: this.formFile.value.motivo
    }
    this._uploadService.addDetailFile(detailFile).subscribe((res) => {
      if (res) {
        swal.fire('Bien', 'informacion Actualizada Exitosamente!', 'success');
      }
    },
      (response) => {
        swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
      });
  }
}