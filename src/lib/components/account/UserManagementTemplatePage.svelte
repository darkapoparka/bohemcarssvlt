<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroUserManagementData } from '$lib/auxero/user-management';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
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

<AuxeroDashboardSlotShell
	{pageDocument}
	beforeHtml={beforeUsersHtml}
	afterHtml={afterUsersHtml}
	preserveDetailsPrefix={false}
>
	<UserManagementTable {users} />
</AuxeroDashboardSlotShell>
