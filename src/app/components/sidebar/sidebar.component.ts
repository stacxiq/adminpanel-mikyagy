import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
const STORAGE_KEY = 'local_user';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  //{ path: '/dashboard', title: 'اللوحة الرئيسية', icon: 'dashboard', class: '' },
  { path: '/slideshow', title: 'الصور الاستعراضية', icon: 'burst_mode', class: '' },
 // { path: '/articles', title: 'لوحة المقالات', icon: 'local_library', class: '' },
 // { path: '/brandview', title: 'البراندات', icon: 'copyright', class: '' },
 // { path: '/sectionview', title: 'الاقسام', icon: 'view_carousel', class: '' },
 // { path: '/products', title: 'المنتجات', icon: 'shopping_basket', class: '' },
  { path: '/orders', title: 'الطلبات', icon: 'shopping_cart', class: '' },
  { path: '/users', title: 'المستخدمين', icon: 'people', class: '' },
  { path: '/discount_code', title: 'رموز التخفيض', icon: 'attach_money', class: '' },
  { path: '/shipping-cost', title: 'اجور الشحن', icon: 'emoji_transportation', class: '' },
  { path: '/all-notify', title: 'ارسال اشعار', icon: 'notification_important', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService) { }

  logout() {
    this.afAuth.auth.signOut();
    this.storage.set(STORAGE_KEY, null);
    this.router.navigate(['login']);
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
}
