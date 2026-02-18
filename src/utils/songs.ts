import discographyData from '@/constants/discography.json';
import { slugify } from './slugify';

export interface Musician {
    name: string;
    instrument?: string | { es: string; en: string };
}

export interface Song {
    id: string;
    title: string;
    album: {
        id: string;
        title: string;
        year: number;
        cover: string;
        songArtwork?: string;
    };
    details: {
        duration: string;
        track_number: number;
    };
    credits: {
        writers: {
            lyrics: string[];
            music: string[];
        };
        musicians: Musician[];
    };
    theme?: {
        es: string;
        en: string;
    };
    lyrics: {
        en: string;
        es?: string;
    };
}

export function getAllSongs(): Song[] {
    const allSongs: Song[] = [];

    discographyData.forEach((album) => {
        album.tracks.forEach((track) => {
            allSongs.push({
                id: slugify(track.title),
                title: track.title,
                album: {
                    id: album.id,
                    title: album.title,
                    year: album.year,
                    cover: album.cover,
                },
                details: {
                    duration: track.duration,
                    track_number: track.n,
                },
                credits: {
                    writers: {
                        lyrics: track.writers,
                        music: track.writers, // Assuming writers are both lyrics and music for now
                    },
                    musicians: [],
                },
                lyrics: {
                    en: track.lyrics,
                },
            });
        });
    });

    return allSongs;
}

export function getSongById(id: string): Song | undefined {
    return getAllSongs().find((s) => s.id === id);
}
