<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowRight,
		Calculator,
		CarFront,
		GitCompare,
		Info,
		MessageCircle,
		PhoneCall,
		UserRound,
		Wrench,
		X
	} from '@lucide/svelte';
	import CarFilled from '@tabler/icons-svelte/icons/car-filled';
	import HeartFilled from '@tabler/icons-svelte/icons/heart-filled';
	import HomeFilled from '@tabler/icons-svelte/icons/home-filled';
	import Menu2 from '@tabler/icons-svelte/icons/menu-2';
	import TagFilled from '@tabler/icons-svelte/icons/tag-filled';

	let { pathname = '/' }: { pathname?: string } = $props();

	const mainItems = [
		{
			href: '/',
			label: 'Начало',
			icon: HomeFilled,
			exact: true
		},
		{
			href: '/inventory',
			label: 'Коли',
			icon: CarFilled,
			exact: false,
			tone: 'commerce'
		},
		{
			href: '/sell-your-car',
			label: 'Продай',
			icon: TagFilled,
			exact: false,
			tone: 'commerce'
		},
		{
			href: '/account/favorites',
			label: 'Любими',
			icon: HeartFilled,
			exact: false
		}
	] as const;

	const menuSections = [
		{
			title: 'Автомобили',
			links: [
				{ href: '/inventory', label: 'Всички коли', icon: CarFront },
				{ href: '/import', label: 'Внос от Канада', icon: Wrench },
				{ href: '/compare', label: 'Сравни автомобили', icon: GitCompare },
				{ href: '/calculator', label: 'Калкулатор за внос', icon: Calculator }
			]
		},
		{
			title: 'Bohemcars',
			links: [
				{ href: '/about', label: 'За нас', icon: Info },
				{ href: '/contact', label: 'Контакти', icon: MessageCircle },
				{ href: '/account', label: 'Вход / профил', icon: UserRound }
			]
		}
	] as const;

	const isActive = (href: string, exact = false) =>
		exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
	const usesDocumentNavigation = (href: string) => href !== '/inventory';
	const handleNavigationClick = (event: MouseEvent, href: string) => {
		if (!usesDocumentNavigation(href)) return;
		if (event.defaultPrevented || event.button !== 0) return;
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

		const link = event.currentTarget as HTMLAnchorElement;
		if (link.target && link.target !== '_self') return;

		const nextUrl = new URL(link.href, window.location.href);
		if (
			nextUrl.pathname === window.location.pathname &&
			nextUrl.search === window.location.search
		) {
			event.preventDefault();
			return;
		}

		event.preventDefault();
		window.location.assign(link.href);
	};

	const itemClass = (item: (typeof mainItems)[number]) =>
		[
			'mobile-bottom-nav__item',
			'tone' in item && item.tone === 'commerce' && 'mobile-bottom-nav__item--commerce',
			isActive(item.href, item.exact) && 'active'
		]
			.filter(Boolean)
			.join(' ');
</script>

<input
	id="mobile-bottom-menu-toggle"
	class="mobile-menu-toggle"
	type="checkbox"
	aria-label="Отвори меню"
	aria-controls="mobile-bottom-menu"
/>

<nav class="mobile-bottom-nav" aria-label="Мобилна навигация">
	<div class="mobile-bottom-nav__inner">
		{#each mainItems as item (item.href)}
			{@const Icon = item.icon}
			<a
				class={itemClass(item)}
				href={resolve(item.href as '/')}
				aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
				data-sveltekit-reload={usesDocumentNavigation(item.href) ? '' : undefined}
				onclick={(event) => handleNavigationClick(event, item.href)}
			>
				<span class="mobile-bottom-nav__icon" aria-hidden="true">
					<Icon size={26} color="currentColor" stroke={2.4} />
				</span>
				<span class="mobile-bottom-nav__label">{item.label}</span>
			</a>
		{/each}
		<label
			for="mobile-bottom-menu-toggle"
			class="mobile-bottom-nav__menu-trigger"
			aria-controls="mobile-bottom-menu"
			aria-haspopup="dialog"
		>
			<span class="mobile-bottom-nav__icon mobile-bottom-nav__icon--menu" aria-hidden="true">
				<Menu2 size={27} color="currentColor" stroke={2.6} />
			</span>
			<span class="mobile-bottom-nav__label">Меню</span>
		</label>
	</div>
</nav>

<div
	class="mobile-menu-sheet"
	id="mobile-bottom-menu"
	role="dialog"
	aria-modal="true"
	aria-labelledby="mobile-bottom-menu-title"
>
	<label
		class="mobile-menu-sheet__backdrop"
		for="mobile-bottom-menu-toggle"
		aria-label="Затвори менюто"
	></label>
	<div class="mobile-menu-sheet__panel">
		<span class="mobile-menu-sheet__handle" aria-hidden="true"></span>

		<div class="mobile-menu-sheet__header">
			<div>
				<p>Bohemcars</p>
				<strong id="mobile-bottom-menu-title">Меню</strong>
			</div>
			<label
				for="mobile-bottom-menu-toggle"
				class="mobile-menu-sheet__close"
				aria-label="Затвори менюто"
			>
				<X size={22} strokeWidth={2.3} aria-hidden="true" />
			</label>
		</div>

		<a
			class="mobile-menu-sheet__sell"
			href={resolve('/sell-your-car')}
			data-sveltekit-reload=""
			onclick={(event) => handleNavigationClick(event, '/sell-your-car')}
		>
			<div class="mobile-menu-sheet__sell-copy">
				<strong>Продай автомобил</strong>
				<small>Безплатна оценка за минута</small>
			</div>
			<span class="mobile-menu-sheet__sell-arrow" aria-hidden="true">
				<ArrowRight size={18} strokeWidth={2.35} />
			</span>
			<img
				class="mobile-menu-sheet__sell-consultant"
				src="/assets/bohemcars/home2/home2-action-consultant.webp"
				alt=""
				aria-hidden="true"
				loading="lazy"
			/>
		</a>

		<div class="mobile-menu-sheet__actions">
			<a
				href={resolve('/contact')}
				data-sveltekit-reload=""
				onclick={(event) => handleNavigationClick(event, '/contact')}
			>
				<PhoneCall size={18} strokeWidth={2.1} />
				Обади се
			</a>
			<a
				href={resolve('/contact')}
				data-sveltekit-reload=""
				onclick={(event) => handleNavigationClick(event, '/contact')}
			>
				<MessageCircle size={18} strokeWidth={2.1} />
				Пиши ни
			</a>
		</div>

		<div class="mobile-menu-sheet__sections">
			{#each menuSections as section (section.title)}
				<section>
					<h2>{section.title}</h2>
					<div class="mobile-menu-sheet__links">
						{#each section.links as link (link.href)}
							{@const Icon = link.icon}
							<a
								class:active={isActive(link.href)}
								href={resolve(link.href as '/')}
								aria-current={isActive(link.href) ? 'page' : undefined}
								data-sveltekit-reload={usesDocumentNavigation(link.href) ? '' : undefined}
								onclick={(event) => handleNavigationClick(event, link.href)}
							>
								<Icon size={19} strokeWidth={2} />
								<span>{link.label}</span>
							</a>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</div>
</div>

<style>
	.mobile-menu-toggle,
	.mobile-bottom-nav,
	.mobile-menu-sheet {
		display: none;
	}

	@media (max-width: 767.98px) {
		:global(body) {
			padding-bottom: calc(70px + env(safe-area-inset-bottom));
		}

		:global(.progress-wrap) {
			display: none !important;
		}

		:global(body:has(#mobile-bottom-menu-toggle:checked)) {
			overflow: hidden;
		}

		.mobile-menu-toggle {
			position: fixed;
			right: max(4px, calc((100vw - 480px) / 2 + 4px));
			bottom: calc(5px + env(safe-area-inset-bottom));
			z-index: 1001;
			display: block;
			width: calc((min(100vw, 480px) - 8px) / 5);
			height: 54px;
			margin: 0;
			border: 0;
			opacity: 0;
			cursor: pointer;
			padding: 0;
			pointer-events: none;
		}

		.mobile-bottom-nav {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 999;
			display: block;
			padding: 5px 0 calc(5px + env(safe-area-inset-bottom));
			background: #ffffff;
			border-top: 1px solid rgba(28, 28, 28, 0.16);
			box-shadow: 0 -2px 12px rgba(28, 28, 28, 0.06);
		}

		.mobile-bottom-nav__inner {
			display: grid;
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 0;
			max-width: 480px;
			margin: 0 auto;
			padding: 0 4px;
		}

		.mobile-bottom-nav a,
		.mobile-bottom-nav__menu-trigger {
			position: relative;
			display: flex;
			min-width: 0;
			min-height: 56px;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			gap: 2px;
			border: 0;
			border-radius: 0;
			background: transparent;
			appearance: none;
			color: #4c5149;
			font-size: 11px;
			font-weight: 750;
			line-height: 14px;
			cursor: pointer;
			padding: 4px 0;
			text-align: center;
			text-decoration: none;
			transition:
				background-color 0.18s ease,
				color 0.18s ease;
		}

		.mobile-bottom-nav__icon {
			display: flex;
			width: 38px;
			height: 30px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			color: inherit;
			line-height: 0;
			transition:
				background-color 0.18s ease,
				color 0.18s ease;
		}

		.mobile-bottom-nav__label {
			color: inherit;
			font-size: 10.8px;
			font-weight: 750;
			line-height: 14px;
		}

		.mobile-bottom-nav a.mobile-bottom-nav__item--commerce {
			color: #4c5149;
		}

		.mobile-bottom-nav a.mobile-bottom-nav__item--commerce .mobile-bottom-nav__label {
			font-weight: 750;
		}

		.mobile-bottom-nav a.active,
		#mobile-bottom-menu-toggle:checked ~ .mobile-bottom-nav .mobile-bottom-nav__menu-trigger {
			background: transparent;
			color: #111111;
		}

		.mobile-bottom-nav a.active .mobile-bottom-nav__icon,
		#mobile-bottom-menu-toggle:checked
			~ .mobile-bottom-nav
			.mobile-bottom-nav__menu-trigger
			.mobile-bottom-nav__icon {
			background: #d9f275;
			color: #111111;
		}

		.mobile-bottom-nav a.active .mobile-bottom-nav__label,
		#mobile-bottom-menu-toggle:checked
			~ .mobile-bottom-nav
			.mobile-bottom-nav__menu-trigger
			.mobile-bottom-nav__label {
			font-weight: 900;
		}

		.mobile-bottom-nav a:focus-visible,
		#mobile-bottom-menu-toggle:focus-visible ~ .mobile-bottom-nav .mobile-bottom-nav__menu-trigger {
			background: var(--bc-surface);
			color: #17280b;
			outline: 2px solid #1c1c1c;
			outline-offset: -2px;
		}

		#mobile-bottom-menu-toggle:checked {
			pointer-events: none;
		}

		.mobile-bottom-nav a:hover,
		.mobile-bottom-nav__menu-trigger:hover {
			background: transparent;
			color: #17280b;
		}

		.mobile-bottom-nav a:hover .mobile-bottom-nav__icon,
		.mobile-bottom-nav__menu-trigger:hover .mobile-bottom-nav__icon {
			background: var(--bc-surface-soft);
		}

		.mobile-bottom-nav a.active:hover .mobile-bottom-nav__icon,
		#mobile-bottom-menu-toggle:checked
			~ .mobile-bottom-nav
			.mobile-bottom-nav__menu-trigger:hover
			.mobile-bottom-nav__icon {
			background: #d9f275;
		}

		.mobile-bottom-nav :global(svg) {
			flex: 0 0 auto;
			color: inherit;
		}

		.mobile-menu-sheet {
			--mobile-menu-backdrop-opacity: 0;
			--mobile-menu-panel-y: 100%;

			position: fixed;
			inset: 0;
			z-index: 1000;
			display: block;
			box-sizing: border-box;
			visibility: hidden;
			pointer-events: none;
		}

		.mobile-menu-sheet *,
		.mobile-menu-sheet *::before,
		.mobile-menu-sheet *::after {
			box-sizing: border-box;
		}

		#mobile-bottom-menu-toggle:checked ~ .mobile-menu-sheet {
			--mobile-menu-backdrop-opacity: 1;
			--mobile-menu-panel-y: 0;

			visibility: visible;
			pointer-events: auto;
		}

		.mobile-menu-sheet__backdrop {
			position: absolute;
			inset: 0;
			border: 0;
			background: rgba(28, 28, 28, 0.36);
			appearance: none;
			cursor: pointer;
			opacity: var(--mobile-menu-backdrop-opacity);
			padding: 0;
			transition: opacity 180ms ease;
		}

		.mobile-menu-sheet__panel {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: grid;
			gap: 12px;
			width: 100%;
			max-width: 100%;
			max-height: min(90dvh, 760px);
			overflow-y: auto;
			overflow-x: hidden;
			margin: 0;
			padding: 10px 14px calc(18px + env(safe-area-inset-bottom));
			border: 0;
			border-top: 1px solid var(--bc-border);
			border-radius: 22px 22px 0 0;
			background: var(--bc-bg);
			box-shadow: 0 -18px 42px rgba(28, 28, 28, 0.18);
			transform: translateY(var(--mobile-menu-panel-y));
			transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
		}

		#mobile-bottom-menu-toggle:checked ~ .mobile-menu-sheet .mobile-menu-sheet__panel {
			transform: translateY(0) !important;
		}

		.mobile-menu-sheet__handle {
			display: block;
			width: 42px;
			height: 5px;
			justify-self: center;
			border-radius: 999px;
			background: var(--bc-border);
		}

		.mobile-menu-sheet__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		.mobile-menu-sheet__header p,
		.mobile-menu-sheet__header strong {
			margin: 0;
			color: #1c1c1c;
			letter-spacing: 0;
		}

		.mobile-menu-sheet__header p {
			color: #6f766d;
			font-size: 12px;
			font-weight: 700;
			line-height: 16px;
			text-transform: uppercase;
		}

		.mobile-menu-sheet__header strong {
			display: block;
			font-size: 22px;
			font-weight: 700;
			line-height: 27px;
		}

		.mobile-menu-sheet__close {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface);
			appearance: none;
			color: #1c1c1c;
			cursor: pointer;
			padding: 0;
		}

		.mobile-menu-sheet__sell {
			position: relative;
			isolation: isolate;
			display: flex;
			width: 100%;
			max-width: 100%;
			min-width: 0;
			min-height: 68px;
			align-items: center;
			justify-content: space-between;
			gap: 14px;
			overflow: hidden;
			border-radius: 8px;
			background: #1c1c1c;
			padding: 12px clamp(94px, 31vw, 128px) 12px 14px;
			color: #ffffff;
			transition:
				background-color 0.18s ease,
				color 0.18s ease;
		}

		.mobile-menu-sheet__sell::after {
			position: absolute;
			inset: 0;
			z-index: -1;
			background: linear-gradient(90deg, rgba(28, 28, 28, 0) 54%, rgba(17, 17, 17, 0.42) 100%);
			content: '';
		}

		.mobile-menu-sheet__sell:hover,
		.mobile-menu-sheet__sell:focus-visible {
			background: #111111;
			color: #ffffff;
		}

		.mobile-menu-sheet__sell-copy {
			position: relative;
			z-index: 1;
			display: grid;
			gap: 2px;
			min-width: 0;
		}

		.mobile-menu-sheet__sell strong,
		.mobile-menu-sheet__sell small {
			display: block;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.mobile-menu-sheet__sell strong {
			color: #ffffff;
			font-size: 16px;
			font-weight: 900;
			line-height: 20px;
		}

		.mobile-menu-sheet__sell small {
			color: #d9f275;
			font-size: 12px;
			font-weight: 800;
			line-height: 15px;
		}

		.mobile-menu-sheet__sell-arrow {
			position: absolute;
			top: 50%;
			right: 12px;
			z-index: 2;
			display: flex;
			width: 30px;
			height: 30px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: #d9f275;
			color: #111111;
			transform: translateY(-50%);
		}

		.mobile-menu-sheet__sell-arrow :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		.mobile-menu-sheet__sell-consultant {
			position: absolute;
			right: 38px;
			bottom: -11px;
			z-index: 0;
			display: block;
			width: 82px;
			height: 82px;
			object-fit: contain;
			object-position: right bottom;
			opacity: 0.96;
			pointer-events: none;
			user-select: none;
		}

		@media (max-width: 360px) {
			.mobile-menu-sheet__panel {
				padding-right: 12px;
				padding-left: 12px;
			}

			.mobile-menu-sheet__sell {
				padding-right: 88px;
			}

			.mobile-menu-sheet__sell-consultant {
				right: 32px;
				width: 74px;
				height: 74px;
			}
		}

		.mobile-menu-sheet__actions {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}

		.mobile-menu-sheet__actions a {
			display: flex;
			min-height: 48px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: #ffffff;
			color: #14210a;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
		}

		.mobile-menu-sheet__actions a :global(svg),
		.mobile-menu-sheet__actions a :global(svg *) {
			color: currentColor !important;
			stroke: currentColor !important;
		}

		.mobile-menu-sheet__actions a:first-child {
			border-color: #d9f275;
			background: #d9f275;
			color: #14210a;
		}

		.mobile-menu-sheet__actions a:nth-child(2) {
			border-color: #111111;
			background: #111111;
			color: #ffffff;
		}

		.mobile-menu-sheet__actions a:hover,
		.mobile-menu-sheet__actions a:focus-visible {
			background: #1c1c1c;
			color: #ffffff;
		}

		.mobile-menu-sheet__sections {
			display: grid;
			gap: 13px;
		}

		.mobile-menu-sheet__sections section {
			display: grid;
			gap: 8px;
		}

		.mobile-menu-sheet__sections h2 {
			margin: 0;
			color: #626d7c;
			font-size: 12px;
			font-weight: 900;
			letter-spacing: 0;
			line-height: 16px;
			text-transform: uppercase;
		}

		.mobile-menu-sheet__links {
			display: grid;
			gap: 8px;
		}

		.mobile-menu-sheet__links a {
			display: flex;
			min-height: 48px;
			align-items: center;
			gap: 10px;
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 0 13px;
			color: #1c1c1c;
			font-size: 15px;
			font-weight: 700;
			line-height: 20px;
		}

		.mobile-menu-sheet__links a.active,
		.mobile-menu-sheet__links a:hover,
		.mobile-menu-sheet__links a:focus-visible {
			background: #d9f275;
			color: #1c1c1c;
		}
	}
</style>
