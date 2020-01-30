import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { ArticlesViewComponent } from '../articles-view/articles-view.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DataService } from "../services/data.service";
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  articlesList: Observable<any[]>;
  articlesData: any;

  constructor(private firestoreService: FirebaseService,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private data: DataService) { }

  viewDialog(items) {
    this.dialog.open(ArticlesViewComponent, {
      data: { article: items }
    });
  }

  openDialog(item, img, category): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true')
        this.deleteArticle(item, img, category);
    });
  }

  ngOnInit() {
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
  }

  substringText(text): any {
    return new DOMParser().parseFromString(text, "text/html").documentElement.textContent.substring(0, 300) + '...';
  }

  deleteArticle(id, fileName, category) {
    this.firestoreService.deleteRealTimeData('newsList', `${category}/${id}`,);
    this.firestoreService.deleteStorageFile('posts', fileName);
    this.toastr.success('تم حذف المقالة بنجاح', 'تم الحذف');
  }

  updateArticle(item) {
    this.data.saveData(item);
    this.router.navigate(['edit-article']);
  }

  searchArticles(category: string) {
    if (category == null || category == '' || category == undefined) {
      this.toastr.warning('يرجى اختيار الصنف قبل البحث', 'المقال');
      return;
    }
    this.articlesList = this.firestoreService.getRealTimeData('newsList', category);
    this.articlesList.subscribe(data => {
      if (data.length == 0) {
        $('#no-items-ava').show();
        $('#SHOW').hide();
      }
      else {
        $('#no-items-ava').hide();
        $('#SHOW').show();
      }
      this.articlesData = data;
    });
  }

}
