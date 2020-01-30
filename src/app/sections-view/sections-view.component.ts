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
import * as $ from 'jquery';

@Component({
  selector: 'app-sections-view',
  templateUrl: './sections-view.component.html',
  styleUrls: ['./sections-view.component.scss']
})
export class SectionsViewComponent implements OnInit {

  sectionList: Observable<any[]>;
  sectionData: any;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.sectionList = this.firestoreService.getRealTimeDataCol('sectionList');
    }
  }

  ngAfterViewInit() {
    this.sectionList.subscribe(data => {
      if (data.length == 0) {
        $('#no-items-ava').show();
        $('#SHOW').hide();
      }
      else {
        $('#no-items-ava').hide();
        $('#SHOW').show();
      }
      this.sectionData = data;
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

  deletebrand(id: string, fileName: string) {
    this.firestoreService.deleteRealTimeData('sectionList', id);
    this.firestoreService.deleteStorageFile('section', fileName);
    this.toastr.success('تم حذف الجدول بنجاح', 'تم الحذف');
  }
 
}
