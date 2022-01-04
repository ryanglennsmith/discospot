import { spot } from "../config.js";
import request from "superagent";
import SpotifyWebApi from "spotify-web-api-node";
import express from "express";
import { findAlbumID, getSellersOfThisAlbum } from "./disco.js";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "user-modify-playback-state",
  "user-read-playback-position",
  "user-library-read",
  "streaming",
  "user-read-playback-state",
  "user-read-recently-played",
  "playlist-read-private",
  "user-top-read",
  "user-follow-read",
];

const router = express();
const generateRandomString = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
const redirectURI = "http://localhost:3000/api/spot/callback";
const clientID = spot.spotClientID;
const clientSecret = spot.spotClientSecret;
const state = generateRandomString(16);
const spotifyApi = new SpotifyWebApi({
  redirectUri: redirectURI,
  clientId: clientID,
  clientSecret: clientSecret,
});
// Create the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
// redirect to the login URL
router.get("/login", (req, res) => {
  res.redirect(authorizeURL);
});
// handle the spotify creds
router.get("/callback", (req, res, next) => {
  let code = req.query.code;
  spotifyApi.authorizationCodeGrant(code).then(
    function (data) {
      console.log("The token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);
      console.log("The refresh token is " + data.body["refresh_token"]);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
  res.redirect("/#");
});

// this does a lot, route to point the frontend at
// to handle spotify recommendations porting to discogs:
router.get("/", (req, res) => {
  // find top 50 artists in my spotify collection, filter only
  // 🤘🤘 doom and sludge metal 🤘🤘
  spotifyApi.getMyTopArtists({ limit: 50 }).then(
    function (data) {
      const myTopArtists = data.body.items
        .filter(
          (item) =>
            item.genres.includes("doom metal") ||
            item.genres.includes("sludge metal")
        )
        .map((artist) => artist.id);
      // get random 5 from top artists to seed spotify's recommendations
      const randomSlice = Math.floor(Math.random() * myTopArtists.length);
      const mySlice = myTopArtists.slice(randomSlice, randomSlice + 5);
      spotifyApi.getRecommendations({ seed_artists: mySlice }).then(
        async function (data) {
          let recommendations = data.body.tracks
            .filter((album) => album.album.album_type === "ALBUM")
            .map((album) => {
              return {
                title: album.album.name,
                artist: album.artists[0].name,
                id: album.id,
              };
            });
          // find the discogs ID for each of the recommendations
          // trash any null responses
          const idFinder = [];
          for (let i = 0; i < recommendations.length; i++) {
            const recommendationToFind = recommendations[i];
            const foundID = await findAlbumID(
              recommendationToFind.artist,
              recommendationToFind.title
            );
            if (foundID !== null) {
              idFinder.push(foundID);
            }
          }
          // 😈🎵 get a random records ID 🎵😈
          const randomRecord =
            idFinder[Math.floor(Math.random() * idFinder.length)];
          const recordForSale = await getSellersOfThisAlbum(randomRecord);
          res.json(recordForSale);
        },
        function (err) {
          if (err.body.error.status === 401) {
            res.redirect("/api/spot/login");
          }
          console.log("Something went wrong!", err);
        }
      );
    },
    function (err) {
      if (err.body.error.status === 401) {
        res.redirect("/api/spot/login");
      }
      console.log("Something went wrong!", err);
    }
  );
});

export default router;
