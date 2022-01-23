import {Model, model, property} from '@loopback/repository';
import {SeasonFilm} from '.';

@model({settings: {strict: true}})
export class Season extends Model {
  @property({
    type: 'number',
    required: true,
  })
  seasonNumber: number;

  @property({
    type: 'string',
  })
  date?: string;

  @property({
    type: 'array',
    itemType: SeasonFilm,
  })
  seasonFilms?: SeasonFilm[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Season>) {
    super(data);
  }
}

export interface SeasonRelations {
  // describe navigational properties here
}

export type SeasonWithRelations = Season & SeasonRelations;
