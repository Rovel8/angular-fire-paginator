import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface FilmDto {
  fields: {
    characters: number[];
    created: Date;
    director: string;
    edited: Date;
    episode_id: number;
    opening_crawl: string;
    planets: number[];
    producer: string;
    release_date: string;
    species: number[];
    starships: number[];
    title: string;
    vehicles: number[];
  }
  model: string;
  pk: number;
}

export interface Film {
  characters: number[];
  created: Date;
  director: string;
  edited: Date;
  episodeId: number;
  openingCrawl: string;
  planets: number[];
  producer: string;
  releaseDate: string;
  species: number[];
  starships: number[];
  title: string;
  vehicles: number[];
}

export interface Metadata {
  totalFilms: number;
}

export type Direction = 'asc' | 'desc' | undefined;

function mapFilmDtoToFilm(film: FilmDto): Film {
  return {
    characters: film.fields.characters,
    created: film.fields.created,
    director: film.fields.director,
    edited: film.fields.edited,
    episodeId: film.fields.episode_id,
    openingCrawl: film.fields.opening_crawl,
    planets: film.fields.planets,
    producer: film.fields.producer,
    releaseDate: film.fields.release_date,
    species: film.fields.species,
    starships: film.fields.starships,
    title: film.fields.title,
    vehicles: film.fields.vehicles,
  }
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  public readonly limitForQuery = 3;
  private lastFilmOfPortion!: QueryDocumentSnapshot<FilmDto>;
  private firstFilmOfPortion!: QueryDocumentSnapshot<FilmDto>;

  constructor(private store: AngularFirestore) { }

  public getFilmsForStartTemplate(sortBy: string, direction?: Direction): Observable<Film[]>{
    return this.store.collection<FilmDto>('films', ref => ref.orderBy(`${sortBy}`, direction)
    .limit(this.limitForQuery)).snapshotChanges().pipe(
      map(filmsDto => {
        console.log(filmsDto);
        this.setFirstAndLastPortion(filmsDto);
        return filmsDto.map(filmDto => mapFilmDtoToFilm(filmDto.payload.doc.data()));
      }),
    );
  }

  public getNextPortionOfFilms(sortBy: string, direction?: Direction): Observable<Film[]>{
    return this.store.collection<FilmDto>('films', ref => ref.orderBy(`${sortBy}`, direction)
    .startAfter(this.lastFilmOfPortion).limit(this.limitForQuery)).snapshotChanges().pipe(
      map(filmsDto => {
        this.setFirstAndLastPortion(filmsDto);
        return filmsDto.map(filmDto => mapFilmDtoToFilm(filmDto.payload.doc.data()));
      }),
    );
  }

  public getPreviousPortionOfFilms(sortBy: string, direction?: Direction): Observable<Film[]>{
    return this.store.collection<FilmDto>('films', ref => ref.orderBy(`${sortBy}`, direction)
    .endBefore(this.firstFilmOfPortion).limit(this.limitForQuery)).snapshotChanges().pipe(
      map(filmsDto => {
        this.setFirstAndLastPortion(filmsDto);
        return filmsDto.map(filmDto => mapFilmDtoToFilm(filmDto.payload.doc.data()));
      }),
    );
  }

  private setFirstAndLastPortion(films: DocumentChangeAction<FilmDto>[]): void {
    this.firstFilmOfPortion = films[0].payload.doc;
    this.lastFilmOfPortion = films[films.length - 1].payload.doc;
  }

  public getFilmsLength(): Observable<Metadata[]> {
    return this.store.collection<Metadata>('metadata').valueChanges();
  }
}
