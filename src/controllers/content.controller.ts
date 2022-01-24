// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {Content, Season, SeasonFilm} from '../models';
import {FirestoreContentService} from '../services/firestore-content.service';

@authenticate('jwt')
export class ContentController {
  constructor(
    @inject('services.FirestoreContentService')
    public firestoreContentService: FirestoreContentService,
  ) {}

  @post('/content', {
    responses: {
      '200': {
        description: 'Create a new content',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  })
  async createContent(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Content, {
            title: 'new content',
            exclude: ['uid'],
            includeRelations: true,
          }),
        },
      },
    })
    content: Content,
  ): Promise<string> {
    return this.firestoreContentService.addContent(content);
  }

  @post('/content/{id}/seasons', {
    responses: {
      '200': {
        description: 'Create content seasons',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  })
  async createContentSeasons(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Season, {
            includeRelations: true,
            title: 'upsert season',
          }),
        },
      },
    })
    season: Season,
    @param.path.string('id') contentUid: string,
  ): Promise<void> {
    await this.firestoreContentService.addSeason(contentUid, season);
  }

  @post('/content/{contentId}/seasons/{seasonNumber}', {
    responses: {
      '200': {
        description: 'Add season Film',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  })
  async addSeasonFilm(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SeasonFilm, {
            title: 'add season film',
          }),
        },
      },
    })
    seasonFilm: SeasonFilm,
    @param.path.string('contentId') contentId: string,
    @param.path.number('seasonNumber') seasonNumber: number,
  ): Promise<void> {
    await this.firestoreContentService.addContentSeasonFilm(
      contentId,
      seasonNumber,
      seasonFilm,
    );
  }

  @get('/contents/{uid}', {
    responses: {
      '200': Object,
    },
  })
  public async getContentByUid(
    @param.path.string('uid') uid: string,
  ): Promise<Object | null | undefined> {
    return this.firestoreContentService.getContentByUid(uid);
  }

  @get('/contents', {
    responses: {
      '200': Object,
    },
  })
  public async getContents(
    @param.query.number('limit') limit?: number,
  ): Promise<Content[]> {
    return this.firestoreContentService.getContents({
      limit,
    });
  }
}
