import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
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
                for (let index = 0; index < teams.length; index++) {
                    switch (teams[index].code) {
                        case 'ADM':
                            teams[index].code = 'ADMIN'
                            break;
                        case 'PLNC':
                            teams[index].code = 'PLANEACIÓN'
                            break;
                        case 'CTL':
                            teams[index].code = 'CONTRACTUAL'
                            break;
                        case 'NMA':
                            teams[index].code = 'NOMINA'
                            break;
                        case 'JURD':
                            teams[index].code = 'JURIDICO'
                            break;
                        case 'SPV':
                            teams[index].code = 'SUPERVISOR'
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
