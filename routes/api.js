import express from "express";
const router = express.Router();
import path from "path";
import __dirname from "../dirname.js";

import {
  getMyRecordCollection,
  getMarketplaceListing,
  getSellersOfThisAlbum,
  findAlbumID,
} from "../models/disco.js";
import fs from "fs";

/* GET collection. */
router.get("/", async (req, res, next) => {
  const myCollection = await getMyRecordCollection();
  res.json({ collection: myCollection });
});
/*
router.get("/album-info", async (req, res) => {
  const albumInfo = await findAlbumID("Thou", "May Our Chambers Be Full");
  const sellers = await getSellersOfThisAlbum(Number(albumInfo));
  res.json(sellers);
  
}); */

// router.get("/json/", (req, res) => {
//   res.sendFile(path.join(__dirname, "/public/topArtists.json"));
// });
// router.get("/auth/spotify/callback", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "/public/login.html"));
// });

export default router;
