import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { DetalleContrato } from '../pages/planing/models/planing-model';
import {
    CpcType,
    ElementType,
    RubroType,
    StatusContract,
} from './model/generic.model';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { EntityHealth } from '../apps/home-contractor/models/mater.model';
import * as CryptoJS from 'crypto-js';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';

@Injectable({
    providedIn: 'root',
})
export class GenericService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    UpdateContractFolder(data: any) {
        let urlEndpointGenerate =
            this.apiUrl + environment.UpdateContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    UpdateStateContractFolder(contractId: string) {
        const params = new HttpParams().set('contractId', contractId);
        let urlEndpointGenerate =
            this.apiUrl + environment.UpdateStateContractFolderEndpoint;
        return this._httpClient
            .get<IResponse>(urlEndpointGenerate, { params })
            .pipe(catchError(this.handleError));
    }

    getAllContract(inProgress: boolean, tipoModulo: string): Observable<any> {
        const params = new HttpParams()
            .set('inProgress', inProgress)
            .set('tipoModulo', tipoModulo);
        let urlEndPoint = this.apiUrl + environment.GetAllContractEndpoint;
        return this._httpClient.get(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getDetalleContratoList(
        id: any,
        tipo: boolean
    ): Observable<DetalleContrato[]> {
        const params = new HttpParams().set('id', id).set('tipoConsulta', tipo);

        let urlEndpointGenerate =
            this.apiUrl + environment.GetByIdDetailListEndpoint;
        return this._httpClient.get<DetalleContrato[]>(urlEndpointGenerate, {
            params: params,
        });
    }

    getDetalleContractById(id: any): Observable<DetalleContrato> {
        const params = new HttpParams().set('id', id);
        let urlEndpointGenerate =
            this.apiUrl + environment.GetByIdDetailByIdEndpoint;
        return this._httpClient.get<DetalleContrato>(urlEndpointGenerate, {
            params: params,
        });
    }

    getCpcType(): Observable<CpcType[]> {
        let urlEndpointGenerate = this.apiUrl + environment.GetCpcTypeEndpoint;
        return this._httpClient.get<CpcType[]>(urlEndpointGenerate);
    }

    getElementType(): Observable<ElementType[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetElementTypeEndpoint;
        return this._httpClient.get<ElementType[]>(urlEndpointGenerate);
    }

    getstatusContract(): Observable<StatusContract[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetStatusContractEndpoint;
        return this._httpClient.get<StatusContract[]>(urlEndpointGenerate);
    }

    getTypeMinutesContract(): Observable<any[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetMinuteTypeContractEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate);
    }

    getBanksContract(): Observable<any[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetBanksContractEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate);
    }

    getRubrosContract(): Observable<RubroType[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetGetAllRubrosContractEndpoint;
        return this._httpClient.get<RubroType[]>(urlEndpointGenerate);
    }

    getDetailType(): Observable<any[]> {
        let urlEndpointGenerate =
            this.apiUrl + environment.GetDetailTypeEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate);
    }

    getEmptityHealthList(): Observable<EntityHealth[]> {
        let urlEndPoint = this.apiUrl + environment.GetEmptityHealthEndpoint;
        return this._httpClient.get<EntityHealth[]>(urlEndPoint);
    }

    // Método para manejar errores (opcional)
    private handleError(error: any): Observable<any> {
        // Implementa el manejo de errores aquí, si es necesario
        // Por ejemplo, puedes mostrar un mensaje de error en la consola o en una ventana modal
        console.log(error);
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: error.error.message,
            showConfirmButton: false,
            timer: 2000,
        });
        return new Observable<any>();
    }

    addCommasToNumber(value: number): string {
        if (value != null) {
            if (value <= 9999 && value >= 1000) {
                const formattedNumber = value.toString();
                return (
                    formattedNumber.substr(0, 1) + '.' + formattedNumber.substr(1)
                );
            } else {
                return value.toLocaleString('es-ES', { maximumFractionDigits: 0 });
            }
        }

    }

    getDateContract(
        contractorId: string,
        contractId: string
    ): Observable<DetalleContrato[]> {
        const params = new HttpParams().set('contractorId', contractorId).set('contractId', contractId);

        let urlEndpointGenerate =
            this.apiUrl + environment.GetByIdDateHiringEndpoint;
        return this._httpClient.get<any>(urlEndpointGenerate, {
            params: params,
        });
    }

    getTransformDate(getDate: Date): string {
        const datePipe = new DatePipe('en-US');
        const currentDate = new Date(getDate);
        return datePipe.transform(currentDate, 'yyyy-MM-dd');
    }



    encryptData(data: string): string {
        const cipherText = CryptoJS.AES.encrypt(data, GlobalConst.encryptSecretKey).toString();
        return cipherText;
    }

    decryptData(cipherText: string): string {
        const decrypted = CryptoJS.AES.decrypt(cipherText, GlobalConst.encryptSecretKey).toString(CryptoJS.enc.Utf8);
        return decrypted;
    }

    decryptDataUser(cipherText: string): string {
        const decrypted = CryptoJS.AES.decrypt(cipherText, GlobalConst.encryptSecretKeyApi).toString(CryptoJS.enc.Utf8);
        return decrypted;
    }
}
