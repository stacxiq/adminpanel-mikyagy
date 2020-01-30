import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private dataSource = new BehaviorSubject('default message');
    currentMessage = this.dataSource.asObservable();

    constructor() { }

    saveData(data) {
        this.dataSource.next(data);
    }
}