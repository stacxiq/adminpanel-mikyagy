import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { NgForm } from '@angular/forms';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {

  slideList: Observable<any[]>;
  slideData: any;
  image: any;
  imgname: any;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private router: Router,
    private dialog: MatDialog,
    private storage: AngularFireStorage,
    private spinnerService: NgxSpinnerService,
    public firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private toastr: ToastrService) { }


  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.slideList = this.firestoreService.getRealTimeDataCol('slideList');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.slideList.subscribe(data => {
      this.slideData = data;
    });
  }

  saveFormData(form: NgForm) {
    if (this.image) {
      const randomId = Math.random().toString(8).substring(2);
      this.firestoreService.addRealTimeData('slideList', randomId, { id: randomId, image: this.image, imagename: this.imgname });
      form.resetForm();
    }
    else {
      this.toastr.error('يرجى انتظار تحميل الصورة', 'خطا');
    }
  }

  onSelectedFile(event) {
    const randomId = Math.random().toString(8).substring(2);
    this.imgname = 'uni-' + randomId + event.target.files[0].name;
    const id = '/slides/' + this.imgname;
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.image = url;
        });
      })
    ).subscribe();
  }

  onDelete(item) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteStorageFile('slides', item.imagename);
        this.firestoreService.deleteRealTimeData('slideList', item.id);
        this.toastr.success('تم الحذف بنجاح', 'حذف');
      }
    });
  }
}
