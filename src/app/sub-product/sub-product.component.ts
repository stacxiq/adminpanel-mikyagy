import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SubProduct } from '../services/models/sub-product.model';
import { FirebaseService } from '../services/firebase.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router ,ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

const STORAGE_KEY = 'local_user';
@Component({
  selector: 'app-sub-product',
  templateUrl: './sub-product.component.html',
  styleUrls: ['./sub-product.component.scss']
})
export class SubProductComponent implements OnInit {

parentname:string
ref: AngularFireStorageReference;
task: AngularFireUploadTask;
uploadState: Observable<string>;
uploadProgress: Observable<number>;
downloadURL: Observable<string>;


productList: Observable<any[]>;
productData: any;
isEdit: boolean = false;
btnTXT = 'اضافة'
counter = 0;
brandLen: any;

  constructor(private routerParam: ActivatedRoute,
    private firestoreService: FirebaseService,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    private product: SubProduct) { 
    this.routerParam.params.subscribe(params => {
      this.product.parent_product = params['pid'];
      this.product.categorty= params['psection'];
      this.product.brand = params['pbrand'];
      this.parentname = params['pname'];

    });
  }

  ngOnInit() {
    this.spinnerService.show();
    if (this.mstorage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.productList= this.firestoreService.getRealTimeDataCol(`subproductList/${this.product.parent_product}`);
  }

  

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.productList.subscribe(data => {
      this.productData = data;
    });
  }

  saveFormData(form: NgForm) {
    if (this.product.image) {
      this.product.onSale = this.product.price - (this.product.price * this.product.discount);
      if (this.isEdit) {
        this.firestoreService.addRealTimeData('subproductList', `${this.product.parent_product}/${this.product.id}`, this.product);
      } else {
        let id = this.firestore.createId();
        this.product.id = id;
        this.firestoreService.addRealTimeData('subproductList', `${this.product.parent_product}/${this.product.id}`, this.product);
      }
      this.isEdit = false;
      this.btnTXT = 'اضافة';
      this.counter = 0;
      form.resetForm();
    } else {
      this.toastr.error('يرجى انتظار تحميل الصورة', 'خطأ');
    }
  }

  onEdit(product: SubProduct) {
    this.product = product;
    this.isEdit = true;
    this.btnTXT = "تحديث";
    this.counter = 0;
  }

  onDelete(product: SubProduct) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteStorageFile2(`/subproduct/${product.title}`, product.imgname);
        this.firestoreService.deleteRealTimeData('subproductList', `${product.brand}/${product.categorty}/${product.id}`)
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  onSelectedFile(event) {
    if (this.isEdit && this.counter == 0) {
      this.firestoreService.deleteStorageFile2(`/subproduct/${this.product.title}`, this.product.imgname);
      this.product.imgname = [];
      this.product.image = []
    }
    const randomId = Math.random().toString();
    this.product.imgname[this.counter] = randomId + '_' + event.target.files[0].name;
    const id = `/product/${this.product.title}/` + this.product.imgname[this.counter];
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.product.image[this.counter] = url;
          this.counter = this.counter + 1;
        });
      })
    ).subscribe();
  }

}
