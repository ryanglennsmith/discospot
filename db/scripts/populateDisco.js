import query from "../connection.js";
import { myRecordCollection } from "../../models/disco.js";
let queryText = ``;
myRecordCollection.forEach((obj) => {
  queryText += `INSERT INTO discogs_main 
  (discogs_id, thumb, title, artist, artist_id, year, genres, styles)
  VALUES (${obj.id},
    '${obj.thumb}',
    '${obj.title}',
    '${obj.artists[0].name}',
    ${obj.artists[0].id},
    ${obj.year},
    ARRAY [${obj.genres.map((genre) => `'${genre}'`)}],
    ARRAY [${obj.styles.map((style) => `'${style}'`)}])
    ON CONFLICT (discogs_id) DO NOTHING;`;
});
try {
  const response = query(queryText);
  console.log(response);
} catch (err) {
  console.error(err.stack);
}
// console.log(queryText);

// INSERT INTO discogs_to_trash (discogs_id, thumb, title, artist, artist_id, year, genres, styles) VALUES (6892761, 'https://img.discogs.com/OVCFH8J5CVAm23wBPjnBCvi1v4A=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-6892761-1474967457-4850.png.jpg', 'Out Of A Center Which Is Neither Dead Nor Alive', 'Minsk', 483765, 2015, ARRAY ['Rock'], ARRAY ['Alternative Rock', 'Stoner Rock', 'Doom Metal']);
// [n].id
// [n].thumb
// [n].title
// [n].artists[0].name
// [n].artists[0].id
// [n].year
// [n].genres -> array
// [n].styles -> array
// but why
