<script>
  import ArtistCard from './ArtistCard.svelte';

  let { day, stage, artists, preferences = {}, onPreferenceChange } = $props();
</script>

<div class="column">
  <h3 class="stage-name">{stage}</h3>
  <div class="artists">
    {#each artists as artist}
      <ArtistCard
        {day}
        {stage}
        {artist}
        preferences={preferences[`${day}__${stage}__${artist}`] ?? []}
        {onPreferenceChange}
      />
    {/each}
  </div>
</div>

<style>
  .column {
    display: flex;
    flex-direction: column;
    width: max-content;
  }

  .stage-name {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #c084fc;
    margin: 0 0 0.6rem;
    padding: 0.4rem 0.75rem;
    background: #1e0a3c55;
    border: 1px solid #c084fc33;
    border-radius: 6px;
    text-align: center;
    white-space: nowrap;
  }

  .artists {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: stretch;
  }

  .artists :global(.card) {
    width: 100%;
    min-width: unset;
    box-sizing: border-box;
  }
</style>
