import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {securityId, UserProfile} from '@loopback/security';
import * as firebaseAdmin from 'firebase-admin';

// Add this so that loopback can tell the user what error happened
class FirebaseTokenError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
  }
}

@injectable({scope: BindingScope.TRANSIENT})
export class FirebaseTokenService {
  constructor(/* Add @inject to inject parameters */) {}

  tokenToUserProfile(token: firebaseAdmin.auth.DecodedIdToken): UserProfile {
    return {
      [securityId]: token.uid,
      email: token.email,
      name: token.name,
      picture: token.picture,
    };
  }

  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      return this.tokenToUserProfile(decodedToken);
    } catch (error) {
      console.error(
        '%cerror firebase-token.service.ts->verifyToken',
        'color: red; display: block; width: 100%;',
        error,
      );
      throw new FirebaseTokenError(`${error.code}`, 401);
    }
  }

  generateToken(userProfile: UserProfile): Promise<string> {
    throw new FirebaseTokenError('Method not implemented.');
  }
}
