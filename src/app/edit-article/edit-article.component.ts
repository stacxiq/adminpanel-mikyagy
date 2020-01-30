import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { formatDate } from '@angular/common';
import * as firebase from 'firebase/app';
import { Article } from 'app/services/models/article.model';
import { NgForm } from '@angular/forms';
import { DataService } from "../services/data.service";
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private route: Router,
    private storage: AngularFireStorage,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private toastr: ToastrService,
    private article: Article,
    private data: DataService) { }

  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.route.navigate(['login']);
    }
    else {
      this.data.currentMessage.subscribe(data => {
        let info = JSON.parse(JSON.stringify(data));
        this.article.id = info.id;
        this.article.title = info.title;
        this.article.category = info.category;
        this.article.description = info.description;
        this.article.oldname = info.imgname;
      });
    }
  }

  saveFormData(form: NgForm) {
    if (this.article.image) {
      let today = new Date();
      this.article.date = formatDate(today, 'medium', 'en-US');
      const storageRef = firebase.storage().ref();
      storageRef.child(`posts/${this.article.oldname}`).delete();
			this.FirebaseService.addRealTimeData('newsList',`${this.article.category}/${this.article.id}` ,this.article);
      form.resetForm();
      this.route.navigate(['articles']);
    }
    else {
      this.toastr.warning('يرجى انتظار تحميل الصورة', 'خطأ');
    }
  }

  onSelectedFile(event) {
    const randomId = Math.random().toString(8).substring(2);
    this.article.imgname = 'uni-' + randomId + event.target.files[0].name;
    const id = '/posts/' + this.article.imgname;
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.article.image = url;
        });
      })
    ).subscribe();
  }

}
