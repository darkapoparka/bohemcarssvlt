<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		Calculator,
		Car,
		CircleDollarSign,
		GitCompare,
		Heart,
		Home,
		Info,
		Menu,
		MessageCircle,
		PhoneCall,
		UserRound,
		Wrench,
		X
	} from '@lucide/svelte';

	let { pathname = '/' }: { pathname?: string } = $props();

	const mainItems = [
		{ href: '/', label: 'Начало', icon: Home, exact: true },
		{ href: '/inventory', label: 'Коли', icon: Car, exact: false },
		{ href: '/sell-your-car', label: 'Продай', icon: CircleDollarSign, exact: false },
		{ href: '/account/favorites', label: 'Любими', icon: Heart, exact: false }
	] as const;

	const menuSections = [
		{
			title: 'Автомобили',
			links: [
				{ href: '/inventory', label: 'Всички коли', icon: Car },
				{ href: '/import', label: 'Внос от Канада', icon: Wrench },
				{ href: '/compare', label: 'Сравни автомобили', icon: GitCompare },
				{ href: '/calculator', label: 'Калкулатор за внос', icon: Calculator }
			]
		},
		{
			title: 'Bohemcars',
			links: [
				{ href: '/sell-your-car', label: 'Продай автомобил', icon: CircleDollarSign },
				{ href: '/about', label: 'За нас', icon: Info },
				{ href: '/contact', label: 'Контакти', icon: MessageCircle },
				{ href: '/account', label: 'Вход / профил', icon: UserRound }
			]
		}
	] as const;

	const isActive = (href: string, exact = false) =>
		exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

	let menuOpen = $state(false);

	const toggleMenu = () => {
		menuOpen = !menuOpen;
	};

	const closeMenu = () => {
		menuOpen = false;
	};
</script>

<input
	id="mobile-bottom-menu-toggle"
	class="mobile-menu-toggle"
	type="checkbox"
	bind:checked={menuOpen}
	aria-hidden="true"
	tabindex="-1"
/>

<nav class="mobile-bottom-nav" aria-label="Мобилна навигация">
	<div class="mobile-bottom-nav__inner">
		{#each mainItems as item (item.href)}
			{@const Icon = item.icon}
			<a
				class:active={isActive(item.href, item.exact)}
				href={resolve(item.href as '/')}
				aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
			>
				<Icon size={21} strokeWidth={2.15} />
				<span>{item.label}</span>
			</a>
		{/each}
		<button
			type="button"
			class="mobile-bottom-nav__menu-trigger"
			aria-controls="mobile-bottom-menu"
			aria-expanded={menuOpen}
			aria-haspopup="dialog"
			onclick={toggleMenu}
		>
			<Menu size={21} strokeWidth={2.15} />
			<span>Меню</span>
		</button>
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
			<button type="button" aria-label="Затвори менюто" onclick={closeMenu}>
				<X size={22} strokeWidth={2.3} />
			</button>
		</div>

		<a class="mobile-menu-sheet__sell" href={resolve('/sell-your-car')}>
			<span>
				<CircleDollarSign size={21} strokeWidth={2.25} />
			</span>
			<strong>Продай автомобил</strong>
			<small>Бърза заявка за оценка</small>
		</a>

		<div class="mobile-menu-sheet__actions">
			<a href={resolve('/contact')}>
				<PhoneCall size={19} strokeWidth={2.25} />
				Обади се
			</a>
			<a href={resolve('/contact')}>
				<MessageCircle size={19} strokeWidth={2.25} />
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
							>
								<Icon size={20} strokeWidth={2.15} />
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
			padding-bottom: calc(72px + env(safe-area-inset-bottom));
		}

		.mobile-menu-toggle {
			position: fixed;
			display: block;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		:global(.progress-wrap) {
			display: none !important;
		}

		.mobile-bottom-nav {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 999;
			display: block;
			padding: 6px 10px calc(6px + env(safe-area-inset-bottom));
			background: rgba(255, 255, 255, 0.95);
			border-top: 1px solid rgba(28, 28, 28, 0.07);
			box-shadow: 0 -10px 24px rgba(28, 28, 28, 0.08);
			backdrop-filter: blur(16px);
		}

		.mobile-bottom-nav__inner {
			display: grid;
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 3px;
			max-width: 480px;
			margin: 0 auto;
		}

		.mobile-bottom-nav a,
		.mobile-bottom-nav__menu-trigger {
			display: flex;
			min-width: 0;
			min-height: 50px;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			gap: 2px;
			border: 0;
			border-radius: 8px;
			background: transparent;
			appearance: none;
			color: #687065;
			font-size: 11px;
			font-weight: 700;
			line-height: 14px;
			cursor: pointer;
			padding: 0;
			text-align: center;
		}

		.mobile-bottom-nav span {
			color: inherit;
			font-size: 11px;
			font-weight: 700;
			line-height: 14px;
		}

		.mobile-bottom-nav a.active,
		#mobile-bottom-menu-toggle:checked ~ .mobile-bottom-nav .mobile-bottom-nav__menu-trigger {
			background: #e9f1da;
			color: #4f7012;
		}

		.mobile-bottom-nav a:focus-visible,
		.mobile-bottom-nav__menu-trigger:focus-visible {
			background: #e9f1da;
			color: #4f7012;
			outline: 2px solid #1c1c1c;
			outline-offset: 2px;
		}

		.mobile-bottom-nav a.active {
			outline: 0;
		}

		.mobile-bottom-nav :global(svg) {
			flex: 0 0 auto;
			color: inherit;
			stroke: currentColor;
		}

		.mobile-menu-sheet {
			--mobile-menu-backdrop-opacity: 0;
			--mobile-menu-panel-y: 100%;

			position: fixed;
			inset: 0;
			z-index: 1000;
			display: block;
			visibility: hidden;
			pointer-events: none;
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
			opacity: var(--mobile-menu-backdrop-opacity);
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
			max-height: min(90dvh, 760px);
			overflow-y: auto;
			margin: 0;
			padding: 10px 14px calc(18px + env(safe-area-inset-bottom));
			border: 0;
			border-top: 1px solid #dfe5dc;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			box-shadow: 0 -18px 42px rgba(28, 28, 28, 0.18);
			transform: translateY(var(--mobile-menu-panel-y));
			transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
		}

		.mobile-menu-sheet__handle {
			display: block;
			width: 42px;
			height: 5px;
			justify-self: center;
			border-radius: 999px;
			background: #d7ded7;
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

		.mobile-menu-sheet__header button {
			display: flex;
			width: 42px;
			height: 42px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: #e9ede6;
			appearance: none;
			color: #1c1c1c;
			cursor: pointer;
			padding: 0;
		}

		.mobile-menu-sheet__sell {
			display: grid;
			grid-template-columns: 44px minmax(0, 1fr);
			gap: 2px 10px;
			align-items: center;
			border-radius: 8px;
			background: #d9f275;
			padding: 10px 12px;
			color: #111111;
		}

		.mobile-menu-sheet__sell span {
			display: flex;
			grid-row: 1 / span 2;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			border-radius: 8px;
			background: rgba(255, 255, 255, 0.72);
			color: #111111;
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
			font-size: 16px;
			font-weight: 900;
			line-height: 20px;
		}

		.mobile-menu-sheet__sell small {
			color: #4c5a14;
			font-size: 12px;
			font-weight: 800;
			line-height: 15px;
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
			border-radius: 8px;
			background: #98bc2a;
			color: #ffffff;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
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
			color: #728093;
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
			background: #eef1f5;
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
