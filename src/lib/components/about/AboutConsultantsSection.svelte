<script lang="ts">
	import type { AuxeroAgentCard as AuxeroAgentCardData } from '$lib/auxero/agents';
	import AuxeroAgentCard from '$lib/components/agents/AuxeroAgentCard.svelte';

	let { consultants }: { consultants: AuxeroAgentCardData[] } = $props();
</script>

<section class="bohemcars-consultants">
	<div class="container">
		<div class="title-section wow fadeInDown mb-40" data-wow-delay="0.1s">
			<div>
				<p class="bohemcars-consultants__eyebrow">Екип</p>
				<h2>Екипът зад процеса</h2>
				<p class="bohemcars-consultants__copy">
					Трите роли покриват най-честия път: наличен автомобил, внос от Канада, проверка, документи
					и предаване.
				</p>
			</div>
		</div>
		<div class="sm-grid-cols-1 lg-grid-cols-2 xl-gap-16 grid grid-cols-3 gap-20">
			{#each consultants as consultant, index (consultant.slug)}
				<div class="wow fadeInUp" data-wow-delay={`0.${(index % 4) + 1}s`}>
					<AuxeroAgentCard card={consultant} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.bohemcars-consultants {
		background: #ffffff;
		padding: 62px 0 70px;
	}

	.bohemcars-consultants :global(.container) {
		max-width: 1010px;
	}

	.bohemcars-consultants :global(.title-section) {
		justify-content: center;
		text-align: center;
	}

	.bohemcars-consultants__eyebrow {
		margin-bottom: 8px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-consultants__copy {
		max-width: 720px;
		margin-top: 10px;
		margin-right: auto;
		margin-left: auto;
		color: #696665;
		font-size: 16px;
		line-height: 1.55;
	}

	:global(.bohemcars-about-page .sale-agent-box:hover .sale-agent-title),
	:global(.bohemcars-about-page .sale-agent-box.active .sale-agent-title) {
		text-decoration: none;
	}

	:global(.bohemcars-about-page .sale-agent-social li a:hover),
	:global(.bohemcars-about-page .sale-agent-box .card-bottom .contact li a:hover) {
		border-color: #d6dbd1 !important;
		background-color: #eef0ec !important;
	}

	@media (max-width: 767px) {
		.bohemcars-consultants {
			padding: 44px 0 58px;
		}
	}
</style>
