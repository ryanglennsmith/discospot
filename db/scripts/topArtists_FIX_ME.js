import express from "express";
import path from "path";
import __dirname from "../../dirname.js";
import { spot } from "../../config.js";
import request from "request";
import cors from "cors";
import querystring from "querystring";
import cookieParser from "cookie-parser";
import fs from "fs";
import query from "../../db/connection.js";
const router = express();
export const getMyTopArtists = (accessToken) => {
  const spotRequestURL = "https://api.spotify.com/v1/me/top/artists?limit=50";
  return {
    url: spotRequestURL,
    headers: { Authorization: "Bearer " + accessToken },
    json: true,
  };
};
const redirectURI = "http://localhost:3000/api/spot/callback";
const clientID = spot.spotClientID;
const clientSecret = spot.spotClientSecret;
const generateRandomString = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
let stateKey = "spotify_auth_state";
router
  //   .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());
export const createRouteForSpotify = (dataToSeek) => {
  const makeTable = (body) => {
    let queryText = ``;
    body.items.forEach((obj) => {
      queryText += `INSERT INTO spotify_top_artists (spotify_id, artist, genres, images) 
      VALUES ('${obj.id}',
       '${obj.name}',
        ARRAY [${obj.genres.map((genre) => `'${genre}'`)}],
         '${obj.images[2].url}') 
         ON CONFLICT (spotify_id) DO NOTHING;`;
    });
    // console.log(queryText);
    try {
      const response = query(queryText);
      console.log(response);
    } catch (err) {
      console.error(err.stack);
    }
  };

  const results = [];
  const getData = (body) => {
    console.log(body);
  };
  //   fs.writeFile("./models/topArtists.json", JSON.stringify(body), (err) => {
  //     console.error(err);
  //     return;
  //   });
  // console.log(results[0]);

  router.get("/", (req, res) => {
    let state = generateRandomString(16);
    res.cookie(stateKey, state);
    // router requests authorization:
    let scope =
      "user-read-private user-read-email user-library-read user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private user-top-read user-follow-read";
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: spot.spotClientID,
          scope: scope,
          redirect_uri: redirectURI,
          state: state,
        })
    );
  });
  router.get("/callback", (req, res, next) => {
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;
    if (state === null || state !== storedState) {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "state_mismatch",
          })
      );
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code: code,
          redirect_uri: redirectURI,
          grant_type: "authorization_code",
        },
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(clientID + ":" + clientSecret).toString("base64"),
        },
        json: true,
      };
      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let accessToken = body.access_token;
          let refreshToken = body.refresh_token;
          const options = {
            url: "https://api.spotify.com/v1/artists/6aVjo0xHSiuW5hkasoYSR3/top-tracks?market=us",
            headers: { Authorization: "Bearer " + accessToken },
            json: true,
          };
          request.get(options, (error, response, body) => {
            getData(body);
            console.log(body);
          });
          res.redirect(
            "/#" +
              querystring.stringify({
                access_token: accessToken,
                refresh_token: refreshToken,
              })
          );
        } else {
          res.redirect(
            "/#" +
              querystring.stringify({
                error: "invalid_token",
              })
          );
        }
      });
    }
  });

  router.get("/refresh_token", (req, res) => {
    let refreshToken = req.query.refresh_token;
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(clientID + ":" + clientSecret).toString("base64"),
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let accessToken = body.access_token;
        res.send({
          access_token: accessToken,
        });
      }
    });
  });
};
// router.get("/spot", async (req, res) => {
//   const data = await getSomeSpotifyData();
//   res.json;
// });

// createRouteForSpotify(

// );
// createRouteForSpotify(spotRequest);
export default router;
