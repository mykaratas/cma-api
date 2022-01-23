import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import * as firebaseAdmin from 'firebase-admin';
import {UserRecord} from 'firebase-admin/lib/auth/user-record';

class FirebaseAdminServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
  }
}

@injectable({scope: BindingScope.TRANSIENT})
export class FirebaseAdminService {
  constructor(/* Add @inject to inject parameters */) {}

  async createUser(email: string, password: string): Promise<UserRecord> {
    try {
      return await firebaseAdmin.auth().createUser({
        email,
        password,
      });
    } catch (error) {
      throw new FirebaseAdminServiceError(error.message);
    }
  }

  async deleteUser(uid: string, currentUserUid: string) {
    try {
      // TODO: Role based access control
      if (currentUserUid !== uid) {
        throw new FirebaseAdminServiceError(
          'permission not allowed for user ' + uid,
          401,
        );
      }
      await firebaseAdmin.auth().deleteUser(uid);
    } catch (error) {
      throw new FirebaseAdminServiceError(error.message);
    }
  }
}
