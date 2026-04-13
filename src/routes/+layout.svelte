<script>
  import { currentUser } from '$lib/stores.js';
  import LoginModal from '$lib/components/LoginModal.svelte';

  let { children } = $props();
  let showModal = $state(false);
</script>

<div class="app">
  <header>
    <div class="brand">
      <span class="logo">⚡</span>
      <span class="title">Project Glow Preferences</span>
    </div>
    <div class="user-area">
      {#if $currentUser}
        <span class="username">{$currentUser.name}</span>
        <button class="logout-btn" onclick={() => currentUser.logout()}>Log out</button>
      {:else}
        <button class="login-btn" onclick={() => (showModal = true)}>Edit / New Prefs</button>
      {/if}
    </div>
  </header>

  <main>
    {@render children()}
  </main>
</div>

{#if showModal}
  <LoginModal onClose={() => (showModal = false)} />
{/if}

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; }
  :global(body) {
    margin: 0;
    background: #0a0a1a;
    color: #e2d9f3;
    font-family: 'Inter', system-ui, sans-serif;
    min-height: 100vh;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background: #0f0f22;
    border-bottom: 1px solid #2a2a4a;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo { font-size: 1.3rem; }

  .title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #c084fc;
    letter-spacing: 0.02em;
  }

  .user-area {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .username {
    font-size: 0.9rem;
    color: #a78bfa;
    font-weight: 500;
  }

  .login-btn, .logout-btn {
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    border: 1px solid #c084fc;
    background: transparent;
    color: #c084fc;
    transition: all 0.15s;
  }

  .login-btn:hover { background: #c084fc22; }

  .logout-btn {
    border-color: #555;
    color: #888;
  }

  .logout-btn:hover { color: #ccc; border-color: #888; }

  main {
    flex: 1;
    padding: 1.25rem 1.5rem;
  }
</style>
