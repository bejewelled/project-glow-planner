<script>
  import { currentUser } from '$lib/stores.js';

  let { onClose } = $props();

  let mode = $state('login'); // 'login' | 'register'
  let name = $state('');
  let pin = $state('');
  let error = $state('');
  let loading = $state(false);
  let showPin = $state(false);

  async function submit() {
    error = '';
    if (!name.trim()) { error = 'Please enter your name.'; return; }
    if (!/^\d{4}$/.test(pin)) { error = 'PIN must be exactly 4 digits.'; return; }

    loading = true;
    try {
      const endpoint = mode === 'login' ? '/api/auth' : '/api/members';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), pin })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        error = 'Server error. Please try again.';
        return;
      }

      if (!res.ok) {
        error = data.error || 'Something went wrong. Please try again.';
        return;
      }

      currentUser.login(data);
      onClose();
    } catch {
      error = 'Network error. Please check your connection and try again.';
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') onClose();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay" onkeydown={handleKeydown}>
  <div class="modal">
    <button class="close-btn" onclick={onClose} aria-label="Close">✕</button>

    <h2>{mode === 'login' ? 'Edit Prefs' : 'New Prefs'}</h2>

    {#if mode === 'login'}
      <p class="hint">If you have not added yourself as a user yet, go to "New Prefs" instead.</p>
    {/if}

    <div class="tabs">
      <button class:active={mode === 'login'} onclick={() => { mode = 'login'; error = ''; }}>Edit Prefs</button>
      <button class:active={mode === 'register'} onclick={() => { mode = 'register'; error = ''; }}>New Prefs</button>
    </div>

    <label>
      Name
      <input type="text" bind:value={name} placeholder="Your name" autocomplete="off" />
    </label>

    <label>
      4-digit PIN
      <div class="pin-row">
        <input
          type={showPin ? 'text' : 'password'}
          inputmode="numeric"
          maxlength="4"
          bind:value={pin}
          placeholder="••••"
          autocomplete="current-password"
        />
        <button type="button" class="show-pin-btn" onclick={() => (showPin = !showPin)} aria-label="Toggle PIN visibility">
          {showPin ? '🙈' : '👁'}
        </button>
      </div>
    </label>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button class="submit-btn" onclick={submit} disabled={loading}>
      {loading ? 'Loading…' : mode === 'login' ? 'Edit Prefs' : 'New Prefs'}
    </button>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: #1a1a2e;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 360px;
    position: relative;
    color: #fff;
  }

  h2 {
    margin: 0 0 1.25rem;
    font-size: 1.4rem;
    color: #c084fc;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #888;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }

  .close-btn:hover { color: #fff; }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .tabs button {
    flex: 1;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #444;
    background: transparent;
    color: #aaa;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.15s;
  }

  .tabs button.active {
    background: #c084fc22;
    border-color: #c084fc;
    color: #c084fc;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #bbb;
  }

  .pin-row {
    display: flex;
    gap: 0.4rem;
    align-items: center;
  }

  .pin-row input {
    flex: 1;
    min-width: 0;
  }

  .show-pin-btn {
    background: #0f0f1a;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.5rem 0.55rem;
    cursor: pointer;
    font-size: 0.9rem;
    line-height: 1;
    flex-shrink: 0;
    transition: border-color 0.15s;
  }

  .show-pin-btn:hover { border-color: #c084fc; }

  input {
    background: #0f0f1a;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.6rem 0.75rem;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.15s;
  }

  input:focus { border-color: #c084fc; }

  .hint {
    font-size: 0.8rem;
    color: #888;
    margin: -0.5rem 0 0.75rem;
    line-height: 1.4;
  }

  .error {
    color: #f87171;
    font-size: 0.85rem;
    margin: 0 0 1rem;
  }

  .submit-btn {
    width: 100%;
    padding: 0.75rem;
    background: #c084fc;
    color: #0f0f1a;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .submit-btn:hover:not(:disabled) { background: #a855f7; }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
