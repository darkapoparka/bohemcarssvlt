<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveHeaderData,
		HomeFiveHeaderNavigationItem,
		HomeFiveHeaderSocial
	} from '$lib/auxero/home-five';
	import { MapPin, PhoneCall } from '@lucide/svelte';

	let {
		header,
		hideMobileLogo = false,
		showAddListing = false
	}: { header?: HomeFiveHeaderData; hideMobileLogo?: boolean; showAddListing?: boolean } = $props();

	const addListingHref = '/admin/inventory/new';
	const logoIntrinsicWidth = 1285;
	const logoIntrinsicHeight = 235;
	const routeNavMegaSuppressionClass = 'bohemcars-route-nav-click';
	let megaMenuSuppressionReadyToClear = false;

	const navItemClass = (item: HomeFiveHeaderNavigationItem) =>
		[
			'menu-item',
			item.megaMenu ? 'menu-item-has-children' : '',
			item.megaMenu?.variant === 'inventory' ? 'menu-item--static' : '',
			item.active ? 'current-menu-item menu-item-main' : ''
		]
			.filter(Boolean)
			.join(' ');

	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
	const clearMegaMenuSuppression = () => {
		if (!megaMenuSuppressionReadyToClear) return;
		document.documentElement.classList.remove(routeNavMegaSuppressionClass);
		megaMenuSuppressionReadyToClear = false;
	};
	const armMegaMenuSuppressionClear = () => {
		if (!document.documentElement.classList.contains(routeNavMegaSuppressionClass)) return;
		megaMenuSuppressionReadyToClear = true;
	};
	const suppressMegaMenuDuringNavigation = (event: MouseEvent) => {
		if (event.defaultPrevented || event.button !== 0) return;
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

		const link = event.currentTarget;
		if (!(link instanceof HTMLAnchorElement)) return;
		if (link.target && link.target !== '_self') return;

		const nextUrl = new URL(link.href, window.location.href);
		if (nextUrl.origin !== window.location.origin) return;
		if (
			nextUrl.pathname === window.location.pathname &&
			nextUrl.search === window.location.search
		) {
			return;
		}

		document.documentElement.classList.add(routeNavMegaSuppressionClass);
		megaMenuSuppressionReadyToClear = false;
	};
</script>

{#if header}
	<!-- Header -->
	<div class="header-wrapper-style-4">
		<header class="header header-style-4 bg-white" id="header_main">
			<div class="header-top-bar bg-primary relative">
				<div class="topbar-container header-spacing md-w-full md-min-w-full max-w-1920">
					<div class="flex items-center gap-24">
						<div class="md-gap-8 md flex gap-24">
							<a
								href={resolve(header.contact.addressHref as '/')}
								class="bohemcars-top-contact-link effect-svg-hover md-text-0 flex items-center gap-8 text-sm text-white"
							>
								<span class="bohemcars-top-contact-icon" aria-hidden="true">
									<MapPin size={20} strokeWidth={2.25} aria-hidden="true" />
								</span>
								{header.contact.addressLabel}
							</a>

							<a
								{...hrefAttributes(header.contact.phoneHref)}
								class="bohemcars-top-contact-link effect-svg-hover h7 md-text-0 flex items-center gap-8 text-white"
							>
								<span
									class="bohemcars-top-contact-icon bohemcars-top-contact-icon--accent"
									aria-hidden="true"
								>
									<PhoneCall size={18} strokeWidth={2.2} aria-hidden="true" />
								</span>
								{header.contact.phoneLabel}
							</a>
						</div>

						<div class="divider-vertical lg-hidden h-24"></div>

						<div>
							<div class="core-dropdown language-select" id="language-select">
								<button class="core-dropdown__button text-white" type="button">
									<span class="core-dropdown__label text-white">{header.language.current}</span>
									{@render chevronIcon('#fff')}
								</button>
								<div class="core-dropdown__menu" id="coreDropdownMenu">
									<ul class="core-dropdown__list">
										{#each header.language.options as option (option)}
											<li class="cursor-pointer text-sm">
												{option}
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div
						class="bohemcars-topbar-right header-top-bar--socical-wrapper flex items-center gap-24"
					>
						<a
							href={resolve(header.contact.emailHref as '/')}
							class="effect-svg-hover md-text-0 flex items-center gap-8 text-sm text-white"
						>
							{@render mailIcon()}
							{header.contact.emailLabel}
						</a>

						<ul class="header-top-bar--socical pl-24">
							{#each header.socialLinks as link (link.label)}
								<li>
									<a
										href={resolve(link.href as '/')}
										class="effect-svg-hover"
										aria-label={link.label}
									>
										{@render socialIcon(link)}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>

			<div class="header-container-fluid header-spacing min-height-header relative max-w-1920">
				<div class="header-inner" id="site-header-inner">
					<div class="logo">
						<a href={resolve(header.logo.href as '/')}>
							<img
								src={header.logo.src}
								alt={header.logo.alt}
								width={logoIntrinsicWidth}
								height={logoIntrinsicHeight}
							/>
						</a>
					</div>
					<div
						class="logo-mobile"
						hidden={hideMobileLogo}
						aria-hidden={hideMobileLogo ? 'true' : undefined}
						style={hideMobileLogo ? 'display: none !important; visibility: hidden !important;' : ''}
					>
						<a href={resolve(header.logo.href as '/')}>
							<img
								src={header.logo.mobileSrc}
								alt={header.logo.alt}
								width={logoIntrinsicWidth}
								height={logoIntrinsicHeight}
							/>
						</a>
					</div>

					<div class="header-right header-right-style-2 main-nav-wrapper gap-20">
						<!-- Menu -->
						<nav
							id="main-nav"
							class="main-nav"
							onpointerenter={clearMegaMenuSuppression}
							onpointerleave={armMegaMenuSuppressionClear}
						>
							<ul id="menu-primary-menu" class="menu menu">
								{#each header.navigation as item (item.href)}
									<li class={navItemClass(item)}>
										<a
											href={resolve(item.href as '/')}
											aria-haspopup={item.megaMenu ? 'true' : undefined}
											onclick={suppressMegaMenuDuringNavigation}
										>
											{item.label}
											{#if item.megaMenu}
												{@render chevronIcon('#1C1C1C')}
											{/if}
										</a>

										{#if item.megaMenu}
											{#if item.megaMenu.variant === 'inventory'}
												<div
													class="sub-menu sub-menu--full sub-menu--listing bohemcars-mega bohemcars-mega--vehicles"
												>
													<div class="bohemcars-mega__content">
														<div class="bohemcars-mega__vehicle-panel">
															<div class="sub-menu--listing-nav bohemcars-mega__vehicles">
																{#each item.megaMenu.vehicles as vehicle (vehicle.href)}
																	<a
																		class="bohemcars-mega-car"
																		href={resolve(vehicle.href as '/')}
																		onclick={suppressMegaMenuDuringNavigation}
																	>
																		<span class="bohemcars-mega-car__image-wrap">
																			<img
																				class="bohemcars-mega-car__image"
																				src={vehicle.image}
																				alt={vehicle.label}
																				loading="lazy"
																			/>
																		</span>
																		<span class="bohemcars-mega-car__title">{vehicle.label}</span>
																		<span class="bohemcars-mega-car__meta">{vehicle.meta}</span>
																		<span class="bohemcars-mega-car__actions">
																			<span>{header.ui.megaView}</span>
																			<span>{header.ui.megaDetails}</span>
																		</span>
																	</a>
																{/each}
															</div>

															<div class="bohemcars-mega__footer">
																<a
																	href={resolve(item.megaMenu.footer.ctaHref as '/')}
																	class="btn btn-primary btn-medium font-weight-600 bohemcars-mega__footer-button"
																	onclick={suppressMegaMenuDuringNavigation}
																>
																	{item.megaMenu.footer.ctaLabel}
																</a>
																<div class="bohemcars-mega__footer-copy">
																	<strong>{item.megaMenu.footer.title}</strong>
																	<span>{item.megaMenu.footer.copy}</span>
																</div>
															</div>
														</div>

														<div class="sub-menu--listing-image bohemcars-mega__links">
															{#each item.megaMenu.sections as section (section.title)}
																<div class="sub-menu-item-listing">
																	<p class="h5 menu-item-inner-title mb-16">
																		{section.title}
																		{@render subMenuTitleChevronIcon()}
																	</p>
																	<ul class="sub-menu-item-inner flex flex-col gap-16">
																		{#each section.links as link (link.href)}
																			<li>
																				<a
																					href={resolve(link.href as '/')}
																					onclick={suppressMegaMenuDuringNavigation}
																				>
																					{link.label}
																				</a>
																			</li>
																		{/each}
																	</ul>
																</div>
															{/each}
														</div>
													</div>
												</div>
											{:else}
												<ul class="sub-menu sub-menu--container">
													<li>
														{#each item.megaMenu.links as link (link.href)}
															<a
																href={resolve(link.href as '/')}
																onclick={suppressMegaMenuDuringNavigation}
															>
																{link.label}
															</a>
														{/each}
													</li>
												</ul>
											{/if}
										{/if}
									</li>
								{/each}
							</ul>
						</nav>
						<!-- Menu -->

						<div class="header-button mobile-hidden-header-button flex items-center gap-20">
							<!-- Sign In Button -->
							<a
								href={resolve('/account')}
								class="btn btn-primary-3 btn-large font-weight-600 bg-sign-in open-modal"
								data-modal-id="#LoginModal"
							>
								{@render userIcon('#fff')}
								{header.ui.signIn}
							</a>
							<!-- Sign In Button -->

							{#if showAddListing}
								<!-- Add Listing Button -->
								<a
									href={resolve(addListingHref as '/')}
									class="btn btn-primary btn-large font-weight-600"
								>
									{@render plusCircleIcon('#fff')}
									{header.ui.addListing}
								</a>
								<!-- Add Listing Button -->
							{/if}
						</div>

						<div class="header-actions ml-20">
							<label
								for="bohemcars-mobile-location-toggle"
								class="bohemcars-mobile-map"
								aria-label={header.contact.addressLabel}
								aria-controls="bohemcars-mobile-location-panel"
								aria-haspopup="dialog"
								title={header.contact.addressLabel}
							>
								<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
							</label>
							<a
								{...hrefAttributes(header.contact.phoneHref)}
								class="bohemcars-mobile-call"
								aria-label={header.contact.phoneLabel}
								title={header.contact.phoneLabel}
							>
								<PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" />
							</a>
							<div class="header-search-wrapper">
								<span class="header-action-btn relative" id="searchToggle">
									{@render searchIcon('#1C1C1C')}
								</span>
								<!-- Search Form -->
								<div class="search-form" id="searchForm">
									<form
										class="search-form__form"
										action="/inventory"
										method="get"
										data-bohemcars-search-form="inventory"
									>
										<input
											type="text"
											class="search-form__input"
											name="q"
											placeholder={header.ui.searchPlaceholder}
											autocomplete="off"
											id="searchInput"
										/>
									</form>
								</div>
								<!-- Search Form -->
							</div>

							<a
								href={resolve('/compare')}
								class="header-action-btn header-action-icon"
								aria-label={header.ui.compare}
								data-badge={header.actionBadges.compare}
							>
								{@render compareIcon('#1C1C1C')}
							</a>

							<a
								href={resolve('/account/favorites')}
								class="header-action-btn header-action-icon"
								aria-label={header.ui.wishlist}
								data-badge={header.actionBadges.wishlist}
							>
								{@render heartIcon('#1C1C1C')}
							</a>
							<div class="mobile-button"><span></span></div>
						</div>
					</div>
				</div>
			</div>
			<div class="wrapper-header-button hidden">
				<div class="header-button header-button-mobile flex items-center gap-20">
					<!-- Sign In Button -->
					<a
						href={resolve('/account')}
						class="btn btn-primary-3 btn-large font-weight-600 open-modal"
						data-modal-id="#LoginModal"
					>
						{@render userIcon('#fff')}
						{header.ui.signIn}
					</a>
					<!-- Sign In Button -->

					{#if showAddListing}
						<!-- Add Listing Button -->
						<a
							href={resolve(addListingHref as '/')}
							class="btn btn-primary btn-large font-weight-600"
						>
							{@render plusCircleIcon('#fff')}
							{header.ui.addListing}
						</a>
						<!-- Add Listing Button -->
					{/if}
				</div>
			</div>
		</header>
	</div>
	<!-- Header -->
{/if}

{#snippet chevronIcon(stroke: string)}
	<svg
		class="chevron-down icon-chevron"
		width="16"
		height="12"
		viewBox="0 0 16 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4 6.5L8 10.5L12 6.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet subMenuTitleChevronIcon()}
	<svg
		class="chevron-down lg-show hidden"
		width="16"
		height="12"
		viewBox="0 0 16 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4 6.5L8 10.5L12 6.5"
			stroke="#9FA1A4"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet mailIcon()}
	<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M15.4688 0H0.46875C0.34443 0 0.225201 0.049386 0.137294 0.137294C0.049386 0.225201 0 0.34443 0 0.46875V11.0938C0 11.3838 0.115234 11.662 0.320352 11.8671C0.52547 12.0723 0.803669 12.1875 1.09375 12.1875H14.8438C15.1338 12.1875 15.412 12.0723 15.6171 11.8671C15.8223 11.662 15.9375 11.3838 15.9375 11.0938V0.46875C15.9375 0.34443 15.8881 0.225201 15.8002 0.137294C15.7123 0.049386 15.5931 0 15.4688 0ZM7.96875 6.70781L1.67344 0.9375H14.2641L7.96875 6.70781ZM5.91172 6.09375L0.9375 10.6531V1.53437L5.91172 6.09375ZM6.60547 6.72969L7.65625 7.68906C7.74266 7.76812 7.85554 7.81196 7.97266 7.81196C8.08978 7.81196 8.20265 7.76812 8.28906 7.68906L9.33594 6.72969L14.2641 11.25H1.67422L6.60547 6.72969ZM10.0258 6.09375L15 1.53437V10.6531L10.0258 6.09375Z"
			fill="white"
		/>
	</svg>
{/snippet}

{#snippet socialIcon(link: HomeFiveHeaderSocial)}
	{#if link.icon === 'x'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M3.75 3.125H7.5L16.25 16.875H12.5L3.75 3.125Z"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8.89687 11.2129L3.75 16.8746"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16.2484 3.125L11.1016 8.78672"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if link.icon === 'instagram'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z"
				stroke="white"
				stroke-width="1.5"
			/>
			<path
				d="M13.75 2.5H6.25C4.17893 2.5 2.5 4.17893 2.5 6.25V13.75C2.5 15.8211 4.17893 17.5 6.25 17.5H13.75C15.8211 17.5 17.5 15.8211 17.5 13.75V6.25C17.5 4.17893 15.8211 2.5 13.75 2.5Z"
				stroke="white"
				stroke-width="1.5"
			/>
			<path
				d="M14.0625 6.71875C14.494 6.71875 14.8438 6.36897 14.8438 5.9375C14.8438 5.50603 14.494 5.15625 14.0625 5.15625C13.631 5.15625 13.2812 5.50603 13.2812 5.9375C13.2812 6.36897 13.631 6.71875 14.0625 6.71875Z"
				fill="white"
			/>
		</svg>
	{:else if link.icon === 'youtube'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M17.5 7.5C17.5 6.39543 16.6046 5.5 15.5 5.5H4.5C3.39543 5.5 2.5 6.39543 2.5 7.5V12.5C2.5 13.6046 3.39543 14.5 4.5 14.5H15.5C16.6046 14.5 17.5 13.6046 17.5 12.5V7.5Z"
				stroke="white"
				stroke-width="1.5"
			/>
			<path d="M8.75 7.75L12.5 10L8.75 12.25V7.75Z" fill="white" />
		</svg>
	{:else if link.icon === 'telegram'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.24939 10.5366L13.301 16.7186C13.3822 16.7903 13.4806 16.8396 13.5867 16.8618C13.6927 16.8839 13.8027 16.8781 13.9058 16.845C14.0089 16.8118 14.1016 16.7524 14.1749 16.6726C14.2481 16.5928 14.2994 16.4953 14.3236 16.3897L17.4994 2.59521C17.5025 2.58138 17.5018 2.56696 17.4973 2.55351C17.4928 2.54006 17.4848 2.52807 17.474 2.51884C17.4633 2.50961 17.4502 2.50348 17.4362 2.5011C17.4223 2.49873 17.4079 2.5002 17.3947 2.50537L1.56189 8.70146C1.4636 8.73929 1.38023 8.80798 1.3243 8.89722C1.26837 8.98646 1.2429 9.09143 1.2517 9.19638C1.26051 9.30133 1.30312 9.4006 1.37313 9.47927C1.44315 9.55794 1.5368 9.61178 1.64001 9.63271L6.24939 10.5366Z"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.25 10.5375L17.4539 2.50781"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.25 11.25L8.75 8.75L11.25 11.25L13.75 8.75"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.24382 16.4932C7.81923 17.405 9.67248 17.7127 11.458 17.359C13.2436 17.0053 14.8396 16.0143 15.9484 14.5708C17.0573 13.1273 17.6033 11.3298 17.4847 9.51341C17.3662 7.69704 16.5911 5.98577 15.304 4.69866C14.0169 3.41156 12.3056 2.63646 10.4892 2.51789C8.67284 2.39932 6.87533 2.94537 5.43182 4.05422C3.98831 5.16308 2.99733 6.75906 2.64363 8.54461C2.28993 10.3302 2.59766 12.1834 3.50944 13.7588L2.5321 16.6768C2.49538 16.7869 2.49005 16.9051 2.51671 17.0181C2.54337 17.131 2.60097 17.2344 2.68306 17.3165C2.76514 17.3985 2.86847 17.4561 2.98145 17.4828C3.09443 17.5095 3.2126 17.5041 3.32273 17.4674L6.24382 16.4932Z"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
{/snippet}

{#snippet userIcon(stroke: string)}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M3 20.25C4.81594 17.1122 8.11406 15 12 15C15.8859 15 19.1841 17.1122 21 20.25"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet plusCircleIcon(stroke: string)}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M8.25 12H15.75"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M12 8.25V15.75"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet searchIcon(stroke: string)}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15.8047 15.8047L21.0012 21.0012"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet compareIcon(stroke: string)}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M16.5 13.5L19.5 16.5L16.5 19.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 16.5H19.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M7.5 10.5L4.5 7.5L7.5 4.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.5 7.5H4.5"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet heartIcon(stroke: string)}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z"
			{stroke}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<style>
	.bohemcars-top-contact-link {
		transition:
			color 180ms ease,
			opacity 180ms ease;
	}

	.bohemcars-top-contact-icon {
		display: inline-flex;
		width: 22px;
		height: 22px;
		flex: 0 0 22px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: #d9f275;
		transition: color 180ms ease;
	}

	.bohemcars-top-contact-icon--accent {
		color: #d9f275;
	}

	.bohemcars-top-contact-icon :global(svg) {
		display: block;
		width: 20px;
		height: 20px;
		color: #d9f275;
		stroke: #d9f275;
	}

	.bohemcars-top-contact-icon :global(svg *) {
		stroke: #d9f275 !important;
	}

	.bohemcars-top-contact-link:hover .bohemcars-top-contact-icon,
	.bohemcars-top-contact-link:focus-visible .bohemcars-top-contact-icon {
		color: #ffffff;
	}

	.bohemcars-top-contact-link:hover .bohemcars-top-contact-icon :global(svg *),
	.bohemcars-top-contact-link:focus-visible .bohemcars-top-contact-icon :global(svg *) {
		stroke: #ffffff !important;
	}

	.bohemcars-topbar-right {
		justify-content: flex-end;
	}

	.bohemcars-mobile-call,
	.bohemcars-mobile-map {
		display: none;
	}

	:global(#language-select:not(.active) #coreDropdownMenu) {
		opacity: 0 !important;
		pointer-events: none !important;
		transform: translateY(-10px) !important;
		transition: none !important;
		visibility: hidden !important;
	}

	:global(#language-select.active #coreDropdownMenu) {
		pointer-events: auto !important;
	}

	:global(.header-wrapper-style-4 .header .header-action-btn.header-action-icon::after) {
		top: -6px;
		right: -9px;
		min-width: 17px;
		height: 17px;
		border: 2px solid #ffffff;
		background: #d9f275;
		box-shadow: 0 4px 12px rgba(28, 28, 28, 0.14);
		color: #1c1c1c;
		font-size: 10px;
		font-weight: 700;
	}

	@media (min-width: 768px) {
		:global(.header-wrapper-style-4 .header.header-style-4) {
			height: 145px;
			min-height: 145px;
		}

		:global(.header-wrapper-style-4 .header-top-bar) {
			height: 50px;
			min-height: 50px;
		}

		:global(.header-wrapper-style-4 .header-container-fluid),
		:global(.header-wrapper-style-4 .header-inner),
		:global(.header-wrapper-style-4 .header-right.main-nav-wrapper),
		:global(.header-wrapper-style-4 #main-nav) {
			height: 94px !important;
			min-height: 94px !important;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li > a) {
			align-items: center;
			border: 0 !important;
			box-sizing: border-box;
			display: inline-flex;
			height: 94px;
			padding-bottom: 0 !important;
			padding-top: 0 !important;
		}

		:global(.header-wrapper-style-4 .logo),
		:global(.header-wrapper-style-4 .logo a),
		:global(.header-wrapper-style-4 .logo img) {
			border: 0 !important;
			box-sizing: border-box;
		}

		:global(.header-wrapper-style-4 .logo) {
			display: flex !important;
			flex: 0 1 360px;
			width: min(360px, 31vw);
			max-width: 360px;
			align-items: center;
			min-width: 0;
		}

		:global(.header-wrapper-style-4 .logo a) {
			display: flex;
			width: 100%;
			height: 94px;
			align-items: center;
		}

		:global(.header-wrapper-style-4 .logo img) {
			display: block !important;
			width: auto !important;
			max-width: 100% !important;
			height: auto !important;
			max-height: 58px !important;
			object-fit: contain;
		}
	}

	@media (min-width: 1200px) {
		:global(.header-wrapper-style-4 .header-inner) {
			position: relative;
		}

		:global(.header-wrapper-style-4 .header-right.main-nav-wrapper) {
			display: flex !important;
			align-items: center;
			justify-content: flex-end;
			gap: 20px !important;
		}

		:global(.header-wrapper-style-4 #main-nav) {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			width: max-content;
			margin-right: auto !important;
			margin-left: auto !important;
			transform: none;
		}

		:global(.header-wrapper-style-4 #main-nav .menu > li) {
			display: flex;
			height: 94px;
			align-items: center;
		}

		:global(.header-wrapper-style-4 .header-actions) {
			margin-left: 20px !important;
		}
	}

	:global(.header-wrapper-style-4 .header-actions) {
		flex: 0 0 auto;
	}

	:global(.header-wrapper-style-4 .header .header-action-btn) {
		border: 0 !important;
		box-sizing: border-box;
		line-height: 1;
	}

	@media (min-width: 992px) {
		:global(.header-wrapper-style-4 .header-button .btn:hover),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible),
		:global(.header-wrapper-style-4 .header-button .btn:active) {
			border-color: var(--bc-hover-accent) !important;
			background: var(--bc-hover-accent) !important;
			background-color: var(--bc-hover-accent) !important;
			color: var(--bc-hover-accent-ink) !important;
			box-shadow: none !important;
			transform: none !important;
		}

		:global(.header-wrapper-style-4 .header-button .btn:hover svg),
		:global(.header-wrapper-style-4 .header-button .btn:hover svg *),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible svg),
		:global(.header-wrapper-style-4 .header-button .btn:focus-visible svg *) {
			color: currentColor !important;
			stroke: currentColor !important;
		}
	}

	:global(.header-wrapper-style-4 .header #searchToggle),
	:global(.header-wrapper-style-4 .header .header-action-btn.header-action-icon) {
		flex: 0 0 24px;
		width: 24px;
		height: 24px;
		padding: 0;
	}

	:global(.header-wrapper-style-4 .mobile-hidden-header-button) {
		flex: 0 0 auto;
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children > .sub-menu) {
		left: 50% !important;
		opacity: 0 !important;
		pointer-events: none !important;
		position: absolute !important;
		top: 100% !important;
		transform: translate(-50%, 15px) !important;
		visibility: hidden !important;
		z-index: 30;
	}

	:global(.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children:hover > .sub-menu),
	:global(
		.header-wrapper-style-4 #main-nav .menu > li.menu-item-has-children:focus-within > .sub-menu
	) {
		opacity: 1 !important;
		pointer-events: auto !important;
		transform: translate(-50%, 0) !important;
		visibility: visible !important;
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.bohemcars-mega--vehicles
	) {
		align-items: stretch;
		background: #ffffff;
		border: 1px solid #eceff3;
		border-radius: 0 0 18px 18px;
		box-shadow: 0 18px 36px rgba(17, 24, 39, 0.08);
		display: flex !important;
		flex-direction: column !important;
		flex-wrap: nowrap !important;
		gap: 0;
		left: 50vw !important;
		max-width: 1410px !important;
		opacity: 0 !important;
		overflow: hidden;
		padding: 0;
		pointer-events: none !important;
		position: fixed !important;
		right: auto !important;
		top: 144px !important;
		transform: translate(-50%, 15px) !important;
		transition:
			opacity 180ms ease,
			transform 180ms ease,
			visibility 180ms ease;
		visibility: hidden !important;
		width: min(1410px, calc(100vw - 60px)) !important;
		z-index: 30;
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static:hover
			.sub-menu.bohemcars-mega--vehicles
	) {
		opacity: 1 !important;
		pointer-events: auto !important;
		transform: translate(-50%, 0) !important;
		visibility: visible !important;
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static:focus-within
			.sub-menu.bohemcars-mega--vehicles
	) {
		opacity: 1 !important;
		pointer-events: auto !important;
		transform: translate(-50%, 0) !important;
		visibility: visible !important;
	}

	:global(
		html.bohemcars-route-nav-click
			.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.bohemcars-mega--vehicles
	) {
		opacity: 0 !important;
		pointer-events: none !important;
		transition: none !important;
		visibility: hidden !important;
	}

	:global(
		.header-wrapper-style-4
			.header.is-fixed.is-custom
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.bohemcars-mega--vehicles
	) {
		top: 58px !important;
	}

	:global(
		.header-wrapper-style-4
			#main-nav
			.menu
			> li.menu-item--static
			.sub-menu.bohemcars-mega--vehicles
			.bohemcars-mega__content
	) {
		align-items: stretch;
		display: flex;
		gap: 44px;
		padding: 30px 42px 32px;
		width: 100%;
	}

	:global(.bohemcars-mega__vehicle-panel) {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		justify-content: space-between;
		min-width: 0;
		width: auto;
	}

	:global(.bohemcars-mega__vehicles) {
		display: grid !important;
		gap: 18px 26px;
		grid-template-columns: repeat(4, minmax(150px, 1fr));
		width: 100% !important;
	}

	:global(.bohemcars-mega__links) {
		border-left: 1px solid #e7e7e7;
		display: grid !important;
		flex: 0 0 360px;
		gap: 22px;
		grid-template-columns: repeat(2, minmax(120px, 1fr));
		padding-left: 34px;
		width: 360px !important;
	}

	:global(.bohemcars-mega__links .sub-menu-item-listing) {
		min-width: 0;
	}

	:global(.bohemcars-mega__links .sub-menu-item-listing .h5) {
		font-size: 15px;
		line-height: 22px;
		margin-bottom: 12px;
	}

	:global(.bohemcars-mega__links .sub-menu-item-inner) {
		gap: 10px;
	}

	:global(.bohemcars-mega__links .sub-menu-item-inner a) {
		color: #5c5e62;
		font-size: 14px;
		line-height: 20px;
	}

	:global(.bohemcars-mega-car) {
		align-items: center;
		background: transparent;
		border-radius: 8px;
		color: #1c1c1c;
		display: flex !important;
		flex-direction: column;
		min-width: 0;
		padding: 4px 8px 8px !important;
		text-align: center;
		text-decoration: none;
	}

	:global(.bohemcars-mega-car:hover) {
		background: #f7f7f7;
	}

	:global(.bohemcars-mega-car__image-wrap) {
		align-items: end;
		display: flex;
		height: 112px;
		justify-content: center;
		margin-bottom: 7px;
		width: 100%;
	}

	:global(.bohemcars-mega-car__image) {
		display: block;
		height: 100%;
		max-width: 100%;
		object-fit: contain;
	}

	:global(.bohemcars-mega-car__title) {
		color: #1c1c1c;
		display: block;
		font-size: 17px;
		font-weight: 600;
		line-height: 24px;
		margin-bottom: 2px;
		white-space: nowrap;
	}

	:global(.bohemcars-mega-car__meta) {
		color: #5c5e62;
		display: block;
		font-size: 13px;
		line-height: 18px;
		margin-bottom: 8px;
		white-space: nowrap;
	}

	:global(.bohemcars-mega-car__actions) {
		display: flex;
		gap: 14px;
		justify-content: center;
	}

	:global(.bohemcars-mega-car__actions span) {
		color: #84a91f;
		font-size: 13px;
		line-height: 18px;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	:global(.bohemcars-mega__footer) {
		align-items: center;
		background: transparent;
		border-top: 1px solid #eceff3;
		display: flex;
		flex: 0 0 auto;
		gap: 22px;
		justify-content: flex-start;
		margin-top: 24px;
		padding: 16px 0 0;
		width: 100%;
	}

	:global(.bohemcars-mega__footer-button) {
		white-space: nowrap;
	}

	:global(.bohemcars-mega__footer-copy) {
		border-left: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-left: 22px;
	}

	:global(.bohemcars-mega__footer-copy strong) {
		color: #111827;
		font-size: 15px;
		line-height: 22px;
	}

	:global(.bohemcars-mega__footer-copy span) {
		color: #667085;
		font-size: 13px;
		line-height: 20px;
	}

	@media (max-width: 767.98px) {
		:global(#main-nav-mobile .sub-menu.bohemcars-mega--vehicles) {
			padding: 0 20px 16px;
		}

		:global(#main-nav-mobile .sub-menu.bohemcars-mega--vehicles .bohemcars-mega__content) {
			display: block;
			padding: 0;
		}

		:global(#main-nav-mobile .sub-menu.bohemcars-mega--vehicles .bohemcars-mega__vehicle-panel) {
			width: 100%;
		}

		:global(#main-nav-mobile .sub-menu.bohemcars-mega--vehicles .bohemcars-mega__vehicles) {
			display: grid;
			gap: 10px;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			margin-bottom: 16px;
		}

		:global(#main-nav-mobile .sub-menu.bohemcars-mega--vehicles .bohemcars-mega__links) {
			border-left: 0;
			display: grid;
			gap: 14px;
			grid-template-columns: 1fr;
			padding-left: 0;
			width: 100% !important;
		}

		:global(#main-nav-mobile .sub-menu.bohemcars-mega--vehicles .sub-menu-item-inner a) {
			color: #cfd2d8;
			font-size: 14px;
			line-height: 20px;
			padding-left: 40px;
		}

		:global(#main-nav-mobile .bohemcars-mega-car) {
			padding: 8px 0 !important;
		}

		:global(#main-nav-mobile .bohemcars-mega-car__image-wrap) {
			height: 62px;
			margin-bottom: 6px;
		}

		:global(#main-nav-mobile .bohemcars-mega-car__title) {
			color: #fff;
			font-size: 14px;
			line-height: 20px;
			white-space: normal;
		}

		:global(#main-nav-mobile .bohemcars-mega-car__meta) {
			display: none;
		}

		:global(#main-nav-mobile .bohemcars-mega-car__actions) {
			gap: 10px;
		}

		:global(#main-nav-mobile .bohemcars-mega__footer) {
			align-items: stretch;
			background: transparent;
			border-top: 1px solid rgba(255, 255, 255, 0.12);
			flex-direction: column;
			gap: 10px;
			padding: 14px 0 0;
		}

		:global(#main-nav-mobile .bohemcars-mega__footer-button) {
			height: 42px;
			width: 100%;
		}

		:global(#main-nav-mobile .bohemcars-mega__footer-copy) {
			border-left: 0;
			padding-left: 0;
			text-align: center;
		}

		:global(#main-nav-mobile .bohemcars-mega__footer-copy strong) {
			color: #fff;
			font-size: 13px;
			line-height: 18px;
		}

		:global(#main-nav-mobile .bohemcars-mega__footer-copy span) {
			color: #cfd2d8;
			font-size: 12px;
			line-height: 17px;
		}
	}

	@media (max-width: 767px) {
		:global(.header-wrapper-style-4 .header-top-bar),
		:global(.header-wrapper-style-4 .header-button),
		:global(.header-wrapper-style-4 .wrapper-header-button),
		:global(.header-wrapper-style-4 #main-nav),
		:global(.header-wrapper-style-4 .header-search-wrapper),
		:global(.header-wrapper-style-4 .header-action-btn.header-action-icon),
		:global(.header-wrapper-style-4 .mobile-button) {
			display: none !important;
		}

		:global(.header-wrapper-style-4 .header.header-style-4) {
			background: #ffffff !important;
			border-bottom: 1px solid #e8ece4;
			box-shadow: none;
			height: 64px !important;
			min-height: 64px !important;
		}

		:global(.header-wrapper-style-4 .header-container-fluid) {
			height: 64px !important;
			min-height: 64px !important;
			padding: 0 12px !important;
		}

		:global(.header-wrapper-style-4 .header-inner) {
			height: 64px;
			min-height: 64px;
		}

		:global(.header-wrapper-style-4 .logo) {
			display: flex !important;
			align-items: center;
			width: 176px;
		}

		:global(.header-wrapper-style-4 .logo-mobile) {
			display: none !important;
			visibility: hidden !important;
		}

		:global(.header-wrapper-style-4 .logo img) {
			display: block !important;
			visibility: visible !important;
			width: 142px !important;
			max-width: 142px;
			height: auto;
			max-height: none;
			filter: none;
		}

		:global(.header-wrapper-style-4 .main-nav .logo-mobile) {
			display: none !important;
		}

		:global(.header-wrapper-style-4 .header .header-right-style-2.header-right) {
			width: auto !important;
			margin-left: auto !important;
			gap: 0 !important;
			justify-content: flex-end !important;
		}

		:global(.header-wrapper-style-4 .header-actions) {
			position: absolute;
			top: 13px;
			right: 12px;
			display: flex;
			align-items: center;
			gap: 8px;
			margin-left: 0 !important;
			margin-right: 0 !important;
		}

		.bohemcars-mobile-call,
		.bohemcars-mobile-map {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: #ffffff;
			box-shadow: none;
			color: #1c1c1c;
			cursor: pointer;
			font: inherit;
			line-height: 1;
			padding: 0;
			text-decoration: none;
		}

		.bohemcars-mobile-call:focus-visible,
		.bohemcars-mobile-map:focus-visible {
			border-color: #1c1c1c;
			background: #1c1c1c;
			color: #ffffff;
			outline: 2px solid rgba(255, 255, 255, 0.92);
			outline-offset: 2px;
		}

		.bohemcars-mobile-call :global(svg),
		.bohemcars-mobile-map :global(svg) {
			width: 18px;
			height: 18px;
			color: currentColor;
			fill: none;
			stroke: currentColor;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-actions) {
			top: 8px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map) {
			position: relative;
			width: 44px !important;
			height: 44px !important;
			border: 0 !important;
			background: transparent !important;
			box-sizing: border-box;
			box-shadow: none;
			color: #20350f !important;
		}

		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call::before
		),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map::before
		) {
			position: absolute;
			inset: 2px;
			z-index: 0;
			border: 0;
			border-radius: inherit;
			background: #ffffff;
			box-sizing: border-box;
			content: '';
			pointer-events: none;
		}

		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call:focus-visible
		),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map:focus-visible
		) {
			background: transparent !important;
			color: #20350f !important;
			outline: 0;
		}

		:global(
			body.auxero-template-home-05-html
				.header-wrapper-style-4
				.bohemcars-mobile-call:focus-visible::before
		),
		:global(
			body.auxero-template-home-05-html
				.header-wrapper-style-4
				.bohemcars-mobile-map:focus-visible::before
		) {
			background: #ffffff;
			box-shadow: none;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call svg),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map svg) {
			position: relative;
			z-index: 1;
			width: 17px !important;
			height: 17px !important;
			color: #20350f !important;
			fill: none !important;
			stroke: #20350f !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call svg *),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map svg *) {
			fill: none !important;
			stroke: #20350f !important;
		}
	}
</style>
