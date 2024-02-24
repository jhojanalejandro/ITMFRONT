import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { CodeUser } from 'app/layout/common/enums/userEnum/enumAuth';
import { GlobalConst } from 'app/layout/common/global-constant/global-constant';
import { TeamModel } from 'app/modules/auth/model/user-model';
import { Subject, takeUntil } from 'rxjs';
import swal from 'sweetalert2';

@Component({
    selector: 'settings-team',
    templateUrl: './team.component.html',
})
export class SettingsTeamComponent implements OnInit {
    durationInSeconds = 5;

    members: any[];
    roles: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    permission: boolean = false;

    constructor(private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
    ) {
    }

    ngOnInit(): void {
        this.permission = this._authService.validateRoll(CodeUser.ADMIN);
        if (!this.permission) {
          swal.fire('', 'No tienes permisos para asignar roles!', 'warning');
        }
        this.getRolls();
        this._authService.getTeams()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((teams: TeamModel[]) => {
                // Mark for check
                this.members = teams.map(objeto => {
                    return { ...objeto, rollId: objeto.rollId.toLowerCase() };
                  });
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
        user.rollId = rolCode.value
        this._authService
            .updateUser(user)
            .subscribe((res) => {
                if (res.success) {
                    this.openSnackBar(user.userName);
                }
            });
    }
    openSnackBar(user: string) {
        this._snackBar.open('  Rol Asignado al usuario ' + user, 'echo', {
            duration: this.durationInSeconds * 1000,
        });
    }

  private getRolls() {
    this._authService.getRoll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.roles = res.filter(f => f.code != CodeUser.CONTRACTOR);
      });
  }

}
