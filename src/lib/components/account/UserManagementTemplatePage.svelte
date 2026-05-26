<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroUserManagementData } from '$lib/auxero/user-management';
	import UserManagementTable from './UserManagementTable.svelte';

	let {
		afterUsersHtml,
		beforeUsersHtml,
		pageDocument,
		users
	}: {
		afterUsersHtml: string;
		beforeUsersHtml: string;
		pageDocument: AuxeroPageDocument;
		users: AuxeroUserManagementData;
	} = $props();

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeUsersHtml}
<UserManagementTable {users} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterUsersHtml}
