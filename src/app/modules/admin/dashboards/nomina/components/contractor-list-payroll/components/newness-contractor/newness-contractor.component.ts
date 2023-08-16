import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { ContractorService } from 'app/modules/admin/dashboards/contractual/service/contractor.service';
import { NewnessContractor } from 'app/modules/admin/dashboards/contractual/models/contractor';

@Component({
  selector: 'app-observation-file',
  templateUrl: './newness-contractor.component.html',
  styleUrls: ['./newness-contractor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewnessContractorPayrollComponent implements OnInit, OnDestroy {
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  tiponovedad: any = GlobalConst.tipoNovedad;
  registerDate = new Date();
  disableButton: boolean = false;
  filteredOptions: Observable<string[]>;
  formFile: FormGroup;
  motivos: string[] = [
    'Información Incompleta',
    'Error en la información',
    'Error Ortografico',
  ];
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
    private contractorService: ContractorService,
    private ref: ChangeDetectorRef,
    public matDialogRef: MatDialogRef<NewnessContractorPayrollComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data
  ) { }

  ngOnInit(): void {
    this.formFile = this._formBuilder.group({
      tipoNovedad: new FormControl(null, Validators.required),
      descripcionNovedad: new FormControl(null, Validators.required),
    });
    this.filteredOptions =
      this.formFile.controls.tipoNovedad.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
  }

  cerrar(): void {
    this.matDialogRef.close();
  }

  AddDetailFile() {
    let detailFile: NewnessContractor = {
      id: null,
      contractId:  this._data.contractId,
      contractorId: this._data.contractorId,
      descripcionNovedad: this.formFile.value.descripcionNovedad,
      tipoNovedad: this.formFile.value.tipoNovedad
    }
    this.contractorService.addNewnessContractor(detailFile)
      .pipe(takeUntil(this._unsubscribe$))
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
  validarCampo(event) {
    if (this.formFile.value.motivo != null && this.formFile.value.observation != null) {
      this.disableButton = false;
    } else {
      this.disableButton = true;

    }
  }

  UpdateNewnessContractor() {
    let detailFile: NewnessContractor = {
      contractId:  this._data.contractId,
      contractorId: this._data.id,
      descripcionNovedad: this.formFile.value.descripcionNovedad,
      tipoNovedad: this.formFile.value.tipoNovedad
    }
    this.contractorService.addNewnessContractor(detailFile).subscribe((res) => {
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

    this._unsubscribe$.complete();

    this._unsubscribe$.next();

  }
}