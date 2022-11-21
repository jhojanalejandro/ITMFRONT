import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Item, Items } from 'app/modules/admin/apps/file-manager/file-manager.types';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileComponent } from 'app/modules/admin/dashboards/contractual/upload-file/upload-file.component';
import { SelectionModel } from '@angular/cdk/collections';
import { CollectionAccountsService } from './collection-accounts-list.service';
import { IGetFilesPayments } from './models/GetFilesPaymentDto';
import swal from 'sweetalert2';

@Component({
  selector: 'app-collection-accounts-list',
  templateUrl: './collection-accounts-list.component.html',
  styleUrls: ['./collection-accounts-list.component.scss']
})
export class CollectionAccountsListComponent implements OnInit {
    labelPosition: 'before' | 'after' = 'after';
    selection = new SelectionModel<any>(true, []);
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Items;
    items: any;
    value: any;
    searchText: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: FormControl = new FormControl();
    filteredStreets: Observable<string[]>;
    type: any;
    contractId: any;
    dateSearch: any = new Date()
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _collectionAccounts: CollectionAccountsService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
    ){}

    ngOnInit(): void
    {   
        this.contractId = this._activatedRoute.snapshot.paramMap.get('contractorId') || 'null';
        this.type = this._activatedRoute.snapshot.paramMap.get('type') || 'null';

        this.getData();
         
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
    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        // Mark for check
        this._changeDetectorRef.markForCheck();
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
    
    private _normalizeValue(value: string): string {
        return value.toString().replace(/[0-9]/g, '');
    }
    private _filter2(value: string): string[] {
        if(this.items != null){
            const filterValue = this._normalizeValue(value);
            return this.items.filter(street => this._normalizeValue(street).includes(filterValue));
        }
    }

    private _filter(number: any): any[] {
        const filterValue = number;
        
        return this.items.filter(option => option=== number);
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // let studentObj =  this.dataRandom.find(t=>t.fullname ===event);
        this.items.filter = filterValue;
        // return this.dataRandom.number.find(number => number === event)
    }
    openDialog()
    {
        //this.validateDinamycKey();
        const dialogRef =  this._matDialog.open(UploadFileComponent, {
            autoFocus: false,
            data     : {
                show: false,
                contractorId: this.contractId
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if(result){
                this.getData();
            }
        });               
    }

    onChange(event) {
        // reader.onload = () => {
        //     this.file = reader.result;
        // };
      }
      isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.selection.selected.length;
        console.log(this.selection.selected);
        
       //esta validacion nos permite mostrar y ocltar los detalles de una operacion
        return numSelected === numRows;
        
      }
      masterToggle() {
        if (this.isAllSelected()) {
       
          this.selection.clear();
          return;
        }
    
    //    this.selection.select(...this.dataSource.data);
      }
  
      checkboxLabel(row?: any): string {
        if (!row) {
          return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
      
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id + 1}`;
        
      }
    selectRow($event: any, dataSource: any) {  
        if ($event.checked) {
          this.value = dataSource;
          console.log(this.value);
            
        }
    }
    getData(){

        this.filteredStreets = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'number' ? value : value.numbers)),
            map(numbers => (numbers ? this._filter(numbers) : this.items)),
            );

          this.filteredStreets = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter2(value)),
          );

        // Get the item
        this._collectionAccounts.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {  
                this.items = item;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
    searchByDate =() =>{
      let search: IGetFilesPayments= {contractId: this.contractId, registerDate: this.dateSearch, type: this.type}
      console.log(search);
      this._collectionAccounts.searchByDate(search).subscribe((res) => {   
        this.items = res;
        this._changeDetectorRef.detectChanges();
        this._changeDetectorRef.markForCheck();   

    },
    (response) => {
      swal.fire('Error al Mostrar la informacion!', response, 'error');
    });
    }

}
