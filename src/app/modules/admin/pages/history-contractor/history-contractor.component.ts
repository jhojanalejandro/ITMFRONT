import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector       : 'history-contractor',
    templateUrl    : './history-contractor.component.html',
    styleUrls      : ['./history-contractor.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryContractorComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    drawerOpened: boolean;
    menuData: FuseNavigationItem[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    contractorId: string;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private router: ActivatedRoute,

    )
    {
        this.contractorId = this.router.snapshot.paramMap.get('contractorId') || 'null';
        this.menuData = [
            {
                id      : 'opcion',
                title   : 'Historial',
                type    : 'group',
                children: [
                    {
                        id   : 'opcion.contratos',
                        title: 'Contratos Asociados',
                        type : 'basic',
                        link : '/docs/history/lista/opcion/contratos/'+this.contractorId
                    },
                    {
                        id   : 'opcion.pagos',
                        title: 'Pagos Efectuados',
                        type : 'basic',
                        link : '/docs/history/lista/opcion/pagos/'+this.contractorId
                    },
                    {
                        id   : 'opcion.datos-contratacion',
                        title: 'Datos Registrados',
                        type : 'basic',
                        link : '/docs/history/lista/opcion/datos-contratacion/'+this.contractorId
                    },
                    {
                        id   : 'optcion.serving',
                        title: 'Serving',
                        type : 'basic',
                        link : '/docs/history/lista/opcion/serving/'+this.contractorId
                    }
                ]
            }
        ];
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('md') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
