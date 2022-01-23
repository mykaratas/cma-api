import {Client, expect} from '@loopback/testlab';
import {connectAuthEmulator, getAuth} from 'firebase/auth';
import {CmaApplication} from '../..';
import {setupApplication} from './test-helper';

describe.skip('PingController', () => {
  let app: CmaApplication;
  let client: Client;

  before('setupApplication', async () => {
    const auth = getAuth();
    connectAuthEmulator(auth, 'http://localhost:9099');
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from CMA API'});
  });
});
