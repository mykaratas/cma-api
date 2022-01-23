import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class User extends Model {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  birthDate?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
