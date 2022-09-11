import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AuthService } from 'app/core/auth/auth.service';
import { UploadDataService } from './upload-data.service';
import { ContractorRegister } from './register-contractor/register-contractor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector       : 'upload',
    templateUrl    : './upload-data.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDataComponent implements OnInit, OnDestroy
{

    data: any;
    userName: any;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _uploadData: UploadDataService,
        private authService: AuthService,
        private _matDialog: MatDialog,
        private _router: Router
    )
    {
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.userName = this.authService.accessName
        // Get the data
        this._uploadData.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                // Store the data
                this.data = data;

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

    openDialog(route: any) {
        //this.validateDinamycKey();
        switch(route){
            case 'register':
            const dialogRef = this._matDialog.open(ContractorRegister);
            dialogRef.afterClosed().subscribe(datos => {
              if(datos){      
                // console.log('datos ',datos);               
              }               
            });
            break
        //     case 'addRafle':
        //         const dialogRefs = this.dialog.open(AddRaffleComponent);
        //         dialogRefs.afterClosed().subscribe((result) => {

        //         });
        //     break
        //     case 'winTicket':
        //         const dialogWin = this.dialog.open(WinTicketComponent);
        //         dialogWin.afterClosed().subscribe(datos => {
        //             if(datos != 'vacio'){
        //                 this.dataRandom = datos; 
        //                 this.divShow = true;  
        //             }
                                           
        //         });
        //     break
        //     case 'raffleList':
        //         this._router.navigate(['lista/rifas']);
        //     break
        //     case 'ticketList':
        //         this._router.navigate(['lista/boletos']);
        //     break
        //     case 'style':
        //         this._router.navigate(['juega'], { skipLocationChange: true });
        //     break
        //     case 'resultados':
        //          this._router.navigate(['lista/resultados']);

        //     break
        //     case 'resultadosQr':
        //         this._router.navigate(['lista/resultados/qr'], { skipLocationChange: true });

        //    break

        }
    }


}
