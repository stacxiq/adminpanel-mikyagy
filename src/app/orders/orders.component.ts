import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../services/firebase.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {DatePipe} from '@angular/common'
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orderList: Observable<any[]>;
  orderData: any[]=[];
  orderData2: any[]=[];
  date:any;

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.orderList = this.firestoreService.getRealTimeDataCol('orders');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.orderList.subscribe(data => {
      this.orderData = data;
      this.orderData2 =data;
    });
  }

  onDelete(order) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
          this.firestoreService.deleteRealTimeData('orders', order.id);
          this.toastr.warning('تم الحذف بنجاح', 'حذف');       
      }
    });
  }

  
  show(order){
    this.router.navigate(['order-show',order.id]);
  }

  search(date){
    var datePipe=new DatePipe('en-US');
    date=datePipe.transform(new Date(date), 'yyyy-MM-dd');
    if(date==null || date=='' || this.orderData.length <=0 ){
      this.orderData=this.orderData2;
    } else{
      this.orderData= this.orderData.filter((word:any) => {
        return word.date.includes(date); 
      });    
    }
  }

  onChange(event){
    if(event.data==null || event.data==''){
      this.orderData=this.orderData2;
    } else{
      this.orderData = this.orderData.filter((word:any) => {
        return word.firstname.includes(event.data) || word.lastname.includes(event.data) || word.phone == (event.data) ; 
      });    
    }
  }
 
}
