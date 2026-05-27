<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroUserManagementData } from '$lib/auxero/user-management';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeUsersHtml} afterHtml={afterUsersHtml}>
	<UserManagementTable {users} />
</AuxeroPageShell>
