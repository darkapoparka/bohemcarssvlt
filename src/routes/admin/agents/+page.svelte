<script lang="ts">
	import AgentsTemplatePage from '$lib/components/agents/AgentsTemplatePage.svelte';

	let { data } = $props();
</script>

<AgentsTemplatePage
	afterAgentsHtml={data.afterAgentsHtml}
	beforeAgentsHtml={data.beforeAgentsHtml}
	cards={data.cards}
	dashboardShell={data.dashboardShell}
	management={data.management}
	pageDocument={data.pageDocument}
/>
