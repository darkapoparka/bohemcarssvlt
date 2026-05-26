<script lang="ts">
	let { items }: { items: string[] } = $props();
</script>

<ul class="list mb-32">
	{#each items as item (item)}
		<li class="md-items-start font-weight-500 h7 mb-8 flex items-center gap-12">
			<img src="/assets/icons/check.svg" alt="check" />
			{item}
		</li>
	{/each}
</ul>
