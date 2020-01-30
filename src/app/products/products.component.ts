import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Products } from '../services/models/products.model';
import { FirebaseService } from '../services/firebase.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from "@angular/material";
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { element } from 'protractor';
import { AngularFireList } from '@angular/fire/database';
const STORAGE_KEY = 'local_user';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  brandList: Observable<any[]>;
  brandData: any[];
  sectionList: Observable<any[]>;
  sectionData: any[];
  productList: AngularFireList<any[]>;
  productData: any;
  isEdit: boolean = false;
  btnTXT = 'اضافة'
  special: any;
  discount: any;
  counter = 0;
  brandLen: any;

  constructor(private firestoreService: FirebaseService,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    @Inject(SESSION_STORAGE) private mstorage: StorageService,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    public product: Products) { }

  async ngOnInit() {
    this.spinnerService.show();
    if (this.mstorage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.brandList = this.firestoreService.getRealTimeDataCol('brandList');
    this.sectionList = this.firestoreService.getRealTimeDataCol('sectionList');
    // this.productList= this.firestoreService.getRealTimeDataCol('productList');
   let data:any ;
    this.firestoreService.getRealTimeDataProductCol('productList').on("value",(snap) => {
      this.addto(snap.val());
    });
    
  }
  addto(data){
    this.productData = [];
    for(let i in data ){
      this.productData.push(data[i]);
    }
    console.log(this.productData)
  }
  checkbrand() {
    if (this.brandData.length == 0) {
      this.toastr.warning('لا توجد اي براندات مضافة', 'خطأ');
    }
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.brandList.subscribe(data => {
      this.brandData = data;
    });
    this.spinnerService.hide();
    this.sectionList.subscribe(data => {
      this.sectionData = data;
    });
    this.spinnerService.hide();
    // this.productList.subscribe(data => {
    //   console.log(data);
    //   this.productData = data;
    // });

  }

  saveFormData(form: NgForm) {
    if (this.product.image) {
      this.product.onSale = this.product.price - (this.product.price * this.product.discount);
      if (this.isEdit) {
        if (this.product.Special != this.special) {
          if (this.product.Special != 'false') {
            this.firestoreService.addRealTimeData('FeaturedList', `${this.product.id}`,this.product);
          } else {
            this.firestoreService.deleteRealTimeData('FeaturedList', `${this.product.id}`)
          }
        }
        if (this.product.discount != this.discount) {
          if (this.product.discount != 0) {
            this.firestoreService.addRealTimeData('DiscountList', `${this.product.id}`, this.product);
          } else {
            this.firestoreService.deleteRealTimeData('DiscountList', `${this.product.id}`)
          }
        }
        this.firestoreService.addRealTimeData('productList', `${this.product.id}`, this.product);
      } else {
        let id = this.firestore.createId();
        this.product.id = id;
        if (this.product.Special != 'false') {
          this.firestoreService.addRealTimeData('FeaturedList', `${this.product.id}`, this.product);
        }
        if (this.product.discount != 0) {
          this.firestoreService.addRealTimeData('DiscountList', `${this.product.id}`, this.product);
        }
        this.firestoreService.addRealTimeData('productList', `${this.product.id}`, this.product);
      }
      this.isEdit = false;
      this.btnTXT = 'اضافة';
      this.counter = 0;
      form.resetForm();
    } else {
      this.toastr.error('يرجى انتظار تحميل الصورة', 'خطأ');
    }
  }


addsub(product: Products){

  this.router.navigate(['/sub-product',`${product.id}`,`${product.title}`,`${product.brand}`,`${product.categorty}`]);
}


  onEdit(product: Products) {
    this.special = product.Special;
    this.discount = product.discount;
    this.product = product;
    this.isEdit = true;
    this.btnTXT = "تحديث";
    this.counter = 0;
  }

  onDelete(product: Products) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteStorageFile2(`/product/${product.title}`, product.imgname);
        if (product.Special != 'false') {
          this.firestoreService.deleteRealTimeData('FeaturedList', `${product.id}`)
        }
        if (product.discount != 0) {
          this.firestoreService.deleteRealTimeData('DiscountList', `${product.id}`);
        }
        this.firestoreService.deleteRealTimeData('productList', `${product.brand}/${product.categorty}/${product.id}`)
        this.toastr.warning('تم الحذف بنجاح', 'حذف');
      }
    });
  }

  onSelectedFile(event) {
    if (this.isEdit && this.counter == 0) {
      this.firestoreService.deleteStorageFile2(`/product/${this.product.title}`, this.product.imgname);
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
