import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import swal from 'sweetalert2';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { CpcType,RubroType,Bank } from '../../models/registerMaintainer.model';
import { MaintainerService } from '../../service/maintainer.service.service';

@Component({
  selector: 'app-maintainer-register',
  templateUrl: './maintainer-register.component.html',
  styleUrls: ['./maintainer-register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MaintainerRegisterComponent implements OnInit, OnDestroy {
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  indeterminate = false;
  showAlert: boolean = false;
  registerDate = new Date();
  disableButton: boolean = false;
  filteredOptions: Observable<string[]>;
  formMaintainer: FormGroup;
  placeholderNumber: string = null;
  showNumber: boolean = true;
  placeholderName: string = null;
  cpcOption: CpcType = {
    cpcNumber: '',
    cpcName: '',
    type: ''
  } 
  rubroOption: RubroType = {
    rubro: '',
    rubroNumber: '',
    type: ''
  } 
  bankOption: Bank = {
    bankName: '',
    type: ''
  } 
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
    public matDialogRef: MatDialogRef<MaintainerRegisterComponent>,
    private _formBuilder: FormBuilder,
    private _gmaintainerService: MaintainerService,
    @Inject(MAT_DIALOG_DATA) private _data
  ) { }

  ngOnInit(): void {
    this.formMaintainer = this._formBuilder.group({
      numberOption: new FormControl(null, Validators.required),
      nameOption: new FormControl(null, Validators.required),
    });
    if(this._data.type == 'cpc'){
      this.cpcOption.type = 'cpc'
      this.placeholderNumber = 'Número cpc';
      this.placeholderName = 'Nombre cpc';
    }else if(this._data.type == 'rubro'){
      this.rubroOption.type = 'rubro'
      this.placeholderNumber = 'Número rubro';
      this.placeholderName = 'Nombre rubro';
    } else if(this._data.type == 'bank'){
      this.showNumber = false;
      this.bankOption.type = 'bank'
      this.placeholderNumber = '';
      this.placeholderName = 'Nombre Banco';
    }

  }

  cerrar(): void {
    this.matDialogRef.close();
  }

  saveOption() {
    let nameOption = this.formMaintainer.value.nameOption;
    let numberOption = this.formMaintainer.value.numberOption;
    if(this.cpcOption.type != '' && this.cpcOption.type == 'cpc'){
      this.SaveCpcType(nameOption, numberOption);
    }else if(this.rubroOption.type != '' && this.rubroOption.type == 'rubro'){
      this.SaveRubroType(nameOption, numberOption);
    }else if(this.bankOption.type != '' && this.bankOption.type == 'bank'){
      this.SaveBank(nameOption, numberOption);
    }
  }

  private SaveCpcType(nameOption: string, numberOption: string){
    this.cpcOption.cpcName = nameOption;
    this.cpcOption.cpcNumber = numberOption;
    this._gmaintainerService.addCpcType(this.cpcOption)
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((res) => {
      if (res) {
        swal.fire({
          position: 'center',
          icon: 'success',
          title: '',
          html: 'Información registrada Exitosamente!',
          showConfirmButton: false,
          timer: 1500
        });
        this.matDialogRef.close(true);
      }
    },
      (response) => {
        console.log(response);
        swal.fire('', 'Error'+response, 'error');
      });
  }

  private SaveRubroType(nameOption: string, numberOption: string){
    this.rubroOption.rubro = nameOption;
    this.rubroOption.rubroNumber = numberOption;
    this._gmaintainerService.addRubroType(this.rubroOption)
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((res) => {
      if (res) {
        swal.fire({
          position: 'center',
          icon: 'success',
          title: '',
          html: 'Información registrada Exitosamente!',
          showConfirmButton: false,
          timer: 1500
        });
        this.matDialogRef.close(true);
      }
    },
      (response) => {
        console.log(response);
        swal.fire('', 'Error'+response, 'error');
      });
  }

  private SaveBank(nameOption: string, numberOption: string){
    this.bankOption.bankName = nameOption;
    this._gmaintainerService.addBank(this.bankOption)
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((res) => {
      if (res) {
        swal.fire({
          position: 'center',
          icon: 'success',
          title: '',
          html: 'Información registrada Exitosamente!',
          showConfirmButton: false,
          timer: 1500
        });
        this.matDialogRef.close(true);
      }
    },
      (response) => {
        console.log(response);
        swal.fire('', 'Error'+response, 'error');
      });
  }
  ngOnDestroy(): void {
    this._unsubscribe$.complete();
    this._unsubscribe$.next();
  }
}
