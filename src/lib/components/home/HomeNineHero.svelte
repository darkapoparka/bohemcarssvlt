<script lang="ts">
	import HeroSearchBar from './HeroSearchBar.svelte';
</script>

<section class="home-nine-hero">
	<div class="home-nine-hero__frame">
		<div class="home-nine-hero__slide"></div>
		<div class="home-nine-hero__shade"></div>
		<HeroSearchBar />
		<div class="hero-dots" aria-hidden="true">
			<span class="active"></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
</section>
