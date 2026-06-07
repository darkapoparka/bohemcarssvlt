<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import AdminListingEditor from '$lib/components/admin/AdminListingEditor.svelte';

	let { data, form } = $props();
	const listing = $derived(data.listing);
</script>

<svelte:head>
	<title>Bohemcars Admin - {listing.title}</title>
</svelte:head>

<AdminShell title={listing.title} activePath="/admin/inventory">
	<AdminListingEditor
		{listing}
		{form}
		notice={data.notice}
		submitLabel={listing.source === 'admin-listing' ? 'Save changes' : 'Save draft copy'}
	/>
</AdminShell>
