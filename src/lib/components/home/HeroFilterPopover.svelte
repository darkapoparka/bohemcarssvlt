<script lang="ts">
	import type { HomeFiveHeroSelect, HomeFiveHeroSelectOption } from '$lib/auxero/home-five';
	import { Check, ChevronDown, Search } from '@lucide/svelte';

	let {
		select,
		selected = $bindable([]),
		mode = 'multi',
		variant = 'list',
		searchable = false,
		options,
		isEnglish = false,
		emptyHint = ''
	}: {
		select: HomeFiveHeroSelect;
		selected?: string[];
		mode?: 'single' | 'multi';
		variant?: 'grid' | 'list';
		searchable?: boolean;
		options?: HomeFiveHeroSelectOption[];
		isEnglish?: boolean;
		emptyHint?: string;
	} = $props();

	let open = $state(false);
	let query = $state('');
	let root = $state<HTMLDivElement>();
	let trigger = $state<HTMLButtonElement>();

	const opts = $derived(options ?? select.options);
	const matches = (option: HomeFiveHeroSelectOption) => {
		const needle = query.trim().toLowerCase();
		if (!needle) return true;
		return (
			option.label.toLowerCase().includes(needle) ||
			(option.shortLabel ?? '').toLowerCase().includes(needle)
		);
	};
	const visibleOptions = $derived(searchable ? opts.filter(matches) : opts);

	const labelFor = (value: string) => {
		const option = opts.find((candidate) => candidate.value === value);
		return option?.shortLabel ?? option?.label ?? value;
	};
	const summary = $derived.by(() => {
		if (!selected.length) return select.defaultLabel;
		if (selected.length === 1) return labelFor(selected[0]);
		return isEnglish ? `${selected.length} selected` : `${selected.length} избрани`;
	});

	const isOn = (value: string) => selected.includes(value);
	const toggle = (value: string) => {
		if (mode === 'single') {
			selected = selected[0] === value ? [] : [value];
			close();
			return;
		}
		selected = isOn(value) ? selected.filter((entry) => entry !== value) : [...selected, value];
	};
	const clear = () => {
		selected = [];
	};

	function close() {
		open = false;
		query = '';
		trigger?.focus();
	}

	$effect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (root && !root.contains(event.target as Node)) {
				open = false;
				query = '';
			}
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};
		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKey);
		};
	});

	const doneLabel = $derived(
		selected.length
			? `${isEnglish ? 'Done' : 'Готово'} (${selected.length})`
			: isEnglish
				? 'Done'
				: 'Готово'
	);
</script>

<div class="hfp" class:hfp--open={open} class:hfp--grid={variant === 'grid'} bind:this={root}>
	<!-- Hidden inputs keep the existing GET form contract (name → value pairs) intact. -->
	{#if selected.length === 0}
		<input type="hidden" name={select.name} value="" />
	{:else}
		{#each selected as value (value)}
			<input type="hidden" name={select.name} {value} />
		{/each}
	{/if}

	<button
		type="button"
		class="hfp__field"
		bind:this={trigger}
		aria-haspopup="dialog"
		aria-expanded={open}
		onclick={() => (open ? close() : (open = true))}
	>
		<span class="hfp__label">{select.title}</span>
		<span class="hfp__value" class:hfp__value--placeholder={!selected.length}>{summary}</span>
		<span class="hfp__chev"><ChevronDown size={18} strokeWidth={2.25} aria-hidden="true" /></span>
	</button>

	{#if open}
		<div class="hfp__panel" role="dialog" aria-label={select.title}>
			{#if searchable}
				<div class="hfp__search">
					<Search size={17} strokeWidth={2.1} aria-hidden="true" />
					<!-- svelte-ignore a11y_autofocus -->
					<input
						type="search"
						autocomplete="off"
						placeholder={isEnglish
							? `Search ${select.title.toLowerCase()}…`
							: `Търси ${select.title.toLowerCase()}…`}
						bind:value={query}
						autofocus
					/>
				</div>
			{/if}

			{#if visibleOptions.length === 0}
				<p class="hfp__hint">{emptyHint || (isEnglish ? 'No matches' : 'Няма съвпадения')}</p>
			{:else if variant === 'grid'}
				<div class="hfp__grid">
					{#each visibleOptions as option (option.value)}
						<button
							type="button"
							class="hfp__chip"
							aria-pressed={isOn(option.value)}
							onclick={() => toggle(option.value)}
						>
							{#if option.image}
								<img src={option.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
							{:else}
								<span class="hfp__mono">{(option.shortLabel ?? option.label).charAt(0)}</span>
							{/if}
							<span class="hfp__chiplabel">{option.shortLabel ?? option.label}</span>
						</button>
					{/each}
				</div>
			{:else}
				<div class="hfp__list">
					{#each visibleOptions as option (option.value)}
						<button
							type="button"
							class="hfp__row"
							aria-pressed={isOn(option.value)}
							onclick={() => toggle(option.value)}
						>
							<span class="hfp__rowlabel">{option.label}</span>
							{#if option.countLabel}<small>{option.countLabel}</small>{/if}
							<span class="hfp__tick"><Check size={16} strokeWidth={2.6} aria-hidden="true" /></span
							>
						</button>
					{/each}
				</div>
			{/if}

			{#if mode === 'multi' && visibleOptions.length > 0}
				<div class="hfp__foot">
					<button type="button" class="hfp__clear" onclick={clear}>
						{isEnglish ? 'Clear' : 'Изчисти'}
					</button>
					<button type="button" class="hfp__done" onclick={close}>{doneLabel}</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.hfp {
		position: relative;
		flex: 1 1 0;
		min-width: 120px;
	}

	.hfp__field {
		position: relative;
		display: grid;
		width: 100%;
		min-height: 62px;
		align-content: center;
		gap: 3px;
		border: 1px solid transparent;
		border-radius: 8px;
		background: #ffffff;
		padding: 9px 38px 8px 12px;
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.16s ease,
			box-shadow 0.16s ease;
	}

	.hfp__field:hover {
		border-color: #cdd6c0;
	}

	.hfp--open .hfp__field {
		border-color: #8fbf2e;
		box-shadow: 0 0 0 3px rgba(143, 191, 46, 0.18);
	}

	.hfp__field:focus-visible {
		outline: 2px solid #4f7012;
		outline-offset: 2px;
	}

	.hfp__label {
		overflow: hidden;
		color: #5f5f5f;
		font-size: 11px;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__value {
		overflow: hidden;
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 700;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__value--placeholder {
		color: #7c7c7c;
		font-weight: 600;
	}

	.hfp__chev {
		position: absolute;
		top: 50%;
		right: 12px;
		display: flex;
		color: #9aa48c;
		transform: translateY(-50%);
		transition: transform 0.18s ease;
	}

	.hfp--open .hfp__chev {
		color: #5f8a14;
		transform: translateY(-50%) rotate(180deg);
	}

	.hfp__panel {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		z-index: 60;
		width: min(320px, 86vw);
		border: 1px solid #ececec;
		border-radius: 14px;
		background: #ffffff;
		padding: 13px;
		box-shadow: 0 26px 54px rgba(12, 18, 11, 0.26);
		animation: hfp-pop 0.15s ease;
	}

	.hfp--grid .hfp__panel {
		width: min(430px, 88vw);
	}

	@keyframes hfp-pop {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.hfp__search {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 11px;
		border-radius: 10px;
		background: #f4f6ef;
		padding: 0 12px;
		height: 44px;
		color: #5f6b50;
	}

	.hfp__search input {
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
		font-weight: 600;
		outline: 0;
		appearance: none;
		-webkit-appearance: none;
	}

	.hfp__search input::-webkit-search-cancel-button,
	.hfp__search input::-webkit-search-decoration {
		appearance: none;
		-webkit-appearance: none;
	}

	.hfp__grid {
		display: grid;
		max-height: 286px;
		gap: 8px;
		grid-template-columns: repeat(3, 1fr);
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.hfp__chip {
		display: flex;
		min-height: 76px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1.5px solid transparent;
		border-radius: 11px;
		background: #f6f8f1;
		padding: 6px;
		color: #26331a;
		font: inherit;
		font-size: 12.5px;
		font-weight: 700;
		text-align: center;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.hfp__chip:hover {
		border-color: #cfe39a;
		background: #eef4df;
	}

	.hfp__chip[aria-pressed='true'] {
		border-color: #8fbf2e;
		background: #eaf6cf;
	}

	.hfp__chip img {
		max-width: 42px;
		max-height: 26px;
		object-fit: contain;
	}

	.hfp__mono {
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

	.hfp__chiplabel {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__list {
		display: grid;
		max-height: 300px;
		gap: 4px;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.hfp__row {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 10px;
		border: 1.5px solid transparent;
		border-radius: 10px;
		background: #f6f8f1;
		padding: 12px 13px;
		color: #26331a;
		font: inherit;
		font-size: 14.5px;
		font-weight: 700;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.hfp__row:hover {
		background: #eef4df;
	}

	.hfp__row[aria-pressed='true'] {
		border-color: #8fbf2e;
		background: #eaf6cf;
	}

	.hfp__rowlabel {
		flex: 1 1 auto;
	}

	.hfp__row small {
		color: #7a8a63;
		font-size: 12px;
		font-weight: 700;
	}

	.hfp__tick {
		display: flex;
		color: #5f8a14;
		opacity: 0;
	}

	.hfp__row[aria-pressed='true'] .hfp__tick {
		opacity: 1;
	}

	.hfp__hint {
		margin: 6px 2px;
		color: #6b7563;
		font-size: 13.5px;
		font-weight: 600;
	}

	.hfp__foot {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin-top: 12px;
		border-top: 1px solid #eef0ea;
		padding-top: 11px;
	}

	.hfp__foot button {
		border: 0;
		border-radius: 9px;
		padding: 10px 16px;
		font: inherit;
		font-weight: 800;
		cursor: pointer;
	}

	.hfp__clear {
		background: #f1f3ec;
		color: #39402f;
	}

	.hfp__done {
		background: #1c1c1c;
		color: #ffffff;
	}

	@media (max-width: 767.98px) {
		.hfp {
			min-width: 100%;
		}
	}
</style>
