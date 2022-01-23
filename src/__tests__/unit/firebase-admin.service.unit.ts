// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {expect} from '@loopback/testlab';
// import * as admin from 'firebase-admin';
// import sinon from 'sinon';
// import {User} from '../../models';
// import {FirestoreUserService} from '../../services/firestore-user.service';

// describe('<FirestoreUserService>', () => {
//   let firebaseUserService: FirestoreUserService;
//   let collection: sinon.SinonStub<any[], any>;
//   beforeEach('FirebaseAdminService (before)', async () => {
//     sinon.spy(admin.initializeApp());

//     // sinon.stub(getFirestore() as any, 'collection').returns({
//     //   doc: sinon.stub(),
//     // });
//     firebaseUserService = new FirestoreUserService();
//     // collectionStub = sinon.stub(firebaseUserService.db, 'collection');
//     // collectionStub.returns({
//     //   doc: () => {
//     //     return {
//     //       set: (): Promise<any> => {
//     //         return new Promise((resolve, reject) => {
//     //           resolve('');
//     //         });
//     //       },
//     //       get: (): Promise<any> => {
//     //         return new Promise((resolve, reject) => {
//     //           resolve({
//     //             id: 'id',
//     //             email: 'email',
//     //             name: 'user',
//     //             birthDate: '2017-01-01',
//     //           });
//     //         });
//     //       },
//     //     };
//     //   },
//     // });

//     const collectionMock = (param: any) => {
//       return {
//         doc: () => {
//           return {
//             set: (param2: any): Promise<any> => {
//               return new Promise((resolve, reject) => {
//                 resolve('');
//               });
//             },
//             get: (param3: any): Promise<any> => {
//               return new Promise((resolve, reject) => {
//                 resolve({
//                   id: 'id',
//                   email: 'email',
//                   name: 'user',
//                   birthDate: '2017-01-01',
//                 });
//               });
//             },
//           };
//         },
//       };
//     };
//     collection = sinon
//       .stub(firebaseUserService.db as any, 'collection')
//       .returns(collectionMock);
//   });

//   afterEach(async () => {
//     sinon.restore();
//   });

//   it.only('should be addUser success', async () => {
//     const user = new User();
//     user.email = 'email';
//     user.id = 'uid';
//     const ss = sinon.stub(collection, 'set');
//     console.log('SS', ss.calledOnce);
//     const stb = sinon.stub(
//       firebaseUserService.db.collection('').doc(''),
//       'set',
//     );
//     console.log('BB', stb.calledOnce);
//     await firebaseUserService.addUser(JSON.parse(JSON.stringify(user)));
//     expect(stb.calledOnce).to.equal(true);
//   });

//   it.skip('should be createUser success', async () => {
//     // const userRecord: UserRecord = {
//     //   uid: 'test-uid',
//     //   email: 'test@test.com',
//     //   emailVerified: false,
//     //   disabled: false,
//     //   metadata: {
//     //     creationTime: 'test-timestamp',
//     //     lastSignInTime: 'test-update',
//     //     toJSON: () => {
//     //       return {};
//     //     },
//     //   },
//     //   providerData: [],
//     //   toJSON: () => {
//     //     return {};
//     //   },
//     // };
//     // // sinon.stub(firebaseAdminService, 'createUser').resolves(userRecord);
//     // // sinon.stub(firebaseAdmin.auth(), 'createUser').resolves(userRecord);
//     // // sinon.spy(firebaseAdmin.prototype, 'createUser').returned(
//     // //   new Promise((resolve, reject) => {
//     // //     resolve(userRecord);
//     // //   }),
//     // // );
//     // sinon.stub(admin, 'auth').get(function getterFn() {
//     //   return () => {
//     //     return {createUser: {a: 1}};
//     //   };
//     // });
//     // const result = await firebaseAdminService.createUser(
//     //   userRecord.email ?? '',
//     //   '12345678',
//     // );
//     // console.log({result});
//   });
// });
