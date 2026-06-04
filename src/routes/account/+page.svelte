<script lang="ts">
	import AccountEntryPage from '$lib/components/account/AccountEntryPage.svelte';
	import DashboardRecentTemplatePage from '$lib/components/account/DashboardRecentTemplatePage.svelte';
	import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { PageData } from './$types';

	type AccountDashboardData = PageData & {
		afterRecentHtml: string;
		beforeRecentHtml: string;
		pageDocument: AuxeroPageDocument;
		recent: AuxeroDashboardRecentData;
	};

	let { data }: { data: PageData } = $props();

	const isDashboardData = (value: PageData): value is AccountDashboardData =>
		value.accountEntry !== true &&
		typeof value.afterRecentHtml === 'string' &&
		typeof value.beforeRecentHtml === 'string' &&
		Boolean(value.pageDocument) &&
		Boolean(value.recent);
</script>

{#if data.accountEntry}
	<AccountEntryPage />
{:else if isDashboardData(data)}
	<DashboardRecentTemplatePage
		afterRecentHtml={data.afterRecentHtml}
		beforeRecentHtml={data.beforeRecentHtml}
		pageDocument={data.pageDocument}
		recent={data.recent}
	/>
{/if}
