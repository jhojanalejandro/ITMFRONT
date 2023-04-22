import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { CodeUser } from 'app/core/enums/enumAuth';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { Subject, takeUntil } from 'rxjs';
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
                teams.forEach(element => {
                    switch (element.code) {
                        case CodeUser.ADMIN:
                            element.code = 'ADMIN'
                            break;
                        case CodeUser.PLANEACION:
                            element.code = 'PLANEACIÓN'
                            break;
                        case CodeUser.RECRUITER:
                            element.code = 'CONTRACTUAL'
                            break;
                        case CodeUser.NOMINA:
                            element.code = 'NOMINA'
                            break;
                        case CodeUser.JURIDICO:
                            element.code = 'JURIDICO'
                            break;
                        case CodeUser.SUPERVISOR:
                            element.code = 'SUPERVISOR'
                            break;
                        case CodeUser.DESACTIVADO:
                            element.code = 'DESACTIVADO'
                            break;
                    }
                });
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

    onChange(rolCode: any, user: any) {
        user.code = rolCode.value
        this._authService
            .updateUser(user)
            .subscribe((res) => {
                if (res) {
                    this.openSnackBar(user.userName);
                }

            },
                (response) => {
                    console.log('error', response);
                    swal.fire('Error', 'No se pudo actualizar!', 'error');
                });
    }
    openSnackBar(user: string) {
        this._snackBar.open('  Rol Asignado al usuario ' + user, 'echo', {
            duration: this.durationInSeconds * 1000,
        });
    }
   
}
