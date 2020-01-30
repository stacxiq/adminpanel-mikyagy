import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-articles-view',
  templateUrl: './articles-view.component.html',
  styleUrls: ['./articles-view.component.scss']
})
export class ArticlesViewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

}
