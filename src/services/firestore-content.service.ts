import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {getFirestore} from 'firebase-admin/firestore';
import {v4 as uuidv4} from 'uuid';
import {Collections} from '../enums';
import {Content, Season, SeasonFilm} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class FirestoreContentService {
  private db: FirebaseFirestore.Firestore;

  constructor(/* Add @inject to inject parameters */) {
    this.db = getFirestore();
  }

  public async addContent(contentData: Content): Promise<string> {
    const contentUid = uuidv4();
    const contentRef = this.db.collection(Collections.CONTENTS).doc(contentUid);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {seasons, ...contentRes} = contentData;

    await contentRef.set(contentRes);

    if (
      contentData.seasons &&
      Array.isArray(contentData.seasons) &&
      contentData.seasons.length > 0
    ) {
      const seasonsDoc = contentRef.collection(Collections.SEASONS);
      for (const season of contentData.seasons) {
        await seasonsDoc.doc(`season#${season.seasonNumber}`).set(season);
      }
    }

    return contentUid;
  }

  public async addSeason(uid: string, seasonData: AnyObject): Promise<void> {
    const contentRef = this.db.collection(Collections.CONTENTS).doc(uid); // film id
    await contentRef
      .collection(Collections.SEASONS)
      .doc(`season#${seasonData.seasonNumber}`)
      .set(seasonData);
  }

  public async deleteContent(uid: string): Promise<void> {
    await this.db.collection(Collections.USERS).doc(uid).delete();
  }

  public async updateContent(userData: AnyObject): Promise<void> {
    await this.db
      .collection(Collections.USERS)
      .doc(userData.uid)
      .update(userData);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getContents(paginate: {limit?: number}): Promise<Content[]> {
    const dd = await this.db
      .collection(Collections.CONTENTS)
      .orderBy('title')
      .limit(paginate?.limit ?? 50)
      .get();
    if (!dd.empty) {
      return dd.docs.map(d => d.data()) as Content[];
    } else {
      return [];
    }
  }

  public async getContentByUid(
    uid: string,
  ): Promise<AnyObject | null | undefined> {
    const contentRef = this.db.collection(Collections.CONTENTS).doc(uid);

    const seasonRef = await contentRef
      .collection(Collections.SEASONS)
      .listDocuments();
    const seasons: Season[] = [];
    for (const season of seasonRef) {
      const seasonData = (await season.get()).data() as Season;
      seasons.push(seasonData);
    }

    const doc = await contentRef.get();
    if (doc.exists) {
      const docData = doc.data();
      return {...docData, ...{seasons}};
    } else {
      return null;
    }
  }

  public async addContentSeasonFilm(
    uid: string,
    seasonNumber: number,
    seasonData: SeasonFilm,
  ): Promise<void> {
    const contentRef = this.db.collection(Collections.CONTENTS).doc(uid);

    const seasonRef = contentRef
      .collection(Collections.SEASONS)
      .doc(`season#${seasonNumber}`);

    const data = (await seasonRef.get()).data() as AnyObject;
    if (data?.films) {
      data.films.push(seasonData);
      await seasonRef.set(JSON.parse(JSON.stringify(data)));
    } else {
      await seasonRef.set({films: [seasonData], seasonNumber: seasonNumber});
    }
  }
}
