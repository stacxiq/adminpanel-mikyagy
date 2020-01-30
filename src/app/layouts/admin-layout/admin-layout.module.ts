import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ConfirmDeleteComponent } from '../../confirm-delete/confirm-delete.component';
import { NgxTrumbowygModule } from 'ngx-trumbowyg';
import { BrandComponent } from '../../brand/brand.component';
import { BrandViewComponent } from '../../brand-view/brand-view.component';
import { DiscountCodeComponent } from '../../discount-code/discount-code.component';
import { ArticlesComponent } from '../../articles/articles.component';
import { ArticlesViewComponent } from '../../articles-view/articles-view.component';
import { AddArticlesComponent } from '../../add-articles/add-articles.component';
import { EditArticleComponent } from '../../edit-article/edit-article.component';
import { SlideshowComponent } from '../../slideshow/slideshow.component';
import { ProductsComponent } from '../../products/products.component';
import { UsersComponent } from '../../users/users.component'
import { NotifyComponent } from '../../notify/notify.component';
import { AllNotifyComponent } from '../../all-notify/all-notify.component';
import {SectionsViewComponent} from '../../sections-view/sections-view.component';
import {SectionsComponent} from '../../sections/sections.component';
import {SubProductComponent} from '../../sub-product/sub-product.component';
import {ShippingCostComponent} from '../../shipping-cost/shipping-cost.component';
import {OrdersComponent} from '../../orders/orders.component';
import {OrderShowComponent} from '../../order-show/order-show.component';
import {EditBrandComponent} from '../../edit-brand/edit-brand.component';
import { NgxPrintModule } from 'ngx-print';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule
} from '@angular/material';
import { from } from 'rxjs';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgxSpinnerModule,
    NgxPrintModule,
    NgxTrumbowygModule.withConfig({
      lang: 'ar',
      svgPath: '/assets/icons.svg',
      removeformatPasted: true,
      autogrow: true,
      btns: [
        ['formatting'],
        ['strong', 'em', 'del'],
        ['superscript', 'subscript'],
        ['link'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['unorderedList', 'orderedList'],
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen'],
        ['insertImage']
      ],
      events: {}
    }),
  ],
  declarations: [
    ConfirmDeleteComponent,
    DashboardComponent,
    BrandComponent,
    BrandViewComponent,
    DiscountCodeComponent,
    AddArticlesComponent,
    ArticlesComponent,
    ArticlesViewComponent,
    EditArticleComponent,
    SlideshowComponent,
    ProductsComponent,
    UsersComponent,
    NotifyComponent,
    AllNotifyComponent,
    SectionsViewComponent,
    SectionsComponent,
    SubProductComponent,
    ShippingCostComponent,
    OrdersComponent,
    OrderShowComponent,
    EditBrandComponent,
  ],
  entryComponents: [ConfirmDeleteComponent, ArticlesViewComponent]
})

export class AdminLayoutModule { }
