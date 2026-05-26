import { agents } from '$lib/data/agents';
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

type Conversation = {
	avatar: string;
	badge?: number;
	email: string;
	id: string;
	name: string;
	preview: string;
	time: string;
};

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

const addClassToFirstFormAfter = (html: string, marker: string, className: string) => {
	const markerIndex = html.indexOf(marker);
	const formStart = html.indexOf('<form action="#">', markerIndex);

	if (formStart < 0) return html;

	return `${html.slice(0, formStart)}<form action="#" class="${className}" novalidate>${html.slice(
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

	return `<div class="cart-wrapper bohemcars-account-listings">
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

	return `<div class="cart-wrapper bohemcars-account-listings" data-bohemcars-submissions-table>
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

const userManagementTable = () => `<div class="cart-wrapper bohemcars-users-table">
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

const recentInquiriesBox = (context: AccountContext) => {
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

	return `<div class="dashboard-box bg-white bohemcars-inquiries-box">
	<p class="h4 mb-20">${heading}</p>
	<div class="comments">
		${items
			.map(
				(item, index) => `<div class="comment-box">
			<div class="comment-box__header gap-12 mb-24">
				<div class="comment-box__avatar">
					<img src="${accountAvatarByRole[item.avatarRole]}" alt="${escapeHtml(item.name)}">
				</div>
				<div>
					<div class="text-secondary gap-4 pt-4">
						<p class="h5 mb-4">${escapeHtml(item.name)}</p>
						<p class="text-secondary text-sm">${escapeHtml(formatDashboardDate(item.date, `May ${20 + index}, 2026`))}</p>
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
		? listInquiriesForRole('admin').map((inquiry, index) => ({
				avatar: accountAvatarByRole[index === 1 ? 'agent' : 'customer'],
				badge: inquiry.status === 'new' ? 1 : undefined,
				email: inquiry.contactEmail,
				id: inquiry.id,
				name: inquiry.contactName,
				preview: inquiry.vehicleTitle ?? inquiry.message,
				time: index === 2 ? 'Yesterday' : `${16 - index}:24`
			}))
		: listMessagesForRole(context.session.role).map((message, index) => ({
				avatar: accountAvatarByRole.agent,
				badge: message.status === 'open' ? 1 : undefined,
				email: bohemcarsContact.emailLabel,
				id: message.threadId,
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

const messageContacts = (context: AccountContext) => {
	const records = conversations(context);
	const activeIndex = records.length > 1 ? 1 : 0;
	const contacts = records.length > 0 ? records : [fallbackConversation(context)];

	return `<div class="message-contacts">
	${contacts
		.map(
			(
				conversation,
				index
			) => `<div class="message-contact ${index === activeIndex ? 'active user-online' : ''}" data-contact="${escapeHtml(conversation.id)}">
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

const messageHeader = (context: AccountContext) => {
	const records = conversations(context);
	const active = records[1] ?? records[0] ?? fallbackConversation(context);

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
		<a href="${context.isAdmin ? '/admin/inquiries' : '/contact'}" class="text-highlight font-weight-600">Open context</a>
	</div>
</div>`;
};

const messageBody = (context: AccountContext) => {
	const records = listMessagesForRole(context.session.role).slice(0, 3);

	return `<div class="message-chat__body">
	${records
		.map(
			(
				message,
				index
			) => `<div class="message-item ${index % 2 === 0 ? 'message-item--received' : 'message-item--sent'}">
		<div class="message-item__bubble">
			<div class="message-item__text">${escapeHtml(message.message)}</div>
		</div>
		<div class="message-item__time">${escapeHtml(formatDashboardDate(message.createdAt, 'Today'))}</div>
	</div>`
		)
		.join('\n')}
	<div class="message-date-separator"><span>Today</span></div>
	<div class="message-item message-item--sent">
		<div class="message-item__bubble">
			<div class="message-item__text">Thanks. Bohemcars can review source history, viewing availability, documents, and import timing before you commit.</div>
		</div>
		<div class="message-item__time">Today, 10:12</div>
	</div>
</div>`;
};

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
	next = replaceFirstDivAfter(
		next,
		context.isAdmin ? 'Recent Inquiries' : 'Recent Messages',
		'<div class="dashboard-box bg-white">',
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
	const next = applyAccountShell(html, templateFile, options)
		.replaceAll(
			'<p class="h3 mb-40">Message</p>',
			`<p class="h3 mb-40">${context.isAdmin ? 'Inquiries & Messages' : 'Messages'}</p>`
		)
		.replace(
			/<div class="message-contacts">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
			`${messageContacts(context)}</div>`
		)
		.replace(
			/<div class="message-chat__header">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
			messageHeader(context)
		)
		.replace(
			/<div class="message-chat__body">[\s\S]*?<\/div>\s*<div class="message__action/,
			`${messageBody(context)}\n<div class="message__action`
		);

	return replaceDashboardDemoText(next);
};

const applyProfileData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const context = accountContext(templateFile, options);
	const [firstName, ...lastParts] = context.session.name.split(' ');
	const lastName = lastParts.join(' ') || context.roleLabel;
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll('Become Dealer', 'Account Role')
		.replaceAll('Become A Dealer', context.roleLabel)
		.replaceAll(
			'Your current account type is normal. If you want to become a dealer, please click on button Become a Dealer ',
			`Signed in locally as ${context.roleLabel}. Role-aware pages use this profile context.`
		)
		.replaceAll('Infomation', 'Information')
		.replaceAll('/assets/images/avatar/avatar-10.jpg', accountAvatarByRole[context.session.role])
		.replaceAll('/assets/images/avatar/avatar-11.jpg', bohemcarsAssets.footerImage)
		.replaceAll('value="John"', `value="${escapeHtml(firstName)}"`)
		.replaceAll('value="Smith"', `value="${escapeHtml(lastName)}"`)
		.replace(
			/<textarea placeholder="Your Message\*"[\s\S]*?<\/textarea>/,
			`<textarea placeholder="Profile notes" rows="4" tabindex="5" name="message" class="message textarea-primary text-secondary" id="message" required>${escapeHtml(bohemcarsBrand.tagline)}. ${escapeHtml(bohemcarsContact.appointmentNote)}.</textarea>`
		)
		.replaceAll('value="123  456  7890 "', `value="${bohemcarsContact.primaryPhoneLabel}"`)
		.replaceAll(`value="${bohemcarsContact.emailLabel}"`, `value="${context.session.email}"`)
		.replaceAll('placeholder="Sales Phone*"', 'placeholder="Marketplace Phone*"')
		.replaceAll(
			'value="http://www.facebook.com/avitex"',
			`value="${bohemcarsContact.facebookHref}"`
		)
		.replace(
			'placeholder="6205 Peachtree Dunwoody Rd, Atlanta, GA 30328" value="" required',
			`placeholder="${escapeHtml(bohemcarsContact.addressLabel)}" value="${escapeHtml(bohemcarsContact.addressLabel)}" required`
		);

	next = addClassToFirstFormAfter(next, 'My profile', 'bohemcars-profile-form');
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
	let next = applyAccountShell(html, templateFile, options)
		.replaceAll(`value="${bohemcarsContact.emailLabel}|"`, `value="${context.session.email}"`)
		.replaceAll('value="themesflat@2026"', 'value=""')
		.replaceAll('placeholder="Password"', 'placeholder="Password"');

	next = addClassToFirstFormAfter(next, 'Change Password', 'bohemcars-password-form');

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
