import {
	filterVehicles,
	sortVehicles,
	vehicles,
	type InventoryFilters,
	type SortKey,
	type Vehicle
} from '$lib/data/vehicles';

export type InventoryView = '3' | '4' | 'map';

export type InventoryStateOptions = {
	searchParams?: URLSearchParams;
	view?: InventoryView | string;
};

export type InventoryState = {
	filters: InventoryFilters;
	searchParams: URLSearchParams;
	selected: Vehicle[];
	sort: SortKey;
	sortParam: string;
	view: InventoryView;
};

const sortParamToKey: Record<string, SortKey> = {
	'best-match': 'template',
	default: 'template',
	'highest-price': 'highest',
	'highest-year': 'year',
	'lowest-mileage': 'mileage',
	'lowest-price': 'lowest',
	mileage: 'mileage',
	newest: 'newest',
	'newest-listed': 'template',
	'newest-year': 'newest',
	'oldest-listed': 'template',
	year: 'year'
};

const getParam = (params: URLSearchParams, ...keys: string[]) => {
	for (const key of keys) {
		const value = params.get(key)?.trim();

		if (value) return value;
	}

	return undefined;
};

const getNumberParam = (params: URLSearchParams, ...keys: string[]) => {
	const value = getParam(params, ...keys);
	const parsed = value ? Number(value.replace(/[^\d.-]/g, '')) : Number.NaN;

	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const normalizeFilters = (filters: InventoryFilters) =>
	Object.fromEntries(
		Object.entries(filters).filter(([, value]) => {
			if (typeof value === 'number') return Number.isFinite(value);
			if (!value) return false;

			return String(value).trim().toLowerCase() !== 'all';
		})
	) as InventoryFilters;

export const resolveInventoryView = (value?: string | InventoryView | null): InventoryView => {
	if (value === '4' || value === 'dense' || value === 'grid4') return '4';
	if (value === 'map' || value === 'half-map' || value === 'halfmap') return 'map';

	return '3';
};

export const inventoryTemplateForView = (view: InventoryView) => {
	if (view === '4') return 'listing-grid4-columns.html';
	if (view === 'map') return 'listing-gridstyle-halfmap.html';

	return 'listing-grid3-columns.html';
};

export const viewForInventoryTemplate = (
	templateFile: string,
	options: InventoryStateOptions = {}
) => {
	if (options.view) return resolveInventoryView(options.view);
	if (options.searchParams?.get('view'))
		return resolveInventoryView(options.searchParams.get('view'));
	if (templateFile === 'listing-grid4-columns.html') return '4';
	if (templateFile === 'listing-gridstyle-halfmap.html' || templateFile === 'listing-topmap.html') {
		return 'map';
	}

	return '3';
};

export const getInventoryState = (
	templateFile: string,
	options: InventoryStateOptions = {}
): InventoryState => {
	const searchParams = new URLSearchParams(options.searchParams);
	const sortParam = getParam(searchParams, 'sort') ?? 'best-match';
	const sort = sortParamToKey[sortParam] ?? 'template';
	const filters: InventoryFilters = {
		bodyType: getParam(searchParams, 'body', 'bodyType', 'bodystyle'),
		brand: getParam(searchParams, 'brand'),
		condition: getParam(searchParams, 'condition') as InventoryFilters['condition'],
		fuel: getParam(searchParams, 'fuel', 'FuelType'),
		location: getParam(searchParams, 'location', 'city', 'area'),
		maxMileage: getNumberParam(searchParams, 'maxMileage', 'mileageTo'),
		maxPrice: getNumberParam(searchParams, 'maxPrice', 'priceTo', 'price'),
		maxYear: getNumberParam(searchParams, 'maxYear', 'yearTo'),
		minMileage: getNumberParam(searchParams, 'minMileage', 'mileageFrom'),
		minPrice: getNumberParam(searchParams, 'minPrice', 'priceFrom'),
		minYear: getNumberParam(searchParams, 'minYear', 'yearFrom'),
		query: getParam(searchParams, 'q', 'query', 'keyword', 'model'),
		sourceId: getParam(searchParams, 'sourceId', 'source', 'stockNumber', 'vin'),
		status: getParam(searchParams, 'status'),
		transmission: getParam(searchParams, 'transmission', 'Transmission', 'gearbox')
	};
	const normalizedFilters = normalizeFilters(filters);
	const filtered = filterVehicles(vehicles, normalizedFilters);

	return {
		filters: normalizedFilters,
		searchParams,
		selected: sortVehicles(filtered, sort),
		sort,
		sortParam,
		view: viewForInventoryTemplate(templateFile, options)
	};
};
