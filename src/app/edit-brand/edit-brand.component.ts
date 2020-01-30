import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Brand } from '../services/models/brand.model';
import { NgForm } from '@angular/forms';
import { DataService } from "../services/data.service";
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private router: Router,
    private storage: AngularFireStorage,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private brand: Brand,
    private data: DataService) { }


  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    } else {
      this.data.currentMessage.subscribe(data => {
        let info = JSON.parse(JSON.stringify(data));
        this.brand.discount = info.discount;
        this.brand.image = info.image;
        this.brand.imgname = info.imgname;
        this.brand.name = info.name;
      });
    }
  }

  saveFormData(form: NgForm) {
      this.FirebaseService.addRealTimeData('brandList', this.brand.name, this.brand);
      form.resetForm();
      this.router.navigate(['brandview']);
  }

  onSelectedFile(event) {
    this.FirebaseService.deleteStorageFile('brand', this.brand.imgname);
    const randomId = Math.random().toString(8).substring(2);
    this.brand.imgname = 'uni-' + randomId + event.target.files[0].name;
    const id = '/brand/' + this.brand.imgname;
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.brand.image = url;
        });
      })
    ).subscribe();
  }
}
