import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-DialogChangePercentaje',
    templateUrl: './DialogChangePercentaje.component.html',
    styleUrls: ['./DialogChangePercentaje.component.scss'],
})
export class DialogChangePercentajeComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<DialogChangePercentajeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    ngOnInit(): void {
        this.data = '0.08';
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
