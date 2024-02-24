import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MaintainerRegisterComponent } from './components/maintainer-register/maintainer-register.component';

@Component({
  selector: 'app-maintainers-list-contarctual',
  styleUrls: ['./maintainers-list.component.scss'],
  templateUrl: './maintainers-list.component.html'
})
export class maintainersListComponent implements OnInit {
  selectContract: any;
  data: any;
  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
  ) {}

  ngOnInit(): void {
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
}

}
