import query from "../connection.js";

const response = query(
  `CREATE TABLE IF NOT EXISTS discogs_main (
    id SERIAL PRIMARY KEY, 
    discogs_id INT UNIQUE, 
    thumb TEXT, 
    title TEXT, 
    artist TEXT, 
    artist_id INT,
    year INT,
    genres TEXT[],
    styles TEXT[]);`
);

console.log(response);

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
