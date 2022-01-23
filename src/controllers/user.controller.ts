// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate} from '@loopback/authentication';
import {Credentials, User} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import * as Models from '../models/user.model';
import {
  FirebaseAdminService,
  FirebaseAuthService,
  FirestoreUserService,
} from '../services';

@model()
export class NewUserRequest {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: false,
  })
  birthDate?: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject('services.FirebaseAuthService')
    public firebaseAuthService: FirebaseAuthService,
    @inject('services.FirebaseAdminService')
    public firebaseAdminService: FirebaseAdminService,
  ) {}

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<Models.User> {
    return this.firebaseAuthService.singup(newUserRequest);
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<object> {
    const loginCredentials = await this.firebaseAuthService.singin(
      credentials.email,
      credentials.password,
    );
    return loginCredentials;
  }

  @authenticate('jwt')
  @del('/users/{uid}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('uid') uid: string,
  ): Promise<void> {
    await this.firebaseAdminService.deleteUser(
      uid,
      currentUserProfile[securityId],
    );
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'json',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @inject('services.FirestoreUserService')
    firestoreUserService: FirestoreUserService,
  ): Promise<Models.User | null> {
    return firestoreUserService.getUserByUid(currentUserProfile[securityId]);
  }
}
