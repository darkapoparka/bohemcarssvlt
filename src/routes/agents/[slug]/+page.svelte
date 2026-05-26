<script lang="ts">
	import AgentDetailTemplatePage from '$lib/components/agents/AgentDetailTemplatePage.svelte';

	let { data } = $props();
</script>

<AgentDetailTemplatePage
	afterDetailHtml={data.afterDetailHtml}
	beforeDetailHtml={data.beforeDetailHtml}
	detail={data.detail}
	pageDocument={data.pageDocument}
/>
