<script lang="ts">
	import UserManagementTemplatePage from '$lib/components/account/UserManagementTemplatePage.svelte';

	let { data } = $props();
</script>

<UserManagementTemplatePage
	afterUsersHtml={data.afterUsersHtml}
	beforeUsersHtml={data.beforeUsersHtml}
	notes={data.notes}
	pageDocument={data.pageDocument}
	searchQuery={data.searchQuery}
	selectedUserRole={data.selectedUserRole}
	users={data.users}
/>
