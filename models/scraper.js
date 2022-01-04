import superagent from "superagent";

// get the sellers market list from an album master ID
const getSellersList = async (albumMasterID) => {
  const SellerRegEx = /(\<a\ href\=\"\/sell\/item\/\w+)/g;
  const MatchRegEx = /(\d)/g;
  try {
    const res = await superagent.get(
      `https://www.discogs.com/sell/list?master_id=${albumMasterID}&ev=mb&currency=GBP&format=Vinyl`
    );
    const matches = res.text.match(SellerRegEx);
    const salesSet = new Set(
      matches.map((match) => match.match(MatchRegEx).join(""))
    );
    return Array.from(salesSet);
  } catch (err) {
    console.error(err);
  }
};
export default getSellersList;
