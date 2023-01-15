import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { Subject, takeUntil} from 'rxjs';
import swal from 'sweetalert2';

@Component({
    selector: 'settings-team',
    templateUrl: './team.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsTeamComponent implements OnInit {
    durationInSeconds = 5;

    members: any[];
    roles: any = GlobalConst.roles;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
    ) {
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this._authService.teams$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((teams: any) => {
                // Mark for check
                for (let index = 0; index < teams.length; index++) {
                    if (teams[index].avatar == 'vacio') {
                        teams[index].avatar = 'assets/images/avatars/brian-hughes.png';
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
                            teams[index].idRoll = 'inactivo'
                            break;
                    }

                }
                this.members = teams;
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    onChange(rol: any, user: any) {
        user.idRoll = rol.value;
        // user.rollName = event
        this._authService
            .updateUser(user)
            .subscribe((res) => {
                if (res) {
                    this.openSnackBar(user.userName);
                }

            },
                (response) => {
                    swal.fire('Error', 'No se pudo actualizar!', 'success');
                });
    }
    openSnackBar(user: string) {
        this._snackBar.open('  Rol Asignado al usuario ' + user, 'echo', {
            duration: this.durationInSeconds * 1000,
        });
    }
}
