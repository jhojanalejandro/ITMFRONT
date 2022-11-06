import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../details/details.component';
import { EconomicChartService } from '../economic-chart.service';
import { InventoryCategory, InventoryPagination, InventoryTag, EconomicChart, Components } from '../economic-chart.types';
import { DecimalPipe } from '@angular/common';

@Component({
    selector       : 'economic-chart-list',
    templateUrl    : './economic-chart-list.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class EconomicChartListComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    projectData$: Observable<EconomicChart[]>;
    categories: InventoryCategory[];
    componentList: Components[] = [{id: '0',
    cantDay: 0,
    componentName: '', 
    contractorCant: 0,
    totalValue: 0,
    unitValue: 0}];
    TotalCost: any;
    SubTotal: number;
    operatingExpenses: any;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: EconomicChart | null = null;
    selectedProductForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _inventoryService: EconomicChartService,
        private _matDialog: MatDialog)
    {
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the selected product form
        this.selectedProductForm = this._formBuilder.group({
            id               : [''],
            empresa: new FormControl(null, Validators.required),
            category         : [''],
            name             : ['', [Validators.required]],
            Programa          : [''],
            operatingExpenses : [''],
            stock            : [''],
            reserved         : [''],
            cost             : [''],
            percentage:   new FormControl('8', Validators.required),
            taxPercent       : [''],
            price            : [''],
            subTotal         : [''],
            thumbnail        : [''],
            images           : [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active           : [false]
        });


        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the projectData
        this.projectData$ = this._inventoryService._economicsChart$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProjectData(0, 10, 'name', 'asc', query);
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
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true
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
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProjectData();
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Toggle product details
     *
     * @param productId
     */
    toggleDetails(productId: string): void
    {
        // If the product is already selected...
        if ( this.selectedProduct && this.selectedProduct.id === productId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._inventoryService.getProductById(productId)
            .subscribe((product) => {

                // Set the selected product
                this.selectedProduct = product;

                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedProduct = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void
    {
        // Get the image count and current image index
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex = this.selectedProductForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }


    openDialog( route: any,data: InventoryTag,) {

        switch(route){
            case 'edit':
            const dialogRef =  this._matDialog.open(AddCardComponent, {
                autoFocus: false,
                data     : {
                    data,
                    show: true
                }
              });
              dialogRef.afterClosed().subscribe((result) => {
                if(result){
                    this.componentList[result.id] = result;
                }
              }); 
            break
            case 'add':
                const dialogRefPrroject = this._matDialog.open(AddCardComponent, {
                autoFocus: false,
                data     : {
                    show: false
                }
                });
                dialogRefPrroject.afterClosed().subscribe(datos => {
                    if(datos){
                        if(this.componentList[0].componentName == ''){
                            this.componentList.splice(i,1);
                        }
                        for (var i = 0; i < this.componentList.length; i++) {
                            this.componentList[i].id = i;
                        } 
                        this.componentList.push(datos);
                    }               
                });
            break
        }

    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteComponent(tag: any): void
    {
        // Delete the tag from the server
        this.componentList.splice(tag.id,1); 

        for (var i = 0; i < this.componentList.length; i++) {
            if(this.componentList[i].componentName == ''){
                this.componentList.splice(i,1);
            }
            this.componentList[i].id = i;
        }   
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }


    /**
     * Update the selected product using the form data
     */
    updateSelectedProduct(): void
    {
        // Get the product object
        const product = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;

        // Update the product on the server
        /* this._inventoryService.updateProduct(product.id, product).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        }); */
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void
    {
        //Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete product',
            message: 'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                /* this._inventoryService.deleteProduct(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                }); */
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
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

    private calculateCost(){
        debugger
        this.SubTotal = 0;
        this.TotalCost = 0;
        this.operatingExpenses = 0;
        for(var i = 0; i< this.componentList.length; i++){
            let subt = this.componentList[i].totalValue + this.SubTotal;
            this.SubTotal = subt;
        }
        let  porcentaje= 0;
        switch(this.selectedProductForm.value.percentage){
            case '1':
                porcentaje= 0.01;
            break
            case '2':
                porcentaje= 0.02;
            break
            case '3':
                porcentaje= 0.03;
            break
            case '4':
                porcentaje= 0.04;
            break
            case '5':
                porcentaje= 0.05;
            break
            case '6':
                porcentaje= 0.06;
            break
            case '7':
                porcentaje= 0.07;
            break
            case '8':
                porcentaje= 0.08;
            break
            case '9':
                porcentaje= 0.09;
            break
        }
        this.operatingExpenses = porcentaje *this.SubTotal;

        this.TotalCost = this.SubTotal + this.operatingExpenses;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
