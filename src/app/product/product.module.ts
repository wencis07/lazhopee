import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageDialogComponent } from '../message/message-dialog/message-dialog.component';

@NgModule({
  declarations: [
    ProductListComponent,
    MessageDialogComponent  
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FlexModule,
    FormsModule,    
  ]
})
export class ProductModule { }