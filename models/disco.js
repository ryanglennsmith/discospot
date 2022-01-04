import { disco } from "../config.js";
import disconnect from "disconnect";

const Discogs = disconnect.Client;

const _myCollection = new Discogs({
  userToken: disco.discoAccessToken,
})
  .user()
  .collection();

const myCollection = await _myCollection
  .getReleases(disco.discoUser, 0, { page: 1, per_page: 100 })
  .then((res) => {
    return res;
  });

const _albumID = new Discogs({
  userToken: disco.discoAccessToken,
}).database();

// get the most frequent number in the master ID array
function getMostFrequent(arr) {
  const hashmap = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(hashmap).reduce((a, b) =>
    hashmap[a] > hashmap[b] ? a : b
  );
}

export const findAlbumID = (artist, title) => {
  const albumID = _albumID
    .search({ artist: artist, title: title })
    .then((data) => {
      try {
        const response = data.results.map((result) => result.master_id);
        return getMostFrequent(response);
      } catch (err) {
        console.log("probably null value");
        return null;
      }
    });
  return albumID;
};

// const findAlbum = (artist, title) => {
//   const searchDB = new Discogs({
//     userToken: disco.discoAccessToken,
//   })
//     .database()
//     .search({ artist: artist, title: title }, (err, data) =>
//       data.results.filter((record) =>
//         record.user_data.in_collection ? console.log(record) : null
//       )
//     );
// };

export const getMyRecordCollection = () => {
  const releases = myCollection.releases.map(
    (album) => album.basic_information
  );
  return releases;
};
export const myRecordCollection = await getMyRecordCollection();

const _marketplaceListing = new Discogs({
  userToken: disco.discoAccessToken,
}).marketplace();

export const getMarketplaceListing = async (sellerID) => {
  const marketplaceListing = await _marketplaceListing
    .getListing(sellerID)
    .then((res) => {
      return res;
    });
  // console.log(marketplaceListing);
  return marketplaceListing;
};

// retrieve sellers for an album by master ID
import getSellersList from "./scraper.js";

export const getSellersOfThisAlbum = async (albumMasterID) => {
  const sellersList = await getSellersList(albumMasterID);
  const market = [];
  try {
    if (!sellersList) {
      throw "no data";
    } else if (sellersList.length > 3) {
      for (let i = 0; i < 3; i++) {
        const seller = sellersList[i];
        const listing = await getMarketplaceListing(seller);
        // market.push(listing);
        market.push({
          artist: listing.artist,
          title: listing.title,
          year: listing.year,
          in_collection: listing.release.stats.user.in_collection,
          id: listing.id,
          url: listing.uri,
          condition: listing.condition,
          price: "£" + listing.price.value,
          thumb: listing.release.thumbnail,
        });
      }
    } else {
      for (let i = 0; i < sellersList.length; i++) {
        const seller = sellersList[i];
        const listing = await getMarketplaceListing(seller);
        // market.push(listing);
        market.push({
          artist: listing.artist,
          title: listing.title,
          year: listing.year,
          in_collection: listing.release.stats.user.in_collection,
          id: listing.id,
          url: listing.uri,
          condition: listing.condition,
          price: "£" + listing.price.value,
          thumb: listing.release.thumbnail,
        });
      }
    }
  } catch (err) {
    console.error(err);
  }

  return market;
};
