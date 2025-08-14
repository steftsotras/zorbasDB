<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { VirtualScroll } from "svelte-virtual-scroll-list";
    import SongCard from "$lib/components/SongCard.svelte";
    import type { Song, RawSongData } from "$lib/types/song";
    import { onMount } from "svelte";
    
    let songs: Song[] = [];
    let list: VirtualScroll;
    let searchQuery = "";
    let filteredSongs: Song[] = [];
    let totalSongs = 0;
    
    // Import data utilities
    import { 
        loadSongsFromFile, 
        searchSongs, 
        getSongStatistics 
    } from "$lib/data/songs";
    
    // Load songs data
    onMount(async () => {
        try {
            // Load songs from your JSON file
            // Place your songs.json in src/lib/data/songs.json
            songs = await loadSongsFromFile();
            
            // If no songs loaded from file, use sample data for demo
            if (songs.length === 0) {
                // Sample data for demonstration
                const { processSongs } = await import("$lib/data/songs");
                const sampleData: RawSongData[] = [
                    {
                        "Τίτλος τραγουδιού": "ΑΓΑΠΑ ΤΗ ΜΑΝΟΥΛΑ ΜΟΥ",
                        "Στίχοι του τραγουδιού": "Δεν αγαπάς τη μάνα μου...",
                        "ΤΟΝΙΚΗ": "ΦΑ-",
                        "LINK_YOUTUBE": "#https://youtu.be/XdvcQoNAGkI?si=oSvIm-Yq6p2kI57I#",
                        "Musicpath": "#path#",
                        "Συνθέτης_1": "Κώστας Σκαρβέλης",
                        "Στιχουργός_1": "Κώστας Σκαρβέλης",
                        "Τραγουδιστής_1": "Στελλάκης Περπινιάδης",
                        "Έτος": "1936"
                    },
                    {
                        "Τίτλος τραγουδιού": "ΑΓΑΠΗΣΑ ΚΑΙ ΜΙΣΗΣΑ",
                        "Στίχοι του τραγουδιού": "Πρωί και βράδυ στη ζωή...",
                        "ΤΟΝΙΚΗ": "ΦΑ Χιτζαζ",
                        "LINK_YOUTUBE": "#https://youtu.be/bGWx239XrBs?si=u6465OyLeP63vrCf#",
                        "Musicpath": "#path#",
                        "Συνθέτης_1": "Πάνος Πετσάς",
                        "Στιχουργός_1": "Κώστας Κοφινιώτης",
                        "Τραγουδιστής_1": "Στράτος Παγιουμτζής",
                        "Έτος": "1950"
                    }
                ];
                songs = processSongs(sampleData);
            }
            
            filteredSongs = [...songs];
            totalSongs = songs.length;
            
            // Get and log statistics
            const stats = getSongStatistics(songs);
            console.log('Song collection statistics:', stats);
        } catch (error) {
            console.error('Error loading songs:', error);
        }
    });
    
    // Search functionality
    function handleSearch() {
        filteredSongs = searchSongs(songs, searchQuery);
    }
    
    // Debounce search
    let searchTimeout: NodeJS.Timeout;
    function debounceSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(handleSearch, 300);
    }
    
    $: searchQuery, debounceSearch();
</script>

<!-- Header -->
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
            <div class="flex items-center space-x-3">
                <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3">
                    </path>
                </svg>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Ρεμπέτικα</h1>
            </div>
            
            <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-500 hidden sm:inline">
                    {filteredSongs.length} / {totalSongs} τραγούδια
                </span>
                <div class="relative">
                    <input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Αναζήτηση..."
                        class="w-32 sm:w-48 px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                        </path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- Main Content -->
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {#if filteredSongs.length > 0}
        <div class="virtual-scroll-wrapper h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
            <VirtualScroll
                bind:this={list}
                data={filteredSongs}
                key="uniqueKey"
                let:data
            >
                <div slot="header" class="text-center py-4 text-gray-500 text-sm">
                    <p>Συλλογή {totalSongs} Ρεμπέτικων Τραγουδιών</p>
                </div>
                
                <SongCard song={data} height={data.height} />
                
                <div slot="footer" class="text-center py-8 text-gray-400 text-sm">
                    <p>♪ ♫ ♪</p>
                </div>
            </VirtualScroll>
        </div>
    {:else if searchQuery}
        <div class="flex flex-col items-center justify-center h-[50vh] text-gray-500">
            <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h-.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
            </svg>
            <p class="text-lg">Δεν βρέθηκαν τραγούδια</p>
            <p class="text-sm mt-2">Δοκιμάστε διαφορετική αναζήτηση</p>
        </div>
    {:else}
        <div class="flex items-center justify-center h-[50vh]">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    {/if}
</main>

<!-- Floating Action Buttons -->
<div class="fixed bottom-6 right-6 flex flex-col space-y-3">
    <button 
        on:click={() => list?.scrollToOffset(0)}
        class="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all group"
        title="Πάνω"
    >
        <svg class="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M5 10l7-7m0 0l7 7m-7-7v18">
            </path>
        </svg>
    </button>
    
    <button 
        on:click={() => list?.scrollToBottom()}
        class="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all group"
        title="Κάτω"
    >
        <svg class="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3">
            </path>
        </svg>
    </button>
</div>

<style>
    :global(body) {
        background: linear-gradient(to bottom right, #f8fafc, #f3f4f6);
        min-height: 100vh;
    }
    
    .virtual-scroll-wrapper :global(.virtual-scroll-wrapper) {
        overflow-y: auto;
    }
    
    .virtual-scroll-wrapper :global(.virtual-scroll-item) {
        padding-left: 0;
        padding-right: 0;
    }
    
    /* Custom scrollbar */
    .virtual-scroll-wrapper :global(.virtual-scroll-wrapper::-webkit-scrollbar) {
        width: 6px;
    }
    
    .virtual-scroll-wrapper :global(.virtual-scroll-wrapper::-webkit-scrollbar-track) {
        background: #f3f4f6;
        border-radius: 9999px;
    }
    
    .virtual-scroll-wrapper :global(.virtual-scroll-wrapper::-webkit-scrollbar-thumb) {
        background: #9ca3af;
        border-radius: 9999px;
    }
    
    .virtual-scroll-wrapper :global(.virtual-scroll-wrapper::-webkit-scrollbar-thumb:hover) {
        background: #6b7280;
    }
</style>