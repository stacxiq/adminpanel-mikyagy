import { FirebaseService } from '../services/firebase.service';
import { HttpClient } from '@angular/common/http';;
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Notify } from '../services/models/notify.model';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

  constructor(private router: Router,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    public FirebaseService: FirebaseService,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private notify: Notify) { }

  ngOnInit() {
    if (this.mstorage
      .get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }

  sendToAll(f: NgForm) {
    let today = new Date();
    this.notify.date = formatDate(today, 'medium', 'en-US');
    this.notify.id = this.firestore.createId();
    this.FirebaseService.addRealTimeData('notifyList', this.notify.id, this.notify);

    this.http.post('https://us-central1-makeup-f1787.cloudfunctions.net/sendToTopic', { 'title': this.notify.title, 'content': this.notify.content }).subscribe(data => {
      console.log(data);
      console.log(data['status']);
      if (data['status'] != undefined && data['status'] == 'Done') {
        f.resetForm();
        this.router.navigate(['all-notify']);
      }
    }, error => {
      if (error.status != 200) {
        this.toastr.error("حدث خطا اثناء اضافة الحدث", "خطأ");
      }
    });
  }
}
