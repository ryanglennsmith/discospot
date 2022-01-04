export const disco = {
  discoUser: process.env.DISCOGS_USERNAME,
  discoConsumerKey: process.env.DISCOGS_CONSUMER_KEY,
  discoConsumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
  discoRequestTokenURL: process.env.DISGOCS_REQUEST_TOKEN_URL,
  discoAuthURL: process.env.DISCOGS_AUTH_URL,
  discoAccessToken: process.env.DISCOGS_ACCESS_TOKEN,
};
export const pgPool = {
  pgUser: process.env.PG_USER,
  pgDB: process.env.PG_DB,
  pgPW: process.env.PG_PASSWORD,
  pgServer: process.env.PG_SERVER,
  pgPort: process.env.PG_PORT,
};
export const spot = {
  spotClientID: process.env.SPOTIFY_CLIENT_ID,
  spotClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
};
