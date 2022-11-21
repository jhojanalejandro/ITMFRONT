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
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { EconomicChartService } from '../economic-chart.service';
import {
    InventoryCategory,
    InventoryPagination,
    EconomicChart,
    Components,
} from '../economic-chart.types';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { TypeSelectString } from 'app/layout/common/models/TypeSelect';
import swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';
import { ChartComponent } from 'ng-apexcharts';
import { ElementCardComponent } from '../element/element.component';
import { AddComponentsComponent } from '../componentes/components.component';

@Component({
    selector: 'economic-chart-list',
    templateUrl: './economic-chart-list.component.html',
    styleUrls: ['./economic-chart-list.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class EconomicChartListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    registerDate = new Date();
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    projectData$: Observable<EconomicChart[]>;
    requiere: TypeSelectString[] = GlobalConst.requierePoliza;
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

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _economicService: EconomicChartService,
        private authService: AuthService,
        private _matDialog: MatDialog
    ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the selected product form
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

        // Get the pagination
        this._economicService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        // Get the projectData
        this.projectData$ = this._economicService._economicsChart$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._economicService.getProjectData(
                        0,
                        10,
                        'name',
                        'asc',
                        query
                    );
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get projectData if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.closeDetails();
                        this.isLoading = true;
                        return this._economicService.getProjectData();
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Toggle product details
     *
     * @param productId
     */
    toggleDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedProduct && this.selectedProduct.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        this._economicService.getComponent(productId).subscribe((response) => {
            this.componentList = response;
            this._changeDetectorRef.markForCheck();
        });

        // Get the product by id
        this._economicService
            .getProductById(productId)
            .subscribe((product) => {
                // Set the selected product
                this.selectedProduct = product;

                // Fill the form
                this.economicChartForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void {
        // Get the image count and current image index
        const count = this.economicChartForm.get('images').value.length;
        const currentIndex =
            this.economicChartForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if (forward) {
            this.economicChartForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else {
            this.economicChartForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    openDialog(route: any, data: any) {
        switch (route) {
            case 'addElement':
                const listElement = this.componentList.find(
                    (e) => (e.listElements = data.nombreComponente)
                );
                const dialogRef = this._matDialog.open(ElementCardComponent, {
                    autoFocus: false,
                    data: {
                        data,
                        show: true,
                    },
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        this.componentList[result.id].listElements.push(
                            result.listElements
                        );
                    }
                });
                break;
            case 'add':
                const dialogRefPrroject = this._matDialog.open(
                    AddComponentsComponent,
                    {
                        autoFocus: false,
                        data: {
                            show: false,
                            data,
                        },
                    }
                );
                dialogRefPrroject.afterClosed().subscribe((datos) => {
                    if (datos) {
                        if (this.componentList[0].componentName == '') {
                            this.componentList.splice(i, 1);
                        }
                        for (var i = 0; i < this.componentList.length; i++) {
                            this.componentList[i].id = i;
                        }
                        this.componentList.push(datos);
                    }
                });
                break;
        }
    }

    /**
     * Update the selected product using the form data
     */
    updateSelectedProduct(): void {
        // Get the product object
        const product = this.economicChartForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;

        // Update the product on the server
        /* this._economicService.updateProduct(product.id, product).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        }); */
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void {
        //Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message:
                'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the product object
                const product = this.economicChartForm.getRawValue();

                // Delete the product on the server
                /* this._economicService.deleteProduct(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                }); */
            }
        });
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

    private calculateCost() {
        this.SubTotal = 0;
        this.TotalCost = 0;
        this.operatingExpenses = 0;
        for (var i = 0; i < this.componentList.length; i++) {
            let subt = this.componentList[i].totalValue + this.SubTotal;
            this.SubTotal = subt;
        }
        let porcentaje = 0;
        switch (this.economicChartForm.value.percentage) {
            case '1':
                porcentaje = 0.01;
                break;
            case '2':
                porcentaje = 0.02;
                break;
            case '3':
                porcentaje = 0.03;
                break;
            case '4':
                porcentaje = 0.04;
                break;
            case '5':
                porcentaje = 0.05;
                break;
            case '6':
                porcentaje = 0.06;
                break;
            case '7':
                porcentaje = 0.07;
                break;
            case '8':
                porcentaje = 0.08;
                break;
            case '9':
                porcentaje = 0.09;
                break;
        }
        this.operatingExpenses = porcentaje * this.SubTotal;

        this.TotalCost = this.SubTotal + this.operatingExpenses;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
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
                        'informacion Registrada Exitosamente!',
                        '',
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
                swal.fire('Error al Registrar la informacion!', '', 'error');
                // Show the alert
            }
        );
    }

    deleteComponent(componente: any) {
        debugger
        this._economicService.DeleteComponent(componente.id).subscribe((res) => {
            if (res) {
                swal.fire('informacion Eliminada Exitosamente!', '', 'success');
            }
            this._changeDetectorRef.detectChanges();
        },
            (response) => {
                // Set the alert
                swal.fire('Error al Eliminar la informacion!', '', 'error');
            });
    }
}
