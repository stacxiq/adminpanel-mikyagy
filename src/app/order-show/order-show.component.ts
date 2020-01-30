import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../services/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-order-show',
  templateUrl: './order-show.component.html',
  styleUrls: ['./order-show.component.scss']
})
export class OrderShowComponent implements OnInit {

orderid:string;
orderList: Observable<any[]>;
orderData: object;
name:string;

  constructor(private routerParam: ActivatedRoute,private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
  ) { this.routerParam.params.subscribe(params => {
    this.orderid = params['id'];
    console.log(this.orderid);
  });}

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.orderList = this.firestoreService.getRealTimeData('orders',this.orderid);
    this.spinnerService.hide();
    this.orderList.subscribe(data => {
      this.orderData = data;
      console.log(data)
    });
    
    
  }
  

}
