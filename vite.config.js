import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePages } from '@kingironman2011/vite-pages';

export default defineConfig({
	base: '/',
	plugins: [react(), vitePages()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/setupTests.js'],
		coverage: {
			provider: 'v8',
		},
	},
	server: {
		host: true,
		port: 3000,
		hmr: {
			protocol: 'ws',
			host: 'localhost',
			port: 3000,
			clientPort: 3000,
		},
		watch: {
			usePolling: true,
		},
	},
});
