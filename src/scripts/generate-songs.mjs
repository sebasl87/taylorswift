
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const discographyPath = path.join(__dirname, '../constants/discography.json');
const songsPath = path.join(__dirname, '../constants/songs.json');

const discography = JSON.parse(fs.readFileSync(discographyPath, 'utf8'));

const songs = [];

discography.forEach(album => {
  if (album.tracks) {
    album.tracks.forEach(track => {
      const id = track.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/gi, "")
        .replace(/ /g, "-");

      songs.push({
        id,
        title: track.title,
        album: {
          id: album.id,
          title: album.title,
          year: album.year,
          cover: album.cover
        },
        details: {
          duration: track.duration,
          track_number: track.n
        },
        theme: {
          es: "Tema general",
          en: "General theme"
        },
        credits: {
          writers: {
            lyrics: track.writers || [],
            music: track.writers || []
          },
          musicians: []
        },
        lyrics: {
          en: track.lyrics,
          es: null
        }
      });
    });
  }
});

fs.writeFileSync(songsPath, JSON.stringify(songs, null, 2));

console.log(`Generated ${songs.length} songs in ${songsPath}`);
