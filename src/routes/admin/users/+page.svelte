<script lang="ts">
	import UserManagementTemplatePage from '$lib/components/account/UserManagementTemplatePage.svelte';

	let { data } = $props();
</script>

<UserManagementTemplatePage
	afterUsersHtml={data.afterUsersHtml}
	beforeUsersHtml={data.beforeUsersHtml}
	pageDocument={data.pageDocument}
	users={data.users}
/>
