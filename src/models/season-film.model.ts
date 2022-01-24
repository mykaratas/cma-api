import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class SeasonFilm extends Model {
  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'date',
  })
  releaseDate?: string;

  @property({
    type: 'string',
  })
  url?: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SeasonFilm>) {
    super(data);
  }
}

export interface SeasonFilmRelations {
  // describe navigational properties here
}

export type SeasonFilmWithRelations = SeasonFilm & SeasonFilmRelations;
