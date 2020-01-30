import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Article {
    id: string;
    title: string;
    category: string;
    date: string;
    description: string;
    image: string;
    imgname: string;
    oldname: string;
}
