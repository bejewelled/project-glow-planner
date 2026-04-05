import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      external: [
        'kerberos',
        'gcp-metadata',
        'socks',
        'aws4',
        'mongodb-client-encryption',
        'snappy',
        '@mongodb-js/zstd',
        '@aws-sdk/credential-providers'
      ]
    }
  }
});
