<!-- src/lib/components/SongCard.svelte -->
<script lang="ts">
    import type { Song } from '$lib/types/song';
    
    export let song: Song;
    export let height: number;
    
    let showLyrics = false;
    
    function toggleLyrics() {
        showLyrics = !showLyrics;
    }
    
    function openYoutube() {
        if (song.youtubeLink && song.youtubeLink !== '#') {
            const cleanLink = song.youtubeLink.replace(/#/g, '');
            window.open(cleanLink, '_blank');
        }
    }
    
    // Combine artists for display
    $: artists = [song.singer1, song.singer2, song.singer3].filter(Boolean).join(', ');
    $: composers = [song.composer1, song.composer2].filter(Boolean).join(', ');
    $: lyricists = [song.lyricist1, song.lyricist2].filter(Boolean).join(', ');
</script>

<div class="song-card-wrapper" style="min-height: {height}px; padding: 8px 0;">
    <div class="song-card bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
        <div class="p-4 sm:p-6">
            <!-- Title and Year -->
            <div class="flex items-start justify-between mb-3">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 flex-1 pr-2">
                    {song.title}
                </h2>
                {#if song.year}
                    <span class="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full whitespace-nowrap">
                        {song.year}
                    </span>
                {/if}
            </div>
            
            <!-- Artists Info Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {#if artists}
                    <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
                        </svg>
                        <span class="text-sm text-gray-600 truncate" title={artists}>
                            {artists}
                        </span>
                    </div>
                {/if}
                
                {#if composers}
                    <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm text-gray-600 truncate" title={composers}>
                            Μουσική: {composers}
                        </span>
                    </div>
                {/if}
                
                {#if lyricists && lyricists !== composers}
                    <div class="flex items-center space-x-2 sm:col-span-2">
                        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                        <span class="text-sm text-gray-600 truncate" title={lyricists}>
                            Στίχοι: {lyricists}
                        </span>
                    </div>
                {/if}
            </div>
            
            <!-- Tonality and Actions -->
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    {#if song.tonality}
                        <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {song.tonality}
                        </span>
                    {/if}
                    <button 
                        on:click={toggleLyrics}
                        class="inline-flex items-center space-x-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-all hover:bg-indigo-50 px-2 py-1 rounded-md"
                    >
                        <svg 
                            class="w-4 h-4 transition-transform duration-200 {showLyrics ? 'rotate-180' : ''}" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                        <span>{showLyrics ? 'Απόκρυψη' : 'Στίχοι'}</span>
                    </button>
                </div>
                <div class="flex items-center space-x-2">
                    {#if song.youtubeLink && song.youtubeLink !== '#'}
                        <button 
                            on:click={openYoutube}
                            class="p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            title="Άνοιγμα στο YouTube"
                        >
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    {/if}
                    <button class="p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                        <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Expandable Lyrics -->
            {#if showLyrics && song.lyrics}
                <div class="mt-4 pt-4 border-t border-gray-200 animate-in">
                    <div class="lyrics-text bg-gray-50 rounded-lg p-4 sm:p-5">
                        <pre class="font-sans text-gray-800 whitespace-pre-wrap break-words">{song.lyrics}</pre>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .song-card {
        container-type: inline-size;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: slideDown 0.3s ease-out;
    }
    
    .lyrics-text {
        font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    }
    
    .lyrics-text pre {
        font-size: 1rem;
        line-height: 1.8;
        letter-spacing: 0.02em;
    }
    
    /* Mobile: Still readable but slightly smaller */
    @container (max-width: 640px) {
        .song-card {
            font-size: 0.95rem;
        }
        
        .lyrics-text pre {
            font-size: 0.9375rem; /* 15px - still very readable on mobile */
            line-height: 1.75;
        }
    }
    
    /* Large screens: Even bigger for easier reading */
    @container (min-width: 1024px) {
        .lyrics-text pre {
            font-size: 1.0625rem; /* 17px */
            line-height: 1.85;
        }
    }
</style>