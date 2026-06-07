import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const routeSource = (routeFile: string) =>
	readFileSync(new URL(routeFile, import.meta.url), 'utf-8');

describe('account route state boundaries', () => {
	it('loads dashboard recent data from the server state module, not the raw adapter', () => {
		const accountDashboard = routeSource('./account/+page.server.ts');
		const adminDashboard = routeSource('./admin/+page.server.ts');

		expect([accountDashboard, adminDashboard].join('\n')).not.toContain('auxero-account-data');
		expect(accountDashboard).toContain('getAccountDashboardPageData');
		expect(adminDashboard).toContain('getAccountDashboardPageData');
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

	it('keeps account raw adapter exports scoped to compatibility rendering', () => {
		const adapterSource = routeSource('../lib/server/auxero-account-data.ts');

		expect(adapterSource).toContain('applyAccountTemplateData');
		expect(adapterSource).toContain('getAuxeroAccountRuntimeData');
		expect(adapterSource).not.toMatch(
			/export const getAuxero(?:Dashboard|Message|Account(?:Listings|Profile|Password|ListingForm)|User)/
		);
	});
});
