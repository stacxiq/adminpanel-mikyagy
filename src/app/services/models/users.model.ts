import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Users {
    uid:string;
    email:string;
    firstname:string;
    lastname:string;
    password:string;
    phone:string;
}
