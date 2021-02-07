import { Component, Input, OnInit } from '@angular/core';
import { Film } from '../services/films.service';

@Component({
  selector: 'app-table-sell',
  templateUrl: './table-sell.component.html',
  styleUrls: ['./table-sell.component.scss']
})
export class TableSellComponent implements OnInit {

  @Input() film!: Film;

  constructor() { }

  ngOnInit(): void {
  }

}
