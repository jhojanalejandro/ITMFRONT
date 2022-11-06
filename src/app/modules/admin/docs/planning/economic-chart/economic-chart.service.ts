import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { InventoryPagination, EconomicChart } from './economic-chart.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EconomicChartService
{
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _economicChart: BehaviorSubject<EconomicChart | null> = new BehaviorSubject(null);
    private _economicsChart: BehaviorSubject<EconomicChart[] | null> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination>
    {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get _economicChart$(): Observable<EconomicChart>
    {
        return this._economicChart.asObservable();
    }

    /**
     * Getter for products
     */
    get _economicsChart$(): Observable<EconomicChart[]>
    {
        return this._economicsChart.asObservable();
    }

    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
     getProjectData(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: InventoryPagination; economicChart: EconomicChart[] }>
    {
        let urlEndPoint = this.apiUrl+ environment.GetAllProjectFolderEndpoint;
        return  this._httpClient.get(urlEndPoint).pipe(
            tap((response: any) => {
                this._economicsChart.next(response);
            })
        );
    }

    /**
     * Get product by id
     */
    getProductById(id: string): Observable<EconomicChart>
    {
        return this._economicsChart.pipe(
            take(1),
            map((products) => {
                
                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._economicChart.next(product);

                // Return the product
                return product;
            }),
            switchMap((product) => {

                if ( !product )
                {
                    return throwError('Could not found product with id of ' + id + '!');
                }

                return of(product);
            })
        );
    }



    // /**
    //  * Update product
    //  *
    //  * @param id
    //  * @param product
    //  */
    // updateProduct(id: string, product: EconomicChart): Observable<EconomicChart>
    // {
    //     return this.products$.pipe(
    //         take(1),
    //         switchMap(products => this._httpClient.patch<EconomicChart>('api/apps/ecommerce/inventory/product', {
    //             id,
    //             product
    //         }).pipe(
    //             map((updatedProduct) => {

    //                 // Find the index of the updated product
    //                 const index = products.findIndex(item => item.id === id);

    //                 // Update the product
    //                 products[index] = updatedProduct;

    //                 // Update the products
    //                 this._economicsChart.next(products);

    //                 // Return the updated product
    //                 return updatedProduct;
    //             }),
    //             switchMap(updatedProduct => this.product$.pipe(
    //                 take(1),
    //                 filter(item => item && item.id === id),
    //                 tap(() => {

    //                     // Update the product if it's selected
    //                     this._economicChart.next(updatedProduct);

    //                     // Return the updated product
    //                     return updatedProduct;
    //                 })
    //             ))
    //         ))
    //     );
    // }

    // /**
    //  * Delete the product
    //  *
    //  * @param id
    //  */
    // deleteProduct(id: string): Observable<boolean>
    // {
    //     return this._economicsChart$.pipe(
    //         take(1),
    //         switchMap(products => this._httpClient.delete('api/apps/ecommerce/inventory/product', {params: {id}}).pipe(
    //             map((isDeleted: boolean) => {

    //                 // Find the index of the deleted product
    //                 const index = products.findIndex(item => item.id === id);

    //                 // Delete the product
    //                 products.splice(index, 1);

    //                 // Update the products
    //                 this._economicsChart.next(products);

    //                 // Return the deleted status
    //                 return isDeleted;
    //             })
    //         ))
    //     );
    // }



}
