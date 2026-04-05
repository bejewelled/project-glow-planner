<script>
  import { onMount } from 'svelte';
  import { ARTISTS, STAGES, DAYS } from '$lib/data/artists.js';
  import StageColumn from '$lib/components/StageColumn.svelte';

  let activeDay = $state('FRIDAY');
  let preferences = $state({});
  let loading = $state(true);

  const DAY_LABELS = { FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday' };

  async function loadPreferences() {
    const res = await fetch('/api/preferences');
    preferences = await res.json();
    loading = false;
  }

  onMount(loadPreferences);
</script>

<svelte:head>
  <title>EDC 2026 Preferences</title>
</svelte:head>

<div class="page">
  <div class="day-tabs">
    {#each DAYS as day}
      <button
        class="day-tab"
        class:active={activeDay === day}
        onclick={() => (activeDay = day)}
      >
        {DAY_LABELS[day]}
      </button>
    {/each}
  </div>

  {#if loading}
    <p class="loading">Loading…</p>
  {:else}
    <div class="grid">
      {#each STAGES as stage}
        {#if ARTISTS[activeDay][stage]?.length}
          <StageColumn
            day={activeDay}
            {stage}
            artists={ARTISTS[activeDay][stage]}
            {preferences}
            onPreferenceChange={loadPreferences}
          />
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .day-tabs {
    display: flex;
    gap: 0.5rem;
  }

  .day-tab {
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    border: 1px solid #2a2a4a;
    background: transparent;
    color: #aaa;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.03em;
  }

  .day-tab.active {
    background: #1e0a3c;
    border-color: #c084fc;
    color: #c084fc;
  }

  .day-tab:hover:not(.active) {
    border-color: #555;
    color: #ddd;
  }

  .loading {
    color: #666;
    font-style: italic;
  }

  .grid {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 1rem;
    align-items: flex-start;
    width: max-content;
  }

  .grid::-webkit-scrollbar {
    height: 6px;
  }

  .grid::-webkit-scrollbar-track {
    background: #0f0f22;
    border-radius: 3px;
  }

  .grid::-webkit-scrollbar-thumb {
    background: #3a3a6a;
    border-radius: 3px;
  }
</style>
