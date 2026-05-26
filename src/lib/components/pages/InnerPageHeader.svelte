<script lang="ts">
	import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';

	interface Props {
		title: string;
		crumb: string;
		kicker?: string;
	}

	let { title, crumb, kicker }: Props = $props();
</script>

<Breadcrumbs items={[{ label: crumb }]} />
<section class="inner-hero">
	<div class="container">
		{#if kicker}
			<p class="eyebrow">{kicker}</p>
		{/if}
		<h1>{title}</h1>
	</div>
</section>
