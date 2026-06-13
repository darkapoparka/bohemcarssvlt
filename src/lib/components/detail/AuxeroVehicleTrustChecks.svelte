<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleTrust } from '$lib/auxero/detail';

	let { trust }: { trust: AuxeroVehicleTrust } = $props();
</script>

<aside class="bohemcars-pdp-trustbar" aria-label={trust.verdict}>
	<span class="bohemcars-pdp-trustbar__mark">
		<img src="/assets/icons/SealCheck.svg" alt="" aria-hidden="true" />
	</span>
	<span class="bohemcars-pdp-trustbar__text">
		<span class="bohemcars-pdp-trustbar__verdict">{trust.verdict}</span>
		<span class="bohemcars-pdp-trustbar__summary">{trust.summary}</span>
	</span>
	<span class="bohemcars-pdp-trustbar__providers">{trust.providers}</span>
	<a class="bohemcars-pdp-trustbar__link" href={resolve('/contact')}>
		{trust.reportLabel}
		<img src="/assets/icons/CaretCircleRight.svg" alt="" aria-hidden="true" />
	</a>
</aside>

<style>
	.bohemcars-pdp-trustbar {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		margin-bottom: 24px;
		padding: 14px 18px;
		border: 1px solid #e1e5dc;
		border-left: 3px solid #98bc2a;
		border-radius: 8px;
		background: #ffffff;
	}

	.bohemcars-pdp-trustbar__mark {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: #e4f0bf;
	}

	.bohemcars-pdp-trustbar__mark img {
		width: 19px;
		height: 19px;
	}

	.bohemcars-pdp-trustbar__text {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
		flex: 1 1 240px;
	}

	.bohemcars-pdp-trustbar__verdict {
		font-size: 14px;
		font-weight: 700;
		color: #14210f;
	}

	.bohemcars-pdp-trustbar__summary {
		font-size: 12.5px;
		color: #4b4b4b;
		line-height: 1.4;
	}

	.bohemcars-pdp-trustbar__providers {
		flex: 0 0 auto;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: #6f7d56;
		white-space: nowrap;
	}

	.bohemcars-pdp-trustbar__link {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 5px;
		font-size: 13px;
		font-weight: 700;
		color: #4f7012;
		white-space: nowrap;
	}

	.bohemcars-pdp-trustbar__link img {
		width: 17px;
		height: 17px;
	}

	.bohemcars-pdp-trustbar__link:hover {
		color: #14210f;
	}

	.bohemcars-pdp-trustbar__link:focus-visible {
		outline: 2px solid #98bc2a;
		outline-offset: 3px;
		border-radius: 6px;
	}

	@media (max-width: 575px) {
		.bohemcars-pdp-trustbar__providers {
			display: none;
		}
	}
</style>
