import { Injectable, OnInit } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
// import { user as userData } from 'app/mock-api/common/user/data';

@Injectable({
    providedIn: 'root'
})
export class UserMockApi implements OnInit {
     _user: User ={
        id: this._userServ.accessId,
        name: this._userServ.accessName,
        email: this._userServ.accessEmail,
        avatar: this._userServ.accessName,
        status: 'online'
    } ;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _userServ: AuthService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }
    ngOnInit(): void {
        this.getuser();
    }


    getuser(){
        this._userServ.getUser().subscribe((response) => {
            
 
        }
    );

    }
    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user')
            .reply(() => [200, cloneDeep(this._user)]);

        // -----------------------------------------------------------------------------------------------------
        // @ User - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/common/user')
            .reply(({request}) => {

                // Get the user mock-api
                const user = cloneDeep(request.body.user);

                // Update the user mock-api
                this._user = assign({}, this._user, user);

                // Return the response
                return [200, cloneDeep(this._user)];
            });
    }
}
