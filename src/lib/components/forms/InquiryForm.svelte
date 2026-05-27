<script lang="ts">
	import type { InquiryFormField, InquiryInputField } from './types';

	type Props = {
		buttonClass?: string;
		fields: InquiryFormField[];
		formClass: string;
		gridClass: string;
		novalidate?: boolean;
		showEmptyStatus?: boolean;
		statusClass?: string;
		statusMessage?: string;
		submitLabel: string;
	};

	let {
		buttonClass = 'btn btn-primary btn-large font-weight-600 w-full',
		fields,
		formClass,
		gridClass,
		novalidate = false,
		showEmptyStatus = true,
		statusClass = 'auxero-form-status text-highlight font-weight-600 mt-12',
		statusMessage = 'Request captured. Bohemcars will follow up shortly.',
		submitLabel
	}: Props = $props();

	let status = $state('');

	const inputClass = (field: InquiryInputField) => `${field.active ? 'active ' : ''}input-large`;

	function submitInquiry(event: SubmitEvent) {
		event.preventDefault();
		status = statusMessage;
	}
</script>

<form action="#" class={formClass} {novalidate} onsubmit={submitInquiry}>
	<div class={gridClass}>
		{#each fields as field (`${field.kind}-${field.name}-${field.id ?? field.label}`)}
			<div class={field.wrapperClass}>
				<p class="mb-8">{field.label}</p>

				{#if field.kind === 'input'}
					<input
						class={inputClass(field)}
						id={field.id}
						name={field.name}
						placeholder={field.placeholder}
						required={field.required}
						type={field.type}
						value=""
					/>
				{:else if field.kind === 'select'}
					<select class={field.className} id={field.id} name={field.name} required={field.required}>
						{#each field.options as option (option)}
							<option>{option}</option>
						{/each}
					</select>
				{:else}
					<textarea
						class={field.className}
						id={field.id}
						name={field.name}
						placeholder={field.placeholder}
						required={field.required}
						rows={field.rows ?? 3}
					></textarea>
				{/if}
			</div>
		{/each}
	</div>

	<button type="submit" class={buttonClass}>
		{submitLabel}
	</button>

	{#if showEmptyStatus || status}
		<p class={statusClass} aria-live="polite">{status}</p>
	{/if}
</form>
