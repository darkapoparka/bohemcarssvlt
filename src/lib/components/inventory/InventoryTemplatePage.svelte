<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
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

	const inventorySuffixFromForm = (form: HTMLFormElement) => {
		const params = new SvelteURLSearchParams();

		for (const [key, value] of new FormData(form).entries()) {
			if (typeof value !== 'string') continue;

			const trimmed = value.trim();
			const normalized = trimmed.toLowerCase();

			if (!trimmed || normalized === 'all' || (key === 'view' && normalized === '4')) continue;

			params.append(key, trimmed);
		}

		const query = params.toString();

		return query ? `?${query}` : '';
	};

	$effect(() => {
		if (browser) {
			document.body.className = pageDocument.bodyClass;
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
			.join(' ');
		const mergeBodyClasses = (...classNames: string[]) =>
			Array.from(
				new Set(classNames.flatMap((className) => className.trim().split(/\s+/)).filter(Boolean))
			).join(' ');

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
			'.bohemcars-inventory-searchbar',
			'.bohemcars-inventory-active-filters--results',
			'.bohemcars-inventory-content',
			'.bohemcars-map-fallback',
			'#filterSidebar'
		];
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
					'inner-page auxero-template-listing-gridstyle-halfmap-html'
				);
			}

			return mergeBodyClasses(
				inventoryBaseBodyClass,
				'inner-page auxero-template-listing-grid4-columns-html'
			);
		};

		const replaceOptionalNode = (selector: string, fresh: Document) => {
			const currentNode = root.querySelector<HTMLElement>(selector);
			const freshNode = fresh.querySelector<HTMLElement>(selector);

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

		const navigateInventory = async (suffix = '', historyMode: 'push' | 'replace' = 'push') => {
			setSidebarOpen(false);

			if (window.matchMedia('(max-width: 767.98px)').matches) {
				await goto(resolve(`/inventory${suffix}` as `/inventory${string}`));
				return;
			}

			const nextPath = resolve(`/inventory${suffix}` as `/inventory${string}`);
			const response = await fetch(nextPath, {
				cache: 'no-store',
				credentials: 'same-origin',
				headers: { 'x-bohemcars-inventory-sync': '1' }
			});

			if (!response.ok) {
				await goto(nextPath);
				return;
			}

			const fresh = new DOMParser().parseFromString(await response.text(), 'text/html');

			desktopInventorySelectors.forEach((selector) => replaceOptionalNode(selector, fresh));
			document.body.className = inventoryBodyClass(nextPath);
			if (historyMode === 'push') {
				window.history.pushState({}, '', nextPath);
			} else {
				window.history.replaceState({}, '', nextPath);
			}
			setSidebarOpen(false);
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

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && sidebar()?.classList.contains('active')) {
				event.preventDefault();
				setSidebarOpen(false);
			}
		};

		setSidebarOpen(false);
		document.addEventListener('click', handleClick, true);
		document.addEventListener('submit', handleSubmit, true);
		document.addEventListener('keydown', handleKeydown);
		window.addEventListener('popstate', handlePopState);

		return () => {
			document.removeEventListener('click', handleClick, true);
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

	@media (min-width: 768px) {
		:global(body.auxero-template-listing-grid3-columns-html),
		:global(body.auxero-template-listing-grid4-columns-html),
		:global(body.auxero-template-listing-gridstyle-halfmap-html),
		:global(body.auxero-template-listing-grid3-columns-html #wrapper),
		:global(body.auxero-template-listing-grid4-columns-html #wrapper),
		:global(body.auxero-template-listing-gridstyle-halfmap-html #wrapper),
		:global(body.auxero-template-listing-grid3-columns-html section.pb-100),
		:global(body.auxero-template-listing-grid4-columns-html section.pb-100),
		:global(body.auxero-template-listing-gridstyle-halfmap-html section.pb-100) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(
			body.auxero-template-listing-grid3-columns-html .bohemcars-inventory-searchbar__utility
		),
		:global(
			body.auxero-template-listing-grid4-columns-html .bohemcars-inventory-searchbar__utility
		),
		:global(
			body.auxero-template-listing-gridstyle-halfmap-html .bohemcars-inventory-searchbar__utility
		) {
			border: 0 !important;
			border-top: 1px solid var(--bc-border) !important;
			border-radius: 0 !important;
			background: transparent !important;
			box-shadow: none !important;
			margin-top: 12px !important;
			margin-bottom: 0 !important;
			padding: 12px 0 0 !important;
		}

		:global(
			body.auxero-template-listing-grid3-columns-html
				.bohemcars-inventory-toolbar-row
				.core-dropdown__button
		),
		:global(
			body.auxero-template-listing-grid4-columns-html
				.bohemcars-inventory-toolbar-row
				.core-dropdown__button
		),
		:global(
			body.auxero-template-listing-gridstyle-halfmap-html
				.bohemcars-inventory-toolbar-row
				.core-dropdown__button
		) {
			background: #f1f3ee !important;
			border-color: var(--bc-border) !important;
			box-shadow: none !important;
		}

		:global(body.auxero-template-listing-grid3-columns-html .bohemcars-inventory-content),
		:global(body.auxero-template-listing-grid4-columns-html .bohemcars-inventory-content),
		:global(body.auxero-template-listing-gridstyle-halfmap-html .bohemcars-inventory-content) {
			border: 0 !important;
			border-radius: 0 !important;
			background: transparent !important;
			box-shadow: none !important;
		}

		:global(
			body.auxero-template-listing-grid3-columns-html .bohemcars-inventory-content .card-box-style-1
		),
		:global(
			body.auxero-template-listing-grid4-columns-html .bohemcars-inventory-content .card-box-style-1
		),
		:global(
			body.auxero-template-listing-gridstyle-halfmap-html
				.bohemcars-inventory-content
				.card-box-style-1
		) {
			overflow: hidden !important;
			border: 0 !important;
			border-radius: 8px !important;
			background: var(--bc-card-bg) !important;
			box-shadow: none !important;
			transition: background-color 0.2s ease !important;
		}

		:global(
			body.auxero-template-listing-grid3-columns-html
				.bohemcars-inventory-content
				.card-box-style-1
				.content
		),
		:global(
			body.auxero-template-listing-grid4-columns-html
				.bohemcars-inventory-content
				.card-box-style-1
				.content
		),
		:global(
			body.auxero-template-listing-gridstyle-halfmap-html
				.bohemcars-inventory-content
				.card-box-style-1
				.content
		) {
			border-radius: 0 0 8px 8px !important;
			background: var(--bc-card-bg) !important;
			transition: background-color 0.2s ease !important;
		}

		:global(
			body.auxero-template-listing-grid3-columns-html
				.bohemcars-inventory-content
				.card-box-style-1:hover
		),
		:global(
			body.auxero-template-listing-grid3-columns-html
				.bohemcars-inventory-content
				.card-box-style-1.active
		),
		:global(
			body.auxero-template-listing-grid4-columns-html
				.bohemcars-inventory-content
				.card-box-style-1:hover
		),
		:global(
			body.auxero-template-listing-grid4-columns-html
				.bohemcars-inventory-content
				.card-box-style-1.active
		),
		:global(
			body.auxero-template-listing-gridstyle-halfmap-html
				.bohemcars-inventory-content
				.card-box-style-1:hover
		),
		:global(
			body.auxero-template-listing-gridstyle-halfmap-html
				.bohemcars-inventory-content
				.card-box-style-1.active
		) {
			background: var(--bc-card-hover) !important;
			box-shadow: none !important;
			transform: none !important;
		}

		:global(
			body.auxero-template-listing-grid3-columns-html
				.bohemcars-inventory-content
				.card-box-style-1:hover
				.content
		),
		:global(
			body.auxero-template-listing-grid3-columns-html
				.bohemcars-inventory-content
				.card-box-style-1.active
				.content
		),
		:global(
			body.auxero-template-listing-grid4-columns-html
				.bohemcars-inventory-content
				.card-box-style-1:hover
				.content
		),
		:global(
			body.auxero-template-listing-grid4-columns-html
				.bohemcars-inventory-content
				.card-box-style-1.active
				.content
		),
		:global(
			body.auxero-template-listing-gridstyle-halfmap-html
				.bohemcars-inventory-content
				.card-box-style-1:hover
				.content
		),
		:global(
			body.auxero-template-listing-gridstyle-halfmap-html
				.bohemcars-inventory-content
				.card-box-style-1.active
				.content
		) {
			background: var(--bc-card-hover) !important;
			box-shadow: none !important;
			transform: none !important;
		}
	}
</style>
