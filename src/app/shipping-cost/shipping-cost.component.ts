import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ShippingCost } from 'app/services/models/shipping-cost.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-shipping-cost',
  templateUrl: './shipping-cost.component.html',
  styleUrls: ['./shipping-cost.component.scss']
})
export class ShippingCostComponent implements OnInit {

  shippingList: Observable<any[]>;
  shippingData: any;
  btnTXT = 'تحديث'
  isEdit=false;
  cost;

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private shipping: ShippingCost) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.shippingList = this.firestoreService.getRealTimeDataCol('shippingList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.shippingList.subscribe(data => {
      this.shippingData = data;
    });
  }

  saveFormData(form: NgForm) {
    if(this.cost != this.shipping.cost){
    this.firestoreService.addRealTimeData('shippingList', `${this.shipping.name}`, this.shipping);
    console.log("js");  
  }
    this.isEdit = false;
  }

  onEdit(shipping: ShippingCost) {
    this.shipping = shipping;
    this.cost =shipping.cost;
    this.isEdit = true;
  }
  cancel(){
    this.isEdit= false;
  }

}
