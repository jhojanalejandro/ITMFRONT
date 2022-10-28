import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularmaterialModule } from 'app/layout/common/angular material/angularmaterial.module';
// import { FileManagerAllModule } from '@syncfusion/ej2-angular-filemanager';

// import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups';

// import {
//     DropDownButtonModule,
//     SplitButtonModule,
// } from '@syncfusion/ej2-angular-splitbuttons';

// import { CheckBoxModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';

// import {
//     SliderModule,
//     NumericTextBoxModule,
//     ColorPickerModule,
// } from '@syncfusion/ej2-angular-inputs';

// import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';

// import {
//     DropDownListModule,
//     ComboBoxModule,
//     DropDownListAllModule,
//     MultiSelectAllModule,
// } from '@syncfusion/ej2-angular-dropdowns';

// import {
//     DocumentEditorAllModule,
//     DocumentEditorContainerAllModule,
// } from '@syncfusion/ej2-angular-documenteditor';

// import { ToolbarModule, TabModule } from '@syncfusion/ej2-angular-navigations';

import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

const ds = [
    // ToolbarModule,
    // DropDownListAllModule,
    // ColorPickerModule,
    // SplitButtonModule,
    // ComboBoxModule,
    // TabModule,
    // DocumentEditorAllModule,
    // DocumentEditorContainerAllModule,
    // DropDownListModule,
    // SliderModule,
    // TooltipModule,
    // NumericTextBoxModule,
    // CheckBoxModule,
    // ButtonModule,
    // DropDownButtonModule,
    // DialogModule,
    // MultiSelectAllModule,
    // ListViewAllModule,
    CommonModule,
    FormsModule,
    AngularmaterialModule,
    ReactiveFormsModule,
    // FileManagerAllModule,
]

@NgModule({
    imports: [
        ds
    ],
    exports: [
      
        ...ds,
    ],
})
export class SharedModule {}
