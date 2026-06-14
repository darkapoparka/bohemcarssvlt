<script lang="ts">
	import { resolve } from '$app/paths';
	import { ChevronDown, Heart, Mail, MapPin, Menu, Phone, Scale, Search, X } from '@lucide/svelte';
	import type { HomeFiveHeaderData } from '$lib/auxero/home-five';

	// Clean Svelte 5 + Tailwind v4 public header — topbar + main nav, no Auxero
	// theme classes / no app.css. Mega-menu items navigate (rich dropdown panels
	// are the next layer); nav stays fully functional in the meantime.
	let { header }: { header: HomeFiveHeaderData } = $props();

	const externalHref = (href: string) => ({ href });
	let mobileOpen = $state(false);
</script>

<header class="sticky top-0 z-50 font-bc-body">
	<!-- Topbar -->
	<div class="hidden border-b border-bc-border bg-bc-surface-soft md:block">
		<div class="mx-auto flex h-10 w-full max-w-[1440px] items-center justify-between px-4 text-[13px] text-bc-ink-soft">
			<div class="flex items-center gap-5">
				<a href={resolve(header.contact.addressHref as '/')} class="flex items-center gap-1.5 transition-colors hover:text-bc-accent-contrast">
					<MapPin size={15} strokeWidth={2} class="text-bc-accent" aria-hidden="true" />
					{header.contact.addressLabel}
				</a>
				<a {...externalHref(header.contact.phoneHref)} class="flex items-center gap-1.5 font-semibold transition-colors hover:text-bc-accent-contrast">
					<Phone size={15} strokeWidth={2} class="text-bc-accent" aria-hidden="true" />
					{header.contact.phoneLabel}
				</a>
			</div>
			<div class="flex items-center gap-5">
				<a href={resolve(header.contact.emailHref as '/')} class="flex items-center gap-1.5 transition-colors hover:text-bc-accent-contrast">
					<Mail size={15} strokeWidth={2} class="text-bc-accent" aria-hidden="true" />
					{header.contact.emailLabel}
				</a>
				<span class="flex items-center gap-1 font-semibold">
					{header.language.current}
					<ChevronDown size={13} strokeWidth={2.4} aria-hidden="true" />
				</span>
			</div>
		</div>
	</div>

	<!-- Main nav -->
	<div class="border-b border-bc-border bg-white">
		<div class="mx-auto flex h-[84px] w-full max-w-[1440px] items-center justify-between gap-6 px-4">
			<a href={resolve(header.logo.href as '/')} class="shrink-0">
				<img src={header.logo.src} alt={header.logo.alt} width="1285" height="235" class="h-12 w-auto" />
			</a>

			<nav class="hidden items-center gap-1 lg:flex" aria-label="Bohemcars">
				{#each header.navigation as item (item.href)}
					<a
						href={resolve(item.href as '/')}
						aria-current={item.active ? 'page' : undefined}
						class={[
							'flex items-center gap-1 rounded-bc-sm px-3 py-2 text-base font-semibold transition-colors hover:text-bc-accent-contrast',
							item.active ? 'text-bc-accent-contrast' : 'text-bc-ink'
						]}
					>
						{item.label}
						{#if item.megaMenu}
							<ChevronDown size={15} strokeWidth={2.4} class="text-bc-muted" aria-hidden="true" />
						{/if}
					</a>
				{/each}
			</nav>

			<div class="flex items-center gap-2">
				<button
					type="button"
					aria-label={header.ui.searchPlaceholder}
					class="hidden h-11 w-11 items-center justify-center rounded-full border border-bc-border text-bc-ink transition-colors hover:border-bc-accent hover:text-bc-accent-contrast sm:flex"
				>
					<Search size={19} strokeWidth={2} aria-hidden="true" />
				</button>
				<a
					href={resolve('/compare')}
					aria-label={header.ui.compare}
					class="relative hidden h-11 w-11 items-center justify-center rounded-full border border-bc-border text-bc-ink transition-colors hover:border-bc-accent hover:text-bc-accent-contrast sm:flex"
				>
					<Scale size={19} strokeWidth={2} aria-hidden="true" />
					{#if header.actionBadges.compare > 0}
						<span class="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bc-accent px-1 text-[10px] font-bold text-bc-accent-contrast">
							{header.actionBadges.compare}
						</span>
					{/if}
				</a>
				<a
					href={resolve('/account/favorites')}
					aria-label={header.ui.wishlist}
					class="relative hidden h-11 w-11 items-center justify-center rounded-full border border-bc-border text-bc-ink transition-colors hover:border-bc-accent hover:text-bc-accent-contrast sm:flex"
				>
					<Heart size={19} strokeWidth={2} aria-hidden="true" />
					{#if header.actionBadges.wishlist > 0}
						<span class="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bc-accent px-1 text-[10px] font-bold text-bc-accent-contrast">
							{header.actionBadges.wishlist}
						</span>
					{/if}
				</a>
				<a
					href={resolve('/account')}
					class="hidden h-12 items-center rounded-bc-md bg-bc-accent px-5 text-[15px] font-bold text-bc-accent-contrast transition-colors hover:bg-bc-accent-contrast hover:text-white sm:flex"
				>
					{header.ui.signIn}
				</a>
				<button
					type="button"
					aria-label="Menu"
					aria-expanded={mobileOpen}
					onclick={() => (mobileOpen = !mobileOpen)}
					class="flex h-11 w-11 items-center justify-center rounded-full border border-bc-border text-bc-ink transition-colors hover:border-bc-accent lg:hidden"
				>
					{#if mobileOpen}
						<X size={20} strokeWidth={2.2} aria-hidden="true" />
					{:else}
						<Menu size={20} strokeWidth={2.2} aria-hidden="true" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile nav -->
		{#if mobileOpen}
			<nav class="border-t border-bc-border bg-white px-4 py-3 lg:hidden" aria-label="Bohemcars mobile">
				<ul class="flex flex-col">
					{#each header.navigation as item (item.href)}
						<li>
							<a
								href={resolve(item.href as '/')}
								aria-current={item.active ? 'page' : undefined}
								class={[
									'flex min-h-12 items-center text-base font-semibold transition-colors hover:text-bc-accent-contrast',
									item.active ? 'text-bc-accent-contrast' : 'text-bc-ink'
								]}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
				<a
					href={resolve('/account')}
					class="mt-2 flex h-12 items-center justify-center rounded-bc-md bg-bc-accent text-[15px] font-bold text-bc-accent-contrast"
				>
					{header.ui.signIn}
				</a>
			</nav>
		{/if}
	</div>
</header>
