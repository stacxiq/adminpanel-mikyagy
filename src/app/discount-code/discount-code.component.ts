import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../services/firebase.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Discount } from 'app/services/models/discount.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-discount-code',
  templateUrl: './discount-code.component.html',
  styleUrls: ['./discount-code.component.scss']
})
export class DiscountCodeComponent implements OnInit {

  codeList: Observable<any[]>;
  codeData: any;
  btnTXT = 'اضافة'
  disctype = "نسبة التخفيض";

  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private discount: Discount) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.codeList = this.firestoreService.getRealTimeDataCol('codeList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.codeList.subscribe(data => {
      this.codeData = data;
    });
  }

  saveFormData(form: NgForm) {
    this.firestoreService.addRealTimeData('codeList', `${this.discount.code}`, this.discount);
    this.btnTXT = 'اضافة';
    form.resetForm();
  }
  typeSelect() {
    if (this.discount.type == "سعر ثابت") {
      this.disctype = "سعر التخفيض"
    } else {
      this.disctype = "نسبة التخفيض"
    }
  }
  onEdit(discount: Discount) {
    this.discount = discount;
    this.btnTXT = "تحديث";
  }

  onDelete(discount: Discount) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteRealTimeData('codeList', discount.code);
        this.toastr.success('تم الحذف بنجاح', 'حذف');
      }
    });
  }

}
