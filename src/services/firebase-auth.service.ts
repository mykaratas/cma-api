import {/* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {NewUserRequest} from '../controllers';
import {User} from '../models';
import {FirestoreUserService} from './firestore-user.service';
class FirebaseAuthServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
  }
}

@injectable({scope: BindingScope.TRANSIENT})
export class FirebaseAuthService {
  constructor(
    @inject('services.FirestoreUserService')
    public firestoreUserService: FirestoreUserService,
  ) {}

  async singin(username: string, password: string): Promise<AnyObject> {
    const auth = getAuth();
    try {
      let user: User | null = null;
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      if (userCredentials.user) {
        user = await this.firestoreUserService.getUserByUid(
          userCredentials.user.uid,
        );
      }
      return {userCredentials, user};
    } catch (error) {
      throw new FirebaseAuthServiceError(error.message, 401);
    }
  }

  async singup(userReq: NewUserRequest): Promise<User> {
    const auth = getAuth();
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        userReq.email,
        userReq.password,
      );
      const user = {
        id: userCredentials.user.uid,
        email: userReq.email,
        birthDate: userReq?.birthDate,
        name: userReq?.name,
      } as User;

      await this.firestoreUserService.addUser(user);
      return user;
    } catch (error) {
      throw new FirebaseAuthServiceError(error.message, 401);
    }
  }

  async singout(username: string, password: string): Promise<void> {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      throw new FirebaseAuthServiceError(error.message, 401);
    }
  }
}
