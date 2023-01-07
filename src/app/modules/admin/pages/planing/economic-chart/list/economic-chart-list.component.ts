import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    Subject,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { EconomicChartService } from '../../service/economic-chart.service';
import {
    InventoryCategory,
    InventoryPagination,
    EconomicChart,
    Components,
} from '../economic-chart.types';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericService } from 'app/modules/admin/generic/generic.services';

@Component({
    selector: 'economic-chart-list',
    templateUrl: './economic-chart-list.component.html',
    styleUrls: ['./economic-chart-list.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class EconomicChartListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    registerDate = new Date();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    projectData$: any;
    displayedColumns: string[] = [
        'actions',
        'companyName',
        'projectName',
        'descriptionProject',
        'fechaContrato',
        'fechaFinalizacion',
        'activate',
    ];
    dataSource: MatTableDataSource<any>;

    componentList: Components[] = [
        {
            id: '0',
            cantDay: 0,
            componentName: '',
            contractorCant: 0,
            totalValue: 0,
            unitValue: 0,
            listElements: [
                {
                    id: 0,
                    elemento: '',
                    contractorCant: 0,
                    cantDay: 0,
                    totalValue: 0,
                    unitValue: 0,
                },
            ],
        },
    ];
    TotalCost: any;
    SubTotal: number;
    operatingExpenses: any;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: EconomicChart | null = null;
    economicChartForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _economicService: EconomicChartService,
        private _genericService: GenericService,
        private authService: AuthService,
        private _router: Router,
    ) {
        this.projectData$ = this._economicService._economicsChart$;
        this.dataSource = new MatTableDataSource(
            this.projectData$.source._value

        );
    }

    ngOnInit(): void {
        this.economicChartForm = this._formBuilder.group({
            id: [''],
            empresa: new FormControl(null, Validators.required),
            requiere: [''],
            operatingExpenses: [''],
            contrctorsCant: [''],
            cost: [''],
            percentage: new FormControl('8', Validators.required),
            price: [''],
            subTotal: [''],
            thumbnail: [''],
            images: [[]],
            active: [false],
        });
        this.getDetailContract();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    addComponent(data: any) {
        this._router.navigateByUrl("/docs/ecommerce/Componentes/" + data.id);
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    async addProjectFolder() {
        if (this.economicChartForm.value.ejecucion == 'Ejecutar Contrato') {
            this.economicChartForm.value.ejecucion = true;
        } else {
            this.economicChartForm.value.ejecucion = false;
        }
        const registerProject: any = {
            userId: this.authService.accessId,
            companyName: this.economicChartForm.value.companyName,
            projectName: this.economicChartForm.value.projectName,
            descriptionProject: this.economicChartForm.value.description,
            registerDate: this.registerDate,
            modifyDate: this.registerDate,
            execution: this.economicChartForm.value.ejecucion,
            budget: 0,
            contractCant: 0,
            cpc: '',
            nombreCpc: '',
            activate: false,
        };
        this._economicService.addEconomicChart(registerProject).subscribe(
            (res) => {
                if (res) {
                    swal.fire(
                        'Bien',
                        'informacion Registrada Exitosamente!',
                        'success'
                    );
                    //this.matDialogRef.close();
                    this._changeDetectorRef.detectChanges();
                    this._changeDetectorRef.markForCheck();
                }
            },
            (response) => {
                this.economicChartForm.enable();
                // Set the alert
                swal.fire('Error', 'Error al Registrar la informacion!', 'error');
                // Show the alert
            }
        );
    }

    deleteComponent(componente: any) {
        this._economicService.DeleteComponent(componente.id).subscribe(
            (res) => {
                if (res) {
                    swal.fire(
                        'Bien',
                        'informacion Eliminada Exitosamente!',
                        'success'
                    );
                }
                this._changeDetectorRef.detectChanges();
            },
            (response) => {
                // Set the alert
                swal.fire('Error', 'Error al Eliminar la informacion!', 'error');
            }
        );
    }

    getDetailContract(){
        for (let index = 0; index < this.projectData$.source._value.length; index++) {
            this._genericService.getDetalleContrato(this.projectData$.source._value[index].id, false).subscribe((resp: any) => {
                this.projectData$.source._value[index].fechaContrato = resp.fechaContrato;
                this.projectData$.source._value[index].fechaFinalizacion = resp.fechaFinalizacion;                
            })
        }

    }
}
