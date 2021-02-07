import { Direction, Film, FilmsService } from './services/films.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  public readonly displayedColumns = ['title', 'release_date', 'director', 'episode_id'];
  public dataSource!: Film[];
  private subscriber!: Subscription;
  public isBackFilmsAvailable = true;
  public isNextFilmsAvailable = true;
  public isLoadingResults = false;
  private filmsQuantity = 0;
  private maxFilmsQuantity = 0;
  public filmsPerPage = 3;
  public queryToSortBy = 'pk';
  public currentDirection: Direction;

  public filterFormControl = new FormControl('');

  constructor(private service: FilmsService){}

  public ngOnInit(): void {
    this.service.getFilmsLength().subscribe(data => {
      this.filmsQuantity = data[0].totalFilms;
      this.maxFilmsQuantity = data[0].totalFilms;
    });
    this.subscriber = this.service.getFilmsForStartTemplate(this.queryToSortBy, this.currentDirection).subscribe(films => {
      this.dataSource = films;
      this.filmsQuantity -= this.filmsPerPage;
      this.checkFilmsQuantity();
    });
  }

  public getPrevFilms(): void {
    this.subscriber = this.service.getPreviousPortionOfFilms(this.queryToSortBy, this.currentDirection).subscribe(films => {
      this.dataSource = films;
    });
    this.filmsQuantity += this.filmsPerPage;
    this.checkFilmsQuantity();
  }

  public getNextFilms(): void {
    this.subscriber = this.service.getNextPortionOfFilms(this.queryToSortBy, this.currentDirection).subscribe(films => {
      this.dataSource = films;
    });
    this.filmsQuantity -= this.filmsPerPage;
    this.checkFilmsQuantity();
  }

  public checkFilmsQuantity(): void {
    if (this.filmsQuantity <= 0){
      this.isNextFilmsAvailable = false;
    }else {
      this.isNextFilmsAvailable = true;
    }

    if (this.filmsQuantity + this.filmsPerPage >= this.maxFilmsQuantity){
      this.isBackFilmsAvailable = false;
    }else {
      this.isBackFilmsAvailable = true;
    }
  }

  public sortMatTable(event: Sort): void {
    this.queryToSortBy = 'fields.' + event.active;
    this.currentDirection = event.direction ? event.direction : undefined;
    this.subscriber = this.service.getFilmsForStartTemplate(this.queryToSortBy, this.currentDirection).subscribe(films => {
      this.dataSource = films;
    });
    this.filmsQuantity = this.maxFilmsQuantity;
    this.filmsQuantity -= this.filmsPerPage;
    this.checkFilmsQuantity();
  }

  public filterMatTable(event: Event): void {
   
  }

  public ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
