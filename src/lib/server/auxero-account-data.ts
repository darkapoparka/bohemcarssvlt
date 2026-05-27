import { agents } from '$lib/data/agents';
import type {
	AuxeroAccountListingRow,
	AuxeroAccountListingsData
} from '$lib/auxero/account-listings';
import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';
import type {
	AuxeroMessageBubble,
	AuxeroMessageContact,
	AuxeroMessageThreadData
} from '$lib/auxero/messages';
import type {
	AuxeroUserManagementData,
	AuxeroUserManagementRow
} from '$lib/auxero/user-management';
import type {
	AuxeroAccountPasswordFormData,
	AuxeroAccountProfileFormData
} from '$lib/auxero/account-forms';
import { bohemcarsAssets, bohemcarsBrand, bohemcarsContact } from '$lib/data/bohemcars';
import { vehicles, type Vehicle } from '$lib/data/vehicles';
import {
	bohemcarsRoleLabel,
	resolveBohemcarsSession,
	type BohemcarsRole,
	type BohemcarsSession
} from './auth';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { listInquiriesForRole } from './inquiries';
import { listMessagesForRole } from './messages';
import { listInventoryForAdmin, listVehicleSubmissions } from './inventory';
import { listManagedUsers } from './users';
import { getBohemcarsGarageState } from './garage';

type AccountContext = {
	active: string;
	basePath: '/account' | '/admin';
	isAdmin: boolean;
	roleLabel: string;
	session: BohemcarsSession;
};

type DashboardStat = {
	href: string;
	icon: string;
	id: string;
	label: string;
	value: string;
};

type DashboardMenuItem = {
	badge?: number;
	href: string;
	icon: string;
	id: string;
	label: string;
};

type Conversation = Omit<AuxeroMessageContact, 'active'>;

type UserRow = {
	avatarRole: BohemcarsRole;
	email: string;
	id: string;
	kind: string;
	name: string;
	role: string;
	state: string;
	status: string;
};

type RecentDashboardItem = {
	avatarRole: BohemcarsRole;
	body: string;
	date: string;
	name: string;
	title: string;
};

const demoVehicleTitles = [
	'Audi A6 Avant E-Tron',
	'2024 Hyundai Elantra',
	'Kia EV9 2024',
	'Genesis Electrified G80',
	'Chevrolet Camaro 2020',
	'Audi R8'
] as const;

const accountAvatarByRole: Record<BohemcarsRole, string> = {
	admin: '/assets/bohemcars/team/avatar-sales.jpg',
	agent: agents[1]?.image ?? '/assets/bohemcars/team/avatar-logistics.jpg',
	customer: '/assets/bohemcars/team/avatar-inspection.jpg'
};

const dashboardIcon = '/assets/images/dashboard/Dashboard.svg';
const listingIcon = '/assets/images/dashboard/MyListing.svg';
const addListingIcon = '/assets/images/dashboard/AddListing.svg';
const favoritesIcon = '/assets/images/dashboard/MyFavorites.svg';
const reviewsIcon = '/assets/images/dashboard/MyReviews.svg';
const messagesIcon = '/assets/images/dashboard/Messages.svg';
const profileIcon = '/assets/images/dashboard/MyProfile.svg';
const passwordIcon = '/assets/images/dashboard/ChangePassword.svg';
const logoutIcon = '/assets/images/dashboard/Logout.svg';

const escapeHtml = (value: string | number) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const km = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

const hiddenInput = (name: string, value: string) =>
	`<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}">`;

const setInputValueByName = (html: string, name: string, value: string) =>
	html.replace(
		new RegExp(`(<input\\b(?=[^>]*\\bname="${name}")[^>]*\\bvalue=")[^"]*(")`, 'i'),
		(_match, before: string, after: string) => `${before}${escapeHtml(value)}${after}`
	);

const editListingIdFromRoute = (routePath = '') => {
	const match = routePath.replace(/^\/+|\/+$/g, '').match(/^admin\/inventory\/edit\/([^/]+)$/);

	if (!match) return undefined;

	try {
		return decodeURIComponent(match[1]);
	} catch {
		return match[1];
	}
};

const formatDashboardDate = (value: string, fallback = 'Today') => {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return fallback;

	return date.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
};

const findClosingDivIndex = (html: string, openDivIndex: number) => {
	const pattern = /<\/?div\b[^>]*>/gi;
	pattern.lastIndex = openDivIndex;
	let depth = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(html))) {
		if (match[0].startsWith('</')) {
			depth -= 1;
		} else {
			depth += 1;
		}

		if (depth === 0) return match.index + match[0].length;
	}

	return -1;
};

const replaceDivBlock = (html: string, start: number, replacement: string) => {
	if (start < 0) return html;

	const end = findClosingDivIndex(html, start);

	if (end < 0) return html;

	return `${html.slice(0, start)}${replacement}${html.slice(end)}`;
};

const replaceFirstDivAfter = (
	html: string,
	marker: string,
	blockStart: string,
	replacement: string
) => {
	const markerIndex = html.indexOf(marker);
	if (markerIndex < 0) return html;

	const start = html.indexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const replaceDivContaining = (
	html: string,
	marker: string,
	blockStart: string,
	replacement: string
) => {
	const markerIndex = html.indexOf(marker);
	if (markerIndex < 0) return html;

	const start = html.lastIndexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const addClassToFirstFormAfter = (
	html: string,
	marker: string,
	className: string,
	attributes = ''
) => {
	const markerIndex = html.indexOf(marker);
	const formStart = html.indexOf('<form action="#">', markerIndex);

	if (formStart < 0) return html;

	return `${html.slice(0, formStart)}<form action="#" class="${className}" novalidate${attributes}>${html.slice(
		formStart + '<form action="#">'.length
	)}`;
};

const activeRouteForTemplate = (templateFile: string, routePath = '') => {
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

const accountContext = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
): AccountContext => {
	const routePath = options.routePath ?? '';
	const session = options.session ?? resolveBohemcarsSession(routePath, options.searchParams);
	const isAdmin = routePath.replace(/^\/+/, '').startsWith('admin');

	return {
		active: activeRouteForTemplate(templateFile, routePath),
		basePath: isAdmin ? '/admin' : '/account',
		isAdmin,
		roleLabel: bohemcarsRoleLabel(session.role),
		session
	};
};

const menuItem = (
	context: AccountContext,
	id: string,
	href: string,
	icon: string,
	label: string,
	badge?: number
) => `<li>
	<a href="${href}" class="dashboard-menu-item ${context.active === id ? 'active' : ''}" data-bohemcars-menu-item="${escapeHtml(id)}">
		<img src="${icon}" alt="${escapeHtml(label)}">
		${escapeHtml(label)}
		${badge ? `<span class="number" data-bohemcars-menu-badge="${escapeHtml(id)}">${badge}</span>` : ''}
	</a>
</li>`;

const dashboardMenu = (context: AccountContext) => {
	const inquiryCount = listInquiriesForRole(
		context.session.role === 'agent' ? 'agent' : 'admin'
	).length;
	const messageCount = listMessagesForRole(context.session.role).length;
	const agentRoleQuery = context.session.role === 'agent' ? '?role=agent' : '';
	const items: DashboardMenuItem[] =
		context.isAdmin && context.session.role === 'agent'
			? [
					{
						badge: inquiryCount,
						href: `/admin/inquiries${agentRoleQuery}`,
						icon: reviewsIcon,
						id: 'inquiries',
						label: 'Inquiries'
					},
					{
						badge: messageCount,
						href: `/admin/messages${agentRoleQuery}`,
						icon: messagesIcon,
						id: 'messages',
						label: 'Messages'
					},
					{
						href: '/account/profile?role=agent',
						icon: profileIcon,
						id: 'profile',
						label: 'Profile'
					},
					{
						href: '/account/password?role=agent',
						icon: passwordIcon,
						id: 'password',
						label: 'Change Password'
					}
				]
			: context.isAdmin
				? [
						{ href: '/admin', icon: dashboardIcon, id: 'dashboard', label: 'Dashboard' },
						{
							href: '/admin/inventory',
							icon: listingIcon,
							id: 'listings',
							label: 'Inventory'
						},
						{
							href: '/admin/inventory/new',
							icon: addListingIcon,
							id: 'add',
							label: 'Add Listing'
						},
						{
							badge: inquiryCount,
							href: '/admin/inquiries',
							icon: reviewsIcon,
							id: 'inquiries',
							label: 'Inquiries'
						},
						{
							badge: messageCount,
							href: '/admin/messages',
							icon: messagesIcon,
							id: 'messages',
							label: 'Messages'
						},
						{ href: '/admin/agents', icon: profileIcon, id: 'agents', label: 'Agents' },
						{ href: '/admin/users', icon: favoritesIcon, id: 'users', label: 'Users' },
						{
							href: '/account/profile?role=admin',
							icon: profileIcon,
							id: 'profile',
							label: 'Profile'
						},
						{
							href: '/account/password?role=admin',
							icon: passwordIcon,
							id: 'password',
							label: 'Change Password'
						}
					]
				: [
						{ href: '/account', icon: dashboardIcon, id: 'dashboard', label: 'Dashboard' },
						{
							href: '/account/listings',
							icon: listingIcon,
							id: 'listings',
							label: 'My Listings'
						},
						{ href: '/sell-your-car', icon: addListingIcon, id: 'add', label: 'Submit Vehicle' },
						{
							href: '/account/favorites',
							icon: favoritesIcon,
							id: 'favorites',
							label: 'My Favorites'
						},
						{ href: '/account/compare', icon: reviewsIcon, id: 'compare', label: 'My Compare' },
						{
							badge: messageCount,
							href: '/account/messages',
							icon: messagesIcon,
							id: 'messages',
							label: 'Messages'
						},
						{ href: '/account/profile', icon: profileIcon, id: 'profile', label: 'My Profile' },
						{
							href: '/account/password',
							icon: passwordIcon,
							id: 'password',
							label: 'Change Password'
						}
					];

	return `<ul class="dashboard-menu">
	${items
		.map((item) => menuItem(context, item.id, item.href, item.icon, item.label, item.badge))
		.join('\n')}
	${menuItem(context, 'logout', '/', logoutIcon, 'Logout')}
</ul>`;
};

const accountDropdownItem = ({ href, icon, id, label }: DashboardMenuItem) => `<li>
	<a href="${href}" data-bohemcars-user-menu-item="${escapeHtml(id)}">
		<img src="${icon}" alt="${escapeHtml(label)}" width="24" height="24">
		${escapeHtml(label)}
	</a>
</li>`;

const accountDropdown = (context: AccountContext) => {
	const items: DashboardMenuItem[] =
		context.isAdmin && context.session.role === 'agent'
			? [
					{
						href: '/admin/inquiries?role=agent',
						icon: reviewsIcon,
						id: 'inquiries',
						label: 'Agent Inquiries'
					},
					{
						href: '/admin/messages?role=agent',
						icon: messagesIcon,
						id: 'messages',
						label: 'Agent Messages'
					},
					{
						href: '/account/profile?role=agent',
						icon: profileIcon,
						id: 'profile',
						label: 'Profile'
					},
					{
						href: '/account/password?role=agent',
						icon: passwordIcon,
						id: 'password',
						label: 'Change Password'
					}
				]
			: context.isAdmin
				? [
						{ href: '/admin', icon: dashboardIcon, id: 'dashboard', label: 'Admin Dashboard' },
						{ href: '/admin/inventory', icon: listingIcon, id: 'listings', label: 'Inventory' },
						{
							href: '/admin/inventory/new',
							icon: addListingIcon,
							id: 'add',
							label: 'Add Listing'
						},
						{ href: '/admin/messages', icon: messagesIcon, id: 'messages', label: 'Messages' },
						{
							href: '/account/profile?role=admin',
							icon: profileIcon,
							id: 'profile',
							label: 'Profile'
						}
					]
				: [
						{ href: '/account', icon: dashboardIcon, id: 'dashboard', label: 'Account Dashboard' },
						{
							href: '/account/listings',
							icon: listingIcon,
							id: 'listings',
							label: 'My Listings'
						},
						{
							href: '/account/favorites',
							icon: favoritesIcon,
							id: 'favorites',
							label: 'My Favorites'
						},
						{ href: '/account/compare', icon: reviewsIcon, id: 'compare', label: 'My Compare' },
						{ href: '/account/messages', icon: messagesIcon, id: 'messages', label: 'Messages' },
						{ href: '/account/profile', icon: profileIcon, id: 'profile', label: 'My Profile' }
					];

	return `<ul class="core-dropdown__list user-admin-links">
	${items.map(accountDropdownItem).join('\n')}
	${accountDropdownItem({ href: '/', icon: logoutIcon, id: 'logout', label: 'Logout' })}
</ul>`;
};

const replaceAccountDropdown = (html: string, context: AccountContext) =>
	html.replace(
		/<ul class="core-dropdown__list user-admin-links">[\s\S]*?<\/ul>/,
		accountDropdown(context)
	);

const applyRoleScopedAccountChrome = (html: string, context: AccountContext) => {
	if (!context.isAdmin || context.session.role !== 'agent') return html;

	return html
		.replaceAll('href="/admin/inventory/new"', 'href="/admin/inquiries?role=agent"')
		.replaceAll('Add Listing', 'Inquiries');
};

const applyAccountShell = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const listingHeading = context.isAdmin ? 'Bohemcars Inventory' : 'My Listings';

	const next = html
		.replaceAll('Bohemcars Admin', escapeHtml(context.session.name))
		.replaceAll(
			'/assets/images/dashboard/dashbroard_avatar.png',
			accountAvatarByRole[context.session.role]
		)
		.replaceAll('Dashboard', context.isAdmin ? 'Admin Dashboard' : 'Account Dashboard')
		.replaceAll('My Reviews', context.isAdmin ? 'Inquiries' : 'My Compare')
		.replaceAll('Recent Inquiries', context.isAdmin ? 'Recent Inquiries' : 'Recent Messages')
		.replaceAll('Lead Views', context.isAdmin ? 'Lead Views' : 'Saved Activity')
		.replaceAll('All Listing', listingHeading)
		.replaceAll('<p class="h4 mb-20">Inventory</p>', `<p class="h4 mb-20">${listingHeading}</p>`)
		.replace('</head>', `<meta name="bohemcars-role" content="${context.session.role}">\n</head>`);

	return applyRoleScopedAccountChrome(replaceAccountDropdown(next, context), context).replace(
		/<ul class="dashboard-menu">[\s\S]*?<\/ul>/,
		dashboardMenu(context)
	);
};

const statCards = (context: AccountContext) => {
	const inquiryCount = listInquiriesForRole(
		context.isAdmin ? 'admin' : context.session.role
	).length;
	const messageCount = listMessagesForRole(context.session.role).length;
	const submissionCount = listVehicleSubmissions().length;
	const garage = context.isAdmin ? undefined : getBohemcarsGarageState(context.session);
	const stats: DashboardStat[] = context.isAdmin
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

	return `<div class="grid grid-cols-4 xl-grid-cols-2 sm-grid-cols-1 gap-30 mb-30">
	${stats
		.map(
			(
				stat
			) => `<a href="${stat.href}" class="dashboard-cart" data-bohemcars-dashboard-stat="${escapeHtml(stat.id)}" data-bohemcars-stat-value="${escapeHtml(stat.value)}">
		<div>
			<p class="h7 font-weight-500 mb-4">${escapeHtml(stat.label)}</p>
			<p class="h3">${escapeHtml(stat.value)}</p>
		</div>
		<div class="icon">
			<img src="${stat.icon}" alt="${escapeHtml(stat.label)}">
		</div>
	</a>`
		)
		.join('\n')}
</div>`;
};

const inventoryListingRows = (source: Vehicle[]): AuxeroAccountListingRow[] =>
	source.map((vehicle) => ({
		actions: [
			{
				ariaLabel: `Edit ${vehicle.title}`,
				href: `/admin/inventory/edit/${encodeURIComponent(vehicle.slug)}`,
				icon: '/assets/images/dashboard/AddListing.svg',
				kind: 'edit-inventory',
				label: 'Edit Listing'
			},
			{
				ariaLabel: `Remove ${vehicle.title}`,
				icon: '/assets/icons/trash.svg',
				kind: 'remove',
				label: 'Remove Listing'
			}
		],
		columns: [vehicle.brand, String(vehicle.year), vehicle.transmission, vehicle.fuel],
		description: vehicle.description || bohemcarsContact.appointmentNote,
		href: `/inventory/${encodeURIComponent(vehicle.slug)}`,
		id: vehicle.slug,
		image: vehicle.image,
		kind: 'inventory',
		priceLabel: vehicle.priceLabel,
		title: vehicle.title
	}));

const submissionListingRows = (context: AccountContext): AuxeroAccountListingRow[] =>
	listVehicleSubmissions().map((submission) => ({
		actions: [
			{
				ariaLabel: `Edit ${submission.title}`,
				href: '/sell-your-car',
				icon: '/assets/images/dashboard/AddListing.svg',
				kind: 'edit-submission',
				label: 'Edit Submission'
			},
			{
				ariaLabel: 'Message Bohemcars',
				href: '/account/messages',
				icon: '/assets/images/dashboard/Messages.svg',
				kind: 'message',
				label: 'Message'
			}
		],
		columns: [
			submission.contactPhone,
			submission.expectedPrice,
			submission.mileage,
			submission.status
		],
		description: submission.message,
		id: submission.id,
		image: accountAvatarByRole[context.session.role],
		kind: 'submission',
		title: submission.title,
		titleMeta: submission.vin
	}));

const accountListingsData = (
	context: AccountContext,
	source: Vehicle[] = vehicles.slice(0, 5)
): AuxeroAccountListingsData =>
	context.isAdmin
		? {
				footerText: `Showing ${source.length} of ${vehicles.length} Bohemcars entries`,
				headers: ['Car', 'Brand', 'Year', 'Transmission', 'Fuel Type', 'Action'],
				isSubmissions: false,
				pagination: ['1', '2', '3'],
				rows: inventoryListingRows(source)
			}
		: {
				footerText: `Showing ${listVehicleSubmissions().length} Bohemcars sell-your-car submissions`,
				headers: ['Submission', 'Contact', 'Expected Price', 'Mileage', 'Status', 'Action'],
				isSubmissions: true,
				rows: submissionListingRows(context)
			};

const cartItem = (
	vehicle: Vehicle,
	editHref: string | ((vehicle: Vehicle) => string)
) => `<div class="cart-item" data-bohemcars-slug="${escapeHtml(vehicle.slug)}">
	<a href="/inventory/${encodeURIComponent(vehicle.slug)}" class="cart-item__product">
		<div class="cart-item__image">
			<img src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}">
		</div>
		<div class="cart-item__name">
			<p class="h4 clamp-1 clamp mb-8">${escapeHtml(vehicle.title)}</p>
			<p class="clamp-1 clamp text-secondary mb-12">${escapeHtml(vehicle.description || bohemcarsContact.appointmentNote)}</p>
			<p class="h5">${escapeHtml(vehicle.priceLabel)}</p>
		</div>
	</a>
	<div class="cart-item__price"><span class="price">${escapeHtml(vehicle.brand)}</span></div>
	<div class="cart-item__year"><span>${vehicle.year}</span></div>
	<div class="cart-item__total"><span>${escapeHtml(vehicle.transmission)}</span></div>
	<div><span>${escapeHtml(vehicle.fuel)}</span></div>
	<div class="cart-item__action">
		<a href="${typeof editHref === 'function' ? editHref(vehicle) : editHref}" class="hover-fill-white cart-item__edit action" aria-label="Edit ${escapeHtml(vehicle.title)}">
			<img src="/assets/images/dashboard/AddListing.svg" alt="edit">
			<p class="tooltip">Edit Listing</p>
		</a>
		<div class="hover-fill-white cart-item__remove action" role="button" tabindex="0" aria-label="Remove ${escapeHtml(vehicle.title)}">
			<img src="/assets/icons/trash.svg" alt="remove">
			<p class="tooltip">Remove Listing</p>
		</div>
	</div>
</div>`;

const cartWrapper = (source: Vehicle[], context: AccountContext) => {
	const editHref = context.isAdmin
		? (vehicle: Vehicle) => `/admin/inventory/edit/${encodeURIComponent(vehicle.slug)}`
		: '/sell-your-car';

	return `<div class="cart-wrapper bohemcars-account-listings" data-bohemcars-account-listings>
	<div class="cart-header">
		<div class="font-weight-600">Car</div>
		<div class="font-weight-600">Brand</div>
		<div class="font-weight-600">Year</div>
		<div class="font-weight-600">Transmission</div>
		<div class="font-weight-600">Fuel Type</div>
		<div class="font-weight-600">Action</div>
	</div>
	<div class="cart-items">
		${source.map((vehicle) => cartItem(vehicle, editHref)).join('\n')}
	</div>
	<div class="divider w-full mb-20"></div>
	<div class="flex justify-between items-center flex-wrap gap-12 pagination-bottom" id="pagination-bottom">
		<ul class="pagination">
			<li><a href="#" class="pagination__link active">1</a></li>
			<li><a href="#" class="pagination__link">2</a></li>
			<li><a href="#" class="pagination__link">3</a></li>
		</ul>
		<p class="text-secondary">Showing ${source.length} of ${vehicles.length} Bohemcars entries</p>
	</div>
</div>`;
};

const submissionCartWrapper = (context: AccountContext) => {
	const submissions = listVehicleSubmissions();

	return `<div class="cart-wrapper bohemcars-account-listings" data-bohemcars-account-listings data-bohemcars-submissions-table>
	<div class="cart-header">
		<div class="font-weight-600">Submission</div>
		<div class="font-weight-600">Contact</div>
		<div class="font-weight-600">Expected Price</div>
		<div class="font-weight-600">Mileage</div>
		<div class="font-weight-600">Status</div>
		<div class="font-weight-600">Action</div>
	</div>
	<div class="cart-items">
		${submissions
			.map(
				(
					submission
				) => `<div class="cart-item" data-bohemcars-submission-id="${escapeHtml(submission.id)}">
			<div class="cart-item__product">
				<div class="cart-item__image">
					<img src="${accountAvatarByRole[context.session.role]}" alt="${escapeHtml(submission.title)}">
				</div>
				<div class="cart-item__name">
					<p class="h4 clamp-1 clamp mb-8">${escapeHtml(submission.title)}</p>
					<p class="clamp-1 clamp text-secondary mb-12">${escapeHtml(submission.message)}</p>
					<p class="h5">${escapeHtml(submission.vin)}</p>
				</div>
			</div>
			<div class="cart-item__price"><span class="price">${escapeHtml(submission.contactPhone)}</span></div>
			<div class="cart-item__year"><span>${escapeHtml(submission.expectedPrice)}</span></div>
			<div class="cart-item__total"><span>${escapeHtml(submission.mileage)}</span></div>
			<div><span>${escapeHtml(submission.status)}</span></div>
			<div class="cart-item__action">
				<a href="/sell-your-car" class="hover-fill-white cart-item__edit action" aria-label="Edit ${escapeHtml(submission.title)}">
					<img src="/assets/images/dashboard/AddListing.svg" alt="edit">
					<p class="tooltip">Edit Submission</p>
				</a>
				<a href="/account/messages" class="hover-fill-white cart-item__edit action" aria-label="Message Bohemcars">
					<img src="/assets/images/dashboard/Messages.svg" alt="message">
					<p class="tooltip">Message</p>
				</a>
			</div>
		</div>`
			)
			.join('\n')}
	</div>
	<div class="divider w-full mb-20"></div>
	<p class="text-secondary">Showing ${submissions.length} Bohemcars sell-your-car submissions</p>
</div>`;
};

const userRows = (): UserRow[] =>
	listManagedUsers().map((user) => ({
		avatarRole: user.avatarRole,
		email: user.email,
		id: user.id,
		kind: user.kind,
		name: user.name,
		role: user.roleLabel,
		state: user.statusLabel,
		status: user.context
	}));

const userManagementRows = (): AuxeroUserManagementRow[] =>
	userRows().map((user) => ({
		actions: [
			{
				ariaLabel: `Message ${user.name}`,
				icon: '/assets/images/dashboard/Messages.svg',
				kind: 'message',
				label: 'Message'
			},
			{
				ariaLabel: `Review ${user.name}`,
				icon: '/assets/images/dashboard/MyReviews.svg',
				kind: 'review',
				label: 'Review'
			}
		],
		columns: [user.email, user.role, user.status, user.state],
		description: user.status,
		id: user.id,
		image: accountAvatarByRole[user.avatarRole],
		kind: user.kind,
		name: user.name,
		role: user.role
	}));

const userManagementData = (context: AccountContext): AuxeroUserManagementData => ({
	footerText: 'Role-aware prototype accounts and lead contacts managed by Bohemcars.',
	headers: ['User', 'Email', 'Role', 'Context', 'Status', 'Action'],
	rows: context.isAdmin ? userManagementRows() : []
});

const userManagementStats =
	() => `<div class="grid grid-cols-4 xl-grid-cols-2 sm-grid-cols-1 gap-30 mb-30">
	${[
		{
			href: '/admin/users',
			icon: '/assets/images/dashboard/MyProfile.svg',
			label: 'User Roles',
			value: String(userRows().length)
		},
		{
			href: '/admin/inquiries',
			icon: '/assets/images/dashboard/clockCountdown.svg',
			label: 'Open Leads',
			value: String(listInquiriesForRole('admin').length)
		},
		{
			href: '/admin/messages',
			icon: '/assets/images/dashboard/chats.svg',
			label: 'Message Threads',
			value: String(listMessagesForRole('admin').length)
		},
		{
			href: '/admin/agents',
			icon: '/assets/images/dashboard/star.svg',
			label: 'Agents',
			value: String(agents.length)
		}
	]
		.map(
			(stat) => `<a href="${stat.href}" class="dashboard-cart">
		<div>
			<p class="h7 font-weight-500 mb-4">${escapeHtml(stat.label)}</p>
			<p class="h3">${escapeHtml(stat.value)}</p>
		</div>
		<div class="icon">
			<img src="${stat.icon}" alt="${escapeHtml(stat.label)}">
		</div>
	</a>`
		)
		.join('\n')}
</div>`;

const userManagementTable =
	() => `<div class="cart-wrapper bohemcars-users-table" data-bohemcars-users-table>
	<div class="cart-header">
		<div class="font-weight-600">User</div>
		<div class="font-weight-600">Email</div>
		<div class="font-weight-600">Role</div>
		<div class="font-weight-600">Context</div>
		<div class="font-weight-600">Status</div>
		<div class="font-weight-600">Action</div>
	</div>
	<div class="cart-items">
		${userRows()
			.map(
				(
					user
				) => `<div class="cart-item" data-bohemcars-user-id="${escapeHtml(user.id)}" data-bohemcars-user-kind="${escapeHtml(user.kind)}" data-bohemcars-user-role="${escapeHtml(user.role.toLowerCase())}">
			<div class="cart-item__product">
				<div class="cart-item__image"><img src="${accountAvatarByRole[user.avatarRole]}" alt="${escapeHtml(user.name)}"></div>
				<div class="cart-item__name">
					<p class="h4 clamp-1 clamp mb-8">${escapeHtml(user.name)}</p>
					<p class="clamp-1 clamp text-secondary mb-12">${escapeHtml(user.status)}</p>
				</div>
			</div>
			<div class="cart-item__price"><span class="price">${escapeHtml(user.email)}</span></div>
			<div class="cart-item__year"><span>${escapeHtml(user.role)}</span></div>
			<div class="cart-item__total"><span>${escapeHtml(user.status)}</span></div>
			<div><span>${escapeHtml(user.state)}</span></div>
			<div class="cart-item__action">
				<a href="/admin/messages?role=admin" class="hover-fill-white cart-item__edit action" aria-label="Message ${escapeHtml(user.name)}">
					<img src="/assets/images/dashboard/Messages.svg" alt="message">
					<p class="tooltip">Message</p>
				</a>
				<a href="/admin/inquiries?role=admin" class="hover-fill-white cart-item__edit action" aria-label="Review ${escapeHtml(user.name)}">
					<img src="/assets/images/dashboard/MyReviews.svg" alt="review">
					<p class="tooltip">Review</p>
				</a>
			</div>
		</div>`
			)
			.join('\n')}
	</div>
	<div class="divider w-full mb-20"></div>
	<p class="text-secondary">Role-aware prototype accounts and lead contacts managed by Bohemcars.</p>
</div>`;

const userManagementNotes = () => `<div class="dashboard-box bg-white bohemcars-users-box">
	<p class="h4 mb-20">Role Access Notes</p>
	<div class="comments">
		<div class="comment-box">
			<p class="h5 mb-12">Admin</p>
			<p class="h7 line-height-28">Full access to inventory, inquiries, messages, agents, and users.</p>
		</div>
		<div class="comment-box">
			<p class="h5 mb-12">Agent</p>
			<p class="h7 line-height-28">Can work assigned inquiries and message threads without full admin access.</p>
		</div>
		<div class="comment-box">
			<p class="h5 mb-12">Customer</p>
			<p class="h7 line-height-28">Keeps favorites, compare list, messages, profile, password, and sell-car submissions.</p>
		</div>
	</div>
</div>`;

const dashboardRecentData = (context: AccountContext): AuxeroDashboardRecentData => {
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

const recentInquiriesBox = (context: AccountContext) => {
	const data = dashboardRecentData(context);

	return `<div class="dashboard-box bg-white bohemcars-inquiries-box" data-bohemcars-dashboard-recent>
	<p class="h4 mb-20">${data.heading}</p>
	<div class="comments">
		${data.items
			.map(
				(item) => `<div class="comment-box">
			<div class="comment-box__header gap-12 mb-24">
				<div class="comment-box__avatar">
					<img src="${escapeHtml(item.avatar)}" alt="${escapeHtml(item.name)}">
				</div>
				<div>
					<div class="text-secondary gap-4 pt-4">
						<p class="h5 mb-4">${escapeHtml(item.name)}</p>
						<p class="text-secondary text-sm">${escapeHtml(item.dateLabel)}</p>
					</div>
				</div>
			</div>
			<p class="h5 mb-12">${escapeHtml(item.title)}</p>
			<p class="h7 line-height-28">${escapeHtml(item.body)}</p>
		</div>`
			)
			.join('\n')}
	</div>
</div>`;
};

const favoriteCard = (vehicle: Vehicle, index: number) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;
	const tagClass = index % 2 === 0 ? 'bg-primary-2' : 'bg-green';

	return `<div class="card-box card-box-style-1" data-bohemcars-slug="${escapeHtml(vehicle.slug)}">
	<div class="top">
		<p class="${tagClass} text-white highlight">${escapeHtml(vehicle.tag ?? 'Available')}</p>
		<p class="heart bohemcars-favorite is-active" role="button" tabindex="0" aria-label="Remove ${escapeHtml(vehicle.title)}">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 5 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C14.1444 5 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z" stroke="white" fill="#d9f275"/></svg>
		</p>
	</div>
	<div class="image"><a href="${url}"><img class="card--img" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}"></a></div>
	<div class="content border-light border-top-none">
		<div class="bottom">
			<p class="category uppercase text-white"><a href="${url}" class="text-white uppercase text-xs">${escapeHtml(vehicle.brand)}</a></p>
			<div class="flex items-center gap-8">
				<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
				<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
			</div>
		</div>
		<p class="h6 card-box__title mb-8"><a href="${url}">${escapeHtml(vehicle.title)}</a></p>
		<ul class="tag mb-10">
			<li><img src="/assets/icons/icon-gauge.svg" alt="mileage"><span>${km(vehicle.mileage)}</span></li>
			<li><img src="/assets/icons/calendar.svg" alt="year"><span>${vehicle.year}</span></li>
			<li><img src="/assets/icons/gaspump.svg" alt="fuel"><span>${escapeHtml(vehicle.fuel)}</span></li>
			<li><img src="/assets/icons/auto.svg" alt="transmission"><span>${escapeHtml(vehicle.transmission)}</span></li>
		</ul>
		<p class="h6 card-box__price mb-15 flex justify-between gap-8 items-center">${escapeHtml(vehicle.priceLabel)}</p>
		<div class="divider mb-15"></div>
		<div class="flex justify-between">
			<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-bohemcars-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">Compare</p>
			<a href="${url}" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a>
		</div>
	</div>
</div>`;
};

const favoriteGrid = (context: AccountContext) => {
	const savedSlugs = getBohemcarsGarageState(context.session).favorites;
	const savedVehicles = savedSlugs
		.map((slug) => vehicles.find((vehicle) => vehicle.slug === slug))
		.filter((vehicle): vehicle is Vehicle => Boolean(vehicle));
	const content = savedVehicles.length
		? savedVehicles.map((vehicle, index) => favoriteCard(vehicle, index)).join('\n')
		: `<div class="dashboard-box bg-white" data-bohemcars-favorites-empty="true">
			<p class="h4 mb-8">No saved Bohemcars vehicles yet</p>
			<p class="text-secondary">Use the heart action on inventory cards to build your saved list.</p>
		</div>`;

	return `<div class="grid grid-cols-3 lg-grid-cols-2 md-grid-cols-1 gap-x-23 gap-y-30 mb-30" data-bohemcars-favorites-grid data-bohemcars-favorites-count="${savedVehicles.length}">
	${content}
</div>`;
};

const conversations = (context: AccountContext): Conversation[] => {
	const records = context.isAdmin
		? listInquiriesForRole(context.session.role === 'agent' ? 'agent' : 'admin').map(
				(inquiry, index) => ({
					avatar: accountAvatarByRole[index === 1 ? 'agent' : 'customer'],
					badge: inquiry.status === 'new' ? 1 : undefined,
					email: inquiry.contactEmail,
					id: inquiry.id,
					name: inquiry.contactName,
					preview: inquiry.vehicleTitle ?? inquiry.message,
					time: index === 2 ? 'Yesterday' : `${16 - index}:24`
				})
			)
		: listMessagesForRole(context.session.role).map((message, index) => ({
				avatar: accountAvatarByRole.agent,
				badge: message.status === 'open' ? 1 : undefined,
				email: bohemcarsContact.emailLabel,
				id: `${message.threadId}-${message.id}`,
				name: message.threadId === 'bohemcars-sales' ? 'Bohemcars Sales' : 'Bohemcars Admin',
				preview: message.message,
				time: index === 0 ? '16:24' : 'Yesterday'
			}));

	return records.slice(0, 3);
};

const fallbackConversation = (context: AccountContext): Conversation => ({
	avatar: accountAvatarByRole[context.isAdmin ? 'customer' : 'agent'],
	badge: context.isAdmin ? 1 : undefined,
	email: bohemcarsContact.emailLabel,
	id: context.isAdmin ? 'bohemcars-lead-queue' : 'bohemcars-sales',
	name: context.isAdmin ? 'Bohemcars Lead Queue' : 'Bohemcars Sales',
	preview: context.isAdmin
		? 'New Bohemcars inquiries will appear here.'
		: 'Your Bohemcars conversations will appear here.',
	time: 'Today'
});

const messageContactsData = (context: AccountContext): AuxeroMessageContact[] => {
	const records = conversations(context);
	const activeIndex = records.length > 1 ? 1 : 0;
	const contacts = records.length > 0 ? records : [fallbackConversation(context)];

	return contacts.map((conversation, index) => ({
		...conversation,
		active: index === activeIndex
	}));
};

const messageThreadData = (context: AccountContext): AuxeroMessageThreadData => {
	const contacts = messageContactsData(context);
	const activeContact = contacts.find((contact) => contact.active) ?? contacts[0];
	const messages: AuxeroMessageBubble[] = context.isAdmin
		? listInquiriesForRole(context.session.role === 'agent' ? 'agent' : 'admin')
				.slice(0, 3)
				.map((inquiry, index) => ({
					id: inquiry.id,
					sent: index % 2 === 1,
					text: inquiry.message,
					time: formatDashboardDate(inquiry.createdAt, 'Today')
				}))
		: listMessagesForRole(context.session.role)
				.slice(0, 3)
				.map((message, index) => ({
					id: message.id,
					sent: index % 2 === 1,
					text: message.message,
					time: formatDashboardDate(message.createdAt, 'Today')
				}));

	const fallbackMessage: AuxeroMessageBubble = {
		id: context.isAdmin ? 'bohemcars-lead-queue-empty' : 'bohemcars-sales-empty',
		sent: false,
		text: context.isAdmin
			? 'New Bohemcars inquiries will appear here for triage.'
			: 'Your Bohemcars conversation history will appear here.',
		time: 'Today'
	};

	return {
		activeContact,
		contacts,
		contextHref: context.isAdmin ? '/admin/inquiries' : '/contact',
		heading: context.isAdmin ? 'Inquiries & Messages' : 'Messages',
		messages: [
			...(messages.length ? messages : [fallbackMessage]),
			{
				id: 'bohemcars-thread-response',
				sent: true,
				text: 'Thanks. Bohemcars can review source history, viewing availability, documents, and import timing before you commit.',
				time: 'Today, 10:12'
			}
		]
	};
};

const messageOptions = (sent: boolean) => `<div class="message-item__options core-dropdown">
	<img class="core-dropdown__button${sent ? ' ml-auto' : ''}" src="/assets/icons/more.svg" alt="">
	<ul class="core-dropdown__menu">
		<li><a href="#" class="text-primary">Reply</a></li>
		<li><a href="#" class="text-primary">Delete</a></li>
	</ul>
</div>`;

const messageContacts = (data: AuxeroMessageThreadData) => {
	return `<div class="message-contacts">
	${data.contacts
		.map(
			(
				conversation,
				index
			) => `<div class="message-contact ${conversation.active ? 'active user-online' : index === 2 ? 'user-offline' : ''}" data-contact="${escapeHtml(conversation.id)}">
		<div class="message-contact__avatar">
			<img src="${escapeHtml(conversation.avatar)}" alt="${escapeHtml(conversation.name)}">
		</div>
		<div class="message-contact__info">
			<div class="message-contact__name">${escapeHtml(conversation.name)}</div>
			<div class="message-contact__preview">${escapeHtml(conversation.preview)}</div>
		</div>
		<div class="message-contact__meta">
			<div class="message-contact__time">${escapeHtml(conversation.time)}</div>
			${conversation.badge ? `<div class="message-contact__badge">${conversation.badge}</div>` : ''}
		</div>
	</div>`
		)
		.join('\n')}
</div>`;
};

const messageHeader = (data: AuxeroMessageThreadData) => {
	const active = data.activeContact;

	return `<div class="message-chat__header">
	<div class="message-chat__user">
		<div class="message-chat__avatar user-online">
			<img src="${escapeHtml(active.avatar)}" alt="${escapeHtml(active.name)}">
		</div>
		<div class="message-chat__user-info">
			<div class="message-chat__name">${escapeHtml(active.name)}</div>
			<div class="message-chat__email">${escapeHtml(active.email)}</div>
		</div>
	</div>
	<div class="message-chat__actions">
		<div class="core-dropdown more style-2">
			<button class="core-dropdown__button ml-auto">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10 5.83333C10.4602 5.83333 10.8333 5.46024 10.8333 5C10.8333 4.53976 10.4602 4.16667 10 4.16667C9.53976 4.16667 9.16667 4.53976 9.16667 5C9.16667 5.46024 9.53976 5.83333 10 5.83333Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10 15.8333C10.4602 15.8333 10.8333 15.4602 10.8333 15C10.8333 14.5398 10.4602 14.1667 10 14.1667C9.53976 14.1667 9.16667 14.5398 9.16667 15C9.16667 15.4602 9.53976 15.8333 10 15.8333Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div class="core-dropdown__menu">
				<ul class="core-dropdown__list more-links">
					<li><a href="${escapeHtml(data.contextHref)}">Open context</a></li>
					<li><a href="#">Delete</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>`;
};

const messageBody = (data: AuxeroMessageThreadData) => {
	return `<div class="message-chat__body">
	${data.messages
		.map(
			(
				message,
				index
			) => `${index === data.messages.length - 1 ? '<div class="message-date-separator"><span>Today</span></div>' : ''}
	<div class="message-item ${message.sent ? 'message-item--sent' : 'message-item--received'}">
		<div class="message-item__bubble">
			${message.sent ? messageOptions(true) : ''}
			<div class="message-item__text">${escapeHtml(message.text)}</div>
			${message.sent ? '' : messageOptions(false)}
		</div>
		<div class="message-item__time">${escapeHtml(message.time)}</div>
	</div>`
		)
		.join('\n')}
</div>`;
};

const messageContainer = (context: AccountContext) => {
	const data = messageThreadData(context);

	return `<div class="message-container" data-bohemcars-message-container>
	<div class="message-sidebar">
		<div class="message-search">
			<form action="#" class="search-form-contact">
				<input type="text" name="SearchUsers" id="SearchUsers" class="form-control" placeholder="Search Users">
				<button>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M17.9438 17.0575L14.0321 13.1466C15.1659 11.7854 15.7312 10.0395 15.6106 8.27214C15.4899 6.50475 14.6925 4.85192 13.3843 3.65748C12.076 2.46304 10.3576 1.81895 8.58657 1.8592C6.81553 1.89945 5.12818 2.62094 3.87554 3.87358C2.62289 5.12622 1.9014 6.81357 1.86115 8.58462C1.8209 10.3557 2.46499 12.074 3.65943 13.3823C4.85387 14.6906 6.5067 15.488 8.27409 15.6086C10.0415 15.7293 11.7874 15.1639 13.1485 14.0302L17.0595 17.9419C17.1175 17.9999 17.1865 18.046 17.2623 18.0774C17.3382 18.1089 17.4195 18.125 17.5016 18.125C17.5838 18.125 17.6651 18.1089 17.741 18.0774C17.8168 18.046 17.8858 17.9999 17.9438 17.9419C18.0019 17.8838 18.048 17.8149 18.0794 17.739C18.1108 17.6631 18.127 17.5818 18.127 17.4997C18.127 17.4176 18.1108 17.3363 18.0794 17.2604C18.048 17.1845 18.0019 17.1156 17.9438 17.0575ZM3.12664 8.74969C3.12664 7.63717 3.45654 6.54963 4.07463 5.62461C4.69271 4.69958 5.57121 3.97861 6.59905 3.55287C7.62688 3.12712 8.75788 3.01573 9.84903 3.23277C10.9402 3.44981 11.9424 3.98554 12.7291 4.77221C13.5158 5.55888 14.0515 6.56116 14.2686 7.65231C14.4856 8.74345 14.3742 9.87445 13.9485 10.9023C13.5227 11.9301 12.8018 12.8086 11.8767 13.4267C10.9517 14.0448 9.86416 14.3747 8.75164 14.3747C7.26031 14.373 5.83053 13.7799 4.77599 12.7253C3.72146 11.6708 3.1283 10.241 3.12664 8.74969Z" fill="#1C1C1C"/>
					</svg>
				</button>
			</form>
		</div>
		${messageContacts(data)}
	</div>
	<div class="message-chat">
		${messageHeader(data)}
		${messageBody(data)}
		<div class="message__action flex items-center">
			<div class="message-chat__input">
				<input type="text" placeholder="Add a message..." class="message-chat__input-field w-full">
				<button type="button" class="message-chat__attach">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M19.6553 11.4697C19.725 11.5393 19.7803 11.622 19.8181 11.7131C19.8558 11.8041 19.8753 11.9017 19.8753 12.0003C19.8753 12.0989 19.8558 12.1964 19.8181 12.2875C19.7803 12.3785 19.725 12.4613 19.6553 12.5309L11.9631 20.2184C10.9784 21.203 9.64281 21.7561 8.25027 21.756C6.85772 21.756 5.52225 21.2027 4.53763 20.2179C3.55301 19.2332 2.99991 17.8977 3 16.5051C3.00009 15.1126 3.55336 13.7771 4.5381 12.7925L13.8437 3.34998C14.5468 2.6462 15.5006 2.25053 16.4953 2.25C17.4901 2.24947 18.4443 2.64414 19.1481 3.34717C19.8519 4.0502 20.2476 5.00401 20.2481 5.99877C20.2486 6.99353 19.8539 7.94776 19.1509 8.65154L9.84341 18.094C9.42072 18.5167 8.84743 18.7542 8.24966 18.7542C7.65189 18.7542 7.0786 18.5167 6.65591 18.094C6.23322 17.6714 5.99576 17.0981 5.99576 16.5003C5.99576 15.9025 6.23322 15.3292 6.65591 14.9065L14.4653 6.97342C14.5337 6.90044 14.616 6.84188 14.7074 6.8012C14.7988 6.76051 14.8974 6.73851 14.9974 6.7365C15.0974 6.73448 15.1968 6.7525 15.2897 6.78947C15.3827 6.82645 15.4673 6.88165 15.5386 6.95181C15.6098 7.02198 15.6664 7.10569 15.7048 7.19804C15.7433 7.29038 15.7629 7.38948 15.7625 7.4895C15.762 7.58953 15.7416 7.68846 15.7024 7.78048C15.6632 7.87249 15.6059 7.95573 15.534 8.02529L7.72372 15.9669C7.6538 16.0362 7.59822 16.1187 7.56016 16.2096C7.5221 16.3004 7.50231 16.3979 7.50192 16.4964C7.50153 16.5949 7.52054 16.6925 7.55787 16.7836C7.59521 16.8748 7.65013 16.9577 7.71951 17.0276C7.78888 17.0976 7.87135 17.1531 7.9622 17.1912C8.05306 17.2293 8.15052 17.249 8.24902 17.2494C8.34753 17.2498 8.44514 17.2308 8.53629 17.1935C8.62745 17.1562 8.71036 17.1012 8.78029 17.0319L18.0868 7.59404C18.5095 7.17222 18.7473 6.59977 18.748 6.00261C18.7486 5.40545 18.5119 4.83251 18.0901 4.40982C17.6683 3.98713 17.0959 3.74932 16.4987 3.74871C15.9015 3.74809 15.3286 3.98472 14.9059 4.40654L5.60216 13.8453C5.25363 14.1933 4.97704 14.6065 4.7882 15.0614C4.59936 15.5162 4.50197 16.0039 4.50158 16.4964C4.50119 16.9889 4.59781 17.4767 4.78592 17.9318C4.97403 18.387 5.24996 18.8007 5.59794 19.1492C5.94593 19.4977 6.35915 19.7743 6.81402 19.9632C7.2689 20.152 7.75651 20.2494 8.24902 20.2498C8.74154 20.2502 9.2293 20.1536 9.68448 19.9654C10.1396 19.7773 10.5533 19.5014 10.9018 19.1534L18.595 11.4659C18.7361 11.3259 18.9271 11.2476 19.1259 11.2483C19.3247 11.249 19.5151 11.3286 19.6553 11.4697Z" fill="#4B4B4B"/>
					</svg>
				</button>
			</div>
			<button type="button" class="message-chat__send">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M21.3112 2.689C21.1226 2.5005 20.8871 2.36569 20.629 2.29846C20.371 2.23122 20.0997 2.234 19.843 2.3065H19.829L1.83461 7.7665C1.54248 7.85069 1.28283 8.02166 1.09007 8.25676C0.897302 8.49185 0.780525 8.77997 0.75521 9.08294C0.729895 9.3859 0.797238 9.6894 0.948314 9.95323C1.09939 10.2171 1.32707 10.4287 1.60117 10.5602L9.56242 14.4377L13.4343 22.3943C13.5547 22.6513 13.7462 22.8685 13.9861 23.0201C14.226 23.1718 14.5042 23.2517 14.788 23.2502C14.8312 23.2502 14.8743 23.2484 14.9174 23.2446C15.2201 23.2201 15.5081 23.1036 15.7427 22.9107C15.9773 22.7178 16.1473 22.4578 16.2299 22.1656L21.6862 4.17119C21.6862 4.1665 21.6862 4.16181 21.6862 4.15712C21.7596 3.90115 21.7636 3.63024 21.6977 3.37223C21.6318 3.11421 21.4984 2.8784 21.3112 2.689ZM14.7965 21.7362L14.7918 21.7493V21.7427L11.0362 14.0271L15.5362 9.52712C15.6709 9.38533 15.7449 9.19651 15.7424 9.00094C15.7399 8.80537 15.6611 8.61852 15.5228 8.48022C15.3845 8.34191 15.1976 8.26311 15.002 8.26061C14.8065 8.2581 14.6177 8.3321 14.4759 8.46681L9.97586 12.9668L2.25742 9.21119H2.25086H2.26399L20.2499 3.75025L14.7965 21.7362Z" fill="white"/>
				</svg>
			</button>
		</div>
	</div>
</div>`;
};

const accountNameParts = (context: AccountContext) => {
	const [firstName, ...lastParts] = context.session.name.split(' ');

	return {
		firstName: firstName || bohemcarsBrand.name,
		lastName: lastParts.join(' ') || context.roleLabel
	};
};

const profileMapEmbedUrl =
	'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s';

const profileFormData = (context: AccountContext): AuxeroAccountProfileFormData => {
	const { firstName, lastName } = accountNameParts(context);

	return {
		address: bohemcarsContact.addressLabel,
		avatarImage: accountAvatarByRole[context.session.role],
		birthDate: '1994-03-22',
		company: bohemcarsBrand.name,
		description: `${bohemcarsBrand.tagline}. ${bohemcarsContact.appointmentNote}.`,
		email: context.session.email,
		firstName,
		gender: 'Male',
		lastName,
		mapEmbedUrl: profileMapEmbedUrl,
		mapOptions: [
			bohemcarsContact.addressLabel,
			`${bohemcarsContact.addressLabel} - appointment area`,
			`${bohemcarsContact.addressLabel} - import handoff`
		],
		marketplacePhone: bohemcarsContact.marketplacePhoneLabel,
		phone: bohemcarsContact.primaryPhoneLabel,
		posterImage: bohemcarsAssets.footerImage,
		role: context.session.role,
		roleLabel: context.roleLabel,
		roleNote: `Signed in locally as ${context.roleLabel}. Role-aware pages use this profile context.`,
		socialLinks: [
			{
				icon: '/assets/icons/input-facebook.svg',
				id: 'Facebook',
				name: 'Facebook',
				value: bohemcarsContact.facebookHref
			},
			{ icon: '/assets/icons/input-skype.svg', id: 'skype', name: 'skype', value: '' },
			{ icon: '/assets/icons/input-x.svg', id: 'xUrl', name: 'xUrl', value: '' },
			{ icon: '/assets/icons/input-telegram.svg', id: 'telegram', name: 'telegram', value: '' },
			{ icon: '/assets/icons/input-instagram.svg', id: 'instagram', name: 'instagram', value: '' },
			{
				icon: '/assets/icons/input-youtube.svg',
				id: 'youtube',
				name: 'youtube',
				value: bohemcarsContact.youtubeHref
			}
		]
	};
};

const passwordFormData = (context: AccountContext): AuxeroAccountPasswordFormData => ({
	email: context.session.email,
	role: context.session.role
});

const applyDashboardData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	let next = applyAccountShell(html, templateFile, options);

	next = replaceFirstDivAfter(
		next,
		context.isAdmin ? 'Admin Dashboard' : 'Account Dashboard',
		'<div class="grid grid-cols-4',
		statCards(context)
	);
	next = replaceFirstDivAfter(
		next,
		context.isAdmin ? 'Bohemcars Inventory' : 'My Listings',
		'<div class="cart-wrapper">',
		context.isAdmin ? cartWrapper(vehicles.slice(0, 5), context) : submissionCartWrapper(context)
	);
	next = replaceDivContaining(
		next,
		context.isAdmin ? 'Recent Inquiries' : 'Recent Messages',
		'<div class="dashboard-box bg-white',
		recentInquiriesBox(context)
	);

	return replaceDashboardDemoText(next);
};

const applyUsersData = (html: string, templateFile: string, options: AuxeroRenderOptions = {}) => {
	let next = applyAccountShell(html, templateFile, options)
		.replace('<p class="h3 mb-30">Admin Dashboard</p>', '<p class="h3 mb-30">User Management</p>')
		.replaceAll('All Listing', 'User Accounts');

	next = replaceFirstDivAfter(
		next,
		'User Management',
		'<div class="grid grid-cols-4',
		userManagementStats()
	);
	next = replaceFirstDivAfter(
		next,
		'User Management',
		'<div class="cart-wrapper">',
		userManagementTable()
	);
	next = replaceFirstDivAfter(
		next,
		'User Management',
		'<div class="dashboard-box bg-white">',
		userManagementNotes()
	);

	return replaceDashboardDemoText(next);
};

const applyFavoritesData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	let next = applyAccountShell(html, templateFile, options);
	next = replaceFirstDivAfter(
		next,
		'My Favorites',
		'<div class="grid grid-cols-3',
		favoriteGrid(context)
	);

	return replaceDashboardDemoText(next);
};

const applyMessagesData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const data = messageThreadData(context);
	const next = replaceFirstDivAfter(
		applyAccountShell(html, templateFile, options).replaceAll(
			'<p class="h3 mb-40">Message</p>',
			`<p class="h3 mb-40">${data.heading}</p>`
		),
		data.heading,
		'<div class="message-container">',
		messageContainer(context)
	);

	return replaceDashboardDemoText(next);
};

const applyProfileData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const profile = profileFormData(context);
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll('Become Dealer', 'Account Role')
		.replaceAll('Become A Dealer', profile.roleLabel)
		.replaceAll(
			'Your current account type is normal. If you want to become a dealer, please click on button Become a Dealer ',
			profile.roleNote
		)
		.replaceAll('Infomation', 'Information')
		.replaceAll('/assets/images/avatar/avatar-10.jpg', profile.avatarImage)
		.replaceAll('/assets/images/avatar/avatar-11.jpg', profile.posterImage)
		.replaceAll('value="John"', `value="${escapeHtml(profile.firstName)}"`)
		.replaceAll('value="Smith"', `value="${escapeHtml(profile.lastName)}"`)
		.replace(
			/<textarea placeholder="Your Message\*"[\s\S]*?<\/textarea>/,
			`<textarea placeholder="Profile notes" rows="4" tabindex="5" name="message" class="message textarea-primary text-secondary" id="message" required>${escapeHtml(profile.description)}</textarea>`
		)
		.replaceAll('placeholder="Sales Phone*"', 'placeholder="Marketplace Phone*"')
		.replaceAll(
			'value="http://www.facebook.com/avitex"',
			`value="${profile.socialLinks[0]?.value ?? ''}"`
		)
		.replace(
			'placeholder="6205 Peachtree Dunwoody Rd, Atlanta, GA 30328" value="" required',
			`placeholder="${escapeHtml(profile.address)}" value="${escapeHtml(profile.address)}" required`
		);

	next = setInputValueByName(next, 'Phone', profile.phone);
	next = setInputValueByName(next, 'SalesPhone', profile.marketplacePhone);
	next = setInputValueByName(next, 'EmailAddress', profile.email);
	next = setInputValueByName(next, 'Company', profile.company);
	next = setInputValueByName(next, 'youtube', profile.socialLinks[5]?.value ?? '');
	next = addClassToFirstFormAfter(
		next,
		'My profile',
		'bohemcars-profile-form',
		' data-bohemcars-profile-form'
	);
	next = next.replace(
		'</form>',
		`<div class="flex justify-end mt-24">
	<button type="submit" class="btn btn-primary btn-large-3 font-weight-600">Save Locally</button>
</div>
</form>`
	);

	return replaceDashboardDemoText(next);
};

const applyPasswordData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const password = passwordFormData(context);
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll(`value="${bohemcarsContact.emailLabel}|"`, `value="${password.email}"`)
		.replaceAll('value="themesflat@2026"', 'value=""')
		.replaceAll('placeholder="Password"', 'placeholder="Password"');

	next = addClassToFirstFormAfter(
		next,
		'Change Password',
		'bohemcars-password-form',
		' data-bohemcars-password-form'
	);

	return replaceDashboardDemoText(next);
};

const applyListingsData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll('My Listings', context.isAdmin ? 'Inventory Management' : 'My Listings')
		.replaceAll('Showing 1 to 9 of 16 entries', `Showing 1 to 5 of ${vehicles.length} entries`);

	next = replaceFirstDivAfter(
		next,
		'Search by keyword',
		'<div class="cart-wrapper">',
		context.isAdmin ? cartWrapper(vehicles.slice(0, 5), context) : submissionCartWrapper(context)
	);

	return replaceDashboardDemoText(next);
};

const applyAddListingData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const editListingId = editListingIdFromRoute(options.routePath);
	const editListing = context.isAdmin
		? listInventoryForAdmin().find(
				(listing) =>
					listing.id === editListingId ||
					listing.slug === editListingId ||
					listing.routePath.endsWith(`/${editListingId}`)
			)
		: undefined;
	const editVehicle = editListing
		? vehicles.find(
				(candidate) =>
					candidate.slug === editListing.slug ||
					candidate.slug === editListing.id ||
					editListing.routePath.endsWith(`/${candidate.slug}`)
			)
		: undefined;
	const vehicle = vehicles[0];
	const title = editListing?.title ?? vehicle.title;
	const priceLabel = editListing?.priceLabel ?? vehicle.priceLabel;
	const vin = editListing?.vin ?? vehicle.stockNumber;
	const mileage = editListing?.mileage ?? km(vehicle.mileage);
	const engine = editVehicle?.engine ?? vehicle.engine;
	const color = editVehicle?.exterior ?? vehicle.exterior;
	const sourceUrl = editVehicle?.sourceUrl ?? vehicle.sourceUrl;
	const location = editVehicle?.location ?? bohemcarsContact.addressLabel;
	const adminHeading = editListing ? 'Edit Bohemcars Listing' : 'Add Bohemcars Listing';
	const pageHeading = context.isAdmin ? adminHeading : 'Submit Your Vehicle';
	const formMode =
		editListing?.source === 'admin-listing'
			? 'edit'
			: editListing?.source === 'static-vehicle'
				? 'clone-static'
				: 'create';
	const hiddenFields = [
		hiddenInput('actorRole', context.session.role),
		hiddenInput('role', context.session.role),
		hiddenInput(
			'routePath',
			options.routePath ?? (context.isAdmin ? '/admin/inventory/new' : '/sell-your-car')
		),
		hiddenInput('status', editListing?.status ?? 'draft'),
		editListing?.source === 'admin-listing' ? hiddenInput('listingId', editListing.id) : '',
		editListing?.source === 'static-vehicle' ? hiddenInput('sourceId', editListing.id) : ''
	].join('\n');
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll('Add Listings', pageHeading)
		.replaceAll('Save & Preview', editListing ? 'Save Draft Changes' : 'Save Draft')
		.replaceAll('List Now', context.isAdmin ? 'Publish Locally' : 'Submit Draft')
		.replace(
			'<a href="#" class="btn btn-line-1 px-24 btn-large font-weight-600">',
			'<a href="#" class="btn btn-line-1 px-24 btn-large font-weight-600 bohemcars-local-form-action" data-bohemcars-form-target=".bohemcars-add-listing-form" data-bohemcars-form-status="Listing draft saved locally for Bohemcars review" data-bohemcars-submit-form="true" data-bohemcars-listing-status="draft">'
		)
		.replace(
			'<a href="#" class="btn btn-primary px-24 btn-large font-weight-600">',
			'<a href="#" class="btn btn-primary px-24 btn-large font-weight-600 bohemcars-local-form-action" data-bohemcars-form-target=".bohemcars-add-listing-form" data-bohemcars-form-status="Listing published locally for Bohemcars" data-bohemcars-submit-form="true" data-bohemcars-listing-status="published">'
		)
		.replaceAll('value="Audi A6 Avant E-Tron"', `value="${escapeHtml(title)}"`)
		.replaceAll('placeholder="Years"', 'placeholder="Year"')
		.replaceAll('placeholder="Condition"', 'placeholder="Condition or status"')
		.replaceAll('placeholder="Enter number"', `placeholder="${escapeHtml(priceLabel)}"`)
		.replaceAll('placeholder="Enter VIN"', `placeholder="${escapeHtml(vin)}"`)
		.replaceAll('placeholder="Enter mileage"', `placeholder="${escapeHtml(mileage)}"`)
		.replaceAll(
			'placeholder="Enter engine"',
			`placeholder="${escapeHtml(engine || 'Engine on request')}"`
		)
		.replaceAll('placeholder="Enter color"', `placeholder="${escapeHtml(color)}"`)
		.replaceAll('Price ($)*', 'Price (EUR)*')
		.replaceAll('placeholder="e.g.1000"', `placeholder="${escapeHtml(priceLabel)}"`)
		.replaceAll(
			'placeholder="6205 Peachtree Dunwoody Rd, Atlanta, GA 30328"',
			`placeholder="${escapeHtml(location)}"`
		)
		.replaceAll(
			'value="6205 Peachtree Dunwoody Rd, Atlanta, GA 30328"',
			`value="${escapeHtml(location)}"`
		)
		.replaceAll('placeholder="Your url"', `placeholder="${escapeHtml(sourceUrl)}"`);

	next = setInputValueByName(next, 'title', title);
	next = setInputValueByName(next, 'Enternumber', priceLabel);
	next = setInputValueByName(next, 'EnterVIN', vin);
	next = setInputValueByName(next, 'mileage', mileage);
	next = setInputValueByName(next, 'Enterengine', engine || 'Engine on request');
	next = setInputValueByName(next, 'Color', color);
	next = setInputValueByName(next, 'PriceListing', priceLabel);
	next = setInputValueByName(next, 'Yoururl', sourceUrl);

	next = addClassToFirstFormAfter(next, pageHeading, 'bohemcars-add-listing-form');

	next = next.replace(
		'<form action="#" class="bohemcars-add-listing-form" novalidate>',
		`<form action="#" class="bohemcars-add-listing-form" novalidate data-bohemcars-admin-listing-mode="${formMode}">\n${hiddenFields}`
	);

	return replaceDashboardDemoText(next);
};

const replaceDashboardDemoText = (html: string) =>
	demoVehicleTitles
		.reduce(
			(next, title, index) => next.replaceAll(title, vehicles[index % vehicles.length].title),
			html
		)
		.replaceAll('Benzin + Plin', 'Petrol')
		.replaceAll('Tampa, FL', bohemcarsContact.addressLabel)
		.replaceAll('$44.900,00', vehicles[0]?.priceLabel ?? 'On request')
		.replaceAll('$42.800,00', vehicles[1]?.priceLabel ?? 'On request')
		.replaceAll('$45.500,00', vehicles[2]?.priceLabel ?? 'On request')
		.replaceAll('Randynox', 'Bohemcars Lead')
		.replaceAll('Mista Nyroom', 'Bohemcars Customer')
		.replaceAll('Marvin McKinney', 'Bohemcars Sales')
		.replaceAll('John Smith', 'Bohemcars Customer')
		.replaceAll('Brooklyn Simmons', 'Bohemcars Inspection')
		.replaceAll('Arlene McCoy', 'Bohemcars Import')
		.replaceAll('Darrell Steward', 'Bohemcars Admin')
		.replaceAll('Theresa Webb', 'Bohemcars Support')
		.replaceAll('grew-sra@gmail.com', bohemcarsContact.emailLabel)
		.replaceAll('Hey! there I&#39;m available', 'Bohemcars follow-up is ready')
		.replaceAll("Hey! there I'm available", 'Bohemcars follow-up is ready');

export const applyAccountTemplateData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	if (templateFile === 'dashboard.html') {
		const context = accountContext(templateFile, options);

		return context.active === 'users'
			? applyUsersData(html, templateFile, options)
			: applyDashboardData(html, templateFile, options);
	}
	if (templateFile === 'my-favorites.html') return applyFavoritesData(html, templateFile, options);
	if (templateFile === 'message.html') return applyMessagesData(html, templateFile, options);
	if (templateFile === 'my-profile.html') return applyProfileData(html, templateFile, options);
	if (templateFile === 'change-password.html')
		return applyPasswordData(html, templateFile, options);
	if (templateFile === 'my-listings.html') return applyListingsData(html, templateFile, options);
	if (templateFile === 'add-listings-2.html')
		return applyAddListingData(html, templateFile, options);

	return html;
};

export const getAuxeroDashboardRecentData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => dashboardRecentData(accountContext(templateFile, options));

export const getAuxeroMessageThreadData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => messageThreadData(accountContext(templateFile, options));

export const getAuxeroAccountListingsData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountListingsData(accountContext(templateFile, options));

export const getAuxeroUserManagementData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => userManagementData(accountContext(templateFile, options));

export const getAuxeroAccountProfileFormData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => profileFormData(accountContext(templateFile, options));

export const getAuxeroAccountPasswordFormData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => passwordFormData(accountContext(templateFile, options));

export const isAccountTemplate = (templateFile: string) =>
	[
		'dashboard.html',
		'my-favorites.html',
		'message.html',
		'my-profile.html',
		'change-password.html',
		'my-listings.html',
		'add-listings-2.html'
	].includes(templateFile);

export const getAuxeroAccountRuntimeData = (options: AuxeroRenderOptions = {}) => {
	const session = resolveBohemcarsSession(options.routePath ?? '', options.searchParams);

	return {
		activeRole: session.role,
		session,
		sessions: Object.values({
			admin: resolveBohemcarsSession('admin'),
			agent: resolveBohemcarsSession('agent'),
			customer: resolveBohemcarsSession('account')
		})
	};
};
