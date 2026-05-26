import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4197 --strictPort',
		timeout: 120_000,
		url: 'http://127.0.0.1:4197'
	},
	use: { baseURL: 'http://127.0.0.1:4197' },
	testMatch: '**/*.e2e.{ts,js}'
});
