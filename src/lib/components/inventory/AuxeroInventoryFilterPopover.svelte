<script lang="ts">
	import type {
		AuxeroInventoryFilter,
		AuxeroInventoryDesktopData
	} from '$lib/auxero/inventory-desktop';
	import { Check, ChevronDown, Search, X } from '@lucide/svelte';

	let {
		allSelectedValue,
		filter,
		optionLayout = 'auto',
		presentation = 'popover'
	}: {
		allSelectedValue?: string;
		filter: AuxeroInventoryFilter;
		optionLayout?: 'auto' | 'grid' | 'list';
		presentation?: AuxeroInventoryDesktopData['filterPresentation'];
	} = $props();

	const inputType = $derived(filter.mode === 'single' ? 'radio' : 'checkbox');
	const allSelected = $derived(filter.selectedValues.length === 0);
	const hasImages = $derived(filter.options.some((option) => option.image));
	const searchable = $derived(filter.options.length > 8);
	const usesModal = $derived(presentation === 'modal');
	const usesGridOptions = $derived(
		!usesModal && (optionLayout === 'grid' || (optionLayout === 'auto' && hasImages))
	);
	const usesRowOptions = $derived(!usesGridOptions);

	let open = $state(false);
	let query = $state('');
	let root = $state<HTMLDivElement>();
	let trigger = $state<HTMLButtonElement>();
	let searchInput = $state<HTMLInputElement>();

	const isChecked = (value: string) =>
		value
			? filter.selectedValues.some((selected) => selected.toLowerCase() === value.toLowerCase())
			: allSelected;

	const isAllFilterValue = (value: string) => !value.trim();

	const matches = (label: string) => {
		const needle = query.trim().toLowerCase();

		return !needle || label.toLowerCase().includes(needle);
	};

	const fieldValue = $derived(
		allSelected ? (allSelectedValue ?? filter.placeholder) : filter.selectedSummary
	);
	const allOptionLabel = $derived(allSelectedValue ?? filter.placeholder);
	const listClass = $derived(
		usesModal ? 'ifp__modal-list' : usesGridOptions ? 'ifp__grid' : 'ifp__list'
	);
	const showDone = $derived(usesModal || filter.mode === 'multiple');

	function close(focusTrigger = true) {
		open = false;
		query = '';
		if (focusTrigger) trigger?.focus();
	}

	function openPanel() {
		open = true;
		window.dispatchEvent(new CustomEvent('bohemcars-inventory-filter-open', { detail: root }));
	}

	function togglePanel() {
		if (open) {
			close();
			return;
		}

		openPanel();
	}

	function clearField() {
		const inputs = Array.from(root?.querySelectorAll<HTMLInputElement>('.ifp__input') ?? []);
		const allInput = inputs.find((input) => isAllFilterValue(input.value));

		for (const input of inputs) {
			input.checked = input === allInput;
		}

		allInput?.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function onPick() {
		if (!usesModal && filter.mode === 'single') close(false);
	}

	function onSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') event.preventDefault();
	}

	$effect(() => {
		if (!open) return;

		searchInput?.focus();

		const onPointerDown = (event: PointerEvent) => {
			if (!usesModal && root && !root.contains(event.target as Node)) {
				close(false);
			}
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};
		const onFieldOpen = (event: Event) => {
			if (event instanceof CustomEvent && event.detail !== root) close(false);
		};
		const previousOverflow = document.body.style.overflow;

		if (usesModal) document.body.style.overflow = 'hidden';

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKey);
		window.addEventListener('bohemcars-inventory-filter-open', onFieldOpen);

		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKey);
			window.removeEventListener('bohemcars-inventory-filter-open', onFieldOpen);

			if (usesModal) document.body.style.overflow = previousOverflow;
		};
	});
</script>

<!--
	The option inputs stay mounted even when the picker is closed, preserving the
	existing GET form contract. Popover changes submit immediately via the parent
	form change handler; modal changes are staged until the footer submit button.
-->
<div
	class="ifp"
	class:ifp--open={open}
	class:ifp--grid={usesGridOptions}
	class:ifp--modal={usesModal}
	bind:this={root}
	data-name={filter.name}
	data-inventory-filter-field
	data-filter-mode={filter.mode}
	data-filter-presentation={presentation}
>
	<button
		type="button"
		class="ifp__field"
		bind:this={trigger}
		aria-haspopup="dialog"
		aria-expanded={open}
		onclick={togglePanel}
	>
		<span class="ifp__label">{filter.label}</span>
		<span class="ifp__value" class:ifp__value--placeholder={allSelected}>{fieldValue}</span>
		<span class="ifp__chev"><ChevronDown size={18} strokeWidth={2.25} aria-hidden="true" /></span>
	</button>

	{#if usesModal && open}
		<button type="button" class="ifp__backdrop" aria-label="Затвори филтъра" onclick={() => close()}
		></button>
	{/if}

	<div
		class={['ifp__panel', usesModal && 'ifp__panel--modal']}
		role="dialog"
		aria-label={filter.label}
		aria-modal={usesModal && open ? 'true' : undefined}
		aria-hidden={!open}
	>
		<div class="ifp__head">
			<p>{filter.label}</p>
			{#if usesModal}
				<button type="button" class="ifp__close" aria-label="Затвори" onclick={() => close()}>
					<X size={18} strokeWidth={2.2} aria-hidden="true" />
				</button>
			{/if}
		</div>

		{#if searchable}
			<div class="ifp__search">
				<Search size={17} strokeWidth={2.1} aria-hidden="true" />
				<input
					type="search"
					autocomplete="off"
					placeholder={`Търси ${filter.label.toLowerCase()}...`}
					bind:value={query}
					bind:this={searchInput}
					onkeydown={onSearchKeydown}
				/>
			</div>
		{/if}

		<div class={listClass}>
			<label
				class={usesRowOptions ? 'ifp__row' : 'ifp__chip ifp__chip--all'}
				hidden={Boolean(query)}
			>
				<input
					class="ifp__input"
					type={inputType}
					name={filter.name}
					value=""
					checked={allSelected}
					data-inventory-filter-input
					onchange={onPick}
				/>
				{#if usesRowOptions}
					<span class="ifp__control" aria-hidden="true"></span>
					<span class="ifp__rowlabel">{allOptionLabel}</span>
					<span class="ifp__tick"><Check size={16} strokeWidth={2.6} aria-hidden="true" /></span>
				{:else}
					<span class="ifp__chiplabel">{allOptionLabel}</span>
				{/if}
			</label>

			{#each filter.options as option (option.value)}
				<label
					class={usesRowOptions ? 'ifp__row' : 'ifp__chip'}
					hidden={searchable && !matches(option.label)}
				>
					<input
						class="ifp__input"
						type={inputType}
						name={filter.name}
						value={option.value}
						checked={isChecked(option.value)}
						data-inventory-filter-input
						onchange={onPick}
					/>
					{#if usesRowOptions}
						<span class="ifp__control" aria-hidden="true"></span>
						{#if option.image}
							<img
								class="ifp__rowimage"
								src={option.image}
								alt=""
								aria-hidden="true"
								loading="lazy"
								decoding="async"
							/>
						{/if}
						<span class="ifp__rowlabel">{option.label}</span>
						{#if typeof option.count === 'number'}<small>{option.count}</small>{/if}
						<span class="ifp__tick"><Check size={16} strokeWidth={2.6} aria-hidden="true" /></span>
					{:else}
						{#if option.image}
							<img src={option.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
						{/if}
						<span class="ifp__chiplabel">{option.label}</span>
						{#if typeof option.count === 'number'}
							<small class="ifp__chipcount">{option.count}</small>
						{/if}
					{/if}
				</label>
			{/each}
		</div>

		{#if showDone}
			<div class="ifp__foot">
				{#if usesModal}
					<button type="button" class="ifp__clear" onclick={clearField}>Изчисти</button>
				{/if}
				<button
					class="ifp__done"
					type={usesModal ? 'submit' : 'button'}
					onclick={() => close(false)}
				>
					Готово
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.ifp {
		position: relative;
	}

	.ifp--open {
		z-index: 120;
	}

	.ifp__field {
		position: relative;
		display: grid;
		width: 100%;
		min-height: 58px;
		align-content: center;
		gap: 2px;
		border: 1px solid #e2e6dc;
		border-radius: 10px;
		background: #ffffff;
		padding: 8px 38px 8px 14px;
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			box-shadow 0.16s ease;
	}

	.ifp__field:hover {
		border-color: #c2cbb4;
		background: #fbfcf8;
	}

	.ifp--open .ifp__field {
		border-color: #8fbf2e;
		box-shadow: 0 0 0 3px rgba(143, 191, 46, 0.16);
	}

	.ifp__field:focus-visible {
		outline: 2px solid #4f7012;
		outline-offset: 2px;
	}

	.ifp__label {
		overflow: hidden;
		color: #6c7563;
		font-size: 11px;
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__value {
		overflow: hidden;
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 650;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__value--placeholder {
		color: #7c7c7c;
		font-weight: 550;
	}

	.ifp__chev {
		position: absolute;
		top: 50%;
		right: 12px;
		display: flex;
		color: #9aa48c;
		transform: translateY(-50%);
		transition: transform 0.18s ease;
	}

	.ifp--open .ifp__chev {
		color: #5f8a14;
		transform: translateY(-50%) rotate(180deg);
	}

	.ifp__backdrop {
		position: fixed;
		inset: 0;
		z-index: 10000;
		border: 0;
		background: rgba(13, 19, 26, 0.58);
		backdrop-filter: blur(5px);
		cursor: default;
	}

	.ifp__panel {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		z-index: 1001;
		display: none;
		box-sizing: border-box;
		width: min(520px, calc(100vw - 40px));
		max-width: calc(100vw - 40px);
		border: 1px solid #dfe6d4;
		border-radius: 12px;
		background: #ffffff;
		padding: 13px;
		box-shadow: 0 18px 38px rgba(12, 18, 11, 0.16);
	}

	.ifp__panel--modal {
		position: fixed;
		top: 50%;
		right: 0;
		left: 0;
		z-index: 10001;
		display: none;
		width: min(464px, calc(100vw - 32px));
		max-height: min(680px, calc(100vh - 48px));
		margin: 0 auto;
		padding: 16px;
		border-color: #f0f1ec;
		border-radius: 18px;
		box-shadow: 0 28px 70px rgba(10, 15, 20, 0.35);
		transform: translateY(-50%);
	}

	.ifp--grid .ifp__panel {
		width: min(544px, calc(100vw - 40px));
	}

	.ifp--open .ifp__panel {
		display: grid;
		gap: 12px;
	}

	.ifp__head {
		display: none;
	}

	.ifp__panel--modal .ifp__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.ifp__head p {
		margin: 0;
		color: #111111;
		font-size: 18px;
		font-weight: 800;
		line-height: 24px;
	}

	.ifp__close {
		display: inline-grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border: 1px solid #ecefe5;
		border-radius: 999px;
		background: #f7f8f4;
		color: #7d8375;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
	}

	.ifp__close:hover {
		background: #eef3e2;
		color: #1c1c1c;
	}

	.ifp__search {
		display: flex;
		align-items: center;
		gap: 9px;
		border-radius: 10px;
		background: #f4f6ef;
		padding: 0 12px;
		height: 44px;
		color: #5f6b50;
	}

	.ifp__panel--modal .ifp__search {
		height: 46px;
		border: 1px solid #dfe5d8;
		background: #ffffff;
	}

	.ifp__search input {
		width: 100%;
		height: auto;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none !important;
		padding: 0;
		color: #1c1c1c;
		font: inherit;
		font-size: 14.5px;
		font-weight: 500;
		outline: 0;
		appearance: none;
		-webkit-appearance: none;
	}

	.ifp__search input::-webkit-search-cancel-button,
	.ifp__search input::-webkit-search-decoration {
		appearance: none;
		-webkit-appearance: none;
	}

	.ifp__grid {
		display: grid;
		max-height: min(640px, calc(100vh - 180px));
		gap: 8px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		overflow-x: hidden;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.ifp__list,
	.ifp__modal-list {
		display: grid;
		max-height: min(640px, calc(100vh - 180px));
		gap: 4px;
		overflow-x: hidden;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.ifp__modal-list {
		max-height: min(386px, calc(100vh - 250px));
		margin: 0 -4px;
		padding: 0 4px;
	}

	.ifp__input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.ifp__chip {
		display: flex;
		min-height: 62px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1.5px solid transparent;
		border-radius: 11px;
		background: #f6f8f1;
		padding: 6px;
		color: #26331a;
		font-size: 12.5px;
		font-weight: 600;
		text-align: center;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.ifp__chip:hover {
		border-color: #cfe39a;
		background: #eef4df;
	}

	.ifp__chip:has(.ifp__input:checked) {
		border-color: #8fbf2e;
		background: #eaf6cf;
	}

	.ifp__chip img {
		max-width: 42px;
		max-height: 26px;
		object-fit: contain;
	}

	.ifp__mono {
		display: grid;
		width: 34px;
		height: 30px;
		place-items: center;
		border-radius: 8px;
		background: #2c3d1d;
		color: #ffffff;
		font-size: 15px;
		font-weight: 900;
	}

	.ifp__chiplabel {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__chipcount {
		color: #5f6b50;
		font-size: 11px;
		font-weight: 800;
		line-height: 1;
		letter-spacing: 0.01em;
	}

	.ifp__chip:has(.ifp__input:checked) .ifp__chipcount {
		color: #3f5a14;
	}

	.ifp__chip--all {
		min-height: 46px;
		flex-direction: row;
		grid-column: 1 / -1;
		gap: 8px;
	}

	.ifp__row {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		min-height: 42px;
		align-items: center;
		gap: 10px;
		border: 1.5px solid transparent;
		border-radius: 10px;
		background: #f6f8f1;
		padding: 10px 13px;
		color: #26331a;
		font-size: 14.5px;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.ifp__panel--modal .ifp__row {
		min-height: 44px;
		background: transparent;
		padding: 8px 8px;
		color: #151515;
		font-size: 15px;
		font-weight: 600;
	}

	.ifp__row:hover {
		background: #eef4df;
	}

	.ifp__panel--modal .ifp__row:hover {
		background: #f4f7ee;
	}

	.ifp__row:has(.ifp__input:checked) {
		border-color: #8fbf2e;
		background: #eaf6cf;
	}

	.ifp__panel--modal .ifp__row:has(.ifp__input:checked) {
		border-color: transparent;
		background: #f1f6e4;
	}

	.ifp__control {
		display: inline-grid;
		width: 18px;
		height: 18px;
		flex: 0 0 18px;
		place-items: center;
		border: 1px solid #cfd5c6;
		border-radius: 5px;
		background: #ffffff;
	}

	.ifp__panel--modal .ifp__control {
		display: inline-grid;
	}

	.ifp__row:has(.ifp__input:checked) .ifp__control,
	.ifp__panel--modal .ifp__row:has(.ifp__input:checked) .ifp__control {
		border-color: #8fbf2e;
		background: #8fbf2e;
	}

	.ifp__row:has(.ifp__input:checked) .ifp__control::after,
	.ifp__panel--modal .ifp__row:has(.ifp__input:checked) .ifp__control::after {
		width: 9px;
		height: 6px;
		border-bottom: 2px solid #ffffff;
		border-left: 2px solid #ffffff;
		content: '';
		transform: rotate(-45deg);
	}

	.ifp__rowimage {
		width: 28px;
		height: 18px;
		object-fit: contain;
	}

	.ifp__rowlabel {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__row small {
		flex: 0 0 auto;
		color: #7a8a63;
		font-size: 12px;
		font-weight: 700;
	}

	.ifp__tick {
		display: flex;
		color: #5f8a14;
		opacity: 0;
	}

	.ifp__row:has(.ifp__input:checked) .ifp__tick {
		opacity: 1;
	}

	.ifp__panel--modal .ifp__tick {
		display: none;
	}

	.ifp__foot {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		border-top: 1px solid #eef0ea;
		padding-top: 11px;
	}

	.ifp__panel--modal .ifp__foot {
		justify-content: space-between;
		margin: 0 -16px -16px;
		padding: 12px 16px;
		background: #ffffff;
		border-radius: 0 0 18px 18px;
	}

	.ifp__done,
	.ifp__clear {
		border: 0;
		border-radius: 9px;
		padding: 10px 18px;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}

	.ifp__done {
		background: #1c1c1c;
		color: #ffffff;
	}

	.ifp__clear {
		background: #f1f3ec;
		color: #39402f;
	}

	.ifp__done:hover {
		background: #2e2e2e;
	}

	.ifp__clear:hover {
		background: #e8eddd;
	}

	@media (max-width: 575px) {
		.ifp__panel--modal {
			top: 24px;
			max-height: calc(100vh - 48px);
			transform: none;
		}
	}
</style>
