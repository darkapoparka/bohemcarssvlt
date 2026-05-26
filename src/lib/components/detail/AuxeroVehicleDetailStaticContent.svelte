<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
	const contactHref = resolve('/contact');
	const reviewsHref = resolve('/reviews');
</script>

{#snippet starRow()}
	<div class="flex items-center">
		<img src="/assets/icons/star-2.svg" alt="star" />
		<img src="/assets/icons/star-2.svg" alt="star" />
		<img src="/assets/icons/star-2.svg" alt="star" />
		<img src="/assets/icons/star-2.svg" alt="star" />
		<img src="/assets/icons/star-2.svg" alt="star" />
	</div>
{/snippet}

{#snippet ratingBar(label: string, width: string, percent: string)}
	<div class="rating-box__bar-item">
		<p class="rating-box__bar-label">
			<span class="text">{label}</span> <img src="/assets/icons/star-2.svg" alt="star" />
		</p>
		<div class="rating-box__bar-wrapper">
			<div class="rating-box__bar" style={`width: ${width};`}></div>
		</div>
		<span class="rating-box__bar-percent">{percent}</span>
	</div>
{/snippet}

<div class="divider mb-40 w-full"></div>

<p class="h4 mb-16">Services Calculator</p>
<form action="/calculator" class="financing-calculator mb-40">
	<div class="financing-calculator-form mb-24">
		<div class="xl2-grid-cols-2 md-grid-cols-1 grid grid-cols-4 gap-12">
			<div>
				<p class="mb-10">Car Price</p>
				<input
					class="active"
					id="ServicesCalculatorCarPrice"
					name="ServicesCalculatorCarPrice"
					type="text"
					value={detail.priceLabel}
					required
				/>
			</div>

			<div>
				<p class="mb-10">Interest Rate</p>
				<input
					id="ServicesCalculatorInterestRate"
					name="ServicesCalculatorInterestRate"
					type="text"
					value="1.2%"
					required
				/>
			</div>

			<div>
				<p class="mb-8">Loan Term (months)</p>
				<select id="ServicesCalculatorLoanTerm" name="ServicesCalculatorLoanTerm">
					<option>60 months</option>
					<option>30 months</option>
					<option>10 months</option>
				</select>
			</div>

			<div>
				<p class="mb-8">Down Payment</p>
				<input
					id="ServicesCalculatorDownPayment"
					name="ServicesCalculatorDownPayment"
					type="text"
					value="$400"
					required
				/>
			</div>
		</div>

		<button class="btn btn-medium btn-primary mb-2">Calculate</button>
	</div>

	<div class="md-grid-cols-1 grid grid-cols-3 gap-8">
		<div>
			<p class="mb-4">Monthly Payment:</p>
			<p class="font-weight-600">{detail.monthlyLabel}</p>
		</div>

		<div>
			<p class="mb-4">Total Interest Payment:</p>
			<p class="font-weight-600">Final terms on request</p>
		</div>

		<div>
			<p class="mb-4">Est. Total Loan:</p>
			<p class="font-weight-600">{detail.priceLabel}</p>
		</div>
	</div>
</form>

<div class="divider mb-40 w-full"></div>

<div class="md-flex-col md-items-start mb-16 flex items-center justify-between gap-16">
	<div>
		<p class="h4 mb-12">Location</p>
		<p class="flex items-center gap-8">
			<img class="h-16 w-16" src="/assets/icons/MapPin.svg" alt="fuel" />
			{detail.contact.address}
		</p>
	</div>

	<a href={contactHref} class="text-underline text-highlight text-sm">Get Directions</a>
</div>

<div class="widget-gg-map radius-16 mb-40 flex overflow-hidden">
	<iframe
		title="Bohemcars appointment area"
		src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s"
		height="523"
		style="border:0;width: 100%;"
		allowfullscreen
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
	></iframe>
</div>

<div class="divider mb-40 w-full"></div>

<div class="mb-16 flex items-center justify-between gap-16">
	<p class="h4">Customer Reviews</p>
</div>

<div class="rating-box mb-40">
	<div class="rating-box__content">
		<div class="rating-box__overview">
			<div class="rating-box__average">
				<span class="rating-box__score">4.8</span>
				<div class="rating-box__stars">
					<img src="/assets/icons/star-2.svg" alt="star" />
					<img src="/assets/icons/star-2.svg" alt="star" />
					<img src="/assets/icons/star-2.svg" alt="star" />
					<img src="/assets/icons/star-2.svg" alt="star" />
					<img src="/assets/icons/star-2.svg" alt="star" />
				</div>
				<p class="rating-box__count">(1,968 Ratings)</p>
			</div>
		</div>
		<div class="rating-box__distribution">
			{@render ratingBar('5', '60%', '60%')}
			{@render ratingBar('4', '20%', '20%')}
			{@render ratingBar('3', '10%', '10%')}
			{@render ratingBar('2', '7%', '7%')}
			{@render ratingBar('1', '3%', '3%')}
		</div>
		<div class="rating-box__button">
			<a href="#reviewForm" class="btn btn-primary btn-large font-weight-600 capitalize">
				Write a review
			</a>
		</div>
	</div>
</div>

<div class="comments mb-40">
	<div class="comment-box">
		<div class="comment-box__header mb-20">
			<div class="comment-box__avatar">
				<img src="/assets/images/avatar/coment-avatar-1.png" alt="avatar" />
			</div>
			<div>
				<div class="text-secondary mb-8 flex items-center gap-4">
					<p class="h5">Randynox</p>
					<span class="text-secondary text-sm">-</span>
					<span class="text-secondary text-sm">August 13, 2025</span>
				</div>
				{@render starRow()}
			</div>
		</div>
		<p class="text-secondary">
			Bought new in 2012, and it is still running strong at over 180,000 miles. I have only had to
			replace the battery and brakes once. The ride is smooth, the interior still feels solid, and
			the fuel economy has not dropped much.
		</p>
	</div>

	<div class="comment-box">
		<div class="comment-box__header mb-20">
			<div class="comment-box__avatar guest">MN</div>
			<div>
				<div class="text-secondary mb-8 flex items-center gap-4">
					<p class="h5">Mista Nyroom</p>
					<span class="text-secondary text-sm">-</span>
					<span class="text-secondary text-sm">August 22, 2025</span>
				</div>
				{@render starRow()}
			</div>
		</div>
		<p class="text-secondary">
			Picked this car up used about five years ago with 90k miles. It is now at 160k and still
			starts every morning without hesitation. Maintenance is simple, parts are cheap, and it is
			surprisingly comfortable on long drives.
		</p>
	</div>

	<div class="comment-box">
		<div class="comment-box__header mb-20">
			<div class="comment-box__avatar">
				<img src="/assets/images/avatar/coment-avatar-2.png" alt="avatar" />
			</div>
			<div>
				<div class="text-secondary mb-8 flex items-center gap-4">
					<p class="h5">Heather Dick</p>
					<span class="text-secondary text-sm">-</span>
					<span class="text-secondary text-sm">August 18, 2025</span>
				</div>
				{@render starRow()}
			</div>
		</div>
		<p class="text-secondary" id="reviewForm">
			Owned since 2010. Drove it through all kinds of weather, from hot summers to snowy roads, and
			it never let me down. A few minor repairs here and there, mostly wear and tear, but the engine
			just keeps going.
		</p>
	</div>

	<p>
		<a href={reviewsHref} class="text-underline font-weight-600 capitalize"
			>View more reviews (98)</a
		>
	</p>
</div>

<div>
	<p class="h4 mb-8 capitalize">add a review</p>
	<p class="mb-20">Your email address will not be published</p>

	<button
		class="btn btn-primary btn-large font-weight-600 open-modal capitalize"
		data-modal-id="#LoginModal"
	>
		Login to add a Review
	</button>
</div>
