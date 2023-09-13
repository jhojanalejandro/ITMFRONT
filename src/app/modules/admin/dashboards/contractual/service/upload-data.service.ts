import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class UploadDataService {
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

    addHiringContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addHiringEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    addContractFolder(data: any): Observable<any> {
        let urlEndpointSaveContract = this.apiUrl + environment.addContractFolderEndpoint;
        // return this._httpClient.post<IResponse>(urlEndpointSaveContract, data);
        return this._httpClient.post<IResponse>(urlEndpointSaveContract, data).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    UpdateCostContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.UpdateContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    finalContract(id: any) {
        let urlEndpointGenerate = this.apiUrl + environment.DeleteContractFolderEndpoint;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate, id);
    }

    // Método para manejar errores (opcional)
    private handleError(error: any): Observable<any> {
        // Implementa el manejo de errores aquí, si es necesario
        // Por ejemplo, puedes mostrar un mensaje de error en la consola o en una ventana modal
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: 'Error del sistema Intenta nuevamente!',
            showConfirmButton: false,
            timer: 1500
        });
        return new Observable<any>();
    }
}
