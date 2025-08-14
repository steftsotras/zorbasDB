// src/lib/data/songs.ts
import type { Song, RawSongData } from '$lib/types/song';

/**
 * Transform raw song data from JSON to typed Song objects
 */
export function transformRawData(raw: RawSongData): Song {
    return {
        title: raw["Τίτλος τραγουδιού"],
        lyrics: raw["Στίχοι του τραγουδιού"],
        tonality: raw["ΤΟΝΙΚΗ"],
        youtubeLink: raw["LINK_YOUTUBE"],
        musicPath: raw["Musicpath"],
        composer1: raw["Συνθέτης_1"],
        composer2: raw["Συνθέτης_2"],
        lyricist1: raw["Στιχουργός_1"],
        lyricist2: raw["Στιχουργός_2"],
        singer1: raw["Τραγουδιστής_1"],
        singer2: raw["Τραγουδιστής_2"],
        singer3: raw["Τραγουδιστής_3"],
        year: raw["Έτος"]
    };
}

/**
 * Calculate dynamic height based on song content
 */
export function calculateHeight(song: Song): number {
    let baseHeight = 180; // Base height for card without lyrics
    
    // Add height for additional artists
    const additionalArtists = [
        song.singer2, 
        song.singer3, 
        song.composer2, 
        song.lyricist2
    ].filter(Boolean).length;
    
    if (additionalArtists > 0) {
        baseHeight += additionalArtists * 15;
    }
    
    // Add small variance for visual interest
    baseHeight += Math.floor(Math.random() * 20);
    
    return baseHeight;
}

/**
 * Create a unique key for each song
 */
export function createSongKey(song: Song, index: number): string {
    return `${song.title}-${song.year}-${index}`;
}

/**
 * Process and prepare songs for display
 */
export function processSongs(rawData: RawSongData[]): (Song & { height: number; uniqueKey: string })[] {
    return rawData.map((raw, index) => {
        const song = transformRawData(raw);
        return {
            ...song,
            height: calculateHeight(song),
            uniqueKey: createSongKey(song, index)
        };
    });
}

/**
 * Load songs from JSON file (for static imports)
 * Place your songs.json file in src/lib/data/
 */
export async function loadSongsFromFile(): Promise<Song[]> {
    try {
        // Option 1: Static import (recommended for build time)
        const response = await import('./songs.json');
        const rawData: RawSongData[] = response.default;
        return processSongs(rawData);
    } catch (error) {
        console.error('Error loading songs:', error);
        return [];
    }
}

/**
 * Load songs from API endpoint
 */
export async function loadSongsFromAPI(endpoint: string): Promise<Song[]> {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch songs');
        
        const rawData: RawSongData[] = await response.json();
        return processSongs(rawData);
    } catch (error) {
        console.error('Error loading songs from API:', error);
        return [];
    }
}

/**
 * Search/filter songs
 */
export function searchSongs(songs: Song[], query: string): Song[] {
    if (!query.trim()) return songs;
    
    const searchTerm = query.toLowerCase();
    
    return songs.filter(song => {
        const searchableFields = [
            song.title,
            song.singer1,
            song.singer2,
            song.singer3,
            song.composer1,
            song.composer2,
            song.lyricist1,
            song.lyricist2,
            song.year,
            song.tonality,
            song.lyrics
        ].filter(Boolean).map(field => field!.toLowerCase());
        
        return searchableFields.some(field => field.includes(searchTerm));
    });
}

/**
 * Sort songs by various criteria
 */
export function sortSongs(songs: Song[], sortBy: 'title' | 'year' | 'singer' | 'composer' = 'title'): Song[] {
    return [...songs].sort((a, b) => {
        switch (sortBy) {
            case 'year':
                return (a.year || '').localeCompare(b.year || '');
            case 'singer':
                return (a.singer1 || '').localeCompare(b.singer1 || '');
            case 'composer':
                return (a.composer1 || '').localeCompare(b.composer1 || '');
            case 'title':
            default:
                return a.title.localeCompare(b.title);
        }
    });
}

/**
 * Group songs by a specific field
 */
export function groupSongs(songs: Song[], groupBy: 'year' | 'singer' | 'composer' | 'tonality'): Map<string, Song[]> {
    const grouped = new Map<string, Song[]>();
    
    songs.forEach(song => {
        let key: string;
        switch (groupBy) {
            case 'year':
                key = song.year || 'Άγνωστο';
                break;
            case 'singer':
                key = song.singer1 || 'Άγνωστος';
                break;
            case 'composer':
                key = song.composer1 || 'Άγνωστος';
                break;
            case 'tonality':
                key = song.tonality || 'Άγνωστη';
                break;
        }
        
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key)!.push(song);
    });
    
    return grouped;
}

/**
 * Get statistics about the song collection
 */
export function getSongStatistics(songs: Song[]) {
    const stats = {
        totalSongs: songs.length,
        uniqueYears: new Set(songs.map(s => s.year).filter(Boolean)).size,
        uniqueSingers: new Set([
            ...songs.map(s => s.singer1),
            ...songs.map(s => s.singer2),
            ...songs.map(s => s.singer3)
        ].filter(Boolean)).size,
        uniqueComposers: new Set([
            ...songs.map(s => s.composer1),
            ...songs.map(s => s.composer2)
        ].filter(Boolean)).size,
        uniqueLyricists: new Set([
            ...songs.map(s => s.lyricist1),
            ...songs.map(s => s.lyricist2)
        ].filter(Boolean)).size,
        songsWithYoutube: songs.filter(s => s.youtubeLink && s.youtubeLink !== '#').length,
        yearRange: {
            earliest: Math.min(...songs.map(s => parseInt(s.year || '9999')).filter(y => y < 9999)),
            latest: Math.max(...songs.map(s => parseInt(s.year || '0')))
        }
    };
    
    return stats;
}