import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Users } from 'app/services/models/users.model';
const STORAGE_KEY = 'local_user';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'
import { MatDialog } from "@angular/material";
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  usersList: Observable<any[]>;
  usersData: any[] = [];
  usersData2: any[] = [];
  name = '';



  constructor(private firestoreService: FirebaseService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,) { }

  ngOnInit() {
    this.spinnerService.show();
    if (this.storage.get(STORAGE_KEY) == null) {
      this.router.navigate(['login']);
    }
    this.usersList = this.firestoreService.getRealTimeDataCol('users');
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
    this.usersList.subscribe(data => {
      this.usersData = data;
      this.usersData2 =data;
    });
  }

  onDelete(user) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.firestoreService.deleteStuEmailPassword(user.email, user.password).then(done => {
          this.firestoreService.deleteRealTimeData('users', user.id);
          this.toastr.warning('تم الحذف بنجاح', 'حذف');
          this.firestoreService.addRealTimeData('blacklist',`${user.id}`,{phone : user.phone})
        }).catch(err => {
          this.toastr.warning('حصل خطا اثناء حذف الحساب', 'خطا');
        });
      }
    });
  }
  
  onChange(event){
    if(event.data==null || event.data==''){
      this.usersData=this.usersData2;
    } else{
      this.usersData = this.usersData.filter((word:any) => {
        return word.firstname.includes(event.data) || word.lastname.includes(event.data); 
      });    
    }
  }
 
}
