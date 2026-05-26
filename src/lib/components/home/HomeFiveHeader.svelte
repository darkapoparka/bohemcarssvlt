<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeaderData, HomeFiveHeaderSocial } from '$lib/auxero/home-five';

	let { header }: { header?: HomeFiveHeaderData } = $props();

	const addListingHref = '/admin/inventory/new';
</script>

{#if header}
	<!-- Header -->
	<div class="header-wrapper-style-4">
		<header class="header header-style-4 header-blur" id="header_main">
			<div class="header-top-bar bg-primary relative">
				<div class="topbar-container header-spacing md-w-full md-min-w-full max-w-1920">
					<div class="flex gap-24">
						<div class="md-gap-8 md flex gap-24">
							<a
								href={resolve(header.contact.addressHref as '/')}
								class="effect-svg-hover md-text-0 flex items-center gap-8 text-sm text-white"
							>
								{@render mapPinIcon()}
								{header.contact.addressLabel}
							</a>

							<a
								href={resolve(header.contact.emailHref as '/')}
								class="effect-svg-hover md-text-0 flex items-center gap-8 text-sm text-white"
							>
								{@render mailIcon()}
								{header.contact.emailLabel}
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

					<div class="header-top-bar--socical-wrapper flex items-center gap-24">
						<a
							href={resolve(header.contact.phoneHref as '/')}
							class="effect-svg-hover h7 md-text-0 flex items-center gap-8 text-white"
						>
							{@render phoneIcon()}
							{header.contact.phoneLabel}
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
							<img src={header.logo.src} alt={header.logo.alt} />
						</a>
					</div>
					<div class="logo-mobile">
						<a href={resolve(header.logo.href as '/')}>
							<img src={header.logo.mobileSrc} alt={header.logo.alt} />
						</a>
					</div>

					<div class="header-right header-right-style-2 main-nav-wrapper gap-20">
						<!-- Menu -->
						<nav id="main-nav" class="main-nav margin-right-auto">
							<ul id="menu-primary-menu" class="menu menu style-2">
								{#each header.navigation as item (item.href)}
									<li
										class={item.active ? 'menu-item current-menu-item menu-item-main' : 'menu-item'}
									>
										<a href={resolve(item.href as '/')}>{item.label}</a>
									</li>
								{/each}
							</ul>
						</nav>
						<!-- Menu -->

						<div class="header-button mobile-hidden-header-button flex items-center gap-20">
							<!-- Sign In Button -->
							<a
								href={resolve('/account')}
								class="btn btn-line-white btn-large font-weight-600 bg-sign-in open-modal"
								data-modal-id="#LoginModal"
							>
								{@render userIcon('#fff')}
								Sign In
							</a>
							<!-- Sign In Button -->

							<!-- Add Listing Button -->
							<a
								href={resolve(addListingHref as '/')}
								class="btn btn-white btn-large font-weight-600"
							>
								{@render plusCircleIcon('#1C1C1C')}
								Add Listing
							</a>
							<!-- Add Listing Button -->
						</div>

						<div class="header-actions ml-20">
							<div class="header-search-wrapper">
								<span class="header-action-btn relative" id="searchToggle">
									{@render searchIcon()}
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
											placeholder="Search Bohemcars inventory"
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
								aria-label="Compare"
								data-badge={header.actionBadges.compare}
							>
								{@render compareIcon()}
							</a>

							<a
								href={resolve('/account/favorites')}
								class="header-action-btn header-action-icon"
								aria-label="Wishlist"
								data-badge={header.actionBadges.wishlist}
							>
								{@render heartIcon()}
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
						class="btn btn-primary btn-large font-weight-600 open-modal"
						data-modal-id="#LoginModal"
					>
						{@render userIcon('#1C1C1C')}
						Sign In
					</a>
					<!-- Sign In Button -->

					<!-- Add Listing Button -->
					<a
						href={resolve(addListingHref as '/')}
						class="btn btn-primary btn-large font-weight-600"
					>
						{@render plusCircleIcon('#fff')}
						Add Listing
					</a>
					<!-- Add Listing Button -->
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

{#snippet mapPinIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M10 5.15625C9.41284 5.15625 8.83886 5.33036 8.35065 5.65657C7.86244 5.98278 7.48193 6.44644 7.25723 6.98891C7.03254 7.53138 6.97374 8.12829 7.08829 8.70417C7.20284 9.28006 7.48559 9.80904 7.90078 10.2242C8.31596 10.6394 8.84494 10.9222 9.42083 11.0367C9.99671 11.1513 10.5936 11.0925 11.1361 10.8678C11.6786 10.6431 12.1422 10.2626 12.4684 9.77435C12.7946 9.28614 12.9688 8.71216 12.9688 8.125C12.9688 7.33764 12.656 6.58253 12.0992 6.02578C11.5425 5.46903 10.7874 5.15625 10 5.15625ZM10 10.1562C9.59826 10.1562 9.20554 10.0371 8.8715 9.81392C8.53746 9.59073 8.27711 9.27349 8.12337 8.90233C7.96963 8.53116 7.9294 8.12275 8.00778 7.72872C8.08616 7.3347 8.27961 6.97276 8.56369 6.68869C8.84776 6.40461 9.2097 6.21116 9.60372 6.13278C9.99775 6.0544 10.4062 6.09463 10.7773 6.24837C11.1485 6.40211 11.4657 6.66246 11.6889 6.9965C11.9121 7.33054 12.0312 7.72326 12.0312 8.125C12.0312 8.66372 11.8172 9.18038 11.4363 9.56131C11.0554 9.94224 10.5387 10.1562 10 10.1562ZM10 1.40625C8.21871 1.40832 6.51097 2.11685 5.25141 3.37641C3.99185 4.63597 3.28332 6.34371 3.28125 8.125C3.28125 10.5398 4.40156 13.1047 6.52109 15.5422C7.47774 16.6478 8.55442 17.6435 9.73125 18.5109C9.81003 18.5661 9.90385 18.5956 10 18.5956C10.0961 18.5956 10.19 18.5661 10.2688 18.5109C11.4456 17.6435 12.5223 16.6478 13.4789 15.5422C15.5984 13.1047 16.7188 10.5422 16.7188 8.125C16.7167 6.34371 16.0082 4.63597 14.7486 3.37641C13.489 2.11685 11.7813 1.40832 10 1.40625ZM10 17.5398C8.82812 16.6352 4.21875 12.7828 4.21875 8.125C4.21875 6.59172 4.82784 5.12123 5.91204 4.03704C6.99623 2.95284 8.46672 2.34375 10 2.34375C11.5333 2.34375 13.0038 2.95284 14.088 4.03704C15.1722 5.12123 15.7812 6.59172 15.7812 8.125C15.7812 12.7828 11.1719 16.6352 10 17.5398Z"
			fill="white"
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

{#snippet phoneIcon()}
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M9.39063 0.972052C9.4065 0.912527 9.43395 0.856715 9.47141 0.807805C9.50886 0.758896 9.55559 0.717849 9.60892 0.687012C9.66225 0.656175 9.72113 0.636153 9.78221 0.62809C9.84328 0.620026 9.90535 0.624081 9.96485 0.640021C11.097 0.935349 12.13 1.52718 12.9574 2.35454C13.7847 3.1819 14.3766 4.21487 14.6719 5.34705C14.6878 5.40656 14.6919 5.46862 14.6838 5.5297C14.6758 5.59077 14.6557 5.64965 14.6249 5.70298C14.5941 5.75631 14.553 5.80304 14.5041 5.8405C14.4552 5.87795 14.3994 5.9054 14.3399 5.92127C14.3004 5.93179 14.2596 5.93704 14.2188 5.9369C14.1155 5.93696 14.0151 5.90291 13.9331 5.84004C13.8512 5.77718 13.7923 5.68901 13.7656 5.58924C13.5121 4.61673 13.0038 3.72942 12.2931 3.01877C11.5825 2.30811 10.6952 1.79982 9.72266 1.54627C9.66314 1.5304 9.60733 1.50295 9.55842 1.4655C9.50951 1.42804 9.46846 1.38131 9.43762 1.32798C9.40679 1.27465 9.38677 1.21577 9.3787 1.1547C9.37064 1.09362 9.37469 1.03156 9.39063 0.972052ZM15.3039 11.6244C15.1701 12.6457 14.6689 13.5833 13.8941 14.2619C13.1192 14.9405 12.1238 15.3138 11.0938 15.3119C4.97657 15.3119 0 10.3353 0 4.21815C-0.00196546 3.18849 0.370961 2.19333 1.04913 1.41855C1.72729 0.643772 2.66431 0.142365 3.68516 0.00798942C3.92016 -0.0205687 4.15808 0.027887 4.36319 0.146079C4.56831 0.264271 4.72953 0.44582 4.82266 0.663458L6.4711 4.34315C6.54389 4.50973 6.574 4.69183 6.55872 4.87298C6.54345 5.05412 6.48326 5.2286 6.3836 5.38065C6.37355 5.39612 6.36259 5.41099 6.35079 5.42518L4.7047 7.38299C4.6947 7.40328 4.6895 7.4256 4.6895 7.44822C4.6895 7.47085 4.6947 7.49316 4.7047 7.51346C5.30313 8.73846 6.58751 10.0135 7.8297 10.6111C7.85044 10.6206 7.87309 10.6251 7.89587 10.6243C7.91865 10.6234 7.94093 10.6173 7.96094 10.6064L9.88985 8.9658C9.90362 8.95382 9.91824 8.94285 9.9336 8.93299C10.085 8.83207 10.2591 8.7705 10.4403 8.75386C10.6214 8.73722 10.8039 8.76603 10.9711 8.83768L14.6617 10.4916C14.8765 10.5868 15.0549 10.7485 15.1705 10.953C15.2862 11.1574 15.333 11.3937 15.3039 11.6267V11.6244Z"
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

{#snippet searchIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
			stroke="#fff"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15.8047 15.8047L21.0012 21.0012"
			stroke="#fff"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet compareIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M16.5 13.5L19.5 16.5L16.5 19.5"
			stroke="#fff"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 16.5H19.5"
			stroke="#fff"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M7.5 10.5L4.5 7.5L7.5 4.5"
			stroke="#fff"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.5 7.5H4.5"
			stroke="#fff"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet heartIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z"
			stroke="#fff"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}
