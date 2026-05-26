<script lang="ts">
	const brands = Array.from(
		{ length: 12 },
		(_, index) => `/assets/images/brand/brand-${index + 1}.png`
	);
</script>

<section class="section brand-strip">
	<div class="container">
		<div class="section-title section-title--center">
			<p class="eyebrow">Popular Makes</p>
			<h2>Shop By Brand</h2>
		</div>
		<div class="brand-strip__grid">
			{#each brands as brand, index (brand)}
				<a href="/inventory" aria-label={`Brand ${index + 1}`}>
					<img src={brand} alt="" />
				</a>
			{/each}
		</div>
	</div>
</section>
