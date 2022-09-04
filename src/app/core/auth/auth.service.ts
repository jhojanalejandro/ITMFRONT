import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { IResponse } from 'app/layout/common/models/Response';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    encryptText: string = 'encrypt';  
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    apiUrl: any = environment.apiURL;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }


    get user$(): Observable<any>
    {
        return this._data.asObservable();
    }
    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    set accessId(id: string)
    {
        localStorage.setItem('accessId', id);
    }

    set accessName(name: string)
    {
        localStorage.setItem('accessName', name);
    }
    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    get accessId(): string
    {
        return localStorage.getItem('accessId') ?? '';
    }
    get accessName(): string
    {
        return localStorage.getItem('accessName') ?? '';
    }

    
    set accessIdQr(accessIdQr: any)
    {
        localStorage.setItem('accessIdQr', accessIdQr);
    }
    get accessIdQr(): any
    {
        return localStorage.getItem('accessIdQr') ?? '';
    }

    set accessNumberQr(accessNumberQr: any)
    {
        localStorage.setItem('accessNumberQr', accessNumberQr);
    }
    get accessNumberQr(): any
    {
        return localStorage.getItem('accessNumberQr') ?? '';
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
                // let plainText:string;
                // this.accessId= crypto.AES.encrypt(plainText, response.id).toString();
                // Set the authenticated flag to true
                this._authenticated = true;
                // Store the user on the user service
                this._userService.user = response;
                // Return a new observable with the response                
                return of(response);
            })
        );
    }

    getUser(): Observable<any>
    {
        // Throw error, if the user is already logged in
        // let plainText:string;
        // let id = crypto.AES.decrypt(plainText, this.accessId).toString();
        
        // let plainText:string;
        // let encrypt:string;
        // encrypt= crypto.AES.encrypt(plainText, this.accessId).toString();
        // console.log('encrypt', encrypt);
        // let plainText2:string;
  
        // console.log('descrypt',  crypto.AES.decrypt(encrypt, encrypt).toString(crypto.enc.Utf8));
        
        return this._httpClient.get<IResponse>(this.apiUrl + environment.getByIdUserEndpoint + this.accessId).pipe(
            switchMap((response: any) => {
                // Store the user on the user service
                this._userService.user = response;
                // Return a new observable with the response
                this._data.next(response);
                return of(response);
            })
        );
    }
    updateUser(data: any){
        return this._httpClient.post<IResponse>(this.apiUrl + environment.updateUserEndpoint, data).pipe(
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

                    // Store the user on the user service
                    this._userService.user = response.user;

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
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessId');
        localStorage.removeItem('accessName');
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
}
