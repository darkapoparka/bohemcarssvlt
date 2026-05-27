import { bohemcarsConsultants, bohemcarsContact, bohemcarsFetchedAt } from '$lib/data/bohemcars';
import { agents, getAgentBySlug, type Agent } from '$lib/data/agents';
import { listManagedAgents, type ManagedAgent } from './agents';
import { resolveBohemcarsSession, type BohemcarsSession } from './auth';
import { getBohemcarsGarageState } from './garage';
import {
	bodyTypes,
	brands,
	fuels,
	getRelatedVehicles,
	getVehicleBySlug,
	vehicles,
	type Vehicle
} from '$lib/data/vehicles';
import {
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryView,
	type InventoryState,
	type InventoryView
} from './inventory-state';

export { getInventoryState, inventoryTemplateForView, resolveInventoryView };

export type AuxeroRenderOptions = {
	request?: Request;
	routePath?: string;
	searchParams?: URLSearchParams;
	session?: BohemcarsSession;
	slug?: string;
	view?: InventoryView | string;
};

const sortLabels: Record<string, string> = {
	'best-match': 'Best Match',
	'highest-price': 'Highest Price',
	'lowest-mileage': 'Lowest Mileage',
	'lowest-price': 'Lowest Price',
	newest: 'Newest Year',
	'newest-listed': 'Newest Listed'
};

const detailFallbackSlug = vehicles[0]?.slug ?? '21764342419542174';

const compareIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_13399_19575)">
		<path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M6.875 10H13.125" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M10 6.875V13.125" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
	</g>
</svg>`;

const heartIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_13399_19510)">
		<path d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
	</g>
</svg>`;

const escapeHtml = (value: string | number) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const km = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

const getParam = (params: URLSearchParams, ...keys: string[]) => {
	for (const key of keys) {
		const value = params.get(key)?.trim();

		if (value) return value;
	}

	return undefined;
};

const inventoryUrl = (state: InventoryState, overrides: Record<string, string | undefined>) => {
	const params = new URLSearchParams(state.searchParams);

	for (const [key, value] of Object.entries(overrides)) {
		if (!value || (key === 'view' && value === '3')) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	}

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const modelOptions = Array.from(new Set(vehicles.map((vehicle) => vehicle.model).filter(Boolean)))
	.sort((a, b) => a.localeCompare(b, 'en'))
	.slice(0, 24);
const transmissionOptions = Array.from(new Set(vehicles.map((vehicle) => vehicle.transmission)))
	.filter(Boolean)
	.sort();

const viewIcon = (view: InventoryView) => {
	if (view === '4') {
		return `<svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="3" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="11" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="19" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="27" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/>
			<circle cx="3" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="11" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="19" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/><circle cx="27" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/>
		</svg>`;
	}

	if (view === 'map') {
		return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="5" cy="6" r="2.5" fill="white" stroke="#9FA1A4"/><rect x="9" y="3.5" width="10" height="5" rx="2.5" fill="white" stroke="#9FA1A4"/>
			<circle cx="5" cy="14" r="2.5" fill="white" stroke="#9FA1A4"/><rect x="9" y="11.5" width="10" height="5" rx="2.5" fill="white" stroke="#9FA1A4"/>
		</svg>`;
	}

	return `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="3" cy="6" r="2.5" stroke="#9FA1A4"/><circle cx="11" cy="6" r="2.5" stroke="#9FA1A4"/><circle cx="19" cy="6" r="2.5" stroke="#9FA1A4"/>
		<circle cx="3" cy="14" r="2.5" stroke="#9FA1A4"/><circle cx="11" cy="14" r="2.5" stroke="#9FA1A4"/><circle cx="19" cy="14" r="2.5" stroke="#9FA1A4"/>
	</svg>`;
};

const viewToggle = (state: InventoryState) =>
	(['3', '4', 'map'] as const)
		.map((view) => {
			const labels: Record<InventoryView, string> = {
				'3': 'Comfortable 3 grid',
				'4': 'Dense 4 grid',
				map: 'Half map'
			};

			return `<a class="item-menu ${state.view === view ? 'active' : ''}" href="${inventoryUrl(
				state,
				{
					view
				}
			)}" aria-label="${labels[view]}" title="${labels[view]}">${viewIcon(view)}</a>`;
		})
		.join('');

const sortDropdown = (state: InventoryState) => {
	const options = [
		['best-match', 'Best Match'],
		['lowest-price', 'Lowest Price'],
		['highest-price', 'Highest Price'],
		['lowest-mileage', 'Lowest Mileage'],
		['newest-year', 'Newest Year'],
		['newest-listed', 'Newest Listed']
	];

	return `<ul class="core-dropdown__list">
		${options
			.map(
				([value, label]) => `<li class="core-dropdown__item">
			<a href="${inventoryUrl(state, { sort: value })}" class="core-dropdown__option ${
				state.sortParam === value ? 'active' : ''
			}" data-sort="${value}" data-value="${value}">${label}</a>
		</li>`
			)
			.join('')}
	</ul>`;
};

const highlightClass = (vehicle: Vehicle, index: number) => {
	if (vehicle.isClientVehicle) return 'bg-primary-2';
	if (vehicle.tag === 'New listing') return 'bg-green';

	return index % 4 === 0 ? 'bg-primary-2' : 'bg-green';
};

const cardMeta = (vehicle: Vehicle, tagClass = 'tag style2 mb-10') => `<ul class="${tagClass}">
	<li><img src="/assets/icons/icon-gauge.svg" alt="mileage"><span>${km(vehicle.mileage)}</span></li>
	<li><img src="/assets/icons/calendar.svg" alt="year"><span>${vehicle.year}</span></li>
	<li><img src="/assets/icons/gaspump.svg" alt="fuel"><span>${escapeHtml(vehicle.fuel)}</span></li>
	<li><img src="/assets/icons/auto.svg" alt="transmission"><span>${escapeHtml(vehicle.transmission)}</span></li>
</ul>`;

const gridCard = (vehicle: Vehicle, index: number) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;
	const monthly = `${vehicle.monthly.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR/mo`;

	return `<div class="card-box card-box-style-1 wow fadeIn" data-wow-delay="0.${(index % 4) + 1}s" data-bohemcars-slug="${escapeHtml(vehicle.slug)}">
		<div class="top">
			<p class="${highlightClass(vehicle, index)} text-white highlight">${escapeHtml(vehicle.tag ?? 'Available')}</p>
			<p class="heart bohemcars-favorite" role="button" tabindex="0" aria-label="Save ${escapeHtml(vehicle.title)}">${heartIcon}</p>
		</div>
		<div class="image">
			<a href="${url}">
				<img class="card--img" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}">
			</a>
		</div>
		<div class="content border-light border-top-none">
			<div class="bottom">
				<p class="category uppercase text-white">
					<a href="${url}" class="text-white uppercase text-xs">${escapeHtml(vehicle.brand)}</a>
				</p>
				<div class="flex items-center gap-8">
					<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
					<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
				</div>
			</div>
			<p class="h6 card-box__title mb-8"><a href="${url}">${escapeHtml(vehicle.title)}</a></p>
			${cardMeta(vehicle)}
			<p class="h6 card-box__price mb-15 flex justify-between gap-8 items-center">
				${escapeHtml(vehicle.priceLabel)}
				<span class="text-sm">${monthly}<a href="${url}" class="text-underline ml-2 text-muted text-xs">See Finance</a></span>
			</p>
			<div class="divider mb-15"></div>
			<div class="flex justify-between">
				<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-bohemcars-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">
					${compareIcon}
					Compare
				</p>
				<a href="${url}" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a>
			</div>
		</div>
	</div>`;
};

const listCard = (vehicle: Vehicle, index: number) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;

	return `<div class="card-box card-box-style-9" data-bohemcars-slug="${escapeHtml(vehicle.slug)}">
		<div class="top">
			<p class="${highlightClass(vehicle, index)} text-white highlight">${escapeHtml(vehicle.tag ?? 'Available')}</p>
			<p class="heart bohemcars-favorite" role="button" tabindex="0" aria-label="Save ${escapeHtml(vehicle.title)}">${heartIcon}</p>
		</div>
		<div class="bottom">
			<p class="category uppercase text-white"><a href="${url}" class="text-white uppercase text-xs">${escapeHtml(vehicle.brand)}</a></p>
			<div class="flex items-center gap-8">
				<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
				<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
			</div>
		</div>
		<div class="image"><a href="${url}"><img class="card--img" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}"></a></div>
		<div class="content">
			<p class="h6 card-box__title mb-4"><a href="${url}">${escapeHtml(vehicle.title)}</a></p>
			<p class="text-secondary clamp-1 clamp mb-8">${escapeHtml(vehicle.description || bohemcarsContact.appointmentNote)}</p>
			${cardMeta(vehicle, 'tag style3 mb-14')}
			<p class="h6 card-box__price mb-10 flex justify-between gap-8 items-center">${escapeHtml(vehicle.priceLabel)}</p>
			<div class="flex gap-32">
				<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-bohemcars-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">${compareIcon} Compare</p>
				<a href="${url}" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a>
			</div>
		</div>
	</div>`;
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
	const start = html.indexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const inventoryContent = (state: InventoryState) => {
	const gridClass =
		state.view === '4'
			? 'grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41'
			: state.view === 'map'
				? 'grid grid-cols-1 gap-20'
				: 'grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41';
	const cards = state.selected
		.map((vehicle, index) =>
			state.view === 'map' ? listCard(vehicle, index) : gridCard(vehicle, index)
		)
		.join('\n');
	const empty = `<div class="card-box card-box-style-1 bohemcars-empty-state">
		<div class="content border-light">
			<p class="h6 card-box__title mb-8">No Bohemcars vehicles match these filters</p>
			<p class="text-secondary mb-15">Clear filters or contact Bohemcars for a Canada import request.</p>
			<a href="/inventory" class="view-details">Reset inventory <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="reset"></a>
		</div>
	</div>`;

	return `<div class="content-tab bohemcars-inventory-content">
		<div class="content-inner active">
			<div class="${gridClass}">
				${cards || empty}
			</div>
		</div>
	</div>`;
};

const replaceInventoryToolbar = (html: string, state: InventoryState) => {
	const hasFilters = Object.keys(state.filters).length > 0;
	const selectedCount = state.selected.length;
	const showingText =
		selectedCount > 0
			? `Showing 1 - ${selectedCount} of ${selectedCount} ${hasFilters ? 'matching ' : ''}Bohemcars Listings`
			: `Showing 0 of ${vehicles.length} Bohemcars Listings`;
	const selectedSort = sortLabels[state.sortParam] ?? 'Best Match';

	return html
		.replace(/Showing 1\s*(?:–|-)\s*30 of 118 Listings/g, showingText)
		.replace(
			/(<div class="container mb-40 flat-tabs" data-custom="true">\s*)<div class="row mb-24">/,
			`$1<div class="row mb-24 bohemcars-inventory-toolbar-row">`
		)
		.replace(
			/<span id="filterMatchesCount">\s*\d+\s*<\/span>/g,
			`<span id="filterMatchesCount">${state.selected.length} </span>`
		)
		.replace(/Show 1,029 Matches/g, `Show ${state.selected.length} Matches`)
		.replace(
			/<div class="flex items-center gap-12 py-12 justify-center listing-tabs menu-tab">[\s\S]*?<\/div>/,
			`<div class="flex items-center gap-12 py-12 justify-center listing-tabs menu-tab bohemcars-view-toggle">${viewToggle(state)}</div>`
		)
		.replace(
			/<span class="core-dropdown__selected">[\s\S]*?<\/span>/,
			`<span class="core-dropdown__selected">${selectedSort}</span>`
		)
		.replace(/<ul class="core-dropdown__list">[\s\S]*?<\/ul>/, sortDropdown(state));
};

const replaceInventoryContent = (html: string, state: InventoryState) => {
	const tabsStart = html.indexOf('data-custom="true"');
	const contentStart = html.indexOf('<div class="content-tab', tabsStart);

	return replaceDivBlock(html, contentStart, inventoryContent(state));
};

const optionCheckbox = (
	name: string,
	value: string,
	selected?: string
) => `<label class="filter-checkbox">
	<input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${selected === value ? 'checked' : ''}>
	<span>${escapeHtml(value)}</span>
</label>`;

const filterRuntimeData = {
	bodyTypes,
	brands,
	fuels,
	models: modelOptions,
	transmissions: transmissionOptions
};

const demoVehicleTitleMap = [
	'Audi A6 Avant E-Tron',
	'2024 Hyundai Elantra',
	'Kia EV9 2024',
	'Chevrolet Camaro 2020',
	'Audi R8',
	'Genesis Electrified G80',
	'2020 Chevy Camaro ZL1',
	'2022 Ford Mustang® GTD',
	'Porsche 911 S/T',
	'2022 Ford GT White',
	'Bmw x7 Pure Excellence 2023',
	'BMW X6 Electric',
	'2017 BMV X1 xDrive 20d xline'
] as const;

const replaceDemoVehicleCopy = (html: string) =>
	demoVehicleTitleMap.reduce((next, title, index) => {
		const vehicle = vehicles[index % vehicles.length];

		return next.replaceAll(title, vehicle.title);
	}, html);

export const getAuxeroListingRuntimeData = () => ({
	contact: bohemcarsContact,
	filters: filterRuntimeData,
	vehicles: vehicles.map((vehicle) => ({
		bodyType: vehicle.bodyType,
		brand: vehicle.brand,
		condition: vehicle.condition,
		engine: vehicle.engine,
		exterior: vehicle.exterior,
		fuel: vehicle.fuel,
		image: vehicle.image,
		imagesCount: vehicle.images.length || 1,
		interior: vehicle.interior,
		location: vehicle.location,
		mileage: vehicle.mileage,
		model: vehicle.model,
		price: vehicle.price,
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		stockNumber: vehicle.stockNumber,
		tag: vehicle.tag,
		title: vehicle.title,
		transmission: vehicle.transmission,
		vin: vehicle.vin,
		year: vehicle.year
	}))
});

export const getCompareVehicles = (options: AuxeroRenderOptions = {}) => {
	const params = new URLSearchParams(options.searchParams);
	const ids = getParam(params, 'ids', 'compare')
		?.split(',')
		.map((slug) => slug.trim())
		.filter(Boolean);
	const routePath = options.routePath?.replace(/^\/+|\/+$/g, '') ?? '';
	const accountGarageIds =
		!ids?.length && routePath === 'account/compare'
			? getBohemcarsGarageState(
					options.session ?? resolveBohemcarsSession(options.routePath, options.searchParams)
				).compare
			: undefined;
	const selected = ids?.length
		? ids
				.map((slug) => getVehicleBySlug(slug))
				.filter((vehicle): vehicle is Vehicle => Boolean(vehicle))
		: accountGarageIds?.length
			? accountGarageIds
					.map((slug) => getVehicleBySlug(slug))
					.filter((vehicle): vehicle is Vehicle => Boolean(vehicle))
			: vehicles.slice(0, 4);

	return (selected.length ? selected : vehicles.slice(0, 4)).slice(0, 4);
};

const compareRow = (
	icon: string,
	label: string,
	values: string[],
	alt = label.toLowerCase()
) => `<tr>
	<td>
		<div class="flex items-center gap-8">
			<img src="/assets/icons/${icon}" alt="${escapeHtml(alt)}">
			<span>${escapeHtml(label)}:</span>
		</div>
	</td>
	${values.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}
</tr>`;

const compareTable = (
	selected: Vehicle[]
) => `<table class="card-details--table bohemcars-compare-table" data-bohemcars-compare-table>
	<tr>
		<td></td>
		${selected
			.map(
				(vehicle) => `<td data-bohemcars-compare-column="${escapeHtml(vehicle.slug)}">
			<div class="relative top">
				<button class="compare-item-remove-table" type="button" data-bohemcars-compare-remove="${escapeHtml(vehicle.slug)}" style="position: absolute; top: 0; right: 0; background: transparent; border: none; cursor: pointer; padding: 8px; z-index: 10;">
					<img src="/assets/icons/close-modal.svg" alt="Remove" style="width: 24px; height: 24px;">
				</button>
				<a href="/inventory/${encodeURIComponent(vehicle.slug)}">
					<img class="mb-10 radius-16 image" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.title)}">
				</a>
				<p class="h4 text-center"><a href="/inventory/${encodeURIComponent(vehicle.slug)}">${escapeHtml(vehicle.title)}</a></p>
			</div>
		</td>`
			)
			.join('')}
	</tr>
	${compareRow(
		'mileage.svg',
		'Mileage',
		selected.map((vehicle) => km(vehicle.mileage))
	)}
	${compareRow(
		'years.svg',
		'Years',
		selected.map((vehicle) => String(vehicle.year)),
		'year'
	)}
	${compareRow(
		'gaspump.svg',
		'Fuel',
		selected.map((vehicle) => vehicle.fuel)
	)}
	${compareRow(
		'color.svg',
		'Color',
		selected.map((vehicle) => vehicle.exterior || 'On request')
	)}
	${compareRow(
		'location.svg',
		'Location',
		selected.map((vehicle) => vehicle.location)
	)}
	${compareRow(
		'interior.svg',
		'Interior',
		selected.map((vehicle) => vehicle.interior || 'On request')
	)}
	${compareRow(
		'engine.svg',
		'Engine',
		selected.map((vehicle) => vehicle.engine || 'On request')
	)}
	${compareRow(
		'transmission.svg',
		'Transmission',
		selected.map((vehicle) => vehicle.transmission)
	)}
	${compareRow(
		'VIN.svg',
		'Source ID',
		selected.map((vehicle) => vehicle.vin)
	)}
	${compareRow(
		'QrCode.svg',
		'Stock Number',
		selected.map((vehicle) => vehicle.stockNumber)
	)}
	${compareRow(
		'Payment.png',
		'Price',
		selected.map((vehicle) => vehicle.priceLabel),
		'price'
	)}
</table>`;

export const applyCompareData = (html: string, options: AuxeroRenderOptions = {}) => {
	const selected = getCompareVehicles(options);
	const table = compareTable(selected);

	return replaceDemoVehicleCopy(
		html
			.replaceAll('Compare Cars Side-by-Side', 'Compare Bohemcars Vehicles Side-by-Side')
			.replaceAll(
				'Compare features, performance, and pricing to choose the perfect car.',
				'Compare price, mileage, source details, and specifications before you book a viewing.'
			)
			.replace(/<table class="card-details--table">[\s\S]*?<\/table>/g, table)
	);
};

const socialLink = (href: string, icon: string, label: string) => `<li>
	<a href="${escapeHtml(href)}" target="_blank" aria-label="${escapeHtml(label)}" rel="noreferrer">
		<img src="/assets/icons/${icon}" alt="${escapeHtml(label)}">
	</a>
</li>`;

const agentSocials = () => `<ul class="sale-agent-social justify-center flex gap-12">
	${socialLink(bohemcarsContact.facebookHref, 'input-facebook.svg', 'Facebook')}
	${socialLink(bohemcarsContact.viberHref, 'ChatCircleDots.svg', 'Viber')}
	${socialLink(bohemcarsContact.youtubeHref, 'input-youtube.svg', 'YouTube')}
	${socialLink(bohemcarsContact.emailHref, 'input-telegram.svg', 'Email')}
</ul>`;

const isManagedAgent = (agent: Agent | ManagedAgent): agent is ManagedAgent =>
	'openInquiries' in agent;

const agentStatusText = (agent: ManagedAgent) =>
	`${agent.status === 'active' ? 'Active' : 'Paused'} · ${agent.openInquiries} open leads`;

const agentCard = (agent: Agent | ManagedAgent, index: number, adminMode = false) => {
	const url = `/agents/${encodeURIComponent(agent.slug)}`;
	const managementMeta =
		adminMode && isManagedAgent(agent)
			? `<p class="text-secondary text-sm mt-4" data-bohemcars-agent-status="${agent.status}">${escapeHtml(agentStatusText(agent))}</p>
				<p class="text-secondary text-sm mt-4" data-bohemcars-agent-note="${escapeHtml(agent.slug)}">${escapeHtml(agent.note)}</p>`
			: '';
	const assignedLeadsLabel =
		adminMode && isManagedAgent(agent)
			? `Assigned Leads (${agent.openInquiries})`
			: 'Assigned Leads';

	return `<div class="sale-agent-box ${index === 1 ? 'active' : ''}">
		<div class="card-top mb-20">
			<a class="w-full flex" href="${url}">
				<img class="w-full" src="${escapeHtml(agent.image)}" alt="${escapeHtml(agent.name)}">
			</a>
			${agentSocials()}
		</div>

		<div class="card-bottom flex items-center justify-between gap-16">
			<div class="content">
				<a class="h5 font-weight-600 sale-agent-title" href="${url}">${escapeHtml(agent.name)}</a>
				<p class="text-secondary text-sm">${escapeHtml(agent.title)}</p>
				${managementMeta}
			</div>

			<ul class="contact">
				<li>
					<a href="${bohemcarsContact.primaryPhoneHref}" aria-label="Call ${escapeHtml(agent.name)}">
						<img src="/assets/icons/PhoneCall.svg" alt="phone">
					</a>
				</li>
				<li>
					<a href="${bohemcarsContact.emailHref}" aria-label="Email ${escapeHtml(agent.name)}">
						<img src="/assets/icons/input-telegram.svg" alt="email">
					</a>
				</li>
			</ul>
		</div>
		${
			adminMode
				? `<div class="mt-16 flex flex-wrap gap-8">
			<a href="/admin/inquiries?role=admin" class="btn btn-small btn-primary-3 font-weight-600">${assignedLeadsLabel}</a>
			<a href="/admin/messages?role=admin" class="btn btn-small btn-line-style-2 font-weight-600">Messages</a>
		</div>`
				: ''
		}
	</div>`;
};

const agentGrid = (
	adminMode = false
) => `<div class="grid grid-cols-4 sm-grid-cols-1 lg-grid-cols-2 gap-30 xl-gap-16 bohemcars-agent-grid" data-bohemcars-agent-management="${adminMode}">
	${(adminMode ? listManagedAgents() : agents).map((agent, index) => agentCard(agent, index, adminMode)).join('\n')}
</div>`;

export const applyAgentsData = (html: string, options: AuxeroRenderOptions = {}) => {
	const adminMode = options.routePath?.replace(/^\/+/, '').startsWith('admin/agents') ?? false;
	const next = html
		.replaceAll('Find a Dealer', 'Find a Consultant')
		.replace(
			'<h2>Bohemcars Consultants</h2>',
			adminMode ? '<h2>Bohemcars Agent Management</h2>' : '<h2>Bohemcars Consultants</h2>'
		);

	return replaceFirstDivAfter(
		next,
		adminMode ? '<h2>Bohemcars Agent Management</h2>' : '<h2>Bohemcars Consultants</h2>',
		'<div class="grid grid-cols-4',
		agentGrid(adminMode)
	);
};

const agentFromOptions = (options: AuxeroRenderOptions = {}) => {
	const routeSlug = options.routePath
		?.replace(/^\/+|\/+$/g, '')
		.split('/')
		.pop();
	const slug = options.slug ?? routeSlug ?? agents[0].slug;

	return getAgentBySlug(slug) ?? agents[0];
};

const agentInventoryGrid = (agent: Agent) => {
	const selected = vehicles.filter((vehicle) => vehicle.agentSlug === agent.slug).slice(0, 3);
	const fallback = selected.length ? selected : vehicles.slice(0, 3);

	return `<div class="grid grid-cols-1 gap-20 mb-40 bohemcars-agent-inventory">
		${fallback.map((vehicle, index) => listCard(vehicle, index)).join('\n')}
	</div>`;
};

const bohemcarsMapEmbedSrc =
	'https://maps.google.com/maps?q=Plovdiv%20South%20Industrial%20Zone&t=&z=13&ie=UTF8&iwloc=&output=embed';

export const applyAgentDetailData = (html: string, options: AuxeroRenderOptions = {}) => {
	const agent = agentFromOptions(options);
	const inventoryCount = vehicles.filter((vehicle) => vehicle.agentSlug === agent.slug).length;
	let next = html
		.replaceAll('Mike Hanley', escapeHtml(agent.name))
		.replaceAll('Verified Dealer', 'Verified Bohemcars Consultant')
		.replace('/assets/images/pages/sale-agent-9.jpg', escapeHtml(agent.image))
		.replace(
			/<p class="text-secondary mb-4">\s*Darrell Steward[\s\S]*?<\/p>/,
			`<p class="text-secondary mb-4">${escapeHtml(agent.bio)}</p>`
		)
		.replace(
			/<p class="text-secondary mb-40">\s*His passion[\s\S]*?<\/p>/,
			`<p class="text-secondary mb-40">Bohemcars keeps every conversation practical: source details, inspection context, import or registration steps, and viewing appointments are confirmed before the next commitment.</p>`
		)
		.replace(
			/Dealer Inventory \(3\)/g,
			`Bohemcars Inventory (${inventoryCount || vehicles.length})`
		)
		.replace(
			/<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]*"/g,
			`<iframe src="${bohemcarsMapEmbedSrc}"`
		)
		.replaceAll(
			'6205 Peachtree Dunwoody Rd, Atlanta, GA 30328',
			escapeHtml(bohemcarsContact.addressLabel)
		)
		.replaceAll('Get Directions', 'Plan Appointment')
		.replaceAll('1-555-678-8888', escapeHtml(bohemcarsContact.primaryPhoneLabel))
		.replaceAll('1-555-678-9999', escapeHtml(bohemcarsContact.marketplacePhoneLabel))
		.replaceAll('tel:1-555-678-8888', bohemcarsContact.primaryPhoneHref)
		.replaceAll('tel:1-555-678-9999', bohemcarsContact.marketplacePhoneHref)
		.replaceAll('Call To Dealer', 'Call Bohemcars')
		.replaceAll('Chat via WhatsApp', 'Chat on Viber')
		.replaceAll('value="Tony Nguyen"', 'value=""')
		.replaceAll(`value="${bohemcarsContact.emailLabel}"`, 'value=""')
		.replaceAll('Find a Dealer', 'Find a Consultant')
		.replaceAll('Send Inquiry about Vehicle', `Send Inquiry to ${agent.name}`)
		.replaceAll('This Vehicle&#39;s Availability 2', 'Import request')
		.replaceAll('This Vehicle&#39;s Availability 3', 'Documents and registration');

	next = next.replace(
		/<a href="\/agents\/bohemcars-sales" class="btn btn-medium btn-primary-3/g,
		`<a href="${bohemcarsContact.primaryPhoneHref}" class="btn btn-medium btn-primary-3`
	);
	next = next.replace(
		/<a href="#" class="btn btn-medium btn-primary-4/g,
		`<a href="${bohemcarsContact.viberHref}" class="btn btn-medium btn-primary-4`
	);
	next = replaceFirstDivAfter(
		next,
		'Bohemcars Inventory',
		'<div class="grid grid-cols-1',
		agentInventoryGrid(agent)
	);

	return replaceDemoVehicleCopy(next);
};

const addClassToFirstFormAfter = (html: string, marker: string, className: string) => {
	const markerIndex = html.indexOf(marker);
	const formStart = html.indexOf('<form action="#">', markerIndex);

	if (formStart < 0) return html;

	return `${html.slice(0, formStart)}<form action="#" class="${className}">${html.slice(
		formStart + '<form action="#">'.length
	)}`;
};

export const applyContactData = (html: string) => {
	let next = html
		.replace(
			/<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]*"/g,
			`<iframe src="${bohemcarsMapEmbedSrc}"`
		)
		.replaceAll('Reach Out to Us', 'Reach Out to Bohemcars')
		.replaceAll(
			'We’re here to assist with any questions, concerns, or inquiries—contact us today!',
			'Ask about inventory, Canada import requests, appointments, documents, or selling your car.'
		)
		.replaceAll('Address Business', 'Bohemcars Office')
		.replaceAll(
			'6205 Peachtree Dunwoody Rd, Atlanta, GA 30328',
			escapeHtml(bohemcarsContact.addressLabel)
		)
		.replaceAll('Week-Day: 8:00 - 18:00', 'Monday-Friday: 9:00 - 18:00')
		.replaceAll('Sunday: Closed', 'Weekend: By appointment')
		.replaceAll('Follow Us On social media:', 'Follow Bohemcars:')
		.replaceAll(
			"We'd love to hear from you! If you have any questions",
			bohemcarsContact.appointmentNote
		)
		.replaceAll('1-555-678-8888', escapeHtml(bohemcarsContact.primaryPhoneLabel))
		.replaceAll('1-333-123-6666', escapeHtml(bohemcarsContact.marketplacePhoneLabel))
		.replaceAll('tel:1-555-678-8888', bohemcarsContact.primaryPhoneHref)
		.replaceAll('tel:1-333-123-6666', bohemcarsContact.marketplacePhoneHref)
		.replaceAll('value="Tony"', 'value=""')
		.replaceAll('placeholder="Enter your last name"', 'placeholder="Enter your last name"');

	next = addClassToFirstFormAfter(next, 'contact-page-form', 'bohemcars-contact-form');

	return next;
};

const replaceFilterSidebar = (html: string, state: InventoryState) => {
	const formStart = html.indexOf('<form action="#">', html.indexOf('filter-sidebar__panel'));
	let next = html;

	if (formStart >= 0) {
		next = `${next.slice(0, formStart)}<form action="/inventory" method="get" class="bohemcars-filter-form">
			<input type="hidden" name="view" value="${state.view}">${next.slice(formStart + '<form action="#">'.length)}`;
	}

	const brandList = `<div class="filter-select-dropdown__list">
		${optionCheckbox('brand', 'all')}
		${brands.map((brand) => optionCheckbox('brand', brand, state.filters.brand)).join('')}
	</div>`;
	const modelList = `<div class="filter-select-dropdown__list">
		${optionCheckbox('model', 'all')}
		${filterRuntimeData.models.map((model) => optionCheckbox('model', model, state.filters.query)).join('')}
	</div>`;
	const bodyList = `<div class="filter-select-dropdown__list">
		${optionCheckbox('bodystyle', 'all')}
		${bodyTypes.map((body) => optionCheckbox('bodystyle', body, state.filters.bodyType)).join('')}
	</div>`;
	const fuelList = `<div class="filter-select-dropdown__list">
		${optionCheckbox('FuelType', 'all')}
		${fuels.map((fuel) => optionCheckbox('FuelType', fuel, state.filters.fuel)).join('')}
	</div>`;

	return next
		.replace(
			/(<div class="search-cars__select filter-select-dropdown" data-name="brand">[\s\S]*?)<div class="filter-select-dropdown__list">[\s\S]*?<\/div>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
			`$1${brandList}$2`
		)
		.replace(
			/(<div class="search-cars__select filter-select-dropdown" data-name="model">[\s\S]*?)<div class="filter-select-dropdown__list">[\s\S]*?<\/div>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
			`$1${modelList}$2`
		)
		.replace(
			/(<div class="search-cars__select filter-select-dropdown" data-name="bodystyle">[\s\S]*?)<div class="filter-select-dropdown__list">[\s\S]*?<\/div>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
			`$1${bodyList}$2`
		)
		.replace(
			/(<div class="search-cars__select filter-select-dropdown" data-name="FuelType">[\s\S]*?)<div class="filter-select-dropdown__list">[\s\S]*?<\/div>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
			`$1${fuelList}$2`
		);
};

type MapLocationGroup = {
	count: number;
	location: string;
	samples: Vehicle[];
};

const mapLocationGroups = (source: Vehicle[]) => {
	const groups = new Map<string, MapLocationGroup>();

	for (const vehicle of source) {
		const location = vehicle.location.trim() || bohemcarsContact.addressLabel;
		const group = groups.get(location) ?? {
			count: 0,
			location,
			samples: []
		};

		group.count += 1;
		if (group.samples.length < 2) group.samples.push(vehicle);
		groups.set(location, group);
	}

	return Array.from(groups.values()).sort(
		(a, b) => b.count - a.count || a.location.localeCompare(b.location, 'bg')
	);
};

const matchingVehicleLabel = (count: number) =>
	`${count} matching ${count === 1 ? 'vehicle' : 'vehicles'}`;

const mapLocationList = (groups: MapLocationGroup[]) => {
	if (!groups.length) {
		return `<p class="text-secondary mb-16" data-bohemcars-map-empty="true">No vehicles match these map filters yet. Reset the filters or call Bohemcars for incoming inventory.</p>`;
	}

	return `<ul class="bohemcars-map-fallback__locations">
		${groups
			.map(
				(group) => `<li data-bohemcars-map-location="${escapeHtml(group.location)}">
					<span class="h7 font-weight-600">${escapeHtml(group.location)}</span>
					<span class="text-secondary">${group.count} ${group.count === 1 ? 'vehicle' : 'vehicles'}</span>
					<span class="text-secondary">${group.samples
						.map((vehicle) => escapeHtml(vehicle.title))
						.join(' / ')}</span>
				</li>`
			)
			.join('')}
	</ul>`;
};

const replaceMap = (html: string, state: InventoryState) => {
	const groups = mapLocationGroups(state.selected);

	return html
		.replace(
			/<div id="map" data-map-zoom="16" data-map-scroll="true"><\/div>/,
			`<div id="map" class="bohemcars-map-fallback" data-map-zoom="16" data-map-scroll="true" data-bohemcars-map-selected="${state.selected.length}">
				<div class="bohemcars-map-fallback__inner">
					<p class="h4 mb-12">Bohemcars showroom area</p>
					<p class="text-secondary mb-8">${escapeHtml(bohemcarsContact.addressLabel)}</p>
					<p class="text-secondary mb-12" data-bohemcars-map-summary="${escapeHtml(matchingVehicleLabel(state.selected.length))}">${escapeHtml(matchingVehicleLabel(state.selected.length))} grouped by appointment area.</p>
					${mapLocationList(groups)}
					<p class="text-secondary mb-16">${escapeHtml(bohemcarsContact.appointmentNote)}. Exact vehicle viewing location is confirmed by phone.</p>
					<a class="btn btn-medium btn-primary-3 font-weight-600" href="${bohemcarsContact.primaryPhoneHref}">${escapeHtml(bohemcarsContact.primaryPhoneLabel)}</a>
				</div>
			</div>`
		)
		.replace(
			/\s*<script src="https:\/\/maps\.googleapis\.com\/maps\/api\/js[\s\S]*?<\/script>/g,
			''
		)
		.replace(/\s*<script src="\/assets\/js\/maps\.js"><\/script>/g, '')
		.replace(/\s*<script src="\/assets\/js\/infobox\.min\.js"><\/script>/g, '');
};

export const applyInventoryData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	const state = getInventoryState(templateFile, options);
	let next = replaceInventoryToolbar(html, state);
	next = replaceInventoryContent(next, state);
	next = replaceFilterSidebar(next, state);

	if (state.view === 'map') {
		next = replaceMap(next, state);
	}

	return replaceDemoVehicleCopy(next)
		.replaceAll('Listing Grid 4 Columns', 'Bohemcars Inventory')
		.replaceAll('Listing Grid 3 Columns', 'Bohemcars Inventory')
		.replaceAll('Listing Grid Half Map', 'Bohemcars Inventory Map')
		.replaceAll('$120', '0 EUR')
		.replaceAll('$750', '150 000 EUR');
};

const overviewItem = (icon: string, label: string, value: string) => `<li class="grid-cols-2 grid">
	<p class="flex items-center gap-8">
		<img class="w-28 h-28" src="/assets/icons/${icon}" alt="${escapeHtml(label)}">
		<span class="h7 text-secondary">${escapeHtml(label)}:</span>
	</p>
	<span class="h7 font-weight-500 pl-28">${escapeHtml(value)}</span>
</li>`;

const overviewList = (vehicle: Vehicle) => `<ul class="car-overview-list-style2">
	${overviewItem('icon-gauge.svg', 'Mileage', km(vehicle.mileage))}
	${overviewItem('calendar.svg', 'Year', String(vehicle.year))}
	${overviewItem('gaspump.svg', 'Fuel', vehicle.fuel)}
	${overviewItem('palette.svg', 'Color', vehicle.exterior)}
	${overviewItem('MapPin.svg', 'Location', vehicle.location)}
	${overviewItem('Seatbelt.svg', 'Interior', vehicle.interior)}
	${overviewItem('Frame.svg', 'Engine', vehicle.engine || 'On request')}
	${overviewItem('transmission-2.svg', 'Transmission', vehicle.transmission)}
	${overviewItem('Barcode.svg', 'Source ID', vehicle.vin)}
	${overviewItem('QrCode.svg', 'Stock Number', vehicle.stockNumber)}
</ul>`;

const featureTabs = (vehicle: Vehicle) => {
	const features = (
		vehicle.features.length
			? vehicle.features
			: ['Verified source listing', 'History review available', 'Viewing by appointment']
	).slice(0, 24);
	const chunks = [
		features.slice(0, 12),
		features.slice(12, 24),
		['Canada import review', 'Document trail review', 'Registration readiness discussion'],
		['Mechanical inspection can be arranged', vehicle.engine || 'Engine details on request'],
		[vehicle.fuel, vehicle.transmission, vehicle.bodyType].filter(Boolean),
		[
			bohemcarsContact.appointmentNote,
			bohemcarsFetchedAt
				? `Inventory refreshed ${bohemcarsFetchedAt}`
				: 'Inventory refreshed from Bohemcars source data'
		]
	];

	return `<div class="flat-tabs mb-40">
		<div class="overflow-x-auto mb-16">
			<ul class="menu-tab menu-tab-style4">
				<li class="active"><span class="text-secondary font-weight-600">Equipment</span></li>
				<li><span class="text-secondary font-weight-600">Comfort</span></li>
				<li><span class="text-secondary font-weight-600">History</span></li>
				<li><span class="text-secondary font-weight-600">Mechanical</span></li>
				<li><span class="text-secondary font-weight-600">Specs</span></li>
				<li><span class="text-secondary font-weight-600">Notes</span></li>
			</ul>
		</div>
		<div class="content-tab">
			${chunks
				.map(
					(chunk, index) => `<div class="content-inner ${index === 0 ? 'active' : ''}">
				<ul class="grid grid-cols-3 xl-grid-cols-2 md-grid-cols-1 gap-8 gap-x-30">
					${chunk
						.map(
							(feature) => `<li class="flex items-center gap-8">
						<img src="/assets/icons/check.svg" alt="check">
						${escapeHtml(feature)}
					</li>`
						)
						.join('')}
				</ul>
			</div>`
				)
				.join('')}
		</div>
	</div>`;
};

const replaceFirstBlockAfter = (
	html: string,
	marker: string,
	blockStart: string,
	replacement: string
) => {
	const markerIndex = html.indexOf(marker);
	const start = html.indexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const relatedSlides = (vehicle: Vehicle) =>
	getRelatedVehicles(vehicle, 4)
		.map((related, index) => `<div class="swiper-slide">${gridCard(related, index)}</div>`)
		.join('\n');

const replaceRelatedVehicles = (html: string, vehicle: Vehicle) => {
	const sectionIndex = html.indexOf('You might also like');
	const wrapperStart = html.indexOf('<div class="swiper-wrapper">', sectionIndex);
	const replacement = `<div class="swiper-wrapper">
		${relatedSlides(vehicle)}
	</div>`;

	return replaceDivBlock(html, wrapperStart, replacement);
};

export const applyDetailData = (html: string, options: AuxeroRenderOptions = {}) => {
	const vehicle = getVehicleBySlug(options.slug ?? detailFallbackSlug) ?? vehicles[0];
	const monthly = `${vehicle.monthly.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR/mo`;
	const consultant =
		bohemcarsConsultants.find((agent) => agent.slug === vehicle.agentSlug) ??
		bohemcarsConsultants[0];
	let next = html
		.replaceAll('Audi A6 Avant e-tron', escapeHtml(vehicle.title))
		.replaceAll('Audi A6 Avant E-Tron', escapeHtml(vehicle.title))
		.replace(
			/src="\/assets\/images\/inner-page\/slide-listing-details-\d+\.jpg"/g,
			`src="${escapeHtml(vehicle.image)}"`
		)
		.replace(/src="\/assets\/images\/card\/card-\d+\.jpg"/g, `src="${escapeHtml(vehicle.image)}"`)
		.replace(
			/The 2024 - 2025 Honda HR-V is offered[\s\S]*?RM 141,900\./,
			escapeHtml(
				vehicle.description ||
					`${vehicle.title} is available through Bohemcars with source review and viewing by appointment.`
			)
		)
		.replaceAll('$44.900', escapeHtml(vehicle.priceLabel))
		.replaceAll('$245/mo', escapeHtml(monthly))
		.replaceAll('$46.300|', escapeHtml(vehicle.priceLabel))
		.replaceAll(
			'$1,560 due at signing · 72 mo · 7.89% APR',
			'Estimated over 72 months. Final terms confirmed by Bohemcars.'
		)
		.replaceAll(
			'List price w/o taxes, fees, and accessories',
			'Listed vehicle price. Final taxes and registration costs confirmed before purchase.'
		)
		.replaceAll(
			'Finance payment w/o taxes, fees, and accessories',
			'Estimated payment before final taxes, registration, and transport costs.'
		)
		.replaceAll('Vehicle in the VAT system', escapeHtml(vehicle.priceBgn || vehicle.condition))
		.replaceAll(
			'6205 Peachtree Dunwoody Rd, Atlanta, GA 30328',
			escapeHtml(bohemcarsContact.addressLabel)
		)
		.replaceAll('Tampa, FL', escapeHtml(vehicle.location))
		.replaceAll('Mike Hanley', escapeHtml(consultant.name))
		.replaceAll('/assets/images/avatar/contact-avatar.png', escapeHtml(consultant.image))
		.replaceAll('Verified Dealer', 'Bohemcars Consultant')
		.replaceAll('1-555-678-8888', escapeHtml(bohemcarsContact.primaryPhoneLabel))
		.replaceAll('1-555-678-9999', escapeHtml(bohemcarsContact.marketplacePhoneLabel))
		.replaceAll('tel:1-555-678-8888', bohemcarsContact.primaryPhoneHref)
		.replaceAll('tel:1-555-678-9999', bohemcarsContact.marketplacePhoneHref)
		.replaceAll('Call To Dealer', 'Call Bohemcars')
		.replaceAll('Chat via WhatsApp', 'Chat on Viber')
		.replaceAll('Tony Nguyen', '')
		.replaceAll('This Vehicle&#39;s Availability 2', 'Registration and documents')
		.replaceAll('This Vehicle&#39;s Availability 3', 'Viewing appointment');

	next = next
		.replace(
			'<div class="listing-details">',
			`<div class="listing-details" data-bohemcars-slug="${escapeHtml(vehicle.slug)}" data-bohemcars-detail="true">`
		)
		.replace(
			'<a href="#" class="btn btn-medium btn-line open-modal padding-button-medium gap-5 font-weight-600" data-modal-id="#CardModal">',
			`<a href="/compare" class="btn btn-medium btn-line open-modal padding-button-medium gap-5 font-weight-600" data-modal-id="#CompareModal" data-bohemcars-compare="${escapeHtml(vehicle.slug)}" role="button" aria-label="Compare ${escapeHtml(vehicle.title)}">`
		)
		.replace(
			'<a href="#" class="btn-icon-circle hover-stroke-white">',
			`<a href="/account/favorites" class="btn-icon-circle hover-stroke-white bohemcars-favorite" role="button" aria-label="Save ${escapeHtml(vehicle.title)}">`
		);

	next = next.replace(/<ul class="car-overview-list-style2">[\s\S]*?<\/ul>/, overviewList(vehicle));
	next = replaceFirstBlockAfter(
		next,
		'Get To Know this car',
		'<div class="flat-tabs mb-40">',
		featureTabs(vehicle)
	);
	next = replaceRelatedVehicles(next, vehicle);

	return replaceDemoVehicleCopy(next)
		.replace(/href="listing-grid4-columns\.html"/g, 'href="/inventory?view=4"')
		.replace(/href="dealer-details\.html"/g, 'href="/agents/bohemcars-sales"')
		.replace(/href="clients-reviews\.html"/g, 'href="/reviews"')
		.replace(/href="#"/g, 'href="/contact"');
};
