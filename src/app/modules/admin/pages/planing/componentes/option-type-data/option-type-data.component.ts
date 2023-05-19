import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { PlaningService } from '../../service/planing.service';

@Component({
  selector: 'app-option-type-data',
  templateUrl: './option-type-data.component.html',
  styleUrls: ['./option-type-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OptionTypeDataComponent implements OnInit, OnDestroy {
  loading: boolean = false; // Flag variable
  showAlert: boolean = false;
  tiponovedad: any = GlobalConst.tipoNovedad;
  registerDate = new Date();
  filteredOptions: Observable<string[]>;
  formFile: FormGroup;
  typeData: string;
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
    public matDialogRef: MatDialogRef<OptionTypeDataComponent>,
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
    // let detailFile: OptionTypeData = {
    //   id: null,
    //   contractId:  this._data.contractId,
    //   contractorId: this._data.contractorId,
    //   descripcionNovedad: this.formFile.value.descripcionNovedad,
    //   tipoNovedad: this.formFile.value.tipoNovedad
    // }
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


  UpdateNewnessContractor() {
    // this.contractorService.addNewnessContractor(detailFile).subscribe((res) => {
    //   if (res) {
    //     swal.fire({
    //       position: 'center',
    //       icon: 'success',
    //       title: '',
    //       html: 'Información actualizada Exitosamente!',
    //       showConfirmButton: false,
    //       timer: 1500
    //     });
    //   }
    // },
    //   (response) => {
    //     swal.fire('Error', 'Error al Actualizar la informacion!', 'error');
    //   });
  }

  opcionType(e: any){
    this.typeData = e.value;
  }

  ngOnDestroy(): void {

    this._unsubscribe$.complete();

    this._unsubscribe$.next();

  }
}
