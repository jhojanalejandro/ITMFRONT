import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { InventoryPagination, EconomicChart } from './economic-chart.types';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { Componente, IElements } from 'app/modules/admin/dashboards/contractual/models/element';
import { DetalleContrato } from './models/detalle-contrato';
import { EconomicContractor } from 'app/modules/admin/dashboards/contractual/contractor-list/models/economic-data-contractor';

@Injectable({
    providedIn: 'root',
})
export class EconomicChartService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    private _economicChart: BehaviorSubject<EconomicChart | null> =
        new BehaviorSubject(null);
    private _economicsChart: BehaviorSubject<EconomicChart[] | null> =
        new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get _economicChart$(): Observable<EconomicChart> {
        return this._economicChart.asObservable();
    }

    /**
     * Getter for products
     */
    get _economicsChart$(): Observable<EconomicChart[]> {
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
    getProjectData(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: InventoryPagination;
        economicChart: EconomicChart[];
    }> {
        let urlEndPoint = this.apiUrl + environment.GetAllProjectFolderEndpoint + false;
        return this._httpClient.get(urlEndPoint).pipe(
            tap((response: any) => {
                this._economicsChart.next(response);
            })
        );
    }

    /**
     * Get product by id
     */
    getProductById(id: string): Observable<EconomicChart> {
        return this._economicsChart.pipe(
            take(1),
            map((products) => {
                // Find the product
                const product = products.find((item) => item.id === id) || null;

                // Update the product
                this._economicChart.next(product);

                // Return the product
                return product;
            }),
            switchMap((product) => {
                if (!product) {
                    return throwError(
                        'Could not found product with id of ' + id + '!'
                    );
                }

                return of(product);
            })
        );
    }

    addEconomicChart(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    addComponent(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addComponent;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }

    getComponent(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getComponent;
        return this._httpClient.get<Componente[]>(urlEndpointGenerate + id);
    }

    addElementoComponente(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addElementosComponent;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }

    getElementoComponente(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addElementosComponent + '/Get/';
        return this._httpClient.get<IElements[]>(urlEndpointGenerate + id);
    }

    getComponentById(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getComponentById;
        return this._httpClient.get<Componente>(urlEndpointGenerate + id);
    }


    getElementoById(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.geElementoById;
        return this._httpClient.get<IElements>(urlEndpointGenerate + id);
    }
    asignmentData(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.asignmentData;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }
    DeleteComponent(id: any) {
        let urlEndpointGenerate = this.apiUrl + environment.deleteComponent;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate + id);
    }

    sendEconomicdataContractor(model: EconomicContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.addEconomicDataContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, model);
    }



}
