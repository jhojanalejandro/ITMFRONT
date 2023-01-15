import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { DetalleContrato } from '../pages/planing/models/detalle-contrato';

@Injectable({
    providedIn: 'root'
})
export class GenericService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }


    UpdateProjectFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateProjectFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    UpdateStateProjectFolder(id: number) {
        const params = new HttpParams()
        .set('id', id);
        let urlEndpointGenerate = this.apiUrl+ environment.UpdateStateProjectFolderEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate, {params: params});
    }


    getAllContract(inProgress: boolean,tipoModulo: string ): Observable<any>
    {
        const params = new HttpParams()
        .set('inProgress', inProgress )
        .set('tipoModulo', tipoModulo)
        let urlEndPoint = this.apiUrl+ environment.GetAllProjectFolderEndpoint;
        return  this._httpClient.get(urlEndPoint, {params: params}).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getDetalleContrato(id: any, tipo: boolean): Observable<DetalleContrato[]> {
        const params = new HttpParams()
        .set('id', id )
        .set('tipoConsulta', tipo);
  
        let urlEndpointGenerate =
            this.apiUrl + environment.GetByIdDetailEndpoint;
        return this._httpClient.get<DetalleContrato[]>(urlEndpointGenerate,{params : params}  
            );
    }
}
