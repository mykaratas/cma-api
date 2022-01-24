import {Model, model, property} from '@loopback/repository';
import {ContentTypes} from '../enums';
import {Season} from './season.model';

@model({settings: {strict: false}})
export class Content extends Model {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  uid?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  imageUrl?: string;

  @property({
    type: 'date',
  })
  releaseDate?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  seasons?: Season[];

  @property({
    type: 'string',
  })
  videoUrl?: string;

  @property({
    type: 'string',
    defaultValue: ContentTypes.TV_SERIES,
  })
  contentType?: string = ContentTypes.TV_SERIES;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Content>) {
    super(data);
  }
}

export interface ContentRelations {
  // describe navigational properties here
}

export type ContentWithRelations = Content & ContentRelations;
