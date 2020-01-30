import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Brand {
    id: string;
    name: string;
    image: string;
    imgname: string;
    discount:number;
}
