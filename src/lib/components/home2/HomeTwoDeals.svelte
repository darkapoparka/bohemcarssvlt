<script lang="ts">
	import { resolve } from '$app/paths';
	import { homeTwoDealCards, type HomeTwoDealCard } from '$lib/auxero/home-two';
</script>

<section class="home2-deals">
	<div class="container">
		<div class="home2-deals__header">
			<div>
				<h2>Популярни оферти</h2>
				<p>Налични и по заявка</p>
			</div>
			<a href={resolve('/inventory?view=4')}>Виж всички</a>
		</div>

		<div class="home2-deals__viewport">
			<div class="home2-deals__rail">
				{#snippet cardContent(card: HomeTwoDealCard)}
					<span class="home2-deal-card__copy">
						<strong>{card.title}</strong>
						<span class="home2-deal-card__description">{card.description}</span>
						<span class="home2-deal-card__saving">{card.saving}</span>
						<span class="home2-deal-card__badge">{card.badge}</span>
					</span>

					<span class="home2-deal-card__image">
						<img
							src={card.image}
							alt=""
							loading="lazy"
							class:home2-deal-card__image--flip={card.flip}
						/>
					</span>

					<span class="home2-deal-card__footer">
						<span class="home2-deal-card__offer">
							<span class="home2-deal-card__price">
								<small>{card.priceLabel}</small>
								<b>{card.price}</b>
							</span>
							<span class="home2-deal-card__monthly">{card.monthly}</span>
						</span>
						<span class="home2-deal-card__arrow" aria-hidden="true">
							<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
								<path d="M7.5 4.5 13 10l-5.5 5.5" />
							</svg>
						</span>
					</span>
				{/snippet}

				{#each homeTwoDealCards as card (card.title)}
					{#if card.kind === 'vehicle'}
						<a
							href={resolve('/inventory/[slug]', { slug: card.slug })}
							class="home2-deal-card"
							style:--image-max={card.imageMax}
						>
							{@render cardContent(card)}
						</a>
					{:else}
						<a
							href={resolve('/services')}
							class="home2-deal-card"
							style:--image-max={card.imageMax}
						>
							{@render cardContent(card)}
						</a>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.home2-deals {
		background: #f6f8f6;
		padding: 42px 0 56px;
	}

	.home2-deals__header {
		align-items: flex-end;
		display: flex;
		gap: 24px;
		justify-content: space-between;
		margin-bottom: 22px;
	}

	.home2-deals__header > div {
		display: block;
	}

	.home2-deals__header h2 {
		color: #111513;
		font-size: clamp(28px, 2.5vw, 40px);
		font-weight: 800;
		line-height: 1.08;
		margin: 0;
	}

	.home2-deals__header p {
		color: #56625c;
		font-size: 15px;
		font-weight: 700;
		line-height: 20px;
		margin: 6px 0 0;
	}

	.home2-deals__header a {
		color: #121715;
		font-size: 15px;
		font-weight: 800;
		line-height: 20px;
		white-space: nowrap;
	}

	.home2-deals__header a:hover {
		color: #7ca017;
	}

	.home2-deals__viewport {
		margin: 0;
		overflow: hidden;
		padding: 0;
	}

	.home2-deals__rail {
		display: grid;
		gap: 14px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.home2-deal-card {
		background: #eaf0ed;
		border-radius: 8px;
		color: #121715;
		display: grid;
		gap: 14px;
		grid-template-areas:
			'copy'
			'image'
			'footer';
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto minmax(138px, 1fr) auto;
		min-height: 354px;
		overflow: hidden;
		padding: 18px 16px 16px;
		position: relative;
	}

	.home2-deal-card:hover {
		background: #e2ebe7;
		box-shadow: none;
		color: #121715;
		transform: none;
	}

	.home2-deal-card__copy {
		align-self: start;
		display: block;
		grid-area: copy;
		min-height: 94px;
		padding-right: 0;
		position: relative;
	}

	.home2-deal-card__badge {
		background: #cce9e4;
		border-radius: 6px;
		color: #0f5a55;
		display: inline-flex;
		font-size: 11px;
		font-weight: 800;
		line-height: 15px;
		margin-top: 8px;
		padding: 5px 8px;
		width: fit-content;
	}

	.home2-deal-card__saving {
		background: #11211c;
		border-radius: 5px;
		color: #72c9c0;
		display: inline-flex;
		font-size: 13px;
		font-weight: 800;
		line-height: 17px;
		margin-top: 9px;
		padding: 4px 8px;
		width: fit-content;
	}

	.home2-deal-card__copy .home2-deal-card__badge {
		position: absolute;
		right: 0;
		top: 0;
	}

	.home2-deal-card__copy strong {
		color: inherit;
		display: -webkit-box;
		font-size: 22px;
		font-weight: 800;
		line-clamp: 2;
		line-height: 27px;
		padding-right: 78px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.home2-deal-card__description {
		color: #66706a;
		display: block;
		font-size: 14px;
		font-weight: 700;
		line-height: 19px;
		margin-top: 5px;
	}

	.home2-deal-card__image {
		align-items: flex-end;
		background: transparent;
		border-radius: 0;
		display: flex;
		grid-area: image;
		justify-content: center;
		margin: 0 -12px;
		min-height: 150px;
		overflow: hidden;
		padding: 0 0 2px;
		position: relative;
	}

	.home2-deal-card__image::after {
		background: radial-gradient(ellipse at center, rgba(18, 23, 21, 0.18), rgba(18, 23, 21, 0) 68%);
		bottom: 14px;
		content: '';
		height: 18px;
		left: 15%;
		position: absolute;
		right: 15%;
	}

	.home2-deal-card__image img {
		max-height: 158px;
		max-width: var(--image-max);
		object-fit: contain;
		position: relative;
		transform: none !important;
		z-index: 1;
	}

	.home2-deal-card__image img.home2-deal-card__image--flip {
		transform: scaleX(-1) !important;
	}

	.home2-deal-card__footer {
		align-items: end;
		display: grid;
		gap: 8px;
		grid-area: footer;
		grid-template-columns: minmax(0, 1fr) 46px;
	}

	.home2-deal-card__offer {
		align-items: flex-end;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		min-width: 0;
	}

	.home2-deal-card__price {
		align-items: baseline;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 5px;
		color: #121715;
		display: inline-flex;
		gap: 6px;
		line-height: 18px;
		padding: 5px 8px;
		white-space: nowrap;
		width: fit-content;
	}

	.home2-deal-card__price small {
		color: #66706a;
		font-size: 12px;
		font-weight: 800;
	}

	.home2-deal-card__price b {
		font-size: 15px;
		font-weight: 900;
	}

	.home2-deal-card__monthly {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 5px;
		color: #121715;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		padding: 5px 8px;
		width: fit-content;
	}

	.home2-deal-card__arrow {
		align-items: center;
		background: #121715;
		border-radius: 50%;
		color: #ffffff;
		display: inline-flex;
		height: 46px;
		justify-content: center;
		width: 46px;
	}

	.home2-deal-card__arrow svg {
		height: 22px;
		width: 22px;
	}

	.home2-deal-card__arrow svg path {
		fill: none;
		stroke: #ffffff !important;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2.3;
	}

	.home2-deal-card:hover .home2-deal-card__arrow {
		background: #98bc2a;
	}

	@media (max-width: 1199px) {
		.home2-deals__rail {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.home2-deal-card {
			min-height: 342px;
		}
	}

	@media (max-width: 575px) {
		.home2-deals {
			padding: 42px 0 54px;
		}

		.home2-deals__header {
			align-items: flex-start;
			flex-direction: column;
			gap: 10px;
		}

		.home2-deals__rail {
			gap: 16px;
			grid-template-columns: 1fr;
		}

		.home2-deal-card {
			gap: 10px;
			grid-template-rows: auto 170px auto;
			min-height: 0;
		}

		.home2-deal-card__copy {
			min-height: 90px;
			padding-right: 0;
		}

		.home2-deal-card__image {
			margin: 0;
			min-height: 170px;
		}

		.home2-deal-card__image img {
			max-height: 160px;
		}

		.home2-deal-card__footer {
			grid-template-columns: 1fr 46px;
		}

		.home2-deal-card__arrow {
			height: 46px;
			width: 46px;
		}
	}
</style>
