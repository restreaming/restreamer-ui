import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePages } from '@kingironman2011/vite-pages';

export default defineConfig({
	base: '/',
	plugins: [react(), vitePages()],
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
	build: {
		chunkSizeWarningLimit: 4000,
	}
});
