<script lang="ts">
	import { resolve } from '$app/paths';

	let { images, title }: { images: string[]; title: string } = $props();
	const contactHref = resolve('/contact');
	const denseInventoryHref = resolve('/inventory?view=4');
</script>

{#snippet galleryButtons()}
	<div class="listing-details-item--content">
		<a class="listing-details-item--button" href={contactHref}>
			<img src="/assets/icons/playcircle.svg" alt="play" />
			Play Video
		</a>
		<a class="listing-details-item--button" href={denseInventoryHref}>
			<img src="/assets/icons/view-all-photo.svg" alt="view" />
			View All Photo
		</a>
	</div>
{/snippet}

{#snippet previousIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M13.9487 2.71258C14.2097 2.97026 14.2335 3.37348 14.0199 3.65762L13.9487 3.73903L7.60622 10L13.9487 16.261C14.2097 16.5186 14.2335 16.9219 14.0199 17.206L13.9487 17.2874C13.6877 17.5451 13.2792 17.5685 12.9913 17.3577L12.9088 17.2874L6.04609 10.5132C5.78505 10.2555 5.76132 9.85232 5.9749 9.56818L6.04609 9.48678L12.9088 2.71258C13.196 2.42914 13.6615 2.42914 13.9487 2.71258Z"
			fill="white"
		/>
	</svg>
{/snippet}

{#snippet nextIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M6.0513 17.2874C5.79025 17.0297 5.76652 16.6265 5.98011 16.3424L6.0513 16.261L12.3938 10L6.0513 3.73903C5.79025 3.48135 5.76652 3.07813 5.98011 2.79399L6.0513 2.71258C6.31235 2.45491 6.72084 2.43148 7.00869 2.64231L7.09116 2.71258L13.9539 9.48678C14.215 9.74446 14.2387 10.1477 14.0251 10.4318L13.9539 10.5132L7.09116 17.2874C6.80401 17.5709 6.33845 17.5709 6.0513 17.2874Z"
			fill="white"
		/>
	</svg>
{/snippet}

<div class="swiper swiper-listing-details-main">
	<div class="swiper-wrapper">
		{#each images as image, index (index)}
			<div class="swiper-slide">
				<div class="listing-details-item main-item relative">
					<img class="img-main" src={image} alt={title} />
					{@render galleryButtons()}
				</div>
			</div>
		{/each}
	</div>
	<p class="swiper-button navigation-prev swiper-listing-details-main-prev">
		{@render previousIcon()}
	</p>
	<p class="swiper-button navigation-next swiper-listing-details-main-next">
		{@render nextIcon()}
	</p>
</div>

<div class="swiper swiper-listing-details-thumbs overflow-hidden pb-60">
	<div class="swiper-wrapper">
		{#each images as image, index (index)}
			<div class="swiper-slide">
				<div class="listing-details-thumb">
					<img src={image} alt="thumbnail" />
				</div>
			</div>
		{/each}
	</div>
</div>
