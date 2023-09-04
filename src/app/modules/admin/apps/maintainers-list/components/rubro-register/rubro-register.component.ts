import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rubro-register',
  templateUrl: './rubro-register.component.html',
  styleUrls: ['./rubro-register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RubroRegisterComponent implements OnInit, OnDestroy {
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  registerDate = new Date();
  disableButton: boolean = false;
  filteredOptions: Observable<string[]>;
  formFile: FormGroup;
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
    private ref: ChangeDetectorRef,
    public matDialogRef: MatDialogRef<RubroRegisterComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data
  ) { }

  ngOnInit(): void {
    this.formFile = this._formBuilder.group({
      tipoNovedad: new FormControl(null, Validators.required),
      descripcionNovedad: new FormControl(null, Validators.required),
    });

  }

  cerrar(): void {
    this.matDialogRef.close();
  }

  AddDetailFile() {
    let detailFile: any = {
      id: null,
      contractId: this._data.contractId,
      contractorId: this._data.contractorId,
      descripcionNovedad: this.formFile.value.descripcionNovedad,
      tipoNovedad: this.formFile.value.tipoNovedad
    }
    // this.contractorService.addNewnessContractor(detailFile)
    //   .pipe(takeUntil(this._unsubscribe$))
    //   .subscribe((res) => {
    //     if (res) {
    //       swal.fire({
    //         position: 'center',
    //         icon: 'success',
    //         title: '',
    //         html: 'Información actualizada Exitosamente!',
    //         showConfirmButton: false,
    //         timer: 1500
    //       });
    //       this.matDialogRef.close(true);
    //     }
    //   },
    //     (response) => {
    //       console.log(response);
    //       swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
    //     });
  }


  validarCampo(event) {
    if (this.formFile.value.motivo != null && this.formFile.value.observation != null) {
      this.disableButton = false;
    } else {
      this.disableButton = true;
    }
  }


  ngOnDestroy(): void {
    this._unsubscribe$.complete();
    this._unsubscribe$.next();
  }
}
