<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutConsultant } from '$lib/auxero/about';

	let { consultants }: { consultants: AuxeroAboutConsultant[] } = $props();
</script>

<section>
	<h2 class="mb-40 text-center">Bohemcars Consultants</h2>
	<div class="container">
		<div class="sm-grid-cols-1 lg-grid-cols-2 xl-gap-16 grid grid-cols-4 gap-30">
			{#each consultants as consultant (consultant.slug)}
				<div class="sale-agent-box">
					<div class="card-top mb-20">
						<a class="flex w-full" href={resolve('/agents/[slug]', { slug: consultant.slug })}>
							<img class="w-full" src={consultant.image} alt={consultant.name} />
						</a>
					</div>
					<div class="card-bottom flex items-center justify-between gap-16">
						<div class="content">
							<a
								href={resolve('/agents/[slug]', { slug: consultant.slug })}
								class="h5 font-weight-600 sale-agent-title">{consultant.name}</a
							>
							<p class="text-secondary text-sm">{consultant.title}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
