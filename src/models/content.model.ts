import {Model, model, property} from '@loopback/repository';
import {Season} from './season.model';

@model({settings: {strict: true}})
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
  year?: string;

  @property({
    type: 'date',
  })
  date?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  seasons?: Season[];

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
