const collectionContainer = document.getElementById("collection");
const recordsList = document.getElementById("records-list");
// window.addEventListener("load", () => {
//   alert("page loaded");
// });
let myCollectionURL = "/api/";
let myRecommendationURL = "/api/spot";

const fetchCollection = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  return data.collection;
};

const populateHTML = async () => {
  const collection = await fetchCollection(myCollectionURL);
  // console.log(collection.sort((a, b) => a.artists[0].name - b.artists[0].name));
  collection.forEach((item) => {
    const recordsListItem = document.createElement("div");
    recordsListItem.setAttribute("class", "card");
    recordsListItem.setAttribute("style", "width: 175px");
    const thumbnail = document.createElement("img");
    thumbnail.setAttribute("class", "card-img-top");
    thumbnail.setAttribute("src", item.thumb);
    thumbnail.setAttribute(
      "alt",
      "album cover for " + item.title + " by " + item.artists[0].name
    );
    thumbnail.setAttribute("style", "width: 125px");
    const recordsListTextBox = document.createElement("div");
    recordsListTextBox.setAttribute("class", "card-body");
    const recordsListArtist = document.createElement("h5");
    recordsListArtist.setAttribute("class", "card-title");
    const recordsListTitle = document.createElement("p");
    recordsListTitle.setAttribute("class", "card-text");

    const textnodeTitle = document.createTextNode(item.title);
    const textnodeArtist = document.createTextNode(item.artists[0].name);

    recordsListItem.appendChild(thumbnail);
    recordsListItem.appendChild(recordsListTextBox);
    recordsListTextBox.appendChild(recordsListArtist);
    recordsListArtist.appendChild(textnodeArtist);
    recordsListTextBox.appendChild(recordsListTitle);
    recordsListTitle.appendChild(textnodeTitle);
    // recordsListItem.appendChild(textnodeArtist);
    // recordsListItem.appendChild(textnodeTitle);
    recordsList.appendChild(recordsListItem);
  });
};
populateHTML();
let script = document.createElement("script");
script.setAttribute("src", "./js/populateModal.js");
document.body.append(script);
// script.onload = function () {
//   alert("populate modal script loaded");
// };
