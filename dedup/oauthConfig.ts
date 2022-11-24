const clientId = '04dca0de1c4e4aca88cc615ac23581be'; // is this going to work for uw
const redirectUri =
  'location' in global && global['location']['host'] === 'localhost:3000'
    ? 'http://localhost:3000/callback'
    : 'https://spotify-dedup.com/callback/';

const host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

export default {
  clientId,
  redirectUri,
  host,
};
