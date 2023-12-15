import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, Subject, switchMap, tap, throwError } from 'rxjs';
import { AuthUtils } from '../../core/auth/auth.utils';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { IUserModel, TeamModel } from 'app/modules/auth/model/user-model';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { UserFile } from 'app/modules/admin/pages/settings/models/setting.model';
import Swal from 'sweetalert2';
import { ResetPassword } from 'app/layout/common/models/reset-password';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    encryptText: string = 'encrypt';
    private _teams: BehaviorSubject<any> = new BehaviorSubject(null);
    private _user: ReplaySubject<IUserModel> = new ReplaySubject<IUserModel>(1);
    private isAuthenticated: boolean = false;
    apiUrl: any = environment.apiURL;
    userPresence$ = new Subject<{ code: string, rol: string, presente: boolean }>();


    constructor(
        private _httpClient: HttpClient) {
    }


    setUserPresence(code: string, rol: string, presente: boolean): void {
        this.userPresence$.next({ code, rol, presente });
    }
    // Método para establecer el estado de autenticación
    setAuthenticated(status: boolean) {
        this.isAuthenticated = status;
    }

    // Método para obtener el estado de autenticación
    isAuthenticatedUser(): boolean {
        return this.isAuthenticated;
    }

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: IUserModel) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<IUserModel> {
        return this._user.asObservable();
    }


    get teams$(): Observable<any> {
        return this._teams.asObservable();
    }
    /**
     * Setter & getter for access token
     */
    set codeC(codeC: string) {
        sessionStorage.setItem('codeC', codeC);
    }

    set accessToken(token: string) {
        sessionStorage.setItem('accessToken', token);
    }

    set accessId(id: string) {
        sessionStorage.setItem('accessId', id);
    }

    set accessName(name: string) {
        sessionStorage.setItem('accessName', name);
    }
    get accessToken(): string {
        return sessionStorage.getItem('accessToken') ?? '';
    }

    get codeC(): string {
        return sessionStorage.getItem('codeC') ?? '';
    }
    set accessEmail(name: string) {
        sessionStorage.setItem('accessEmail', name);
    }
    get accessEmail(): string {
        return sessionStorage.getItem('accessEmail') ?? '';
    }

    get accessId(): string {
        return sessionStorage.getItem('accessId') ?? '';
    }
    get accessName(): string {
        return sessionStorage.getItem('accessName') ?? '';
    }

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(mail: any): Observable<any> {
        let forgot = {
            mail: mail
        }
        return this._httpClient.post(this.apiUrl + environment.retrieveEndpoint, forgot);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: any): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post<IResponse>(this.apiUrl + environment.authenticateEndpoint, credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.data.accessToken;
                this.accessId = response.data.id;
                this.accessName = response.data.userName
                this.accessEmail = response.data.userEmail
                this.codeC = response.data.code
                // let plainText:string;
                // this.accessId= crypto.AES.encrypt(plainText, response.id).toString();
                // Set the authenticated flag to true
                this._authenticated = true;
                // Store the user on the user service
                return of(response);
            })
        );
    }

    getUser(): Observable<IUserModel> {
        // Throw error, if the user is already logged in
        // let plainText:string;
        // let id = crypto.AES.decrypt(plainText, this.accessId).toString();

        // let plainText:string;
        // let encrypt:string;
        // encrypt= crypto.AES.encrypt(plainText, this.accessId).toString();
        // let plainText2:string;
        return this._httpClient.get<any>(this.apiUrl + environment.getByIdUserEndpoint + this.accessId).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                this._user.next(response);
                return of(response);
            })
        );
    }

    updateUser(data: any) {
        let urlEndPoint = this.apiUrl + environment.updateUserEndpoint;
        return this._httpClient.post<IResponse>(urlEndPoint, data).pipe(
            switchMap((response: any) => {
                return of(response);
            }),
            catchError(this.handleError)
        );
    }

    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient.post(this.apiUrl + environment.validateTokenEndpoint + this.accessToken, {
            // accessToken: this.accessToken
        }).pipe(
            catchError(this.handleError),
            switchMap((response: any) => {

                if (response) {
                    // Set the authenticated flag to true
                    this._authenticated = true;
                    // Return true
                    return of(true);
                } else {
                    this._authenticated = false;

                    this.accessToken = '';

                    // Return true
                    return of(false);
                }

            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {

        // Remove the access token from the local storage
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessId');
        sessionStorage.removeItem('accessName');
        sessionStorage.removeItem('codeC');
        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: any) {
        let urlEndpointupdate = this.apiUrl + environment.sigUpEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointupdate, user)
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }
        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    updatePasswordUser(data: any) {
        return this._httpClient.post<IResponse>(environment.apiURL + environment.updatePasswordUserEndpoint, data).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }

    getTeams(): Observable<TeamModel[]> {
        return this._httpClient.get<TeamModel[]>(this.apiUrl + environment.getAllUserEndpoint).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                this._teams.next(response);
                return of(response);
            })
        );
    }


    UploadFileFirm(formdata: UserFile) {
        let urlEndpointGenerate = this.apiUrl + environment.addFileFirmEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

    getRolls(): Observable<any> {
        return this._httpClient.get<any>(this.apiUrl + environment.GetRollsEndpoint).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                this._teams.next(response);
                return of(response);
            })
        );
    }

    getTypeUserFile(): Observable<any> {
        return this._httpClient.get<any>(this.apiUrl + environment.GetTypeUserFileEndpoint).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                this._teams.next(response);
                return of(response);
            })
        );
    }

    validateRoll(area: any, assigned?: string[] | null): boolean {
        let result = false;
        switch (area) {
            case CodeUser.RECRUITER:
                if (this.codeC == CodeUser.ADMIN || this.codeC == CodeUser.RECRUITER || this.codeC == CodeUser.SUPERVISORAREAC) {
                    if (assigned != null && this.codeC == CodeUser.RECRUITER) {
                        let isAssigned = assigned.findIndex(f => f == this.accessId);
                        if (isAssigned >= 0) {
                            result = true;
                        }
                    } else {
                        result = true;
                    }
                }
                break;
            case CodeUser.NOMINA:
                if (this.codeC == CodeUser.ADMIN || this.codeC == CodeUser.NOMINA || this.codeC == CodeUser.SUPERVISORAREAN) {
                    result = true;
                }
                break
            case CodeUser.ADMIN:
                if (this.codeC == CodeUser.ADMIN || this.codeC == CodeUser.SUPERVISORAREAN) {
                    result = true;
                }
                break
            case CodeUser.PLANEACION:
                if (this.codeC == CodeUser.ADMIN || this.codeC == CodeUser.PLANEACION) {
                    result = true;
                }
                break
            case CodeUser.SUPERVISORAREAC:
                if (this.codeC == CodeUser.ADMIN || this.codeC == CodeUser.SUPERVISORAREAC) {
                    result = true;
                }
                break
            case CodeUser.JURIDICO:
                if (this.codeC == CodeUser.ADMIN || this.codeC == CodeUser.JURIDICO) {
                    result = true;
                }
                break
        }
        return result;
    }


    getRoll(): Observable<any[]> {
        return this._httpClient.get<any[]>(this.apiUrl + environment.GetRollsEndpoint).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                this._teams.next(response);
                return of(response);
            })
        );
    }

    UploadFileAttach(formdata: UserFile[]) {
        let urlEndpointGenerate = this.apiUrl + environment.AddFileAttachFirmEndpoint;
        return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }


    resetPassword(resetModel: ResetPassword): Observable<any> {
        return this._httpClient.patch<IResponse>(this.apiUrl + environment.resetPasswordUserpoint, resetModel)
    }

    private handleError(error: any): Observable<any> {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            html: error.error.message,
            showConfirmButton: false,
            timer: 3000
        });
        return new Observable<any>();
    }
}
