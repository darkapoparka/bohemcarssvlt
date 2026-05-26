export const bohemcarsRoles = ['customer', 'agent', 'admin'] as const;

export type BohemcarsRole = (typeof bohemcarsRoles)[number];

export const isBohemcarsRole = (value: unknown): value is BohemcarsRole =>
	typeof value === 'string' && bohemcarsRoles.includes(value as BohemcarsRole);

export const normalizeBohemcarsRole = (value: unknown): BohemcarsRole | undefined => {
	const normalized = typeof value === 'string' ? value.toLowerCase() : undefined;

	return isBohemcarsRole(normalized) ? normalized : undefined;
};

export const defaultRoleForBohemcarsRoute = (routePath = ''): BohemcarsRole => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	if (normalized.startsWith('admin')) return 'admin';
	if (normalized.startsWith('agent')) return 'agent';

	return 'customer';
};

export const canRoleAccessBohemcarsRoute = (role: BohemcarsRole, routePath = '') => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	if (!normalized.startsWith('admin')) return true;
	if (role === 'admin') return true;

	return role === 'agent' && (normalized === 'admin/inquiries' || normalized === 'admin/messages');
};

export const bohemcarsRoleLabel = (role: BohemcarsRole) => {
	if (role === 'admin') return 'Admin';
	if (role === 'agent') return 'Agent';

	return 'Customer';
};
