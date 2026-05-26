<script lang="ts">
	import AgentsTemplatePage from '$lib/components/agents/AgentsTemplatePage.svelte';

	let { data } = $props();
</script>

<AgentsTemplatePage
	afterAgentsHtml={data.afterAgentsHtml}
	beforeAgentsHtml={data.beforeAgentsHtml}
	cards={data.cards}
	pageDocument={data.pageDocument}
/>
