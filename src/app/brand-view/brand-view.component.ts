import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
const STORAGE_KEY = 'local_user';
import { DataService } from "../services/data.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-brand-view',
  templateUrl: './brand-view.component.html',
  styleUrls: ['./brand-view.component.scss']
})
export class BrandViewComponent implements OnInit {

  brandList: Observable<any[]>;
  brandData: any;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private data: DataService) { }
    

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.brandList = this.firestoreService.getRealTimeDataCol('brandList');
    }
  }

  ngAfterViewInit() {
    this.brandList.subscribe(data => {
      if (data.length == 0) {
        $('#no-items-ava').show();
        $('#SHOW').hide();
      }
      else {
        $('#no-items-ava').hide();
        $('#SHOW').show();
      }
      this.brandData = data;
      this.spinnerService.hide();
    });
  }

  openDialog(item: string, img: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true')
        this.deletebrand(item, img);
    });
  }

  updatebrand(item){
    this.data.saveData(item);
    this.router.navigate(['edit-brand']);
  }

  deletebrand(id: string, fileName: string) {
    this.firestoreService.deleteRealTimeData('brandList', id);
    this.firestoreService.deleteStorageFile('brand', fileName);
    this.toastr.success('تم حذف الجدول بنجاح', 'تم الحذف');
  }
}
