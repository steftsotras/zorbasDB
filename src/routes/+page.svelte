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
    
    // Filter states
    let selectedYear = "";
    let selectedSinger = "";
    let selectedComposer = "";
    
    // Available filter options
    let availableYears: string[] = [];
    let availableSingers: string[] = [];
    let availableComposers: string[] = [];
    let showFilters = true; // Open by default
    
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
            
            // Extract and clean filter options
            availableYears = [...new Set(songs.map(s => s.year).filter(Boolean))].sort();
            
            // Clean and deduplicate singers - remove empty strings and trim whitespace
            const allSingers = [
                ...songs.map(s => s.singer1),
                ...songs.map(s => s.singer2),
                ...songs.map(s => s.singer3)
            ].filter(Boolean)
             .map(s => s.trim())
             .filter(s => s && s !== '');
            availableSingers = [...new Set(allSingers)].sort((a, b) => 
                a.localeCompare(b, 'el')
            );
            
            // Clean and deduplicate composers
            const allComposers = [
                ...songs.map(s => s.composer1),
                ...songs.map(s => s.composer2)
            ].filter(Boolean)
             .map(s => s.trim())
             .filter(s => s && s !== '');
            availableComposers = [...new Set(allComposers)].sort((a, b) => 
                a.localeCompare(b, 'el')
            );
            
            // Get and log statistics
            const stats = getSongStatistics(songs);
            console.log('Song collection statistics:', stats);
        } catch (error) {
            console.error('Error loading songs:', error);
        }
    });
    
    // Search and filter functionality
    function applyFilters() {
        let results = [...songs];
        
        // Apply search
        if (searchQuery.trim()) {
            results = searchSongs(results, searchQuery);
        }
        
        // Apply year filter
        if (selectedYear) {
            results = results.filter(s => s.year === selectedYear);
        }
        
        // Apply singer filter - check trimmed values
        if (selectedSinger) {
            results = results.filter(s => 
                s.singer1?.trim() === selectedSinger || 
                s.singer2?.trim() === selectedSinger || 
                s.singer3?.trim() === selectedSinger
            );
        }
        
        // Apply composer filter - check trimmed values
        if (selectedComposer) {
            results = results.filter(s => 
                s.composer1?.trim() === selectedComposer || 
                s.composer2?.trim() === selectedComposer
            );
        }
        
        filteredSongs = results;
    }
    
    // Debounce search
    let searchTimeout: NodeJS.Timeout;
    function debounceSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    }
    
    // Clear all filters
    function clearFilters() {
        searchQuery = "";
        selectedYear = "";
        selectedSinger = "";
        selectedComposer = "";
        applyFilters();
    }
    
    // Check if any filters are active
    $: hasActiveFilters = searchQuery || selectedYear || selectedSinger || selectedComposer;
    
    // React to filter changes
    $: searchQuery, debounceSearch();
    $: selectedYear, selectedSinger, selectedComposer, applyFilters();
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
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Zorbas DB</h1>
            </div>
            
            <div class="flex items-center space-x-2 sm:space-x-3">
                <span class="text-sm text-gray-500 hidden sm:inline">
                    {filteredSongs.length} / {totalSongs}
                </span>
                <button
                    on:click={() => showFilters = !showFilters}
                    class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors {showFilters ? 'bg-gray-100' : ''}"
                    title="Φίλτρα"
                >
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                        </path>
                    </svg>
                    {#if hasActiveFilters}
                        <span class="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
                    {/if}
                </button>
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
    
    <!-- Filters Section -->
    {#if showFilters}
        <div class="border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div class="flex flex-wrap gap-2 items-center">
                    <!-- Year Filter -->
                    <select
                        bind:value={selectedYear}
                        class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Όλα τα έτη</option>
                        {#each availableYears as year}
                            <option value={year}>{year}</option>
                        {/each}
                    </select>
                    
                    <!-- Singer Filter -->
                    <select
                        bind:value={selectedSinger}
                        class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[180px]"
                    >
                        <option value="">Όλοι οι τραγουδιστές</option>
                        {#each availableSingers as singer}
                            <option value={singer} title={singer}>{singer}</option>
                        {/each}
                    </select>
                    
                    <!-- Composer Filter -->
                    <select
                        bind:value={selectedComposer}
                        class="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[180px]"
                    >
                        <option value="">Όλοι οι συνθέτες</option>
                        {#each availableComposers as composer}
                            <option value={composer} title={composer}>{composer}</option>
                        {/each}
                    </select>
                    
                    {#if hasActiveFilters}
                        <button
                            on:click={clearFilters}
                            class="text-sm px-3 py-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-1"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span>Καθαρισμός</span>
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</header>

<!-- Main Content -->
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {#if filteredSongs.length > 0}
        <div class="virtual-scroll-wrapper {showFilters ? 'h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]' : 'h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]'}">
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
    
    .virtual-scroll-wrapper {
        transition: height 0.3s ease;
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
    
    /* Select dropdown styling */
    select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
    }
    
    select option {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>