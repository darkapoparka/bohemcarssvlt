<script lang="ts">
	import MessageTemplatePage from '$lib/components/account/MessageTemplatePage.svelte';

	let { data } = $props();
</script>

<MessageTemplatePage
	afterMessageHtml={data.afterMessageHtml}
	beforeMessageHtml={data.beforeMessageHtml}
	pageDocument={data.pageDocument}
	thread={data.thread}
/>
