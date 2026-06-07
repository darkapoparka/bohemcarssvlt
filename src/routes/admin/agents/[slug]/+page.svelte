<script lang="ts">
	import DashboardAgentDetail from '$lib/components/account/DashboardAgentDetail.svelte';
	import DashliteDashboardShell from '$lib/components/account/DashliteDashboardShell.svelte';

	let { data } = $props();
</script>

<DashliteDashboardShell dashboard={data.dashboard} active="agents">
	<DashboardAgentDetail agent={data.agent} />
</DashliteDashboardShell>
