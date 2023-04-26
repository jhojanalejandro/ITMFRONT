import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { InventoryPagination } from '../economic-chart/economic-chart.types';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { EconomicContractor } from 'app/modules/admin/dashboards/nomina/models/economic-data-contractor';
import { IHiringData } from 'app/modules/admin/dashboards/contractual/models/hiring-data';
import { Activity, Componente, Elements, ProjectFolder, ProjectFolders } from '../models/planing-model';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class EconomicChartService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    private _economicChart: BehaviorSubject<ProjectFolders | null> =
        new BehaviorSubject(null);
    private _economicsChart: BehaviorSubject<ProjectFolders[] | null> =
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
    get _economicChart$(): Observable<ProjectFolders> {
        return this._economicChart.asObservable();
    }

    /**
     * Getter for contracts
     */
    get _economicsChart$(): Observable<ProjectFolders[]> {
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
    getProjectData(): Observable<ProjectFolders[]> {
        const params = new HttpParams()
        .set('inProgress', false )
        .set('tipoModulo', 'planeacion');

        let urlEndPoint = this.apiUrl + environment.GetAllProjectFolderEndpoint;
        return this._httpClient.get(urlEndPoint, { params}).pipe(
            tap((response: any) => {
                response.forEach(element => {
                    if(element.execution){
                        element.execution = "EN Ejecución"
                    }else{
                        element.execution = "EN Proceso"
                    }
                    
                });
                this._economicsChart.next(response);
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

    
    addActivity(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addActivity;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }
    getComponent(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getComponent;
        return this._httpClient.get<Componente[]>(urlEndpointGenerate + id);
    }

    getActivity(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getActivity;
        return this._httpClient.get<Activity[]>(urlEndpointGenerate + id);
    }


    addElementoComponente(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addElementosComponent;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }

    getElementoComponente(id: any) {
        // const params = new HttpParams()
        // .set('contractorId', contractorId)
        // .set('contractId', contractId);
        let urlEndpointGenerate =
            this.apiUrl + environment.getElements;
        return this._httpClient.get<Elements[]>(urlEndpointGenerate + id);
    }

    getComponentById(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getComponentById;
        return this._httpClient.get<Componente>(urlEndpointGenerate + id);
    }


    getElementoById(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.geElementoById;
        return this._httpClient.get<Elements>(urlEndpointGenerate + id);
    }
    asignmentData(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.asignmentData;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }

    GetDataMinuta(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetDataMinutaHiringEndpoint;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }
    DeleteComponent(id: any) {
        let urlEndpointGenerate = this.apiUrl + environment.deleteComponent;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate + id);
    }

    sendEconomicdataContractor(model: EconomicContractor[]) {
        
        let urlEndpointGenerate = this.apiUrl + environment.addEconomicDataContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, model);
    }

    getHiringDataById(contractorId: any, contractId) {
        const params = new HttpParams()
        .set('contractorId', contractorId)
        .set('contractId', contractId);
        let urlEndpointGenerate =
            this.apiUrl + environment.GetByIdHiringEndpoint;
        return this._httpClient.get<IHiringData>(urlEndpointGenerate, {params: params});
    }
}
