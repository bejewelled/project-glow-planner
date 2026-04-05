import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createUserStore() {
  const stored = browser ? localStorage.getItem('edc_user') : null;
  const initial = stored ? JSON.parse(stored) : null;
  const { subscribe, set } = writable(initial);

  return {
    subscribe,
    login(user) {
      if (browser) localStorage.setItem('edc_user', JSON.stringify(user));
      set(user);
    },
    logout() {
      if (browser) localStorage.removeItem('edc_user');
      set(null);
    }
  };
}

export const currentUser = createUserStore();
