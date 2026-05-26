<script lang="ts">
	const categories = [
		['Electric', '24 Vehicles', '/assets/images/card/card-27.png'],
		['Sedan', '32 Vehicles', '/assets/images/card/card-28.png'],
		['SUV', '28 Vehicles', '/assets/images/card/card-29.png'],
		['Pickup Truck', '22 Vehicles', '/assets/images/card/card-30.png'],
		['Hatchback', '38 Vehicles', '/assets/images/card/card-31.png'],
		['Crossover', '29 Vehicles', '/assets/images/card/card-32.png'],
		['Coupe', '23 Vehicles', '/assets/images/card/card-33.png'],
		['Convertible', '32 Vehicles', '/assets/images/card/card-34.png']
	];
</script>

<section class="section">
	<div class="container">
		<div class="section-title">
			<h2>Browse By Type</h2>
			<a class="btn btn-line" href="/inventory">Check All Car Type</a>
		</div>
		<div class="category-rail">
			{#each categories as category (category[0])}
				<a class="category-card" href={`/inventory?type=${encodeURIComponent(category[0])}`}>
					<img src={category[2]} alt={category[0]} />
					<div>
						<h3>{category[0]}</h3>
						<p>{category[1]}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
