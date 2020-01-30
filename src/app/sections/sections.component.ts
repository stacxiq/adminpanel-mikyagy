import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Sections } from '../services/models/sections.model';
import { NgForm } from '@angular/forms';
const STORAGE_KEY = 'local_user';
@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private router: Router,
    private storage: AngularFireStorage,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private toastr: ToastrService,
    private section: Sections) { }


  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }

  saveFormData(form: NgForm) {
    if (this.section.image) {
      this.FirebaseService.addRealTimeData('sectionList', this.section.name, this.section);
      form.resetForm();
      this.router.navigate(['sectionview']);
    }
    else {
      this.toastr.error('يرجى انتظار تحميل الصورة', 'خطأ');
    }
  }

  onSelectedFile(event) {
    const randomId = Math.random().toString(8).substring(2);
    this.section.imgname = 'uni-' + randomId + event.target.files[0].name;
    const id = '/section/' + this.section.imgname;
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.section.image = url;
        });
      })
    ).subscribe();
  }


}
