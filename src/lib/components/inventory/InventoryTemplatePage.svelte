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

		const shouldDocumentNavigate = (link: HTMLAnchorElement) => {
			if (link.matches('.open-modal, [data-modal-id]')) return false;

			const url = new URL(link.href, window.location.href);
			const inventoryPath = resolve('/inventory');

			if (url.origin !== window.location.origin) return false;
			if (url.pathname === inventoryPath || url.pathname.startsWith(`${inventoryPath}/`))
				return false;

			return true;
		};

		const navigateInventory = (suffix = '') => {
			setSidebarOpen(false);
			void goto(resolve(`/inventory${suffix}` as `/inventory${string}`));
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

				if (nextUrl) {
					event.preventDefault();
					navigateInventory(nextUrl);
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
			navigateInventory(inventorySuffixFromForm(event.target));
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

		return () => {
			document.removeEventListener('click', handleClick, true);
			document.removeEventListener('submit', handleSubmit, true);
			document.removeEventListener('keydown', handleKeydown);
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
