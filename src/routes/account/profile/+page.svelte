<script lang="ts">
	import AccountProfileTemplatePage from '$lib/components/account/AccountProfileTemplatePage.svelte';

	let { data } = $props();
</script>

<AccountProfileTemplatePage
	afterProfileHtml={data.afterProfileHtml}
	beforeProfileHtml={data.beforeProfileHtml}
	pageDocument={data.pageDocument}
	profile={data.profile}
/>
