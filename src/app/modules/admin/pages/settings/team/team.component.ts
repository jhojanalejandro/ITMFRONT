import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { Subject, takeUntil, switchMap, Observable, startWith, map } from 'rxjs';

@Component({
    selector       : 'settings-team',
    templateUrl    : './team.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsTeamComponent implements OnInit
{
    members: any[];
    roles: any = GlobalCont.roles;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,

        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._authService.teams$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((teams: any) => {
            // Mark for check
            for (let index = 0; index < teams.length; index++) {
                if(teams[index].avatar == 'vacio'){
                    teams[index].avatar = 'assets/images/avatars/male-07.jpg';
                }  
                
            }
            this.members = teams;
            //this._changeDetectorRef.markForCheck();
        });


        
        // (this._authService.getAllUser()).subscribe((Response) => {
        //     for (let index = 0; index < Response.length; index++) {
        //         if(Response[index].avatar = 'vacio'){
        //             Response[index].avatar = 'assets/images/avatars/male-07.jpg';
        //         }  
                
        //     }
        //     this.members = [Response];
        // });
        // this.members = [
        //     {
        //         avatar: 'assets/images/avatars/male-01.jpg',
        //         name  : 'Dejesus Michael',
        //         email : 'dejesusmichael@mail.org',
        //         role  : 'admin'
        //     },
        //     {
        //         avatar: 'assets/images/avatars/male-03.jpg',
        //         name  : 'Mclaughlin Steele',
        //         email : 'mclaughlinsteele@mail.me',
        //         role  : 'admin'
        //     },
        //     {
        //         avatar: 'assets/images/avatars/female-02.jpg',
        //         name  : 'Laverne Dodson',
        //         email : 'lavernedodson@mail.ca',
        //         role  : 'Escribir'
        //     },
        //     {
        //         avatar: 'assets/images/avatars/female-03.jpg',
        //         name  : 'Trudy Berg',
        //         email : 'trudyberg@mail.us',
        //         role  : 'Leer'
        //     },
        //     {
        //         avatar: 'assets/images/avatars/male-07.jpg',
        //         name  : 'Lamb Underwood',
        //         email : 'lambunderwood@mail.me',
        //         role  : 'Leer'
        //     },
        //     {
        //         avatar: 'assets/images/avatars/male-08.jpg',
        //         name  : 'Mcleod Wagner',
        //         email : 'mcleodwagner@mail.biz',
        //         role  : 'Leer'
        //     },
        //     {
        //         avatar: 'assets/images/avatars/female-07.jpg',
        //         name  : 'Shannon Kennedy',
        //         email : 'shannonkennedy@mail.ca',
        //         role  : 'Leer'
        //     }
        // ];
        

        // Setup the roles

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    async getDtaUser() {

    }
}
