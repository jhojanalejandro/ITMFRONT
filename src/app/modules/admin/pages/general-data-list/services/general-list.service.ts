import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    Observable,
    tap,
} from 'rxjs';
import { environment } from 'environments/environment';
import { InventoryPagination, ProjectFolders } from '../../planing/models/planing-model';
import { HistoryContractor } from '../models/historyContractor';

@Injectable({
    providedIn: 'root',
})
export class GeneralListService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);

    private _listProject: BehaviorSubject<ProjectFolders[] | null> =
        new BehaviorSubject(null);

        private _historyContractor: BehaviorSubject<ProjectFolders[] | null> =
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

    get _projectList$(): Observable<ProjectFolders[]> {
        return this._listProject.asObservable();
    }

    get _historyContractor$(): Observable<ProjectFolders[]> {
        return this._historyContractor.asObservable();
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
    getProjectRegistered(): Observable<ProjectFolders[]> {

        let urlEndPoint = this.apiUrl + environment.GetAllProjectRegisteredEndpoint;
        return this._httpClient.get(urlEndPoint).pipe(
            tap((response: any) => {
                response.forEach(element => {
                    if(element.valorContrato == null ){
                        element.valorContrato = 'No Calculado';
                    }
                    if(element.execution){
                        element.execution = "EN Ejecución"
                    }else{
                        element.execution = "EN Proceso"
                    }
                    
                });
                this._listProject.next(response);
            })
        );
    }

    getHistoryContractor(): Observable<HistoryContractor[]> {

        let urlEndPoint = this.apiUrl + environment.HistoryContractor;
        return this._httpClient.get(urlEndPoint).pipe(
            tap((response: any) => {
                this._historyContractor.next(response);
            })
        );
    }




}
