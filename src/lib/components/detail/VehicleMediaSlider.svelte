<script lang="ts">
	import { Camera, ChevronLeft, ChevronRight, PlayCircle, X } from '@lucide/svelte';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();
	let active = $state(0);
	let lightbox = $state(false);
	const images = $derived(vehicle.gallery.length > 0 ? vehicle.gallery : vehicle.images);

	function next() {
		active = (active + 1) % images.length;
	}

	function previous() {
		active = (active - 1 + images.length) % images.length;
	}
</script>

<div class="media-slider">
	<div class="media-slider__main">
		<img src={images[active]} alt={`${vehicle.title} gallery ${active + 1}`} />
		<div class="media-slider__buttons">
			<button type="button" onclick={() => (lightbox = true)}>
				<PlayCircle size={19} />
				Play Video
			</button>
			<button type="button" onclick={() => (lightbox = true)}>
				<Camera size={19} />
				View All Photo
			</button>
		</div>
		<button
			class="media-slider__arrow media-slider__arrow--left"
			type="button"
			aria-label="Previous image"
			onclick={previous}
		>
			<ChevronLeft size={24} />
		</button>
		<button
			class="media-slider__arrow media-slider__arrow--right"
			type="button"
			aria-label="Next image"
			onclick={next}
		>
			<ChevronRight size={24} />
		</button>
	</div>

	<div class="media-slider__thumbs">
		{#each images as image, index (image)}
			<button
				type="button"
				class={active === index ? 'active' : ''}
				aria-label={`Show image ${index + 1}`}
				onclick={() => (active = index)}
			>
				<img src={image} alt="" />
			</button>
		{/each}
	</div>
</div>

{#if lightbox}
	<div class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Vehicle gallery">
		<button
			class="gallery-lightbox__close"
			type="button"
			aria-label="Close gallery"
			onclick={() => (lightbox = false)}
		>
			<X size={24} />
		</button>
		<img src={images[active]} alt={`${vehicle.title} enlarged`} />
		<div class="media-slider__thumbs">
			{#each images as image, index (image)}
				<button
					type="button"
					class={active === index ? 'active' : ''}
					onclick={() => (active = index)}
				>
					<img src={image} alt="" />
				</button>
			{/each}
		</div>
	</div>
{/if}
