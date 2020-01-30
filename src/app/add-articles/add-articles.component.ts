import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { Article } from '../services/models/article.model';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
const STORAGE_KEY = 'local_user';


@Component({
	selector: 'app-add-articles',
	templateUrl: './add-articles.component.html',
	styleUrls: ['./add-articles.component.scss']
})
export class AddArticlesComponent implements OnInit {

	ref: AngularFireStorageReference;
	task: AngularFireUploadTask;
	uploadState: Observable<string>;
	uploadProgress: Observable<number>;
	downloadURL: Observable<string>;

	constructor(private router: Router,
		private firestore: AngularFirestore,
		private storage: AngularFireStorage,
		public FirebaseService: FirebaseService,
		@Inject(SESSION_STORAGE) private mstorage: StorageService,
		private toastr: ToastrService,
		private article: Article) { }


	ngOnInit() {
		if (this.mstorage
			.get(STORAGE_KEY) == null) {
			this.router.navigate(['login']);
		}
	}

	saveFormData(form: NgForm) {
		if (this.article.image) {
			let today = new Date();
			this.article.date = formatDate(today, 'medium', 'en-US');
			let id = this.firestore.createId();
			this.article.id = id;
			this.FirebaseService.addRealTimeData('newsList',`${this.article.category}/${this.article.id}`,this.article);
			form.resetForm();
			this.router.navigate(['articles']);
		}
		else {
			this.toastr.error('يرجى انتظار تحميل الصورة', 'خطأ');
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
