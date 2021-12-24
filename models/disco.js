import { disco } from "../config.js";
import disconnect from "disconnect";
import fs from "fs";

const Discogs = disconnect.Client;

const myCollection = new Discogs({
  userToken: disco.discoAccessToken,
})
  .user()
  .collection()
  .getReleases(disco.discoUser, 0, { page: 1, per_page: 100 }, (err, data) =>
    fs.writeFile(
      "./models/releases.json",
      JSON.stringify(data.releases),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    )
  );
