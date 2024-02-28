import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, retry, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { ContractContractors } from '../models/contractor';
import { AssignmentType } from '../models/assignment-user.model';
import Swal from 'sweetalert2';
import { ModifyContractor } from 'app/modules/admin/pages/planing/models/planing-model';
import { MinutePdf, ResponseContractorPdf } from '../models/generate-pdf';

@Injectable({
    providedIn: 'root'
})
export class ContractorService {
    private _contractorsByContract: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    constructor(private _httpClient: HttpClient) {
    }

    get contractorsList$(): Observable<any> {
        return this._contractorsByContract.asObservable();
    }

    getContractorsByIdProject(contractId: string) {
        const params = new HttpParams()
            .set('contractId', contractId);
        let urlEndPoint = this.apiUrl + environment.GetByContractorsIdContractEndpoint;
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


    getDataMinute(contractId: ContractContractors): Observable<ResponseContractorPdf<MinutePdf>> {
        let urlEndPoint = this.apiUrl + environment.GetBillByContractIdEndpoint;
        return this._httpClient.post<ResponseContractorPdf<MinutePdf>>(urlEndPoint, contractId);
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

    saveMinuteModify(changeContractModel: ModifyContractor) {
        let urlEndpointGenerate = this.apiUrl + environment.SaveModifyMinuteEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, changeContractModel).pipe(
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    getNewnessType() {
        let urlEndpointGenerate = this.apiUrl + environment.getnewnessType;
        return this._httpClient.get<any>(urlEndpointGenerate)
            .pipe(retry(0));
    }

    getContractorByIdProject(contractId: string,contractorId) {
        const params = new HttpParams()
            .set('contractId', contractId)
            .set('contractorId', contractorId);
        let urlEndPoint = this.apiUrl + environment.GetByContractorIdContractEndpoint;
        return this._httpClient.get<IResponse>(urlEndPoint, { params }).pipe(
            tap((response: any) => {
                this._contractorsByContract.next(response);
            }),
            catchError(this.handleError) // Manejo de errores, si es necesario
        );
    }

    // Método para manejar errores (opcional)
    private handleError(error: any): Observable<any> {
        let errorResponse = null;
        if(error.error.message == null){
            errorResponse = error.error
        }else{
            errorResponse = error.error.message
        }
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: errorResponse,
            showConfirmButton: false,
            timer: 2500
        });
        return new Observable<any>();
    }
}
