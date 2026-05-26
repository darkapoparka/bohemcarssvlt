<script lang="ts">
	import HomeFiveTemplatePage from '$lib/components/home/HomeFiveTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<HomeFiveTemplatePage pageDocument={data.pageDocument} />
