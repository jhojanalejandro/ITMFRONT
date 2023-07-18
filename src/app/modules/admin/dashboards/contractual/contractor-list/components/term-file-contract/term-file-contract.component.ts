import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { ContractorService } from '../../../service/contractor.service';
import { TeamModel } from 'app/modules/auth/model/user-model';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { AssignmentUser, AssignmentType } from '../../../models/assignment-user.model';
import { AssignmentTypeEnumCode } from 'app/layout/common/enums/userEnum/typeAssignmentenum';
import { Subject, takeUntil } from 'rxjs';
import { TermContract } from '../../../models/term-file-contract.model';


@Component({
  selector: 'app-term-file-contract',
  templateUrl: './term-file-contract.component.html',
  styleUrls: ['./term-file-contract.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class TermFileContractComponent implements OnInit {
  termTypeSelected: string = null;
  formTerm: FormGroup;
  termType: string;
  termTypeId: string;
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(private _contractorService: ContractorService,
    public matDialogRef: MatDialogRef<TermFileContractComponent>,
    _authService: AuthService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getTypeAssigment();
    this.formTerm = this._formBuilder.group({
      dateFrom: new FormControl(null, Validators.required),
      dateTo: new FormControl(null, Validators.required),
      termType: new FormControl({ value: this.termType, disabled: true }, Validators.required),
    });

  }

  async addTermFileContract() {
    let termFileDocument: TermContract = {
      detailContract: this.data.contractId,
      fechaInicio: this.formTerm.value.dateFrom,
      fechaTermino: this.formTerm.value.termType,
      termType: this.termTypeId
    }
    this._contractorService
      .saveTermFileContract(termFileDocument)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        if (res) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: 'Fecha Termino agregada correctamente!',
            showConfirmButton: false,
            timer: 1500
          });
          this.closePopup();
        }
      },
        (response) => {
          Swal.fire('Error', 'No se pudo asignar la información!', 'error');
          console.log(response);
        });

  }

  closePopup(): void {
    this.matDialogRef.close();
  }

  private getTypeAssigment() {
    this._contractorService.getTermType()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((Response: any) => {
        if (Response.length > 0) {
          this.termType = Response.find(f => f.code === 'CINC').termDescription;
          this.termTypeId = Response.find(f => f.code === 'CINC').id;
        } else {
          Swal.fire('', 'No es posible asignar fechas sin tipos !', 'warning');
          this.closePopup();
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }

}

