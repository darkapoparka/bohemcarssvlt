<script lang="ts">
	import type { AuxeroAccountProfileFormData } from '$lib/auxero/account-forms';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AccountProfileForm from './AccountProfileForm.svelte';

	let {
		afterProfileHtml,
		beforeProfileHtml,
		pageDocument,
		profile
	}: {
		afterProfileHtml: string;
		beforeProfileHtml: string;
		pageDocument: AuxeroPageDocument;
		profile: AuxeroAccountProfileFormData;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeProfileHtml} afterHtml={afterProfileHtml}>
	<AccountProfileForm {profile} />
</AuxeroPageShell>

<style>
	@media (max-width: 767.98px) {
		:global(body.auxero-template-my-profile-html),
		:global(body.auxero-template-my-profile-html #wrapper),
		:global(body.auxero-template-my-profile-html .dashboard-container),
		:global(body.auxero-template-my-profile-html .dashboard-content) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-my-profile-html .dashboard-content--inner) {
			padding: 18px 14px 92px !important;
		}

		:global(body.auxero-template-my-profile-html .dashboard-content--inner > .h3) {
			margin-bottom: 18px !important;
			font-size: 30px !important;
			font-weight: 800 !important;
			line-height: 36px !important;
		}

		:global(body.auxero-template-my-profile-html .dashboard-toggle-btn) {
			min-height: 46px !important;
			border: 1px solid var(--bc-border) !important;
			border-radius: 8px !important;
			background: var(--bc-control) !important;
			box-shadow: none !important;
			color: #1c1c1c !important;
			padding: 0 18px !important;
			font-size: 15px !important;
			line-height: 20px !important;
		}

		:global(body.auxero-template-my-profile-html .dashboard-toggle-btn:hover) {
			background: var(--bc-control-hover) !important;
		}
	}
</style>
