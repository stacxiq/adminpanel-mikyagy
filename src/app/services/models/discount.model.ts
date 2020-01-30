import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Discount {
    id:string;
    code:string;
    type:string;
    rate:string;
}
