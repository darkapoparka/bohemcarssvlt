<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeaderData } from '$lib/auxero/home-five';
	import { CircleDollarSign, Phone, UserRound } from '@lucide/svelte';

	let { header }: { header?: HomeFiveHeaderData } = $props();

	const home2Navigation = [
		{ href: '/inventory', label: 'Купи' },
		{ href: '/sell-your-car', label: 'Продай' },
		{ href: '/services', label: 'Внос от Канада' },
		{ href: '/inventory?view=4', label: 'Автомобили' },
		{ href: '/about', label: 'За нас' }
	] as const;
</script>

{#if header}
	<header class="home2-header">
		<div class="container">
			<div class="home2-header__inner">
				<a class="home2-header__logo" href={resolve(header.logo.href as '/')}>
					<img
						src="/assets/bohemcars/brand/bohemcars-logo-concept-light-template-clean.png"
						alt={header.logo.alt}
					/>
				</a>

				<nav class="home2-header__nav" aria-label="Основна навигация">
					{#each home2Navigation as item (item.href)}
						<a href={resolve(item.href as '/')}>{item.label}</a>
					{/each}
				</nav>

				<div class="home2-header__actions">
					<a
						class="home2-header__icon-action"
						href={resolve(header.contact.phoneHref as '/')}
						aria-label={header.contact.phoneLabel}
						title={header.contact.phoneLabel}
					>
						<Phone size={20} strokeWidth={2.35} />
					</a>
					<a
						class="home2-header__sell"
						href={resolve('/sell-your-car')}
						aria-label="Оценка за автомобил"
						title="Оценка за автомобил"
					>
						<CircleDollarSign size={20} strokeWidth={2.35} />
					</a>
					<a
						href={resolve('/account')}
						class="home2-header__icon-action open-modal"
						data-modal-id="#LoginModal"
						aria-label={header.ui.signIn}
						title={header.ui.signIn}
					>
						<UserRound size={20} strokeWidth={2.35} />
					</a>
				</div>
			</div>
		</div>
	</header>
{/if}

<style>
	.home2-header {
		background: #55d8cf;
		padding: 16px 0 10px;
		position: relative;
		z-index: 10;
	}

	.home2-header__inner {
		align-items: center;
		display: grid;
		gap: 24px;
		grid-template-columns: 230px minmax(0, 1fr) 172px;
		min-height: 58px;
	}

	.home2-header__logo {
		align-items: center;
		display: flex;
		height: 48px;
		width: 204px;
	}

	.home2-header__logo img {
		display: block;
		height: auto;
		max-height: 42px;
		object-fit: contain;
		width: 100%;
	}

	.home2-header__nav {
		align-items: center;
		display: flex;
		gap: 6px;
		justify-content: center;
		min-width: 0;
		place-self: center;
	}

	.home2-header__nav a {
		border-radius: 8px;
		color: #101514;
		font-size: 16px;
		font-weight: 500;
		line-height: 22px;
		padding: 10px 14px;
		white-space: nowrap;
	}

	.home2-header__nav a:hover,
	.home2-header__nav a:focus-visible {
		background: rgba(255, 255, 255, 0.56);
		color: #101514;
	}

	.home2-header__actions {
		align-items: center;
		display: flex;
		gap: 8px;
		justify-content: flex-end;
	}

	.home2-header__icon-action,
	.home2-header__sell {
		align-items: center;
		background: rgba(255, 255, 255, 0.42);
		border-radius: 999px;
		color: #101514 !important;
		display: flex;
		height: 44px;
		justify-content: center;
	}

	.home2-header__icon-action {
		width: 44px;
	}

	.home2-header__sell {
		padding: 0;
		width: 44px;
	}

	.home2-header__icon-action:hover,
	.home2-header__sell:hover {
		background: #ffffff;
		color: #101514 !important;
	}

	.home2-header__icon-action :global(svg),
	.home2-header__sell :global(svg) {
		color: inherit !important;
		flex: 0 0 auto;
		stroke: currentColor !important;
	}

	@media (max-width: 1199px) {
		.home2-header__inner {
			grid-template-columns: auto 1fr;
		}

		.home2-header__nav {
			display: none;
		}
	}

	@media (max-width: 767px) {
		.home2-header {
			padding-top: 14px;
		}

		.home2-header__inner {
			gap: 14px;
		}

		.home2-header__logo {
			width: 156px;
		}

		.home2-header__actions {
			gap: 6px;
		}

		.home2-header__icon-action,
		.home2-header__sell {
			height: 44px;
			padding: 0;
			width: 44px;
		}
	}
</style>
