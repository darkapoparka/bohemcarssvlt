import { bodyTypes, brands, fuels, vehicles, type InventoryFilters } from '$lib/data/vehicles';
import { translateVehicleTerm, type Locale } from '$lib/i18n/messages';
import type { InventoryState } from '$lib/server/inventory-state';

export type InventoryMobilePill = {
	active: boolean;
	href: string;
	image?: string;
	label: string;
};

export type InventoryMobileOption = {
	active: boolean;
	countLabel?: string;
	href: string;
	label: string;
	value: string;
};

export type InventoryMobileData = {
	activeFilters: InventoryMobilePill[];
	bodyLabel: string;
	bodyOptions: InventoryMobileOption[];
	brandOptions: InventoryMobileOption[];
	brandLabel: string;
	brandValue: string;
	clearHref: string;
	closeLabel: string;
	countLabel: string;
	doneLabel: string;
	drawerTitle: string;
	filterLabel: string;
	fuelLabel: string;
	fuelOptions: InventoryMobileOption[];
	hiddenInputs: Array<{ name: string; value: string }>;
	modelLabel: string;
	modelOptions: InventoryMobileOption[];
	modelValue: string;
	quickPills: InventoryMobilePill[];
	searchDrawerTitle: string;
	searchLabel: string;
	searchPlaceholder: string;
	searchValue: string;
	sortLabel: string;
	sortOptions: InventoryMobileOption[];
	totalPill: InventoryMobilePill;
};

const brandLogos: Record<string, string> = {
	Audi: '/assets/bohemcars/brands/audi.png',
	BMW: '/assets/bohemcars/brands/bmw.png',
	Ford: '/assets/bohemcars/brands/ford.png',
	Mazda: '/assets/bohemcars/brands/mazda.png',
	'Mercedes-Benz': '/assets/bohemcars/brands/mercedes-benz.png',
	Porsche: '/assets/bohemcars/brands/porsche.png',
	Toyota: '/assets/bohemcars/brands/toyota.png',
	Volkswagen: '/assets/bohemcars/brands/volkswagen.png'
};

const labels = (locale: Locale) =>
	locale === 'bg'
		? {
				all: 'Всички',
				allBodyTypes: 'Всички типове',
				allBrands: 'Всички марки',
				allWithCount: (count: number) => `Всички ${count}`,
				body: 'Тип купе',
				brand: 'Марка',
				clear: 'Изчисти',
				close: 'Затвори',
				done: 'Готово',
				drawerTitle: 'Филтри',
				filters: 'Филтри',
				fuel: 'Гориво',
				model: 'Модел',
				search: 'Търси',
				searchDrawerTitle: 'Намери автомобил',
				searchPlaceholder: 'Търси автомобили',
				sort: 'Сортирай',
				sortOptions: {
					'best-match': 'Най-подходящи',
					'highest-price': 'Най-висока цена',
					'lowest-mileage': 'Най-нисък пробег',
					'lowest-price': 'Най-ниска цена',
					'newest-listed': 'Най-нови обяви',
					'newest-year': 'Най-нова година'
				}
			}
		: {
				all: 'All',
				allBodyTypes: 'All body types',
				allBrands: 'All brands',
				allWithCount: (count: number) => `All ${count}`,
				body: 'Body type',
				brand: 'Brand',
				clear: 'Clear',
				close: 'Close',
				done: 'Done',
				drawerTitle: 'Filters',
				filters: 'Filters',
				fuel: 'Fuel',
				model: 'Model',
				search: 'Search',
				searchDrawerTitle: 'Find a car',
				searchPlaceholder: 'Search cars',
				sort: 'Sort',
				sortOptions: {
					'best-match': 'Best Match',
					'highest-price': 'Highest Price',
					'lowest-mileage': 'Lowest Mileage',
					'lowest-price': 'Lowest Price',
					'newest-listed': 'Newest Listed',
					'newest-year': 'Newest Year'
				}
			};

const countBy = (values: string[]) =>
	values.reduce((counts, value) => {
		counts.set(value, (counts.get(value) ?? 0) + 1);

		return counts;
	}, new Map<string, number>());

const inventoryUrl = (state: InventoryState, overrides: Record<string, string | null>) => {
	const params = new URLSearchParams(state.searchParams);

	for (const [key, value] of Object.entries(overrides)) {
		if (!value || (key === 'view' && value === '4') || (key === 'sort' && value === 'best-match')) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	}

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const quickUrl = (
	state: InventoryState,
	overrides: { bodyType?: string | null; brand?: string | null; fuel?: string | null } = {}
) => {
	const params = new URLSearchParams();
	const brand = Object.hasOwn(overrides, 'brand') ? overrides.brand : state.filters.brand;
	const bodyType = Object.hasOwn(overrides, 'bodyType')
		? overrides.bodyType
		: state.filters.bodyType;
	const fuel = Object.hasOwn(overrides, 'fuel') ? overrides.fuel : state.filters.fuel;

	if (state.sortParam !== 'best-match') params.set('sort', state.sortParam);
	if (state.filters.query) params.set('q', state.filters.query);
	if (brand) params.set('brand', brand);
	if (bodyType) params.set('bodyType', bodyType);
	if (fuel) params.set('fuel', fuel);

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const without = (state: InventoryState, keys: string[]) => {
	const params = new URLSearchParams(state.searchParams);

	for (const key of keys) params.delete(key);

	const query = params.toString();

	return `/inventory${query ? `?${query}` : ''}`;
};

const hiddenInputs = (filters: InventoryFilters, sortParam: string) =>
	[
		filters.brand ? { name: 'brand', value: filters.brand } : undefined,
		filters.bodyType ? { name: 'bodyType', value: filters.bodyType } : undefined,
		filters.fuel ? { name: 'fuel', value: filters.fuel } : undefined,
		sortParam !== 'best-match' ? { name: 'sort', value: sortParam } : undefined
	].filter((input): input is { name: string; value: string } => Boolean(input));

export const inventoryMobileDataFromState = (
	state: InventoryState,
	locale: Locale = 'en'
): InventoryMobileData => {
	const text = labels(locale);
	const brandCounts = countBy(vehicles.map((vehicle) => vehicle.brand));
	const bodyCounts = countBy(vehicles.map((vehicle) => vehicle.bodyType));
	const fuelCounts = countBy(vehicles.map((vehicle) => vehicle.fuel));
	const modelCounts = countBy(vehicles.map((vehicle) => vehicle.model).filter(Boolean));
	const selectedBrand = state.filters.brand?.toLowerCase();
	const selectedBody = state.filters.bodyType?.toLowerCase();
	const selectedFuel = state.filters.fuel?.toLowerCase();
	const selectedQuery = state.filters.query?.toLowerCase();
	const totalPill = {
		active: !selectedBrand && !selectedBody && !selectedFuel,
		href: quickUrl(state, { bodyType: null, brand: null, fuel: null }),
		label: text.allWithCount(state.selected.length)
	};
	const brandOptions: InventoryMobileOption[] = [
		{
			active: !selectedBrand,
			countLabel: String(vehicles.length),
			href: quickUrl(state, { brand: null }),
			label: text.allBrands,
			value: ''
		},
		...brands
			.map((brand) => ({
				active: selectedBrand === brand.toLowerCase(),
				count: brandCounts.get(brand) ?? 0,
				countLabel: String(brandCounts.get(brand) ?? 0),
				href: quickUrl(state, { brand }),
				label: brand === 'Mercedes-Benz' ? 'Mercedes' : brand,
				value: brand
			}))
			.filter((option) => option.count > 0)
			.sort((left, right) => right.count - left.count)
	];
	const brandPills = brands
		.map((brand) => ({
			active: selectedBrand === brand.toLowerCase(),
			count: brandCounts.get(brand) ?? 0,
			href: quickUrl(state, { brand }),
			image: brandLogos[brand],
			label: brand === 'Mercedes-Benz' ? 'Mercedes' : brand
		}))
		.filter((pill) => pill.count > 0)
		.sort((left, right) => right.count - left.count)
		.slice(0, 5);
	const bodyPills = bodyTypes
		.map((bodyType) => ({
			active: selectedBody === bodyType.toLowerCase(),
			count: bodyCounts.get(bodyType) ?? 0,
			href: quickUrl(state, {
				bodyType: selectedBody === bodyType.toLowerCase() ? null : bodyType
			}),
			label: translateVehicleTerm(locale, 'bodyTypes', bodyType)
		}))
		.filter((pill) => pill.count > 0 && pill.label !== 'Автомобил' && pill.label !== 'Car')
		.sort((left, right) => right.count - left.count)
		.slice(0, 4);
	const bodyOptions: InventoryMobileOption[] = [
		{
			active: !selectedBody,
			countLabel: String(vehicles.length),
			href: quickUrl(state, { bodyType: null }),
			label: text.allBodyTypes,
			value: ''
		},
		...bodyTypes
			.map((bodyType) => ({
				active: selectedBody === bodyType.toLowerCase(),
				count: bodyCounts.get(bodyType) ?? 0,
				countLabel: String(bodyCounts.get(bodyType) ?? 0),
				href: quickUrl(state, {
					bodyType: selectedBody === bodyType.toLowerCase() ? null : bodyType
				}),
				label: translateVehicleTerm(locale, 'bodyTypes', bodyType),
				value: bodyType
			}))
			.filter(
				(option) => option.count > 0 && option.label !== 'Автомобил' && option.label !== 'Car'
			)
			.sort((left, right) => right.count - left.count)
	];
	const modelOptions = Array.from(modelCounts.entries())
		.map(([model, count]) => ({
			active: selectedQuery === model.toLowerCase(),
			countLabel: String(count),
			href: inventoryUrl(state, { q: selectedQuery === model.toLowerCase() ? null : model }),
			label: model,
			value: model
		}))
		.sort((left, right) => {
			const countDelta = Number(right.countLabel) - Number(left.countLabel);

			return countDelta || left.label.localeCompare(right.label);
		});
	const fuelOptions = fuels
		.map((fuel) => ({
			active: selectedFuel === fuel.toLowerCase(),
			count: fuelCounts.get(fuel) ?? 0,
			href: quickUrl(state, {
				fuel: selectedFuel === fuel.toLowerCase() ? null : fuel
			}),
			label: translateVehicleTerm(locale, 'fuels', fuel),
			value: fuel
		}))
		.filter((option) => option.count > 0 && option.label !== '340 к.с.')
		.slice(0, 8);
	const activeFilters: InventoryMobilePill[] = [];

	if (state.filters.brand) {
		activeFilters.push({
			active: true,
			href: without(state, ['brand']),
			label: state.filters.brand
		});
	}

	if (state.filters.bodyType) {
		activeFilters.push({
			active: true,
			href: without(state, ['body', 'bodyType', 'bodystyle']),
			label: translateVehicleTerm(locale, 'bodyTypes', state.filters.bodyType)
		});
	}

	if (state.filters.fuel) {
		activeFilters.push({
			active: true,
			href: without(state, ['fuel', 'FuelType']),
			label: translateVehicleTerm(locale, 'fuels', state.filters.fuel)
		});
	}

	if (state.filters.query) {
		activeFilters.push({
			active: true,
			href: without(state, ['q', 'query', 'keyword', 'model']),
			label: state.filters.query
		});
	}

	return {
		activeFilters,
		bodyLabel: text.body,
		bodyOptions,
		brandOptions,
		brandLabel: text.brand,
		brandValue: state.filters.brand ?? text.all,
		clearHref: '/inventory',
		closeLabel: text.close,
		countLabel: text.allWithCount(state.selected.length),
		doneLabel: text.done,
		drawerTitle: text.drawerTitle,
		filterLabel: text.filters,
		fuelLabel: text.fuel,
		fuelOptions,
		hiddenInputs: hiddenInputs(state.filters, state.sortParam),
		modelLabel: text.model,
		modelOptions,
		modelValue: state.filters.query ?? text.all,
		quickPills: [totalPill, ...brandPills, ...bodyPills],
		searchDrawerTitle: text.searchDrawerTitle,
		searchLabel: text.search,
		searchPlaceholder: text.searchPlaceholder,
		searchValue: state.filters.query ?? '',
		sortLabel: text.sort,
		sortOptions: Object.entries(text.sortOptions).map(([value, label]) => ({
			active: state.sortParam === value,
			href: inventoryUrl(state, { sort: value }),
			label,
			value
		})),
		totalPill
	};
};
