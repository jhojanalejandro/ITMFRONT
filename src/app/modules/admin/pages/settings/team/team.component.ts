import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
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
    permission: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _authService: AuthService)
    {
    }

    ngOnInit(): void
    {
        debugger
        this.permission = this._authService.validateRoll(CodeUser.ADMIN);
        if (!this.permission) {
          swal.fire('', 'No tienes permisos para asignar roles!', 'warning');
        }
        this._authService.teams$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((teams: any) => {
            // Mark for check
            for (let index = 0; index < teams.length; index++) {
                if(teams[index].avatar == 'vacio'){
                    teams[index].avatar = 'assets/images/avatars/male-07.jpg';
                }  
                switch (teams[index].idRoll) {
                    case 1:
                        teams[index].idRoll = 'admin' 
                    break;
                    case 2:
                        teams[index].idRoll = 'encargado' 
                    break;
                    case 3:
                        teams[index].idRoll = 'leer, escribir' 
                    break;
                    case 4:
                        teams[index].idRoll = 'leer' 
                    break;
                    case 5:
                        teams[index].idRoll = 'escribir' 
                    break;
                    case 7:
                        teams[index].idRoll = 'inactivo' 
                    break;
                }
                
            }
            debugger
            this.members = teams;
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


    onChange(rol:any,user: any) {
        console.log(rol.value);
        
        user.idRoll = rol.value;
        // user.rollName = event
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
