let myRecommendationURL = "/api/spot";

const fetchCollection = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
};
// const recordsForSale = [
//   {
//     in_collection: 0,
//     id: 1717879480,
//     url: "https://www.discogs.com/sell/item/1717879480",
//     condition: "Near Mint (NM or M-)",
//     price: "£25",
//     thumb:
//       "https://img.discogs.com/RUXtOsd_hguDHfkkuvvdrghhicE=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2149177-1266684541.jpeg.jpg",
//   },
//   {
//     in_collection: 0,
//     id: 368172005,
//     url: "https://www.discogs.com/sell/item/368172005",
//     condition: "Mint (M)",
//     price: "£9",
//     thumb:
//       "https://img.discogs.com/cSEb40CkAOYhnN4MX9ufTfQFtmo=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2310115-1285102480.jpeg.jpg",
//   },
//   {
//     in_collection: 0,
//     id: 808111610,
//     url: "https://www.discogs.com/sell/item/808111610",
//     condition: "Mint (M)",
//     price: "£9.99",
//     thumb:
//       "https://img.discogs.com/cSEb40CkAOYhnN4MX9ufTfQFtmo=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2310115-1285102480.jpeg.jpg",
//   },
// ];

const populateModal = async () => {
  const recordsForSale = await fetchCollection(myRecommendationURL);
  console.log(recordsForSale);
  const modalBody = document.querySelector(".modal-body");
  if (recordsForSale.length === 0) {
    modalBody.innerHTML = "<h2>Record Not Found. Try again!</h2>";
  } else {
    recordsForSale.forEach((item) => {
      const recordsSaleItem = document.createElement("div");
      const recordsSaleLink = document.createElement("a");
      recordsSaleLink.setAttribute("href", item.url);
      recordsSaleLink.setAttribute("target", "_blank");
      recordsSaleItem.setAttribute("class", "card");
      recordsSaleItem.setAttribute("style", "width: 125px");
      const recordsSaleThumbnail = document.createElement("img");
      recordsSaleThumbnail.setAttribute("class", "card-img-top");
      recordsSaleThumbnail.setAttribute("src", item.thumb);
      // recordsSaleThumbnail.setAttribute(
      //   "alt",
      //   "album cover for " + item.title + " by " + item.artists[0].name
      // );
      const textNodeRecordsSaleID = document.createTextNode(item.id);
      const textNodeRecordsSalePrice = document.createTextNode(item.price);
      const textNodeRecordsSaleURL = document.createTextNode(item.url);

      recordsSaleItem.appendChild(recordsSaleLink);
      recordsSaleLink.appendChild(recordsSaleThumbnail);
      //   recordsSaleLink.appendChild(textNodeRecordsSaleURL);
      recordsSaleLink.appendChild(textNodeRecordsSalePrice);
      modalBody.appendChild(recordsSaleItem);
    });
  }
  const modalLoader = document.querySelector(".modal-loader");
  modalLoader.style.display = "none";
  modalBody.style.display = "block";
};
populateModal();
