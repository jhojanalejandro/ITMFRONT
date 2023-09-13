import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Contractor } from 'app/modules/admin/dashboards/contractual/models/contractor';
import { ContractorService } from 'app/modules/admin/dashboards/contractual/service/contractor.service';


@Component({
  selector: 'app-detail-contractor',
  styleUrls: ['./detail-contractor.component.scss'],
  templateUrl: './detail-contractor.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailContractorComponent implements OnInit, OnDestroy {

  configForm: FormGroup;
  componentselectId: any;
  dataSource = new MatTableDataSource<any>();
  contractname: string;
  datePipe: DatePipe;
  permission: boolean = false;
  @Input() contractorSelected: Contractor | null ;
  @Output() readonly closeDetail: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly _unsubscribe$ = new Subject<void>();
  selectedContracttorForm: FormGroup;
  constructor(
    private _contractorListService: ContractorService,
    private _authService: AuthService,
    private cdref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private _formBuilder: FormBuilder,
    private _loadrouter: Router,
  ) {
    this.datePipe = new DatePipe('es');
  }
  columnas = [
    { title: 'NOMBRE', name: 'nombre' },
    { title: 'CEDULA', name: 'identificacion' },
    { title: 'CORREO', name: 'correo' },
    { title: 'TELEFONO', name: 'telefono' },
    { title: 'ESTADO', name: 'proccess' },
    { title: 'REGISTRO', name: 'statusContractor' },
    { title: 'JURIDICO', name: 'legalProccess' },
    { title: 'CONTRACTUAL', name: 'hiringStatus' },
    { title: 'MINUTA', name: 'minuteGnenerated' },
    { title: 'COMITE', name: 'comiteGenerated' },
    { title: 'ESTUDIOS PREVIOS', name: 'previusStudy' },
    { title: 'DETALLE', name: 'detail' },
    { title: 'OPCIONES', name: 'acciones' }
  ]

  ngOnInit(): void {
    this.selectedContracttorForm = this._formBuilder.group({
      nombre: [''],
      identificacion: [''],
      lugarExpedicion: ['', [Validators.required]],
      fechaNacimiento: [''],
      direccion: [''],
      telefono: [''],
      celular: [''],
      correo: [''],
      proccess: [''],
      habilitado: ['']
    });
    this.selectedContracttorForm.patchValue(this.contractorSelected);

  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }


  selectRowFull(data: any) {
    console.log(data);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    if (item != null) {
      return item.id || index;
    }
  }


  reloadResolve() {
    const currentUrl: any = this._loadrouter.url;
    this._loadrouter.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._loadrouter.navigateByUrl(currentUrl);
    });
  }

  closeDetails(): void {
    this.contractorSelected = null;
    this.closeDetail.emit(true);
  }


  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
