<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, pushState, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { HomeFiveHeaderData } from '$lib/auxero/home-five';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import HomeFiveHeader from '$lib/components/home/HomeFiveHeader.svelte';
	import InventoryMobilePage from './InventoryMobilePage.svelte';

	let {
		cards,
		copy,
		desktopHtml,
		header,
		mobile,
		pageDocument,
		seoTitle
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		desktopHtml: string;
		header?: HomeFiveHeaderData;
		mobile: InventoryMobileData;
		pageDocument: AuxeroPageDocument;
		seoTitle?: string;
	} = $props();

	const inventoryScopeBodyClass = 'bohemcars-inventory-template';
	const mergeBodyClasses = (...classNames: string[]) =>
		Array.from(
			new Set(classNames.flatMap((className) => className.trim().split(/\s+/)).filter(Boolean))
		).join(' ');

	const multiValueKeys = new Set([
		'bodyType',
		'bodystyle',
		'brand',
		'feature',
		'features',
		'FuelType',
		'fuel',
		'gearbox',
		'model',
		'Transmission',
		'transmission'
	]);
	const isAllFilterValue = (value: string) => {
		const normalized = value.trim().toLowerCase();

		return !normalized || normalized === 'all';
	};
	const uniqueFilterValues = (values: string[]) =>
		Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

	const inventorySuffixFromForm = (form: HTMLFormElement) => {
		const params = new SvelteURLSearchParams();
		const groupedValues: Record<string, string[]> = {};
		const searchValue = form.querySelector<HTMLInputElement>('input[name="q"]')?.value.trim() ?? '';

		for (const [key, value] of new FormData(form).entries()) {
			if (typeof value !== 'string') continue;

			const trimmed = value.trim();
			const normalized = trimmed.toLowerCase();

			if (!trimmed || normalized === 'all' || (key === 'view' && normalized === '4')) continue;
			if (key === 'model' && searchValue) continue;

			if (multiValueKeys.has(key)) {
				groupedValues[key] = [...(groupedValues[key] ?? []), trimmed];
				continue;
			}

			params.set(key, trimmed);
		}

		for (const [key, values] of Object.entries(groupedValues)) {
			params.set(key, uniqueFilterValues(values).join(','));
		}

		const query = params.toString();

		return query ? `?${query}` : '';
	};

	$effect(() => {
		if (browser) {
			document.body.className = mergeBodyClasses(pageDocument.bodyClass, inventoryScopeBodyClass);
		}
	});

	onMount(() => {
		const root = document.querySelector('.bohemcars-inventory-desktop-route');

		if (!root) return;

		const sidebar = () => root.querySelector<HTMLElement>('#filterSidebar');
		const toggle = () => root.querySelector<HTMLButtonElement>('#filterSidebarToggle');
		const originalOverflow = document.body.style.overflow;
		const inventoryBaseBodyClass = document.body.className
			.trim()
			.split(/\s+/)
			.filter(
				(className) =>
					className !== 'halfmap' && !className.startsWith('auxero-template-listing-grid')
			)
			.concat(inventoryScopeBodyClass)
			.join(' ');

		const setSidebarOpen = (open: boolean) => {
			const currentSidebar = sidebar();
			const currentToggle = toggle();
			const panel = currentSidebar?.querySelector<HTMLElement>('.filter-sidebar__panel');
			const overlay = currentSidebar?.querySelector<HTMLElement>('.filter-sidebar__overlay');
			const isRightSidebar = panel?.classList.contains('right-sidebar');

			currentSidebar?.classList.toggle('active', open);
			currentSidebar?.setAttribute('aria-hidden', String(!open));
			currentSidebar?.style.setProperty('opacity', open ? '1' : '0', 'important');
			currentSidebar?.style.setProperty('pointer-events', open ? 'auto' : 'none', 'important');
			currentSidebar?.style.setProperty('visibility', open ? 'visible' : 'hidden', 'important');
			panel?.style.setProperty(
				'left',
				!isRightSidebar ? (open ? '0' : '-400px') : 'auto',
				'important'
			);
			panel?.style.setProperty(
				'right',
				isRightSidebar ? (open ? '0' : '-400px') : 'auto',
				'important'
			);
			panel?.style.setProperty('transform', 'none', 'important');
			overlay?.style.setProperty('opacity', open ? '1' : '0', 'important');
			currentToggle?.setAttribute('aria-expanded', String(open));
			document.body.style.overflow = open ? 'hidden' : originalOverflow;
		};

		const inventoryHref = (href: string) => {
			const url = new URL(href, window.location.href);
			const inventoryPath = resolve('/inventory');

			if (url.origin !== window.location.origin || url.pathname !== inventoryPath) return undefined;

			return `${url.search}${url.hash}`;
		};
		const desktopInventorySelectors = [
			'.bohemcars-inventory-banner',
			'.bohemcars-inventory-main',
			'.bohemcars-inventory-active-filters--results',
			'.bohemcars-inventory-content',
			'.bohemcars-map-fallback'
		];
		let inventoryRequestId = 0;
		let inventoryAbortController: AbortController | undefined;
		const inventoryBodyClass = (path: string) => {
			const view = new URL(path, window.location.origin).searchParams.get('view');

			if (view === '3' || view === 'grid3' || view === 'comfortable') {
				return mergeBodyClasses(
					inventoryBaseBodyClass,
					'inner-page auxero-template-listing-grid3-columns-html'
				);
			}

			if (view === 'map' || view === 'half-map' || view === 'halfmap') {
				return mergeBodyClasses(
					inventoryBaseBodyClass,
					'inner-page halfmap auxero-template-listing-gridstyle-halfmap-html'
				);
			}

			return mergeBodyClasses(
				inventoryBaseBodyClass,
				'inner-page auxero-template-listing-grid4-columns-html'
			);
		};

		const replaceOptionalNode = (selector: string, fresh: Document) => {
			const currentNode = root.querySelector<HTMLElement>(selector);
			const freshRoot =
				fresh.querySelector<HTMLElement>('.bohemcars-inventory-desktop-route') ?? fresh;
			const freshNode = freshRoot.querySelector<HTMLElement>(selector);

			if (selector === '.bohemcars-inventory-banner') {
				if (!freshNode) return;

				if (currentNode) {
					currentNode.replaceWith(freshNode);
					return;
				}

				const stalePageTitle = root.querySelector<HTMLElement>(
					'.page-title, .page-title-style-4, .page-title-inner'
				);

				if (stalePageTitle) {
					stalePageTitle.replaceWith(freshNode);
					return;
				}

				root.querySelector('section.pb-100')?.before(freshNode);
				return;
			}

			if (currentNode && freshNode) {
				currentNode.replaceWith(freshNode);
				return;
			}

			if (currentNode && !freshNode) {
				currentNode.remove();
				return;
			}

			if (freshNode && selector === '.bohemcars-inventory-active-filters--results') {
				root.querySelector('.bohemcars-inventory-content')?.before(freshNode);
				return;
			}

			if (freshNode && selector === '.bohemcars-map-fallback') {
				root.querySelector('.bohemcars-inventory-content')?.after(freshNode);
			}
		};

		const shouldDocumentNavigate = (link: HTMLAnchorElement) => {
			if (link.matches('.open-modal, [data-modal-id]')) return false;

			const url = new URL(link.href, window.location.href);
			const inventoryPath = resolve('/inventory');

			if (url.origin !== window.location.origin) return false;
			if (url.pathname === inventoryPath || url.pathname.startsWith(`${inventoryPath}/`))
				return false;

			return true;
		};

		const navigateInventory = async (
			suffix = '',
			historyMode: 'push' | 'replace' = 'push',
			options: {
				closeSidebar?: boolean;
				preserveDropdownId?: string;
				restoreSidebarOpen?: boolean;
			} = {}
		) => {
			const closeSidebar = options.closeSidebar ?? true;
			const sidebarWasOpen = sidebar()?.classList.contains('active') ?? false;

			if (closeSidebar) setSidebarOpen(false);

			if (window.matchMedia('(max-width: 767.98px)').matches) {
				await goto(resolve(`/inventory${suffix}` as `/inventory${string}`));
				return;
			}

			const nextPath = resolve(`/inventory${suffix}` as `/inventory${string}`);
			const requestId = ++inventoryRequestId;
			inventoryAbortController?.abort();
			const abortController = new AbortController();
			inventoryAbortController = abortController;
			let response: Response;

			try {
				response = await fetch(nextPath, {
					cache: 'no-store',
					credentials: 'same-origin',
					headers: { 'x-bohemcars-inventory-sync': '1' },
					signal: abortController.signal
				});
			} catch (error) {
				if (abortController.signal.aborted) return;

				throw error;
			}

			if (requestId !== inventoryRequestId) return;

			if (!response.ok) {
				await goto(nextPath);
				return;
			}

			const fresh = new DOMParser().parseFromString(await response.text(), 'text/html');

			if (requestId !== inventoryRequestId) return;

			desktopInventorySelectors.forEach((selector) => replaceOptionalNode(selector, fresh));
			if (requestId !== inventoryRequestId) return;
			document.body.className = inventoryBodyClass(nextPath);
			if (historyMode === 'push') {
				pushState(nextPath, {});
			} else {
				replaceState(nextPath, {});
			}

			if (options.preserveDropdownId) {
				const preservedToggle = document.getElementById(options.preserveDropdownId);

				if (preservedToggle instanceof HTMLInputElement) {
					preservedToggle.checked = true;
				}
			}

			if (closeSidebar) {
				setSidebarOpen(false);
			} else {
				setSidebarOpen(options.restoreSidebarOpen ?? sidebarWasOpen);
			}

			if (requestId === inventoryRequestId) {
				inventoryAbortController = undefined;
			}
		};

		const handlePopState = () => {
			if (window.location.pathname !== resolve('/inventory')) return;

			void navigateInventory(window.location.search, 'replace');
		};

		const handleClick = (event: MouseEvent) => {
			if (!(event.target instanceof Element) || !root.contains(event.target)) return;

			if (event.target.closest('#filterSidebarToggle')) {
				event.preventDefault();
				event.stopImmediatePropagation();
				setSidebarOpen(true);
				return;
			}

			if (
				event.target.closest('#filterSidebarClose') ||
				event.target.closest('.filter-sidebar__overlay')
			) {
				event.preventDefault();
				event.stopImmediatePropagation();
				setSidebarOpen(false);
				return;
			}

			const link = event.target.closest('a[href]');
			if (
				link instanceof HTMLAnchorElement &&
				!event.metaKey &&
				!event.ctrlKey &&
				!event.shiftKey
			) {
				const nextUrl = inventoryHref(link.href);

				if (nextUrl !== undefined) {
					if (link.matches('[data-bohemcars-layout-toggle], [data-bohemcars-view-toggle]')) {
						event.preventDefault();
						event.stopImmediatePropagation();
						setSidebarOpen(false);
						void goto(resolve(`/inventory${nextUrl}` as `/inventory${string}`), {
							invalidateAll: true
						});
						return;
					}

					event.preventDefault();
					event.stopImmediatePropagation();

					void navigateInventory(nextUrl);
					return;
				}

				if (shouldDocumentNavigate(link)) {
					event.preventDefault();
					setSidebarOpen(false);
					window.location.assign(link.href);
				}
			}
		};

		const handleSubmit = (event: SubmitEvent) => {
			if (!(event.target instanceof HTMLFormElement) || !root.contains(event.target)) return;

			if (
				!event.target.matches(
					'.bohemcars-inventory-searchbar, .bohemcars-filter-form, .filter-sidebar form'
				)
			) {
				return;
			}

			event.preventDefault();
			event.stopImmediatePropagation();
			void navigateInventory(inventorySuffixFromForm(event.target));
		};

		const handleChange = (event: Event) => {
			if (!(event.target instanceof HTMLInputElement) || !root.contains(event.target)) return;
			if (!event.target.matches('input[data-inventory-filter-input]')) return;

			const input = event.target;
			const form = input.form;

			if (!form) return;

			const filterInputs = Array.from(form.elements).filter(
				(element): element is HTMLInputElement =>
					element instanceof HTMLInputElement &&
					element.dataset.inventoryFilterInput !== undefined &&
					element.name === input.name
			);

			if (input.type === 'checkbox') {
				if (isAllFilterValue(input.value) && input.checked) {
					for (const filterInput of filterInputs) {
						if (filterInput !== input) filterInput.checked = false;
					}
				}

				if (!isAllFilterValue(input.value) && input.checked) {
					for (const filterInput of filterInputs) {
						if (isAllFilterValue(filterInput.value)) filterInput.checked = false;
					}
				}

				if (
					!filterInputs.some(
						(filterInput) => filterInput.checked && !isAllFilterValue(filterInput.value)
					)
				) {
					for (const filterInput of filterInputs) {
						if (isAllFilterValue(filterInput.value)) filterInput.checked = true;
					}
				}
			}

			if (input.name === 'brand') {
				for (const modelInput of Array.from(form.elements).filter(
					(element): element is HTMLInputElement =>
						element instanceof HTMLInputElement &&
						element.dataset.inventoryFilterInput !== undefined &&
						element.name === 'model'
				)) {
					modelInput.checked = isAllFilterValue(modelInput.value);
				}
			}

			if (input.name === 'model' && input.checked) {
				const searchInput = form.querySelector<HTMLInputElement>('input[name="q"]');

				if (searchInput) searchInput.value = '';
			}

			const dropdownToggle = input
				.closest<HTMLElement>('[data-inventory-filter-field]')
				?.querySelector<HTMLInputElement>('.filter-select-dropdown__toggle');
			const sidebarOpen = input.closest('#filterSidebar')?.classList.contains('active') ?? false;

			event.stopImmediatePropagation();
			void navigateInventory(inventorySuffixFromForm(form), 'push', {
				closeSidebar: !sidebarOpen,
				preserveDropdownId: dropdownToggle?.id,
				restoreSidebarOpen: sidebarOpen
			});
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && sidebar()?.classList.contains('active')) {
				event.preventDefault();
				setSidebarOpen(false);
			}
		};

		setSidebarOpen(false);
		document.addEventListener('click', handleClick, true);
		document.addEventListener('change', handleChange, true);
		document.addEventListener('submit', handleSubmit, true);
		document.addEventListener('keydown', handleKeydown);
		window.addEventListener('popstate', handlePopState);

		return () => {
			document.removeEventListener('click', handleClick, true);
			document.removeEventListener('change', handleChange, true);
			document.removeEventListener('submit', handleSubmit, true);
			document.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('popstate', handlePopState);
			document.body.style.overflow = originalOverflow;
		};
	});
</script>

<div class="bohemcars-inventory-desktop-route">
	<AuxeroPageShell
		{pageDocument}
		beforeHtml={pageDocument.bodyHtml}
		afterHtml={desktopHtml}
		title={seoTitle}
	>
		<HomeFiveHeader {header} />
	</AuxeroPageShell>
</div>

<div class="bohemcars-inventory-mobile-route">
	<InventoryMobilePage {cards} {copy} {mobile} />
</div>

<style>
	.bohemcars-inventory-mobile-route {
		display: none;
	}

	@media (max-width: 767.98px) {
		.bohemcars-inventory-desktop-route {
			display: none;
		}

		.bohemcars-inventory-mobile-route {
			display: block;
		}
	}

	:global(.bohemcars-inventory-desktop-route #filterSidebar[aria-hidden='false']) {
		opacity: 1 !important;
		pointer-events: auto !important;
		visibility: visible !important;
	}

	:global(.bohemcars-inventory-desktop-route #filterSidebar[aria-hidden='true']) {
		opacity: 0 !important;
		pointer-events: none !important;
		visibility: hidden !important;
	}

	:global(
		.bohemcars-inventory-desktop-route #filterSidebar[aria-hidden='false'] .filter-sidebar__panel
	) {
		left: 0 !important;
		right: auto !important;
		transform: none !important;
	}

	:global(
		.bohemcars-inventory-desktop-route
			#filterSidebar[aria-hidden='true']
			.filter-sidebar__panel:not(.right-sidebar)
	) {
		left: -400px !important;
		right: auto !important;
		transform: none !important;
	}

	:global(
		.bohemcars-inventory-desktop-route
			#filterSidebar[aria-hidden='true']
			.filter-sidebar__panel.right-sidebar
	) {
		right: -400px !important;
		transform: none !important;
	}
</style>
