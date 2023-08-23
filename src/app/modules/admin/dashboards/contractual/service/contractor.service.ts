import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, retry, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { ContractContractors, Contractor } from '../models/contractor';
import { ChargeAccount } from 'app/modules/admin/apps/home-contractor/models/pdfDocument';
import { AssignmentType } from '../models/assignment-user.model';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class ContractorService {
    private _contractorsByContract: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    getContractorByIdProject(contractId: string) {
        const params = new HttpParams()
            .set('contractId', contractId)
        let urlEndPoint = this.apiUrl + environment.GetByContractorIdContractEndpoint;
        return this._httpClient.get<IResponse>(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            }),
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }


    getPaymentContractor(contractId: string, contractorId: string) {
        let urlEndPoint = this.apiUrl;
        const params = new HttpParams()
            .set('contractId', contractId)
            .set('contractorId', contractorId);
        let urlEndpointGenerate = this.apiUrl + environment.GetPaymentsContractorListEndpoint;

        return this._httpClient.get<IResponse>(urlEndPoint + urlEndpointGenerate, { params: params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            })
        );
    }

    sendmailsAccounts(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.sendMails;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }
    DeleteContractor(id: any) {
        let urlEndpointGenerate = this.apiUrl + environment.DeleteContractorByIdEndpoint;
        return this._httpClient.delete<IResponse>(urlEndpointGenerate + id);
    }

    addContractFolder(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.addContractFolderEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data);
    }

    getPaymentAccount(contractorId: string, contractId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId)
        let urlEndPoint = this.apiUrl + environment.GetPdChargeAccountGetById;
        return this._httpClient.get<ChargeAccount>(urlEndPoint, { params: params });
    }


    getFilesContractorByContractId(contractorId: string, contractId: string) {
        const params = new HttpParams()
            .set('contractorId', contractorId)
            .set('contractId', contractId)
        let urlEndPoint = this.apiUrl + environment.GetAllFileByContractEndpoint;
        return this._httpClient.get<any>(urlEndPoint, { params: params });
    }

    getContractByContractor(contractorId: string) {
        let urlEndPoint = this.apiUrl + environment.GetContractsByContractors;
        return this._httpClient.get<any>(urlEndPoint + contractorId);
    }


    getDataMinute(contractId: ContractContractors) {
        let urlEndPoint = this.apiUrl + environment.GetBillByContractIdEndpoint;
        return this._httpClient.post<any>(urlEndPoint, contractId);
    }

    addNewnessContractor(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.AddnewnessContractor;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data)
            .pipe(retry(0));
    }


    assignmentUser(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.AssignmentUserContractEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data)
            .pipe(catchError(this.handleError));
    }

    getAssignmentType(): Observable<AssignmentType[]> {
        let urlEndPoint = this.apiUrl + environment.GetAllAssignmentTypeEndpoint;
        return this._httpClient.get<AssignmentType[]>(urlEndPoint);
    }


    saveTermFileContract(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.SaveTermFileContractEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data)
            .pipe(retry(0));
    }

    getTermType(): Observable<any[]> {
        let urlEndPoint = this.apiUrl + environment.GetAllTermTypeEndpoint;
        return this._httpClient.get<any[]>(urlEndPoint);
    }

    getValidateDocumentUploadEndpoint(contractId: string, contractorId: string) {
        const params = new HttpParams()
            .set('contractId', contractId)
            .set('contractorId', contractorId);
        let urlEndPoint = this.apiUrl + environment.ValidateDocumentUploadEndpoint;
        return this._httpClient.get<IResponse>(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            }),
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    saveMinuteModify(data: any) {
        let urlEndpointGenerate = this.apiUrl + environment.SaveModifyMinuteEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, data).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    // Método para manejar errores (opcional)
    private handleError(error: any): Observable<any> {
        // Implementa el manejo de errores aquí, si es necesario
        // Por ejemplo, puedes mostrar un mensaje de error en la consola o en una ventana modal
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: error.error.message,
            showConfirmButton: false,
            timer: 2500
        });
        return new Observable<any>();
    }
}
