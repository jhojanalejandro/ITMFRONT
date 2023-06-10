import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, switchMap, tap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';
import { IUserModel } from 'app/modules/auth/model/user-model';
import { UserFirm } from 'app/modules/admin/pages/settings/models/setting.model';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    encryptText: string = 'encrypt';  
    private _teams: BehaviorSubject<any> = new BehaviorSubject(null);
    private _user: ReplaySubject<IUserModel> = new ReplaySubject<IUserModel>(1);

    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient)
    {
    }

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: IUserModel)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<IUserModel>
    {
        return this._user.asObservable();
    }

    
    get teams$(): Observable<any>
    {
        return this._teams.asObservable();
    }
    /**
     * Setter & getter for access token
     */
    set codeC(codeC: string)
    {
        sessionStorage.setItem('codeC', codeC);
    }

    set accessToken(token: string)
    {
        sessionStorage.setItem('accessToken', token);
    }

    set accessId(id: string)
    {
        sessionStorage.setItem('accessId', id);
    }

    set accessName(name: string)
    {
        sessionStorage.setItem('accessName', name);
    }
    get accessToken(): string
    {
        return sessionStorage.getItem('accessToken') ?? '';
    }

    get codeC(): string
    {
        return sessionStorage.getItem('codeC') ?? '';
    }
    set accessEmail(name: string)
    {
        sessionStorage.setItem('accessEmail', name);
    }
    get accessEmail(): string
    {
        return sessionStorage.getItem('accessEmail') ?? '';
    }
    set accessAvatar(name: string)
    {
        sessionStorage.setItem('accessAvatar', name);
    }
    get accessAvatar(): string
    {
        return sessionStorage.getItem('accessAvatar') ?? '';
    }
    get accessId(): string
    {
        return sessionStorage.getItem('accessId') ?? '';
    }
    get accessName(): string
    {
        return sessionStorage.getItem('accessName') ?? '';
    }

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(model: any): Observable<any>
    {
        return this._httpClient.post(this.apiUrl + environment.retrieveEndpoint, model);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: any): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post<IResponse>(this.apiUrl  + environment.authenticateEndpoint, credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;
                this.accessId = response.id;
                this.accessName = response.userName
                this.accessEmail = response.userEmail 
                // let plainText:string;
                // this.accessId= crypto.AES.encrypt(plainText, response.id).toString();
                // Set the authenticated flag to true
                this._authenticated = true;
                // Store the user on the user service
                return of(response);
            })
        );
    }

    getUser(): Observable<IUserModel>
    {
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

    updateUser(data: any){
        let urlEndPoint = this.apiUrl+ environment.updateUserEndpoint;
        return this._httpClient.post<IResponse>(urlEndPoint, data).pipe(
            switchMap((response: any) => {        
                return of(response);
            })
        );
    }

     signInUsingToken(): Observable<any>
    {  
        // Renew token
        return this._httpClient.post(this.apiUrl + environment.validateTokenEndpoint + this.accessToken, {
            // accessToken: this.accessToken
        }).pipe(
            catchError(() =>
                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                
                if(response){
                    // Set the authenticated flag to true
                    this._authenticated = true;
                    // Return true
                    return of(true);
                    }else{
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
    signOut(): Observable<any>
    {
        
        // Remove the access token from the local storage
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessId');
        sessionStorage.removeItem('accessName');
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
     async signUp(user: any): Promise<Observable<any>>
    {
        let urlEndpointupdate = this.apiUrl+ environment.sigUpEndpoint;
        return await  this._httpClient.post<IResponse>(urlEndpointupdate, user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }
        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    updatePasswordUser(data: any){
        return this._httpClient.post<IResponse>(environment.apiURL + environment.updatePasswordUserEndpoint, data).pipe(
            switchMap((response: any) => {        
                return of(response);
            })
        );
    }

    getTeams(): Observable<any>
    {
        return this._httpClient.get<IResponse>(this.apiUrl + environment.getAllUserEndpoint ).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                this._teams.next(response);
                return of(response);
            })
        );
    }

    getAdmins(): Observable<any>
    {
        return this._httpClient.get<IResponse>(this.apiUrl + environment.getAllAdminsEndpoint ).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    UploadFileFirm(formdata: UserFirm) {
        let urlEndpointGenerate = this.apiUrl+ environment.addFileFirmEndpoint;
         return this._httpClient.post<IResponse>(urlEndpointGenerate, formdata);
    }

}
