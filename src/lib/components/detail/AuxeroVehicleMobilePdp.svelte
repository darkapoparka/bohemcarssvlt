<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData, AuxeroVehicleDetailDrawerTabId } from '$lib/auxero/detail';
	import { ArrowLeft, Check, GitCompare, Heart, PhoneCall, Send, Share2, X } from '@lucide/svelte';
	import { Drawer } from 'vaul-svelte';
	import { fade, fly } from 'svelte/transition';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();

	const compareHref = resolve('/compare');
	const favoritesHref = resolve('/account');
	const externalHref = (href: string) => ({ href });
	const drawerRestingSnapPoint = 0.6;
	const drawerExpandedSnapPoint = 0.92;
	const drawerSnapPoints = [drawerRestingSnapPoint, drawerExpandedSnapPoint];

	let activeTab = $state<AuxeroVehicleDetailDrawerTabId>('info');
	let activeDrawerSnapPoint = $state<number | string | null>(drawerSnapPoints[0]);
	let drawerOpen = $state(true);
	let selectedImageIndex = $state(0);
	let shareStatus = $state('');
	let viewerOpen = $state(false);
	let inquiryOpen = $state(false);
	let inquiryStatus = $state('');
	let inquirySubmitting = $state(false);
	let drawerSnapGestureStartY: number | null = null;

	const heroGalleryImages = $derived(Array.from(new Set(detail.galleryImages)));
	const heroImage = $derived(heroGalleryImages[selectedImageIndex] ?? detail.image);
	const primaryFacts = $derived(detail.overviewItems.slice(0, 4));
	const specItems = $derived(detail.overviewItems.slice(0, 10));
	const featureGroups = $derived(detail.featureTabs.filter((tab) => tab.items.length > 0));
	const contentTabs = $derived(
		detail.mobileDrawer.tabs.filter((tab) => ['info', 'specs', 'features'].includes(tab.id))
	);
	const drawerSnapOffset = $derived(
		activeDrawerSnapPoint === drawerExpandedSnapPoint ? '8dvh' : '40dvh'
	);

	const useFallbackImage = (event: Event) => {
		const image = event.currentTarget as HTMLImageElement;

		if (image.src !== detail.imageFallback) {
			image.src = detail.imageFallback;
		}
	};

	const goBack = () => {
		if (browser && window.history.length > 1) {
			window.history.back();
			return;
		}

		goto(resolve('/inventory'));
	};

	const shareVehicle = async () => {
		if (!browser) return;

		const url = window.location.href;

		try {
			if (navigator.share) {
				await navigator.share({
					text: detail.description,
					title: detail.title,
					url
				});
				return;
			}

			await navigator.clipboard?.writeText(url);
			shareStatus = detail.mobileDrawer.copiedLabel;
			window.setTimeout(() => {
				shareStatus = '';
			}, 1800);
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
		}
	};

	const openInquiry = () => {
		inquiryOpen = true;
	};

	const closeInquiry = () => {
		inquiryOpen = false;
	};

	const submitInquiry = async (event: SubmitEvent) => {
		event.preventDefault();

		const form = event.currentTarget as HTMLFormElement;
		const payload = Object.fromEntries(new FormData(form).entries());

		inquirySubmitting = true;

		try {
			await fetch('/api/inquiries', {
				body: JSON.stringify({
					...payload,
					source: 'vehicle-detail-mobile',
					vehicleSlug: detail.slug
				}),
				headers: { 'content-type': 'application/json' },
				method: 'POST'
			});
		} catch {
			// The prototype still confirms local capture if the API is unavailable.
		}

		inquirySubmitting = false;
		inquiryStatus = detail.copy.inquirySuccess;
		form.reset();
	};

	const openImageViewer = (index: number) => {
		selectedImageIndex = index;
		viewerOpen = true;
	};

	const closeImageViewer = () => {
		viewerOpen = false;
	};

	const startDrawerSnapGesture = (event: PointerEvent) => {
		if (
			!(event.target instanceof HTMLElement) ||
			!event.target.closest('.bohemcars-mobile-pdp__handle')
		) {
			return;
		}

		drawerSnapGestureStartY = event.clientY;
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
	};

	const updateDrawerSnapGesture = (event: PointerEvent) => {
		if (drawerSnapGestureStartY === null) return;

		const deltaY = event.clientY - drawerSnapGestureStartY;

		if (Math.abs(deltaY) < 42) return;

		activeDrawerSnapPoint = deltaY < 0 ? drawerExpandedSnapPoint : drawerRestingSnapPoint;
		drawerSnapGestureStartY = null;
	};

	const finishDrawerSnapGesture = (event: PointerEvent) => {
		if (drawerSnapGestureStartY === null) return;

		const deltaY = event.clientY - drawerSnapGestureStartY;
		drawerSnapGestureStartY = null;

		if (Math.abs(deltaY) < 42) return;

		activeDrawerSnapPoint = deltaY < 0 ? drawerExpandedSnapPoint : drawerRestingSnapPoint;
	};

	const cancelDrawerSnapGesture = () => {
		drawerSnapGestureStartY = null;
	};

	const handleWindowKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;

		if (viewerOpen) {
			closeImageViewer();
		} else if (inquiryOpen) {
			closeInquiry();
		}
	};
</script>

<svelte:window
	onkeydown={handleWindowKeydown}
	onpointermove={updateDrawerSnapGesture}
	onpointerup={finishDrawerSnapGesture}
	onpointercancel={cancelDrawerSnapGesture}
/>

<svelte:head>
	<style>
		@media (max-width: 767.98px) {
			html,
			body {
				background: #111111 !important;
				height: 100dvh !important;
				overflow: hidden !important;
				padding-bottom: 0 !important;
				scrollbar-width: none !important;
				width: 100% !important;
			}

			html::-webkit-scrollbar,
			body::-webkit-scrollbar {
				display: none !important;
			}

			body header,
			body.auxero-template-listing-details-3-html header,
			body.auxero-template-listing-details-3-html .header,
			body.auxero-template-listing-details-3-html .header-style-3,
			body .mobile-bottom-nav,
			body .progress-wrap,
			body section.mb-22.background-light,
			body .tf-spacing-style4 {
				display: none !important;
			}

			body section.pb-100 {
				padding-bottom: 0 !important;
			}
		}
	</style>
</svelte:head>

<section
	class="bohemcars-mobile-pdp"
	data-mobile-pdp-root
	aria-label={detail.title}
	style:--bohemcars-mobile-pdp-snap-offset={drawerSnapOffset}
>
	<div class="bohemcars-mobile-pdp__hero" data-mobile-pdp-hero>
		<button
			type="button"
			class="bohemcars-mobile-pdp__image-button"
			aria-label={`${detail.mobileDrawer.photoLabel} ${selectedImageIndex + 1}`}
			onclick={() => openImageViewer(selectedImageIndex)}
		>
			<img
				class="bohemcars-mobile-pdp__image"
				src={heroImage}
				alt={detail.title}
				onerror={useFallbackImage}
			/>
		</button>
		<div class="bohemcars-mobile-pdp__shade"></div>

		<div class="bohemcars-mobile-pdp__topbar" data-mobile-pdp-topbar>
			<button type="button" aria-label={detail.mobileDrawer.backLabel} onclick={goBack}>
				<ArrowLeft size={22} strokeWidth={2.35} aria-hidden="true" />
			</button>

			<div class="bohemcars-mobile-pdp__topbar-actions">
				<a href={compareHref} aria-label={detail.copy.compare}>
					<GitCompare size={20} strokeWidth={2.35} aria-hidden="true" />
				</a>
				<a href={favoritesHref} aria-label={detail.copy.savePrefix}>
					<Heart size={20} strokeWidth={2.35} aria-hidden="true" />
				</a>
				<button type="button" aria-label={detail.mobileDrawer.shareLabel} onclick={shareVehicle}>
					<Share2 size={21} strokeWidth={2.35} aria-hidden="true" />
				</button>
			</div>
		</div>

		{#if shareStatus}
			<p class="bohemcars-mobile-pdp__toast" aria-live="polite">
				<Check size={16} strokeWidth={2.4} aria-hidden="true" />
				{shareStatus}
			</p>
		{/if}

		{#if heroGalleryImages.length > 1}
			<div class="bohemcars-mobile-pdp__hero-thumbs" aria-label={detail.mobileDrawer.photoLabel}>
				{#each heroGalleryImages as image, index (image)}
					<button
						type="button"
						class={selectedImageIndex === index ? 'active' : ''}
						data-mobile-pdp-thumb
						aria-current={selectedImageIndex === index ? 'true' : undefined}
						aria-label={`${detail.mobileDrawer.photoLabel} ${index + 1}`}
						onclick={() => {
							selectedImageIndex = index;
						}}
					>
						<img src={image} alt="" onerror={useFallbackImage} />
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<Drawer.Root
		bind:open={drawerOpen}
		bind:activeSnapPoint={activeDrawerSnapPoint}
		direction="bottom"
		dismissible={false}
		modal={false}
		snapPoints={drawerSnapPoints}
		snapToSequentialPoint={true}
	>
		<Drawer.Content
			class="bohemcars-mobile-pdp__drawer"
			data-mobile-pdp-drawer
			onpointerdown={startDrawerSnapGesture}
		>
			<Drawer.Handle class="bohemcars-mobile-pdp__handle" />

			<div class="bohemcars-mobile-pdp__drawer-heading">
				<div>
					<p>{detail.priceLabel}</p>
					<Drawer.Title level={1}>
						<span class="bohemcars-mobile-pdp__drawer-title">{detail.title}</span>
					</Drawer.Title>
				</div>
				<span>{detail.monthlyLabel}</span>
			</div>

			<div class="bohemcars-mobile-pdp__facts" aria-label={detail.copy.carOverview}>
				{#each primaryFacts as item (item.label)}
					<div>
						<img src={`/assets/icons/${item.icon}`} alt="" aria-hidden="true" />
						<span>{item.value}</span>
					</div>
				{/each}
			</div>

			<Drawer.Description>
				<span class="bohemcars-mobile-pdp__drawer-description">{detail.description}</span>
			</Drawer.Description>

			<div class="bohemcars-mobile-pdp__tabs" aria-label={detail.copy.getToKnow} role="tablist">
				{#each contentTabs as tab (tab.id)}
					<button
						type="button"
						role="tab"
						data-mobile-pdp-tab
						class={['bohemcars-mobile-pdp__tab', activeTab === tab.id && 'active']}
						aria-selected={activeTab === tab.id}
						onclick={() => {
							activeTab = tab.id;
						}}
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<div class="bohemcars-mobile-pdp__panel" role="tabpanel" data-vaul-no-drag>
				{#if activeTab === 'info'}
					<div class="bohemcars-mobile-pdp__section">
						<p class="bohemcars-mobile-pdp__eyebrow">{detail.copy.description}</p>
						<p class="bohemcars-mobile-pdp__body-copy">{detail.description}</p>

						<div class="bohemcars-mobile-pdp__finance">
							<div>
								<span>{detail.copy.cash}</span>
								<strong>{detail.priceLabel}</strong>
								<small>{detail.copy.priceIntro}</small>
							</div>
							<div>
								<span>{detail.copy.finance}</span>
								<strong>{detail.monthlyLabel}</strong>
								<small>{detail.copy.financeTerms}</small>
							</div>
						</div>
					</div>
				{:else if activeTab === 'specs'}
					<ul class="bohemcars-mobile-pdp__spec-list">
						{#each specItems as item (item.label)}
							<li>
								<span>
									<img src={`/assets/icons/${item.icon}`} alt="" aria-hidden="true" />
									{item.label}
								</span>
								<strong>{item.value}</strong>
							</li>
						{/each}
					</ul>
				{:else if activeTab === 'features'}
					<div class="bohemcars-mobile-pdp__feature-groups">
						{#each featureGroups as group (group.label)}
							<section>
								<h2>{group.label}</h2>
								<ul>
									{#each group.items as feature, featureIndex (`${group.label}-${featureIndex}`)}
										<li>
											<Check size={16} strokeWidth={2.4} aria-hidden="true" />
											{feature}
										</li>
									{/each}
								</ul>
							</section>
						{/each}
					</div>
				{/if}
			</div>

			<div class="bohemcars-mobile-pdp__actions">
				<button
					type="button"
					class="bohemcars-mobile-pdp__cta bohemcars-mobile-pdp__cta--primary"
					onclick={openInquiry}
				>
					<Send size={18} strokeWidth={2.3} aria-hidden="true" />
					{detail.copy.inquiryCta}
				</button>
				<a
					class="bohemcars-mobile-pdp__cta bohemcars-mobile-pdp__cta--call"
					{...externalHref(detail.contact.primaryPhoneHref)}
				>
					<PhoneCall size={18} strokeWidth={2.3} aria-hidden="true" />
					{detail.copy.callCta}
				</a>
			</div>
		</Drawer.Content>
	</Drawer.Root>

	{#if inquiryOpen}
		<div
			class="bohemcars-mobile-pdp__inquiry"
			role="dialog"
			aria-modal="true"
			aria-labelledby="bohemcarsMobilePdpInquiryTitle"
		>
			<button
				type="button"
				class="bohemcars-mobile-pdp__inquiry-backdrop"
				aria-label={detail.mobileDrawer.closeLabel}
				onclick={closeInquiry}
				transition:fade={{ duration: 180 }}
			></button>

			<div class="bohemcars-mobile-pdp__inquiry-panel" transition:fly={{ y: 64, duration: 240 }}>
				<span class="bohemcars-mobile-pdp__inquiry-handle" aria-hidden="true"></span>

				<div class="bohemcars-mobile-pdp__inquiry-head">
					<div>
						<p>{detail.title}</p>
						<strong id="bohemcarsMobilePdpInquiryTitle">{detail.copy.inquiryTitle}</strong>
					</div>
					<button
						type="button"
						class="bohemcars-mobile-pdp__inquiry-close"
						aria-label={detail.mobileDrawer.closeLabel}
						onclick={closeInquiry}
					>
						<X size={20} strokeWidth={2.35} aria-hidden="true" />
					</button>
				</div>

				<p class="bohemcars-mobile-pdp__inquiry-intro">{detail.copy.inquiryIntro}</p>

				<form class="bohemcars-mobile-pdp__inquiry-form" onsubmit={submitInquiry}>
					<label>
						<span>{detail.copy.name}</span>
						<input name="name" type="text" autocomplete="name" required />
					</label>
					<label>
						<span>{detail.copy.phone}</span>
						<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required />
					</label>
					<label>
						<span>{detail.copy.subject}</span>
						<select name="subject">
							<option>{detail.copy.subjectViewing}</option>
							<option>{detail.copy.subjectAvailability}</option>
							<option>{detail.copy.subjectDocuments}</option>
						</select>
					</label>
					<label>
						<span>{detail.copy.message}</span>
						<textarea name="message" rows="3" placeholder={detail.copy.messagePlaceholder}
						></textarea>
					</label>

					<button
						type="submit"
						class="bohemcars-mobile-pdp__inquiry-submit"
						disabled={inquirySubmitting}
					>
						<Send size={18} strokeWidth={2.3} aria-hidden="true" />
						{detail.copy.sendInquiry}
					</button>

					<p class="bohemcars-mobile-pdp__inquiry-status" aria-live="polite">
						{#if inquiryStatus}
							<Check size={16} strokeWidth={2.4} aria-hidden="true" />
						{/if}
						{inquiryStatus}
					</p>
				</form>

				<a
					class="bohemcars-mobile-pdp__inquiry-call"
					{...externalHref(detail.contact.primaryPhoneHref)}
				>
					<PhoneCall size={18} strokeWidth={2.3} aria-hidden="true" />
					{detail.contact.primaryPhoneLabel}
				</a>
			</div>
		</div>
	{/if}

	{#if viewerOpen}
		<div
			class="bohemcars-mobile-pdp__viewer"
			data-mobile-pdp-viewer
			role="dialog"
			aria-modal="true"
			aria-label={detail.mobileDrawer.photoLabel}
		>
			<button
				type="button"
				class="bohemcars-mobile-pdp__viewer-close"
				aria-label={detail.mobileDrawer.closeLabel}
				onclick={closeImageViewer}
			>
				<X size={24} strokeWidth={2.35} aria-hidden="true" />
			</button>

			<p class="bohemcars-mobile-pdp__viewer-count">
				{selectedImageIndex + 1} / {heroGalleryImages.length}
			</p>

			<div class="bohemcars-mobile-pdp__viewer-stage">
				<img src={heroImage} alt={detail.title} onerror={useFallbackImage} />
			</div>

			<div class="bohemcars-mobile-pdp__viewer-thumbs" aria-label={detail.mobileDrawer.photoLabel}>
				{#each heroGalleryImages as image, index (image)}
					<button
						type="button"
						class={selectedImageIndex === index ? 'active' : ''}
						aria-current={selectedImageIndex === index ? 'true' : undefined}
						aria-label={`${detail.mobileDrawer.photoLabel} ${index + 1}`}
						onclick={() => {
							selectedImageIndex = index;
						}}
					>
						<img src={image} alt="" onerror={useFallbackImage} />
					</button>
				{/each}
			</div>
		</div>
	{/if}
</section>

<style>
	.bohemcars-mobile-pdp {
		display: none;
	}

	@media (max-width: 767.98px) {
		.bohemcars-mobile-pdp {
			position: fixed;
			inset: 0;
			z-index: 1000;
			display: block;
			width: 100%;
			height: 100dvh;
			max-height: 100dvh;
			margin-left: 0;
			overflow: hidden;
			overscroll-behavior: none;
			background: var(--bc-bg);
			color: #ffffff;
			touch-action: manipulation;
		}

		.bohemcars-mobile-pdp__hero {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: 1001;
			height: 58dvh;
			min-height: 400px;
			overflow: hidden;
			background: #111111;
		}

		.bohemcars-mobile-pdp__image {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
		}

		.bohemcars-mobile-pdp__image-button {
			display: block;
			width: 100%;
			height: 100%;
			border: 0;
			background: #111111;
			cursor: zoom-in;
			padding: 0;
		}

		.bohemcars-mobile-pdp__shade {
			position: absolute;
			inset: 0;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0) 18%);
			pointer-events: none;
		}

		.bohemcars-mobile-pdp__topbar,
		.bohemcars-mobile-pdp__toast {
			position: absolute;
			z-index: 1004;
		}

		.bohemcars-mobile-pdp__topbar {
			top: calc(14px + env(safe-area-inset-top));
			right: 14px;
			left: 14px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.bohemcars-mobile-pdp__topbar button,
		.bohemcars-mobile-pdp__topbar a {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.92);
			color: #1c1c1c;
			cursor: pointer;
			text-decoration: none;
			box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
		}

		.bohemcars-mobile-pdp__topbar button:hover,
		.bohemcars-mobile-pdp__topbar button:focus-visible,
		.bohemcars-mobile-pdp__topbar a:hover,
		.bohemcars-mobile-pdp__topbar a:focus-visible {
			background: #d9f275;
			outline: 0;
		}

		.bohemcars-mobile-pdp__topbar-actions {
			display: flex;
			align-items: center;
			gap: 8px;
		}

		.bohemcars-mobile-pdp__hero-thumbs {
			position: absolute;
			right: 14px;
			bottom: 24px;
			left: 14px;
			z-index: 1003;
			display: flex;
			gap: 8px;
			overflow-x: auto;
			overflow-y: hidden;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-mobile-pdp__hero-thumbs::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-mobile-pdp__hero-thumbs button {
			position: relative;
			flex: 0 0 58px;
			width: 58px;
			height: 44px;
			overflow: hidden;
			border: 2px solid rgba(255, 255, 255, 0.72);
			border-radius: 8px;
			background: #ffffff;
			cursor: pointer;
			padding: 0;
			box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
		}

		.bohemcars-mobile-pdp__hero-thumbs button.active,
		.bohemcars-mobile-pdp__hero-thumbs button:focus-visible {
			border-color: #d9f275;
			outline: 0;
		}

		.bohemcars-mobile-pdp__hero-thumbs img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.bohemcars-mobile-pdp__facts {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			flex: 0 0 auto;
			gap: 5px;
			padding: 0 0 8px;
		}

		.bohemcars-mobile-pdp__facts div {
			display: grid;
			min-width: 0;
			justify-items: center;
			gap: 3px;
			border-radius: 8px;
			background: var(--bc-surface);
			color: #1c1c1c;
			padding: 6px 3px 5px;
		}

		.bohemcars-mobile-pdp__facts img {
			width: 17px;
			height: 17px;
			object-fit: contain;
		}

		.bohemcars-mobile-pdp__facts span {
			max-width: 100%;
			overflow: hidden;
			font-size: 10.5px;
			font-weight: 850;
			line-height: 13px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-mobile-pdp__toast {
			right: 16px;
			top: calc(66px + env(safe-area-inset-top));
			display: inline-flex;
			align-items: center;
			gap: 6px;
			margin: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.92);
			color: #1c1c1c;
			padding: 8px 11px;
			font-size: 12px;
			font-weight: 900;
			line-height: 16px;
		}

		.bohemcars-mobile-pdp :global(.bohemcars-mobile-pdp__drawer[data-vaul-drawer]) {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 1002;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			height: 100dvh;
			overflow: hidden;
			border: 0;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			color: #1c1c1c;
			box-shadow: 0 -20px 46px rgba(0, 0, 0, 0.22);
			outline: 0;
			padding: 7px 14px
				calc(var(--bohemcars-mobile-pdp-snap-offset, 40dvh) + 12px + env(safe-area-inset-bottom));
		}

		.bohemcars-mobile-pdp :global(.bohemcars-mobile-pdp__handle[data-vaul-handle]) {
			position: relative;
			display: block;
			width: 56px;
			height: 22px;
			min-height: 22px;
			align-items: center;
			justify-content: center;
			align-self: center;
			flex: 0 0 22px;
			border-radius: 0;
			background: transparent;
			opacity: 1;
		}

		.bohemcars-mobile-pdp :global(.bohemcars-mobile-pdp__handle[data-vaul-handle])::after {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 34px;
			height: 3px;
			transform: translate(-50%, -50%);
			border-radius: 999px;
			background: var(--bc-border);
			content: '';
		}

		.bohemcars-mobile-pdp :global(.bohemcars-mobile-pdp__handle [data-vaul-handle-hitarea]) {
			position: absolute;
			inset: 0;
			top: 0;
			left: 0;
			display: block;
			width: 100%;
			height: 100%;
			background: transparent;
			transform: none;
		}

		.bohemcars-mobile-pdp__drawer-heading {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 14px;
			padding: 4px 0 10px;
		}

		.bohemcars-mobile-pdp__drawer-heading p,
		.bohemcars-mobile-pdp__drawer-title {
			margin: 0;
			letter-spacing: 0;
		}

		.bohemcars-mobile-pdp__drawer-heading p {
			margin-bottom: 3px;
			color: #98bc2a;
			font-size: 16px;
			font-weight: 900;
			line-height: 20px;
		}

		.bohemcars-mobile-pdp__drawer-title {
			display: -webkit-box;
			color: #1c1c1c;
			overflow: hidden;
			font-size: 20px;
			font-weight: 900;
			line-height: 24px;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}

		.bohemcars-mobile-pdp__drawer-heading > span {
			display: inline-flex;
			min-height: 34px;
			align-items: center;
			flex: 0 0 auto;
			border-radius: 8px;
			background: var(--bc-surface);
			color: #1c1c1c;
			padding: 0 10px;
			font-size: 12px;
			font-weight: 900;
			line-height: 15px;
			white-space: nowrap;
		}

		.bohemcars-mobile-pdp__drawer-description {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.bohemcars-mobile-pdp__tabs {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			align-items: center;
			flex: 0 0 auto;
			gap: 10px;
			overflow: visible;
			border-bottom: 1px solid var(--bc-border);
			padding: 2px 0 0;
		}

		.bohemcars-mobile-pdp__tab {
			position: relative;
			display: inline-flex;
			width: 100%;
			min-width: 0;
			min-height: 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 0;
			background: transparent;
			color: #1c1c1c;
			cursor: pointer;
			padding: 0 4px 12px;
			font-size: 15px;
			font-weight: 900;
			line-height: 18px;
			white-space: nowrap;
		}

		.bohemcars-mobile-pdp__tab.active,
		.bohemcars-mobile-pdp__tab:hover,
		.bohemcars-mobile-pdp__tab:focus-visible {
			background: transparent;
			color: #1c1c1c;
			outline: 0;
		}

		.bohemcars-mobile-pdp__tab::after {
			position: absolute;
			right: 8px;
			bottom: -1px;
			left: 8px;
			height: 3px;
			border-radius: 999px 999px 0 0;
			background: transparent;
			content: '';
		}

		.bohemcars-mobile-pdp__tab.active::after,
		.bohemcars-mobile-pdp__tab:hover::after,
		.bohemcars-mobile-pdp__tab:focus-visible::after {
			background: #98bc2a;
		}

		.bohemcars-mobile-pdp__panel {
			flex: 1 1 auto;
			min-height: 0;
			overflow-y: auto;
			overflow-x: hidden;
			overscroll-behavior: contain;
			padding: 12px 0 12px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-mobile-pdp__panel::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-mobile-pdp__section,
		.bohemcars-mobile-pdp__feature-groups {
			display: grid;
			gap: 13px;
		}

		.bohemcars-mobile-pdp__eyebrow {
			margin: 0;
			color: #728093;
			font-size: 12px;
			font-weight: 900;
			line-height: 16px;
			text-transform: uppercase;
		}

		.bohemcars-mobile-pdp__body-copy {
			margin: 0;
			color: #5f6871;
			font-size: 15px;
			line-height: 24px;
		}

		.bohemcars-mobile-pdp__finance {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
		}

		.bohemcars-mobile-pdp__finance div,
		.bohemcars-mobile-pdp__feature-groups section {
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 12px;
		}

		.bohemcars-mobile-pdp__finance span,
		.bohemcars-mobile-pdp__finance strong,
		.bohemcars-mobile-pdp__finance small {
			display: block;
			min-width: 0;
		}

		.bohemcars-mobile-pdp__finance span {
			color: #728093;
			font-size: 12px;
			font-weight: 900;
			line-height: 16px;
		}

		.bohemcars-mobile-pdp__finance strong {
			margin: 3px 0 5px;
			font-size: 18px;
			font-weight: 900;
			line-height: 22px;
		}

		.bohemcars-mobile-pdp__finance small {
			color: #5f6871;
			font-size: 12px;
			font-weight: 700;
			line-height: 17px;
		}

		.bohemcars-mobile-pdp__spec-list,
		.bohemcars-mobile-pdp__feature-groups ul {
			display: grid;
			gap: 8px;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.bohemcars-mobile-pdp__spec-list li {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(96px, auto);
			gap: 12px;
			align-items: center;
			border-bottom: 1px solid var(--bc-border);
			padding: 10px 0;
		}

		.bohemcars-mobile-pdp__spec-list span {
			display: flex;
			min-width: 0;
			align-items: center;
			gap: 8px;
			color: #68727a;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
		}

		.bohemcars-mobile-pdp__spec-list img {
			width: 23px;
			height: 23px;
			object-fit: contain;
		}

		.bohemcars-mobile-pdp__spec-list strong {
			min-width: 0;
			overflow-wrap: anywhere;
			text-align: right;
			font-size: 14px;
			font-weight: 900;
			line-height: 18px;
		}

		.bohemcars-mobile-pdp__feature-groups h2 {
			margin: 0 0 9px;
			color: #1c1c1c;
			font-size: 15px;
			font-weight: 900;
			line-height: 19px;
		}

		.bohemcars-mobile-pdp__feature-groups li {
			display: flex;
			align-items: flex-start;
			gap: 8px;
			color: #4c565f;
			font-size: 14px;
			font-weight: 750;
			line-height: 20px;
		}

		.bohemcars-mobile-pdp__feature-groups li :global(svg) {
			flex: 0 0 auto;
			color: #98bc2a;
			margin-top: 2px;
		}

		.bohemcars-mobile-pdp__actions {
			display: grid;
			grid-template-columns: 1.45fr 1fr;
			gap: 9px;
			border-top: 1px solid var(--bc-border);
			padding-top: 10px;
		}

		.bohemcars-mobile-pdp__cta {
			display: inline-flex;
			min-height: 50px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border: 0;
			border-radius: 10px;
			font-size: 15px;
			font-weight: 900;
			line-height: 18px;
			text-align: center;
			text-decoration: none;
			cursor: pointer;
			transition:
				background-color 0.18s ease,
				color 0.18s ease,
				transform 0.12s ease;
		}

		.bohemcars-mobile-pdp__cta:active {
			transform: translateY(1px);
		}

		.bohemcars-mobile-pdp__cta--primary {
			background: #b9ee39;
			color: #14210a;
		}

		.bohemcars-mobile-pdp__cta--primary:hover,
		.bohemcars-mobile-pdp__cta--primary:focus-visible {
			background: #a6dd1f;
			outline: 0;
		}

		.bohemcars-mobile-pdp__cta--call {
			background: #1c1c1c;
			color: #ffffff;
		}

		.bohemcars-mobile-pdp__cta--call:hover,
		.bohemcars-mobile-pdp__cta--call:focus-visible {
			background: #000000;
			outline: 0;
		}

		.bohemcars-mobile-pdp__inquiry {
			position: fixed;
			inset: 0;
			z-index: 1008;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}

		.bohemcars-mobile-pdp__inquiry-backdrop {
			position: absolute;
			inset: 0;
			border: 0;
			background: rgba(10, 12, 8, 0.5);
			appearance: none;
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-mobile-pdp__inquiry-panel {
			position: relative;
			display: grid;
			gap: 12px;
			width: 100%;
			max-height: 90dvh;
			overflow-y: auto;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			color: #1c1c1c;
			padding: 10px 16px calc(18px + env(safe-area-inset-bottom));
			box-shadow: 0 -22px 50px rgba(0, 0, 0, 0.3);
			scrollbar-width: none;
		}

		.bohemcars-mobile-pdp__inquiry-panel::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-mobile-pdp__inquiry-handle {
			width: 42px;
			height: 4px;
			justify-self: center;
			border-radius: 999px;
			background: var(--bc-border);
		}

		.bohemcars-mobile-pdp__inquiry-head {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 12px;
		}

		.bohemcars-mobile-pdp__inquiry-head p {
			margin: 0 0 2px;
			overflow: hidden;
			color: #728093;
			font-size: 12px;
			font-weight: 800;
			line-height: 16px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-mobile-pdp__inquiry-head strong {
			display: block;
			color: #1c1c1c;
			font-size: 19px;
			font-weight: 900;
			line-height: 23px;
		}

		.bohemcars-mobile-pdp__inquiry-close {
			display: flex;
			width: 44px;
			height: 44px;
			flex: 0 0 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface);
			color: #1c1c1c;
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-mobile-pdp__inquiry-intro {
			margin: -2px 0 2px;
			color: #5f6871;
			font-size: 14px;
			font-weight: 600;
			line-height: 20px;
		}

		.bohemcars-mobile-pdp__inquiry-form {
			display: grid;
			gap: 10px;
		}

		.bohemcars-mobile-pdp__inquiry-form label {
			display: grid;
			gap: 6px;
		}

		.bohemcars-mobile-pdp__inquiry-form label span {
			color: #1c1c1c;
			font-size: 12.5px;
			font-weight: 800;
			line-height: 16px;
		}

		.bohemcars-mobile-pdp__inquiry-form input,
		.bohemcars-mobile-pdp__inquiry-form select,
		.bohemcars-mobile-pdp__inquiry-form textarea {
			width: 100%;
			border: 1px solid var(--bc-border);
			border-radius: 10px;
			background: var(--bc-surface-soft);
			color: #1c1c1c;
			padding: 12px 13px;
			font: inherit;
			/* >=16px stops iOS Safari from auto-zooming on focus inside the drawer. */
			font-size: 16px;
			font-weight: 600;
			line-height: 20px;
		}

		.bohemcars-mobile-pdp__inquiry-form textarea {
			resize: none;
		}

		.bohemcars-mobile-pdp__inquiry-form input:focus,
		.bohemcars-mobile-pdp__inquiry-form select:focus,
		.bohemcars-mobile-pdp__inquiry-form textarea:focus {
			border-color: #98bc2a;
			background: #ffffff;
			outline: 0;
		}

		.bohemcars-mobile-pdp__inquiry-submit {
			display: inline-flex;
			min-height: 50px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			margin-top: 2px;
			border: 0;
			border-radius: 10px;
			background: #b9ee39;
			color: #14210a;
			cursor: pointer;
			font-size: 15px;
			font-weight: 900;
			line-height: 19px;
			transition: background-color 0.18s ease;
		}

		.bohemcars-mobile-pdp__inquiry-submit:hover,
		.bohemcars-mobile-pdp__inquiry-submit:focus-visible {
			background: #a6dd1f;
			outline: 0;
		}

		.bohemcars-mobile-pdp__inquiry-submit:disabled {
			opacity: 0.65;
			cursor: progress;
		}

		.bohemcars-mobile-pdp__inquiry-status {
			display: flex;
			align-items: center;
			gap: 6px;
			min-height: 18px;
			margin: 0;
			color: #4c5a14;
			font-size: 13px;
			font-weight: 800;
			line-height: 18px;
		}

		.bohemcars-mobile-pdp__inquiry-status :global(svg) {
			color: #6ba80f;
		}

		.bohemcars-mobile-pdp__inquiry-call {
			display: inline-flex;
			min-height: 48px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border: 1px solid var(--bc-border);
			border-radius: 10px;
			background: #ffffff;
			color: #1c1c1c;
			font-size: 15px;
			font-weight: 900;
			line-height: 19px;
			text-decoration: none;
		}

		.bohemcars-mobile-pdp__inquiry-call:hover,
		.bohemcars-mobile-pdp__inquiry-call:focus-visible {
			border-color: #1c1c1c;
			outline: 0;
		}

		.bohemcars-mobile-pdp__viewer {
			position: fixed;
			inset: 0;
			z-index: 1010;
			display: grid;
			grid-template-rows: auto minmax(0, 1fr) auto;
			background: #050505;
			color: #ffffff;
			padding: calc(14px + env(safe-area-inset-top)) 14px calc(16px + env(safe-area-inset-bottom));
		}

		.bohemcars-mobile-pdp__viewer-close {
			position: absolute;
			top: calc(14px + env(safe-area-inset-top));
			right: 14px;
			z-index: 2;
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.94);
			color: #111111;
			cursor: pointer;
		}

		.bohemcars-mobile-pdp__viewer-count {
			align-self: start;
			justify-self: start;
			margin: 0;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.13);
			color: #ffffff;
			padding: 10px 13px;
			font-size: 13px;
			font-weight: 900;
			line-height: 16px;
		}

		.bohemcars-mobile-pdp__viewer-stage {
			display: flex;
			min-height: 0;
			align-items: center;
			justify-content: center;
			padding: 54px 0 20px;
		}

		.bohemcars-mobile-pdp__viewer-stage img {
			display: block;
			width: 100%;
			max-height: 100%;
			object-fit: contain;
		}

		.bohemcars-mobile-pdp__viewer-thumbs {
			display: flex;
			gap: 9px;
			overflow-x: auto;
			overflow-y: hidden;
			padding: 4px 0 0;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-mobile-pdp__viewer-thumbs::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-mobile-pdp__viewer-thumbs button {
			flex: 0 0 66px;
			width: 66px;
			height: 50px;
			overflow: hidden;
			border: 2px solid rgba(255, 255, 255, 0.28);
			border-radius: 8px;
			background: #111111;
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-mobile-pdp__viewer-thumbs button.active,
		.bohemcars-mobile-pdp__viewer-thumbs button:focus-visible {
			border-color: #d9f275;
			outline: 0;
		}

		.bohemcars-mobile-pdp__viewer-thumbs img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	@media (max-width: 380px) {
		.bohemcars-mobile-pdp__facts {
			gap: 4px;
		}

		.bohemcars-mobile-pdp__drawer-heading > span {
			display: none;
		}

		.bohemcars-mobile-pdp__tabs {
			gap: 4px;
		}

		.bohemcars-mobile-pdp__tab {
			font-size: 13px;
		}
	}
</style>
