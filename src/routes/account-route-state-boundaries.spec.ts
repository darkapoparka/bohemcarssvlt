import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const routeSource = (routeFile: string) =>
	readFileSync(new URL(routeFile, import.meta.url), 'utf-8');

describe('account route state boundaries', () => {
	it('loads dashboard recent data from the server state module, not the raw adapter', () => {
		const accountDashboard = routeSource('./account/+page.server.ts');
		const adminDashboard = routeSource('./admin/+page.server.ts');

		expect([accountDashboard, adminDashboard].join('\n')).not.toContain('auxero-account-data');
		expect(accountDashboard).toContain('getAccountDashboardRecentData');
		expect(adminDashboard).toContain('getAccountDashboardRecentData');
	});

	it('loads message thread data from the server state module, not the raw adapter', () => {
		const routes = [
			routeSource('./account/messages/+page.server.ts'),
			routeSource('./admin/messages/+page.server.ts'),
			routeSource('./admin/inquiries/+page.server.ts')
		];
		const joinedRoutes = routes.join('\n');

		expect(joinedRoutes).not.toContain('auxero-account-data');
		expect(joinedRoutes).toContain('getAccountMessageThreadData');
	});
});
