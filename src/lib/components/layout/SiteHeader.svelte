<script lang="ts">
	import { GitCompare, Heart, Menu, Plus, Search, User, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { bohemcarsAssets, isPrimaryNavActive, mainNavigation } from '$lib/data/bohemcars';
	import { cn } from '$lib/utils/cn';
	import { getGarageContext } from '$lib/state/garage.svelte';

	interface Props {
		variant?: 'home' | 'light';
		pathname?: string;
	}

	let { variant = 'light', pathname = '/' }: Props = $props();
	const garage = getGarageContext();
	let menuOpen = $state(false);
	let searchOpen = $state(false);
	let searchQuery = $state('');

	const navItems = mainNavigation;

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		const query = searchQuery.trim();
		const inventoryHref = resolve('/inventory');
		searchOpen = false;
		window.location.assign(
			query ? `${inventoryHref}?q=${encodeURIComponent(query)}` : inventoryHref
		);
	}
</script>

<header class={cn('site-header', variant === 'home' && 'site-header--home')}>
	<div class="site-header__inner">
		<a class="site-header__logo" href={resolve('/')} aria-label="Bohemcars home">
			<img
				src={variant === 'home' ? bohemcarsAssets.logoDark : bohemcarsAssets.logoLight}
				alt="Bohemcars"
			/>
		</a>

		<nav class={cn('site-nav', menuOpen && 'site-nav--open')} aria-label="Primary navigation">
			{#each navItems as item (item.href)}
				<a
					class={cn(
						'site-nav__link',
						isPrimaryNavActive(pathname, item) && 'site-nav__link--active'
					)}
					href={resolve(item.href)}
					onclick={() => (menuOpen = false)}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="site-header__actions">
			<a class="header-pill header-pill--outline" href={resolve('/account')} aria-label="Sign in">
				<User size={20} />
				<span>Sign In</span>
			</a>
			<a class="header-pill header-pill--solid" href={resolve('/sell-your-car')}>
				<Plus size={20} />
				<span>Sell Your Car</span>
			</a>
			<button
				class="icon-button"
				type="button"
				aria-label="Search"
				onclick={() => (searchOpen = true)}
			>
				<Search size={23} />
			</button>
			<a class="icon-button icon-button--badge" href={resolve('/compare')} aria-label="Compare">
				<GitCompare size={23} />
				<span>{garage.compare.length}</span>
			</a>
			<a
				class="icon-button icon-button--badge"
				href={resolve('/account/favorites')}
				aria-label="Wishlist"
			>
				<Heart size={23} />
				<span>{garage.favorites.length}</span>
			</a>
			<button
				class="icon-button site-header__menu"
				type="button"
				aria-label="Toggle navigation"
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>
	</div>
</header>

{#if searchOpen}
	<div class="search-modal" role="dialog" aria-modal="true" aria-label="Site search">
		<button
			class="search-modal__backdrop"
			type="button"
			aria-label="Close search"
			onclick={() => (searchOpen = false)}
		></button>
		<div class="search-modal__panel">
			<button
				class="search-modal__close"
				type="button"
				aria-label="Close search"
				onclick={() => (searchOpen = false)}
			>
				<X size={24} />
			</button>
			<p class="eyebrow">What are you looking for?</p>
			<form class="search-modal__form" onsubmit={submitSearch}>
				<input
					bind:value={searchQuery}
					placeholder="Search for anything"
					aria-label="Search inventory"
				/>
				<button class="btn btn-primary" type="submit">
					<Search size={20} />
					Search
				</button>
			</form>
		</div>
	</div>
{/if}
