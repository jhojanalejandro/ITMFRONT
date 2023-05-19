// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
// import { catchError, Observable, throwError } from 'rxjs';
// import { Item } from 'app/modules/admin/apps/file-manager/file-manager.types';
// import { FileListManagerService } from '../../services/list-file.service';



// @Injectable({
//     providedIn: 'root'
// })
// export class    DetailFileManagerItemFResolver implements Resolve<any>
// {
//     /**
//      * Constructor
//      */
//     constructor(
//         private _router: Router,
//         private _fileManagerService: FileListManagerService
//     )
//     {
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Resolver
//      *
//      * @param route
//      * @param state
//      */
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item>
//     {
//         return this._fileManagerService.getItemByIdDetail(route.paramMap.get('id'))
//                    .pipe(
//                        // Error here means the requested task is not available
//                        catchError((error) => {

//                            // Log the error
//                            console.error(error);

//                            // Get the parent url
//                            const parentUrl = state.url.split('/').slice(0, -1).join('/');

//                            // Navigate to there
//                            this._router.navigateByUrl(parentUrl);

//                            // Throw an error
//                            return throwError(error);
//                        })
//                    );
//     }
// }




