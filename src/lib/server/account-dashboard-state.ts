import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';
import { agents } from '$lib/data/agents';
import { vehicles } from '$lib/data/vehicles';
import {
	bohemcarsRoleLabel,
	resolveBohemcarsSession,
	type BohemcarsRole,
	type BohemcarsSession
} from './auth';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { getBohemcarsGarageState } from './garage';
import { listInquiriesForRole } from './inquiries';
import { listVehicleSubmissions } from './inventory';
import { listMessagesForRole } from './messages';

export type AccountContext = {
	active: string;
	basePath: '/account' | '/admin';
	isAdmin: boolean;
	roleLabel: string;
	session: BohemcarsSession;
};

export type DashboardStat = {
	href: string;
	icon: string;
	id: string;
	label: string;
	value: string;
};

type RecentDashboardItem = {
	avatarRole: BohemcarsRole;
	body: string;
	date: string;
	name: string;
	title: string;
};

export const accountAvatarByRole: Record<BohemcarsRole, string> = {
	admin: '/assets/bohemcars/team/avatar-sales.jpg',
	agent: agents[1]?.image ?? '/assets/bohemcars/team/avatar-logistics.jpg',
	customer: '/assets/bohemcars/team/avatar-inspection.jpg'
};

export const formatDashboardDate = (value: string, fallback = 'Today') => {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return fallback;

	return date.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
};

export const activeRouteForAccountTemplate = (templateFile: string, routePath = '') => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	if (normalized.endsWith('favorites')) return 'favorites';
	if (normalized.endsWith('compare')) return 'compare';
	if (normalized.endsWith('inquiries')) return 'inquiries';
	if (normalized.endsWith('messages')) return 'messages';
	if (normalized.endsWith('profile')) return 'profile';
	if (normalized.endsWith('password')) return 'password';
	if (normalized.includes('inventory/edit/')) return 'add';
	if (normalized.endsWith('inventory/new') || templateFile === 'add-listings-2.html') return 'add';
	if (normalized.endsWith('inventory') || normalized.endsWith('listings')) return 'listings';
	if (normalized.endsWith('agents')) return 'agents';
	if (normalized.endsWith('users')) return 'users';

	return 'dashboard';
};

export const accountContext = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
): AccountContext => {
	const routePath = options.routePath ?? '';
	const session = options.session ?? resolveBohemcarsSession(routePath, options.searchParams);
	const isAdmin = routePath.replace(/^\/+/, '').startsWith('admin');

	return {
		active: activeRouteForAccountTemplate(templateFile, routePath),
		basePath: isAdmin ? '/admin' : '/account',
		isAdmin,
		roleLabel: bohemcarsRoleLabel(session.role),
		session
	};
};

export const accountDashboardStatsData = (context: AccountContext): DashboardStat[] => {
	const inquiryCount = listInquiriesForRole(
		context.isAdmin ? 'admin' : context.session.role
	).length;
	const messageCount = listMessagesForRole(context.session.role).length;
	const submissionCount = listVehicleSubmissions().length;
	const garage = context.isAdmin ? undefined : getBohemcarsGarageState(context.session);

	return context.isAdmin
		? [
				{
					href: '/admin/inventory',
					icon: '/assets/images/dashboard/car.svg',
					id: 'inventory',
					label: 'Inventory',
					value: String(vehicles.length)
				},
				{
					href: '/admin/inquiries',
					icon: '/assets/images/dashboard/clockCountdown.svg',
					id: 'inquiries',
					label: 'Open Leads',
					value: String(inquiryCount)
				},
				{
					href: '/admin/messages',
					icon: '/assets/images/dashboard/chats.svg',
					id: 'messages',
					label: 'Messages',
					value: String(messageCount)
				},
				{
					href: '/admin/agents',
					icon: '/assets/images/dashboard/star.svg',
					id: 'agents',
					label: 'Agents',
					value: String(agents.length)
				}
			]
		: [
				{
					href: '/account/listings',
					icon: '/assets/images/dashboard/car.svg',
					id: 'submissions',
					label: 'Submitted Listings',
					value: String(submissionCount)
				},
				{
					href: '/account/messages',
					icon: '/assets/images/dashboard/clockCountdown.svg',
					id: 'messages',
					label: 'Open Conversations',
					value: String(messageCount)
				},
				{
					href: '/account/favorites',
					icon: '/assets/images/dashboard/star.svg',
					id: 'favorites',
					label: 'My Favorites',
					value: String(garage?.favorites.length ?? 0)
				},
				{
					href: '/account/compare',
					icon: '/assets/images/dashboard/chats.svg',
					id: 'compare',
					label: 'Compare List',
					value: String(garage?.compare.length ?? 0)
				}
			];
};

export const accountDashboardRecentData = (context: AccountContext): AuxeroDashboardRecentData => {
	const heading = context.isAdmin ? 'Recent Inquiries' : 'Recent Messages';
	const items: RecentDashboardItem[] = context.isAdmin
		? listInquiriesForRole('admin')
				.slice(0, 3)
				.map((inquiry) => ({
					avatarRole: inquiry.source === 'sell-your-car' ? 'agent' : context.session.role,
					body: inquiry.message,
					date: inquiry.createdAt,
					name: inquiry.contactName,
					title: inquiry.vehicleTitle ?? inquiry.source
				}))
		: listMessagesForRole(context.session.role)
				.slice(0, 3)
				.map((message) => ({
					avatarRole: 'agent' as BohemcarsRole,
					body: message.message,
					date: message.createdAt,
					name: message.threadId === 'bohemcars-sales' ? 'Bohemcars Sales' : message.authorName,
					title: message.vehicleSlug
						? (vehicles.find((vehicle) => vehicle.slug === message.vehicleSlug)?.title ??
							'Bohemcars vehicle')
						: message.threadId
				}));

	return {
		heading,
		items: items.map((item, index) => ({
			avatar: accountAvatarByRole[item.avatarRole],
			body: item.body,
			dateLabel: formatDashboardDate(item.date, `May ${20 + index}, 2026`),
			id: `${item.name}-${item.title}-${index}`,
			name: item.name,
			title: item.title
		}))
	};
};

export const getAccountDashboardRecentData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountDashboardRecentData(accountContext(templateFile, options));

export const getAccountDashboardStatsData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountDashboardStatsData(accountContext(templateFile, options));
