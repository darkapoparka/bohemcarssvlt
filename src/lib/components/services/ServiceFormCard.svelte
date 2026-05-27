<script lang="ts">
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';

	let { form }: { form: AuxeroServiceFormData } = $props();

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			kind: 'input' as const
		})),
		{
			className: 'select-style-2',
			kind: 'select',
			label: form.serviceLabel,
			name: form.serviceName,
			options: form.serviceOptions
		},
		{
			...form.vehicleField,
			kind: 'input' as const
		}
	]);
</script>

<div class="radius-20 services-center-form bg-white">
	<p class="h4 mb-16">{form.title}</p>
	<InquiryForm
		{fields}
		formClass="send-inquiry bohemcars-service-form"
		gridClass="lg-grid-cols-1 mb-22 grid grid-cols-2 gap-x-12 gap-y-24"
		novalidate
		statusMessage="Service request queued locally for Bohemcars"
		submitLabel={form.submitLabel}
	/>
</div>
