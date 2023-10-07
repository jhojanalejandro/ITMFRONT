import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { ContractorService } from '../../contractual/service/contractor.service';
import { Subject, takeUntil } from 'rxjs';
import { TermContract } from '../../contractual/models/term-file-contract.model';


@Component({
  selector: 'app-term-file-contract',
  templateUrl: './term-file-contract.component.html',
  styleUrls: ['./term-file-contract.component.scss']
})

export class TermFileContractComponent implements OnInit {
  termTypeSelected: string = null;
  formTerm: FormGroup;
  termType: string;
  termTypeId: string;
  registerDate: Date = new Date();
  private readonly _unsubscribe$ = new Subject<void>();
  termFileDocument: TermContract = {
    termDate: null,
    termType: '',
    contractId: '',
    contractorId: '',
    startDate: null,
  }
  constructor(private _contractorService: ContractorService,
    public matDialogRef: MatDialogRef<TermFileContractComponent>,
    _authService: AuthService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getTypeAssigment();
    this.formTerm = this._formBuilder.group({
      dateTo: new FormControl(null, Validators.required),
      termType: new FormControl({ value: this.termType, disabled: true }, Validators.required),
    });

  }

  async addTermFileContract() {
    if(this.data.onlyContractor){
      this.termFileDocument.termDate = this.formTerm.value.dateTo
      this.termFileDocument.termType = this.termTypeId
      this.termFileDocument.contractorId = this.data.contractorId
      this.termFileDocument.contractId = this.data.contractId
    }else{
      this.termFileDocument.startDate = this.registerDate
      this.termFileDocument.termDate = this.formTerm.value.dateTo
      this.termFileDocument.termType = this.termTypeId
      this.termFileDocument.contractId = this.data.contractId
    }
    this._contractorService
      .saveTermFileContract(this.termFileDocument)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        if (res.success) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '',
            html: res.message,
            showConfirmButton: false,
            timer: 1500
          });
          this.closePopup();
        }
      },
        (response) => {
          Swal.fire('', 'No se pudo asignar la información!', 'error');
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
          this.termType = Response.find(f => f.code === this.data.type).termDescription;
          this.termTypeId = Response.find(f => f.code === this.data.type).id;
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

