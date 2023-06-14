import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { DetalleContrato } from '../pages/planing/models/planing-model';
import { AuthService } from 'app/core/auth/auth.service';
import { CpcType, ElementType, StatusContract } from './model/generic.model';

@Injectable({
    providedIn: 'root'
})
export class GenericService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }


    UpdateContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.UpdateContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    UpdateStateContractFolder(id: string) {
        const params = new HttpParams()
            .set('id', id);
        let urlEndpointGenerate = this.apiUrl + environment.UpdateStateContractFolderEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate, { params });
    }


    getAllContract(inProgress: boolean, tipoModulo: string): Observable<any> {
        const params = new HttpParams()
            .set('inProgress', inProgress)
            .set('tipoModulo', tipoModulo)
        let urlEndPoint = this.apiUrl + environment.GetAllContractEndpoint;
        return this._httpClient.get(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getDetalleContratoList(id: any, tipo: boolean): Observable<DetalleContrato[]> {
        const params = new HttpParams()
            .set('id', id)
            .set('tipoConsulta', tipo);

        let urlEndpointGenerate =
            this.apiUrl + environment.GetByIdDetailListEndpoint;
        return this._httpClient.get<DetalleContrato[]>(urlEndpointGenerate, { params: params }
        );
    }

    getDetalleContratoById(id: any, tipo: boolean): Observable<DetalleContrato> {
        const params = new HttpParams()
            .set('id', id)
            .set('tipoConsulta', tipo);

        let urlEndpointGenerate =
            this.apiUrl + environment.GetByIdDetailByIdEndpoint;
        return this._httpClient.get<DetalleContrato>(urlEndpointGenerate, { params: params }
        );
    }


    getCpcType(): Observable<CpcType[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetCpcTypeEndpoint;
        return this._httpClient.get<CpcType[]>(urlEndpointGenerate
        );
    }

    getElementType(): Observable<ElementType[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetElementTypeEndpoint;
        return this._httpClient.get<ElementType[]>(urlEndpointGenerate
        );
    }

    getstatusContract(): Observable<StatusContract[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetStatusContractEndpoint;
        return this._httpClient.get<StatusContract[]>(urlEndpointGenerate
        );
    }

    getTypeMinutesContract(): Observable<any[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetMinuteTypeContractEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate
        );
    }

    
    getBanksContract(): Observable<any[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetBanksContractEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate
        );
    }

    getRubrosContract(): Observable<any[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetGetAllRubrosContractEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate
        );
    }
}
