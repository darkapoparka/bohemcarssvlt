<script lang="ts">
	import type { AuxeroAboutStat } from '$lib/auxero/about';

	let { stats }: { stats: AuxeroAboutStat[] } = $props();
</script>

<div class="md-grid-cols-2 counter-spacing grid grid-cols-4 gap-130">
	{#each stats as stat, index (stat.label)}
		<div
			class={`box-couter-item ${index < stats.length - 1 ? 'outline-right' : ''} wow fadeInUp`}
			data-wow-delay={`0.${index + 1}s`}
		>
			<div class="content">
				<div class="box-couter counter">
					<div class="number-content font-main-2">
						<span
							class="count-number font-main-2"
							data-to={stat.value}
							data-speed="1500"
							data-inviewport="yes">{stat.value}</span
						>{stat.suffix}
					</div>
				</div>
				<p class="font-weight-500 text-muted h7 text-center">{stat.label}</p>
			</div>
		</div>
	{/each}
</div>
