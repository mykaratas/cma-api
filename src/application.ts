import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as firebaseAdmin from 'firebase-admin';
import {FirebaseOptions, initializeApp} from 'firebase/app';
import path from 'path';
import {MySequence} from './sequence';
import {FirebaseTokenService} from './services/firebase-token.service';

export {ApplicationConfig};

export class CmaApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // initialize firebase
    // firebaseAdmin.initializeApp({
    //   credential: firebaseAdmin.credential.applicationDefault(),
    //   databaseURL: 'https://my-firebase-project.firebaseio.com',
    // });

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });

    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    } as FirebaseOptions;

    initializeApp(firebaseConfig);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // JWT Authentication with firebase authentication
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    // This is the key component where we tell which class to use
    // to verify the tokens. The class should implement TokenService interface
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(FirebaseTokenService);
  }
}
