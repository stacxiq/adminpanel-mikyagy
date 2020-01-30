import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth.guard';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { BrandComponent } from '../../brand/brand.component';
import { BrandViewComponent } from '../../brand-view/brand-view.component'
import { DiscountCodeComponent } from '../../discount-code/discount-code.component'
import { ArticlesComponent } from '../../articles/articles.component';
import { AddArticlesComponent } from '../../add-articles/add-articles.component';
import { EditArticleComponent } from '../../edit-article/edit-article.component';
import { SlideshowComponent } from '../../slideshow/slideshow.component';
import { ProductsComponent } from '../../products/products.component';
import { UsersComponent } from '../../users/users.component';
import { NotifyComponent } from '../../notify/notify.component';
import { AllNotifyComponent } from '../../all-notify/all-notify.component';
import {SectionsViewComponent} from '../../sections-view/sections-view.component';
import {SectionsComponent} from '../../sections/sections.component';
import {SubProductComponent} from '../../sub-product/sub-product.component';
import {ShippingCostComponent} from '../../shipping-cost/shipping-cost.component';
import {OrdersComponent} from '../../orders/orders.component';
import {OrderShowComponent} from '../../order-show/order-show.component';
import { EditBrandComponent } from 'app/edit-brand/edit-brand.component';


export const AdminLayoutRoutes: Routes = [
   // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
   // { path: 'brand', component: BrandComponent, canActivate: [AuthGuard] },
   // { path: 'brandview', component: BrandViewComponent, canActivate: [AuthGuard] },
    { path: 'discount_code', component: DiscountCodeComponent, canActivate: [AuthGuard] },
   // { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard] },
   // { path: 'add-article', component: AddArticlesComponent, canActivate: [AuthGuard] },
   // { path: 'edit-article', component: EditArticleComponent, canActivate: [AuthGuard] },
    { path: 'slideshow', component: SlideshowComponent, canActivate: [AuthGuard] },
   // { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'notify', component: NotifyComponent, canActivate: [AuthGuard] },
    { path: 'all-notify', component: AllNotifyComponent, canActivate: [AuthGuard] },
   // { path: 'sectionview', component: SectionsViewComponent, canActivate: [AuthGuard] },
   // { path: 'section', component: SectionsComponent, canActivate: [AuthGuard] },
   // { path: 'sub-product/:pid/:pname/:pbrand/:psection', component: SubProductComponent, canActivate: [AuthGuard] },
    { path: 'shipping-cost', component: ShippingCostComponent, canActivate: [AuthGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'order-show/:id', component: OrderShowComponent, canActivate: [AuthGuard] },
   // { path: 'edit-brand', component: EditBrandComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/slideshow' }
];
