import query from "../connection.js";

const response = query(
  `CREATE TABLE IF NOT EXISTS spotify_top_artists (
    id SERIAL PRIMARY KEY, 
    spotify_id TEXT UNIQUE, 
    artist TEXT, 
    genres TEXT[],
    images TEXT);`
);

console.log(response);

// INSERT INTO spotify_top_artists (spotify_id, artist, genres, images) VALUES (6892761, 'https://img.discogs.com/OVCFH8J5CVAm23wBPjnBCvi1v4A=/fit-in/150x150/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-6892761-1474967457-4850.png.jpg', 'Out Of A Center Which Is Neither Dead Nor Alive', 'Minsk', 483765, 2015, ARRAY ['Rock'], ARRAY ['Alternative Rock', 'Stoner Rock', 'Doom Metal']);
// [n].id
// [n].name
// [n].genres -> array
// [n].images -> array
// but why
