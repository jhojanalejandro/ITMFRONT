import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
    BehaviorSubject,
    Observable,
    catchError,
    tap,
} from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { EconomicContractor } from 'app/modules/admin/dashboards/nomina/models/economic-data-contractor';
import { IHiringData } from 'app/modules/admin/dashboards/contractual/models/hiring-data';
import { Activity, Componente, Elements, InventoryPagination, ContractFolder, ContractFolders, ContractList, ElementComponent } from '../models/planing-model';
import Swal from 'sweetalert2';
import { ModuloEnum } from 'app/layout/common/enums/modulo-enum/modulo';

@Injectable({
    providedIn: 'root',
})
export class PlaningService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    private _economicChart: BehaviorSubject<ContractFolders | null> =
        new BehaviorSubject(null);
    private _contractList: BehaviorSubject<ContractFolders[] | null> =
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
    get _economicChart$(): Observable<ContractFolders> {
        return this._economicChart.asObservable();
    }

    /**
     * Getter for contracts
     */
    get _contractList$(): Observable<ContractList[]> {
        return this._contractList.asObservable();
    }

    getContractActivateList(): Observable<ContractList[]> {
        const params = new HttpParams()
            .set('inProgress', false)
            .set('tipoModulo', ModuloEnum.PLANEACION);

        let urlEndPoint = this.apiUrl + environment.GetAllContractEndpoint;
        return this._httpClient.get(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                response.forEach(element => {
                    if (element.valorContrato != null) {
                        element.valorContrato = (+element.valorContrato.toFixed(0)).toLocaleString();
                    }
                });
                this._contractList.next(response);
            })
        );
    }

    addEconomicChart(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError)
        );
    }

    addComponent(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addComponent;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
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

    getAllActivity(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getActivityByIdComponent;
        return this._httpClient.get<Activity[]>(urlEndpointGenerate + id).pipe(
            catchError(this.handleError)
        );
    }


    addElementoComponente(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.addElementosComponent;
        return this._httpClient.post<any>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError)
        );
    }

    getElementoComponente(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getElements;
        return this._httpClient.get<Elements[]>(urlEndpointGenerate + id);
    }

    getComponentById(id: any, activityId?: string, elementId?: string) {
        const params = new HttpParams()
            .set('id', id)
            .set('activityId', activityId)
            .set('elementId', elementId);
        let urlEndpointGenerate =
            this.apiUrl + environment.getComponentById;
        return this._httpClient.get<IResponse>(urlEndpointGenerate, { params }).pipe(
            catchError(this.handleError)
        );
    }


    getElementoById(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getElementoById;
        return this._httpClient.get<ElementComponent>(urlEndpointGenerate + id);
    }

    getActivityById(id: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.getActivityById;
        return this._httpClient.get<Activity>(urlEndpointGenerate + id);
    }

    asignmentData(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.asignmentData;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }

    GetDataMinuta(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetDataMinutaHiringEndpoint;
        return this._httpClient.post<any>(urlEndpointGenerate, data);
    }
    deleteComponent(id: any) {
        let urlEndpointGenerate = this.apiUrl + environment.deleteComponent;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate + id).pipe(
            catchError(this.handleError)
        );
    }

    sendEconomicdataContractor(model: EconomicContractor[]) {
        let urlEndpointGenerate = this.apiUrl + environment.addEconomicDataContractorEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, model).pipe(
            catchError(this.handleError)
        );
    }

    getHiringDataById(contractorId: any, contractId) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId);
        let urlEndpointGenerate =
            this.apiUrl + environment.GetByIdHiringEndpoint;
        return this._httpClient.get<IHiringData>(urlEndpointGenerate, { params: params });
    }


    // Método para manejar errores (opcional)
    private handleError(error: any): Observable<any> {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: 'Error ' + error.error.message + ' Intenta nuevamente!',
            showConfirmButton: false,
            timer: 1500
        });
        return new Observable<any>();
    }


}
