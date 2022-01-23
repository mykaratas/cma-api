import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {getFirestore} from 'firebase-admin/firestore';
import {Collections} from '../enums';
import {User} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class FirestoreUserService {
  public db: FirebaseFirestore.Firestore;

  constructor(/* Add @inject to inject parameters */) {
    this.db = getFirestore();
  }

  public async addUser(userObject: User): Promise<void> {
    try {
      const userRef = this.db.collection(Collections.USERS).doc(userObject.id);

      await userRef.set(userObject);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteUser(uid: string): Promise<void> {
    await this.db.collection(Collections.USERS).doc(uid).delete();
  }

  public async updateUser(userData: AnyObject): Promise<void> {
    await this.db
      .collection(Collections.USERS)
      .doc(userData.uid)
      .update(userData);
  }

  public async getUserByUid(uid: string): Promise<User | null> {
    const userRef = this.db.collection(Collections.USERS).doc(uid);
    const doc = await userRef.get();
    if (doc.exists) {
      return doc.data() as User;
    } else {
      return null;
    }
  }
}
