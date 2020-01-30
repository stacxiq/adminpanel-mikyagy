import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  APP_NAME: string = "Mikyage";

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  deleteStorageFile(folder: string, filename: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${folder}/${filename}`).delete();
  }

  deleteStorageFile2(folder: string,  filename: string[]) {
    console.log(filename)
    var i = 0;
    while(filename[i] != null){
      console.log(filename[i]);
    const storageRef = firebase.storage().ref();
    storageRef.child(`${folder}/${filename[i]}`).delete();
    i++;
    }
    
  }

  addRealTimeData(colName: string, path: string, dataObject: any) {
    this.db.list(`${colName}/`).set(`${path}`, Object.assign({}, dataObject));
  }

  deleteRealTimeData(colName: string, path: string) {
    this.db.list(`${colName}/`).remove(`${path}`);
  }

  getRealTimeData(colName: string, path: string) {
    return this.db.list(`${colName}/${path}`).valueChanges();
  }

  getRealTimeDataCol(colName: string) {
    return this.db.list(`${colName}`).valueChanges();
  }
  getRealTimeDataProductCol(colName: string) {
    return this.db.list(`${colName}`).query.limitToFirst(50);
  }
 

  async login(email: string, password: string) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async deleteStuEmailPassword(email: string, password: string) {
    await this.afAuth.auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      userCredential.user.delete();
    });
  }
}
