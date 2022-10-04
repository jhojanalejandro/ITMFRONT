import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalCont } from 'app/layout/common/global-constant/global-constant';
import { IUserModel } from 'app/layout/common/models/user-model';
import { Subject, takeUntil, switchMap, Observable, startWith, map } from 'rxjs';
import swal from 'sweetalert2';

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
    constructor(private _authService: AuthService)
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



    }

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

    onChange(event, user: any) {
        debugger
        user.rollName = event
        this._authService
        .updateUser(user)
        .subscribe((res) => {   
          if(res){
            swal.fire('Usuario Actualizado Exitosamente!', '', 'success');

          }
  
        },
        (response) => {
            swal.fire('Error al actualizar!', '', 'success');


        });
    }
}
