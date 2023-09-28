import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ContractorService } from '../../contractual/service/contractor.service';
import { Contractor } from '../../contractual/models/contractor';
import { EntityHealth } from 'app/modules/admin/apps/home-contractor/models/mater.model';

@Component({
    selector: 'app-detail-contractor',
    styleUrls: ['./detail-contractor.component.scss'],
    templateUrl: './detail-contractor.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailContractorComponent implements OnInit, OnDestroy {
    configForm: FormGroup;
    dataSource = new MatTableDataSource<any>();
    datePipe: DatePipe;
    permission: boolean = false;
    @Input() contractorSelected: Contractor | null;
    @Output() readonly closeDetail: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    expandedEmpty = {
        nombre: null,
        correo: null,
        telefono: null,
        fechaNacimiento: null,
        direccion: null,
        celular: null,
        gender: null,
        nacionality: null,
        expeditionPlace: null,
        contractValue: null,
        habilitado: null,
        identificacion: null,
        lugarExpedicion: null,
        elementId: null,
        componentId: null,
        legalProccess: null,
        hiringStatus: null,
        initialContractDate: null,
        finalContractDate: null,
        cantDays: 0,
        bankEntity: null,
        cdp: null,
        level: null,
        eps: null,
        arl: null,
        afp: null,
    };
    eps: EntityHealth[] = [];
    arl: EntityHealth[] = [];
    afp: EntityHealth[] = [];
    @Input() expandedElement: Contractor;

    private readonly _unsubscribe$ = new Subject<void>();
    selectedContracttorForm: FormGroup;
    constructor(
        private _contractorListService: ContractorService,
        private cdref: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
    ) {
        this.datePipe = new DatePipe('es');
    }

    ngOnInit(): void {
      debugger
        this.selectedContracttorForm = this._formBuilder.group({
            expeditionPlace: new FormControl(null),
            correo: new FormControl(null),
            telefono: new FormControl(null),
            direccion: new FormControl(null),
            fechaNacimiento: new FormControl(null),
            cdp: new FormControl(null),
            level: new FormControl(null),
            reserved: new FormControl(null),
            contractValue: new FormControl(null),
            cantDays: new FormControl(null),
            bankEntity: new FormControl(null),
            nacionality: new FormControl(null, Validators.required),
            arl: new FormControl(null, Validators.required),
            eps: new FormControl(null, Validators.required),
            afp: new FormControl(null),
        });
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    closeDetails(): void {
        this.contractorSelected = null;
        this.closeDetail.emit(true);
    }

    updateSelectedProduct() {}

    ngOnDestroy(): void {
        this._unsubscribe$.next(null);
        this._unsubscribe$.complete();
    }
}
