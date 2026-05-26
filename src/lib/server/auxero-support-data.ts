import { agents } from '$lib/data/agents';
import { auxeroAboutContent } from '$lib/auxero/about';
import {
	auxeroCalculatorData,
	formatEur,
	type AuxeroCalculatorField
} from '$lib/auxero/calculator';
import { auxeroFaqGroups, supportFaqs, type AuxeroFaq } from '$lib/auxero/faqs';
import { auxeroReviewCards, type AuxeroReviewCard } from '$lib/auxero/reviews';
import { auxeroTermsSections } from '$lib/auxero/terms';
import {
	bohemcarsAssets,
	bohemcarsBrand,
	bohemcarsContact,
	bohemcarsConsultants
} from '$lib/data/bohemcars';
import { getPostBySlug, posts, type BlogPost } from '$lib/data/blog';
import { brands, vehicles } from '$lib/data/vehicles';
import type { AuxeroRenderOptions } from './auxero-listing-data';

type SupportService = {
	description: string;
	href: string;
	image: string;
	title: string;
};

const supportTemplates = new Set([
	'about-us.html',
	'blog-details-1.html',
	'blog-grid-style-1.html',
	'calculator.html',
	'clients-reviews.html',
	'faqs.html',
	'sell-your-car.html',
	'services-center.html',
	'terms.html'
]);

const serviceCards: SupportService[] = [
	{
		title: 'Import From Canada',
		description:
			'Shortlist vehicles with traceable history, clear photos, and realistic landed-cost expectations before purchase.',
		href: '/contact',
		image: '/assets/bohemcars/services/import-canada-service.png'
	},
	{
		title: 'Evaluate A Listing',
		description:
			'Review VIN, mileage, history reports, equipment, photos, and seller context before you commit.',
		href: '/compare',
		image: '/assets/bohemcars/services/evaluate-link-service.png'
	},
	{
		title: 'Sell Your Car',
		description:
			'Send vehicle details, documents, photos, and expectations so Bohemcars can advise on the right sale path.',
		href: '/sell-your-car',
		image: '/assets/bohemcars/services/sell-car-service.png'
	},
	{
		title: 'Documents And Registration',
		description:
			'Coordinate import documents, technical preparation, registration steps, and handoff details.',
		href: '/services',
		image: bohemcarsAssets.footerImage
	},
	{
		title: 'Appointment Viewings',
		description:
			'Book prepared viewings so the vehicle, documents, and consultant context are ready before arrival.',
		href: '/contact',
		image: bohemcarsAssets.hero
	},
	{
		title: 'Model Comparison',
		description:
			'Compare price, mileage, equipment, history, running costs, and import timing across several candidates.',
		href: '/compare',
		image: '/assets/bohemcars/cta/import-canada-banner-v2.png'
	}
];

const sellSteps = [
	{
		title: 'Send Vehicle Details',
		text: 'Share VIN, mileage, photos, equipment, documents, and your expected price.'
	},
	{
		title: 'Review History And Condition',
		text: 'Bohemcars reviews the information and asks for anything needed before advising.'
	},
	{
		title: 'Choose The Sale Path',
		text: 'Discuss a direct offer, assisted sale, or publishing the car as a client vehicle.'
	},
	{
		title: 'Complete The Handoff',
		text: 'Finalize documents, appointment timing, payment path, and vehicle handover.'
	}
];

const escapeHtml = (value: string | number) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const sentence = (value: string) => escapeHtml(value).replaceAll('\n', '<br>');

const stars = () =>
	Array.from({ length: 5 })
		.map(() => '<img src="/assets/icons/star-6.svg" alt="star">')
		.join('');

const checkList = (items: string[], white = false) =>
	`<ul class="list mb-32">
		${items
			.map(
				(
					item
				) => `<li class="flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start${white ? ' text-white' : ''}">
					<img src="/assets/icons/${white ? 'check-white.svg' : 'check.svg'}" alt="check">
					${escapeHtml(item)}
				</li>`
			)
			.join('\n')}
	</ul>`;

const statsGrid = () => {
	const stats = [
		{ value: String(vehicles.length), suffix: '', label: 'Bohemcars Listings' },
		{ value: String(brands.length), suffix: '', label: 'Brands In Stock' },
		{ value: '98', suffix: '%', label: 'Facebook Recommendations' },
		{ value: '157', suffix: '', label: 'Public Reviews' }
	];

	return `<div class="grid grid-cols-4 gap-130 md-grid-cols-2 counter-spacing">
		${stats
			.map(
				(
					stat,
					index
				) => `<div class="box-couter-item ${index < stats.length - 1 ? 'outline-right' : ''} wow fadeInUp" data-wow-delay="0.${index + 1}s">
					<div class="content">
						<div class="box-couter counter">
							<div class="number-content font-main-2">
								<span class="count-number font-main-2" data-to="${escapeHtml(stat.value)}" data-speed="1500" data-inviewport="yes">${escapeHtml(stat.value)}</span>${escapeHtml(stat.suffix)}
							</div>
						</div>
						<p class="font-weight-500 text-muted h7 text-center">${escapeHtml(stat.label)}</p>
					</div>
				</div>`
			)
			.join('\n')}
	</div>`;
};

const reviewCard = (review: AuxeroReviewCard) => `<div class="testimonior-box">
		<div class="flex items-center gap-4 mb-16">${stars()}</div>
		<p class="testimonior-box--desc mb-16">${sentence(review.text)}</p>
		<div class="testimonior-box--user">
			<img class="testimonior--img" src="${escapeHtml(review.avatar)}" alt="${escapeHtml(review.name)}">
			<div class="testimonior-box--user-content">
				<p class="h5 title">${escapeHtml(review.name)}</p>
				<p class="desc">${escapeHtml(review.role)}</p>
			</div>
		</div>
	</div>`;

const reviewsGrid = (limit = auxeroReviewCards.length) =>
	`<div class="grid grid-cols-3 gap-y-38 gap-x-30 lg-grid-cols-2 md-grid-cols-1 mb-40" data-bohemcars-reviews-grid>
		${auxeroReviewCards.slice(0, limit).map(reviewCard).join('\n')}
	</div>`;

const faqToggle = (faq: AuxeroFaq, index: number, forceWhite = false) =>
	`<div class="flat-toggle ${forceWhite ? 'bg-white' : ''} ${index === 0 ? 'active' : ''}">
		<div class="toggle-title ${index === 0 ? 'active' : ''}">
			<p class="h5 title">${escapeHtml(faq.question)}</p>
			<span class="icon">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M20 15L12 7L4 15" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</span>
		</div>
		<div class="toggle-content">
			<p class="h7 text-secondary line-height-28">${sentence(faq.answer)}</p>
		</div>
	</div>`;

const faqAccordion = (items: AuxeroFaq[], forceWhite = false) =>
	`<div class="flat-accordion flex flex-col gap-18 max-width-930 wow fadeIn" data-wow-delay=".3s">
		${items.map((faq, index) => faqToggle(faq, index, forceWhite)).join('\n')}
	</div>`;

const contactCtaSection = () => `<section class="relative py-100">
	<div class="overlay-parallax"></div>
	<div class="overlay image">
		<img class="lazyload parallax" data-src="${escapeHtml(bohemcarsAssets.hero)}" src="${escapeHtml(bohemcarsAssets.hero)}" alt="Bohemcars">
	</div>
	<div class="container relative index-10">
		<h2 class="mb-12 text-white capitalize">Talk To Bohemcars</h2>
		<p class="h7 line-height-28 text-white mb-20">Send the vehicle, budget, VIN, or photos and the team will prepare the next step.</p>
		<p class="mb-4 text-white">${escapeHtml(bohemcarsContact.appointmentNote)}</p>
		<p class="mb-20 text-white">${escapeHtml(bohemcarsContact.addressLabel)}</p>
		<div class="flex">
			<a href="/contact" class="btn btn-white text-primary btn-large-3 font-weight-600">Contact Bohemcars</a>
		</div>
	</div>
</section>`;

const replaceBodyAfterBreadcrumb = (html: string, body: string) => {
	const marker = '<!-- breadcrumb -->';
	const first = html.indexOf(marker);
	const second = first < 0 ? -1 : html.indexOf(marker, first + marker.length);
	const footer = html.indexOf('<footer', second > -1 ? second : 0);

	if (second < 0 || footer < 0) return html;

	return `${html.slice(0, second + marker.length)}\n\n${body}\n\n\t\t${html.slice(footer)}`;
};

const replaceFromFirstSection = (html: string, body: string) => {
	const start = html.indexOf('<section');
	const footer = html.indexOf('<footer', start);

	if (start < 0 || footer < 0) return html;

	return `${html.slice(0, start)}${body}\n\n\t\t${html.slice(footer)}`;
};

const serviceCard = (
	service: SupportService,
	index: number
) => `<div class="service-box wow fadeInUp" data-wow-delay="0.${(index % 3) + 1}s">
	<div class="mb-22 radius-16 image-effect-scale overflow-hidden">
		<img class="w-full" src="${escapeHtml(service.image)}" alt="${escapeHtml(service.title)}">
	</div>
	<a href="${escapeHtml(service.href)}" class="h4 font-weight-600 mb-8 capitalize">${escapeHtml(service.title)}</a>
	<p class="text-secondary">${sentence(service.description)}</p>
</div>`;

const consultantGrid =
	() => `<div class="grid grid-cols-4 sm-grid-cols-1 lg-grid-cols-2 gap-30 xl-gap-16">
	${agents
		.map(
			(agent) => `<div class="sale-agent-box">
				<div class="card-top mb-20">
					<a class="w-full flex" href="/agents/${escapeHtml(agent.slug)}">
						<img class="w-full" src="${escapeHtml(agent.image)}" alt="${escapeHtml(agent.name)}">
					</a>
				</div>
				<div class="card-bottom flex items-center justify-between gap-16">
					<div class="content">
						<a href="/agents/${escapeHtml(agent.slug)}" class="h5 font-weight-600 sale-agent-title">${escapeHtml(agent.name)}</a>
						<p class="text-secondary text-sm">${escapeHtml(agent.title)}</p>
					</div>
				</div>
			</div>`
		)
		.join('\n')}
</div>`;

const applySellYourCarData = (html: string) => {
	const body = `<section class="pb-100">
	<div class="container">
		<h2>Sell Your Car With Bohemcars</h2>
		<div class="tf-spacing-style3"></div>
		<div class="row">
			<div class="col-lg-6 lg-mb-40">
				<p class="mb-12 text-highlight font-weight-600 uppercase">${escapeHtml(bohemcarsBrand.tagline)}</p>
				<h2 class="font-weight-600 mb-20 capitalize mt-12">A clear route for client vehicles</h2>
				<p class="text-secondary h7 line-height-28 mb-40">Send the right information first and Bohemcars can advise whether a direct offer, assisted sale, or client listing makes sense.</p>
				<ul class="flex flex-col gap-16 mb-38">
					${[
						'VIN, mileage, history, documents, and photos reviewed together',
						'Realistic pricing feedback before the vehicle is published',
						'Appointment-based handoff with clear next steps'
					]
						.map(
							(item) => `<li class="flex gap-4">
								<img class="w-24 h-24" src="/assets/icons/check.svg" alt="check">
								<p class="h5 capitalize">${escapeHtml(item)}</p>
							</li>`
						)
						.join('\n')}
				</ul>
				<div class="flex gap-40 items-center sm-flex-col sm-items-start sm-gap-16">
					<a href="/contact" class="btn btn-primary btn-large-3 font-weight-600">Contact Bohemcars</a>
					<a href="${bohemcarsContact.primaryPhoneHref}" class="flex gap-16">
						<img src="/assets/icons/PhoneCall-3.svg" alt="PhoneCall">
						<div class="mt2">
							<span class="text-sm text-secondary">Have any question?</span>
							<p class="h4">${escapeHtml(bohemcarsContact.primaryPhoneLabel)}</p>
						</div>
					</a>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="flat-tabs about-form">
					<div class="overflow-x-auto mb-26">
						<ul class="menu-tab menu-tab-style7 large">
							<li>Vehicle Details</li>
							<li class="active">VIN And Photos</li>
						</ul>
					</div>
					<div class="content-tab visible">
						<div class="content-inner active">
							<form action="#" class="calculate-form bohemcars-sell-form" novalidate>
								<div class="grid grid-cols-1 gap-15 mb-28">
									<div>
										<p class="mb-8">VIN Number</p>
										<input class="active input-large" placeholder="Enter the VIN" id="sellVIN" name="vin" type="text" required>
									</div>
									<div>
										<p class="mb-8">Mileage</p>
										<input class="input-large" id="sellMileage" name="mileage" placeholder="Mileage in km" type="text" required>
									</div>
									<div>
										<p class="mb-8">Expected Price</p>
										<input class="input-large" id="sellPrice" name="price" placeholder="Expected price in EUR" type="text">
									</div>
									<div>
										<p class="mb-8">Contact Phone</p>
										<input class="input-large" id="sellPhone" name="phone" placeholder="${escapeHtml(bohemcarsContact.primaryPhoneLabel)}" type="tel" required>
									</div>
								</div>
								<button type="submit" class="btn btn-primary btn-large font-weight-600 w-full">Request Review</button>
								<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="tf-spacing-style3"></div>
	<div class="divider w-full"></div>
	<div class="tf-spacing-style3"></div>
	<div class="container wow fadeInUp" data-wow-delay="0.1s">
		<div class="flex justify-center mb-40"><h2>How It Works</h2></div>
		<div class="sell-your-car-box-wrapper">
			${sellSteps
				.map(
					(step, index) => `<div class="sell-your-car-box ${index === 1 ? 'active-step' : ''}">
						<p class="number">${index + 1}</p>
						<a href="/sell-your-car" class="h4 font-weight-600 mb-8">${escapeHtml(step.title)}</a>
						<p class="text-secondary text-center">${escapeHtml(step.text)}</p>
					</div>`
				)
				.join('\n')}
		</div>
	</div>
</section>
<section class="py-100 background-light">
	<div class="container">
		<div class="why-choose-us style2 style3">
			<div class="wow fadeIn" data-wow-delay="0.1s">
				<img class="move5" src="/assets/bohemcars/cta/sell-car-banner-v2.png" alt="Sell your car with Bohemcars">
			</div>
			<div class="wow fadeIn" data-wow-delay="0.2s">
				<h2 class="mb-12">Why Choose Bohemcars?</h2>
				<p class="text-muted mb-20">The team keeps client-vehicle decisions grounded in documents, condition, market position, and realistic timing.</p>
				${checkList([
					'Vehicle review based on VIN, photos, service history, and documents',
					'Direct offer, assisted sale, or client listing path when appropriate',
					'Transparent next steps before appointment or publication',
					'Local support from first request through handoff'
				])}
				<a href="/inventory" class="btn btn-primary btn-large font-weight-600 max-w-min">View Inventory</a>
			</div>
		</div>
		${statsGrid()}
	</div>
</section>
${contactCtaSection()}
<section class="background-light py-100">
	<div class="container">
		<h2 class="mb-40 text-center">Sell Your Car FAQ</h2>
		<div class="max-width-850 mx-auto w-full">${faqAccordion(
			supportFaqs.filter((faq) => ['Selling', 'Viewing', 'Documents', 'Costs'].includes(faq.topic)),
			true
		)}</div>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyServicesData = (html: string) => {
	const body = `<section class="bg-white pb-100">
	<div class="container">
		<h2>Services</h2>
		<div class="tf-spacing-style3"></div>
		<div class="grid grid-cols-2 xl-grid-cols-2 lg-grid-cols-1 gap-30">
			<div class="flex justify-center flex-col wow fadeInUp">
				<h2 class="mb-12 capitalize">Bohemcars Services Center</h2>
				<p class="mb-40 h7 line-height-28 text-secondary">Support for Canada imports, listing evaluation, documents, registration preparation, client vehicles, and appointment-based vehicle viewings.</p>
				<p class="h4 mb-20 capitalize">Our Services Include</p>
				<ul class="grid grid-cols-2 sm-grid-cols-1 gap-x-60 gap-y-8 mb-40">
					${[
						'Canada vehicle sourcing',
						'VIN and history review',
						'Carfax and document context',
						'Transport coordination',
						'Customs and VAT guidance',
						'Registration preparation',
						'Client vehicle sale review',
						'Appointment viewings',
						'Model comparison',
						'Handoff support'
					]
						.map(
							(item) => `<li class="flex items-start gap-8">
								<img src="/assets/icons/check.svg" alt="check">
								<div><p>${escapeHtml(item)}</p></div>
							</li>`
						)
						.join('\n')}
				</ul>
				<div class="flex"><a href="/contact" class="btn btn-primary btn-large-3 font-weight-600">Contact Bohemcars</a></div>
			</div>
			<div class="ml-24 flex lg-ml-0 wow fadeInUp radius-20 image-effect-scale overflow-hidden">
				<img class="w-full" src="/assets/bohemcars/cta/import-canada-banner-v2.png" alt="Bohemcars services">
			</div>
		</div>
	</div>
</section>
<section class="background-light py-100">
	<div class="container">
		<h2 class="text-center capitalize mb-12">Featured Services</h2>
		<p class="mb-40 text-center">Keep the buying, import, and sale decision practical from the first message.</p>
		<div class="grid grid-cols-3 lg-grid-cols-2 md-grid-cols-1 gap-30">
			${serviceCards.map(serviceCard).join('\n')}
		</div>
	</div>
</section>
<section class="relative py-100">
	<div class="overlay-parallax"></div>
	<div class="overlay image">
		<img class="lazyload parallax" data-src="/assets/bohemcars/proof-studio-import-handoff.png" src="/assets/bohemcars/proof-studio-import-handoff.png" alt="Bohemcars service support">
	</div>
	<div class="container relative index-10">
		<div class="grid grid-cols-2 lg-grid-cols-1 gap-30">
			<div class="services-center-info">
				<h2 class="mb-12 text-white">Contact Information</h2>
				<p class="mb-28 text-white h7 line-height-28 font-weight-500">Send a vehicle link, VIN, budget, deadline, or sale request and the right Bohemcars consultant will prepare the next step.</p>
				${checkList(
					[
						'Import and document specialists',
						'Appointment-based vehicle viewings',
						'Clear estimates before commitment',
						'Support from request through handoff'
					],
					true
				)}
				<div class="divider-vertical-style4 mb-40"></div>
				<ul class="grid grid-cols-2 lg-grid-cols-1 gap-12">
					<li class="contact gap-12">
						<div class="icon"><img src="/assets/icons/PhoneCall-2.svg" alt="phone"></div>
						<div class="flex flex-col gap-4">
							<p class="text-sm text-muted">Contact Bohemcars</p>
							<a href="${bohemcarsContact.primaryPhoneHref}" class="text-sm text-white">${escapeHtml(bohemcarsContact.primaryPhoneLabel)}</a>
							<a href="${bohemcarsContact.marketplacePhoneHref}" class="text-sm text-white">${escapeHtml(bohemcarsContact.marketplacePhoneLabel)}</a>
						</div>
					</li>
					<li class="contact gap-12">
						<div class="icon"><img src="/assets/icons/Alarm.svg" alt="hours"></div>
						<div class="flex flex-col gap-4">
							<p class="text-sm text-muted">Working Time</p>
							<span class="text-sm text-white">${escapeHtml(bohemcarsContact.appointmentNote)}</span>
							<span class="text-sm text-white">${escapeHtml(bohemcarsContact.addressLabel)}</span>
						</div>
					</li>
				</ul>
			</div>
			<div class="bg-white radius-20 services-center-form">
				<p class="h4 mb-16">Schedule A Service</p>
				<form action="#" class="send-inquiry bohemcars-service-form" novalidate>
					<div class="grid grid-cols-2 lg-grid-cols-1 gap-x-12 gap-y-24 mb-22">
						<div><p class="mb-8">Name</p><input class="active input-large" name="name" type="text" placeholder="Your name" required></div>
						<div><p class="mb-8">Email</p><input class="input-large" name="email" type="email" placeholder="${escapeHtml(bohemcarsContact.emailLabel)}" required></div>
						<div><p class="mb-8">Phone</p><input class="input-large" name="phone" type="tel" placeholder="${escapeHtml(bohemcarsContact.primaryPhoneLabel)}"></div>
						<div><p class="mb-8">Preferred Date</p><input class="input-large" name="date" type="date"></div>
						<div>
							<p class="mb-8">Service</p>
							<select class="select-style-2" name="service">
								${serviceCards.map((service) => `<option>${escapeHtml(service.title)}</option>`).join('\n')}
							</select>
						</div>
						<div><p class="mb-8">Vehicle Or VIN</p><input class="input-large" name="vehicle" type="text" placeholder="Vehicle link or VIN"></div>
					</div>
					<button class="btn btn-primary btn-large font-weight-600 w-full">Schedule Service</button>
					<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
				</form>
			</div>
		</div>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyAboutData = (html: string) => {
	const body = `<div data-bohemcars-about><section class="pb-100">
	<div class="container">
		<h2>${escapeHtml(auxeroAboutContent.intro.title)}</h2>
		<div class="tf-spacing-style3"></div>
		<div class="row">
			<div class="col-lg-6">
				<div class="about-box">
					<img class="main-img radius-16 wow fadeIn" data-wow-delay="0.1s" src="${escapeHtml(auxeroAboutContent.assets.hero)}" alt="${escapeHtml(auxeroAboutContent.intro.mainImageAlt)}">
					<div class="sub-img wow fadeInUp" data-wow-delay="0.2s"><img src="${escapeHtml(auxeroAboutContent.intro.subImage)}" alt="${escapeHtml(auxeroAboutContent.intro.subImageAlt)}"></div>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="about-content">
					<h2 class="font-weight-600 mb-20">${escapeHtml(auxeroAboutContent.intro.heading)}</h2>
					<p class="text-secondary h7 line-height-28 mb-32">${escapeHtml(auxeroAboutContent.intro.description)}</p>
					<ul class="flex flex-col gap-24 mb-32">
						${auxeroAboutContent.intro.checklist
							.map(
								(item) => `<li class="flex gap-4">
									<img class="w-24 h-24" src="/assets/icons/check.svg" alt="check">
									<p class="h5">${escapeHtml(item)}</p>
								</li>`
							)
							.join('\n')}
					</ul>
					<div class="flex gap-28 items-center">
						<a href="/contact" class="btn btn-primary btn-large font-weight-600">Contact Bohemcars</a>
						<a href="${auxeroAboutContent.contact.primaryPhoneHref}" class="flex gap-16">
							<img src="/assets/icons/PhoneCall-3.svg" alt="PhoneCall">
							<div class="mt2"><span class="text-sm text-secondary">Have any question?</span><p class="h4">${escapeHtml(auxeroAboutContent.contact.primaryPhoneLabel)}</p></div>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="tf-spacing-style5"></div>
	<section>
		<div class="container wow fadeIn" data-wow-delay="0.3s">
			<div class="title-section mb-40">
				<h2>Client Reviews</h2>
				<a href="/reviews" class="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">View All</a>
			</div>
			<div class="swiper-container swiper-testimonior">
				<div class="swiper-wrapper">
					${auxeroReviewCards
						.slice(0, 4)
						.map((review) => `<div class="swiper-slide">${reviewCard(review)}</div>`)
						.join('\n')}
				</div>
				<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-testimonior mt-35"></div>
			</div>
		</div>
	</section>
</section>
<section class="py-100 background-light">
		<div class="container">
			<div class="why-choose-us style2 style3">
			<div class="wow fadeIn" data-wow-delay="0.1s"><img class="move5" src="${escapeHtml(auxeroAboutContent.why.image)}" alt="${escapeHtml(auxeroAboutContent.why.imageAlt)}"></div>
			<div class="wow fadeIn" data-wow-delay="0.2s">
				<h2 class="mb-12">${escapeHtml(auxeroAboutContent.why.heading)}</h2>
				<p class="text-muted mb-20">${escapeHtml(auxeroAboutContent.why.description)}</p>
				${checkList(auxeroAboutContent.why.checklist)}
				<a href="/services" class="btn btn-primary btn-large font-weight-600 max-w-min">Explore Services</a>
			</div>
		</div>
		${statsGrid()}
	</div>
</section>
<div class="tf-spacing"></div>
<section>
	<h2 class="mb-40 text-center">Bohemcars Consultants</h2>
	<div class="container">${consultantGrid()}</div>
</section></div>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyReviewsData = (html: string) => {
	const body = `<section class="pb-100">
	<div class="container">
		<h2>Client Reviews</h2>
		<div class="tf-spacing-style3"></div>
		${reviewsGrid()}
		<ul class="pagination justify-center">
			<li><a href="/reviews" class="pagination__link active">1</a></li>
			<li><a href="${escapeHtml(bohemcarsContact.reviewsHref)}" class="pagination__link" target="_blank" rel="noreferrer">Facebook</a></li>
		</ul>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyFaqData = (html: string) => {
	const body = `<section class="bg-white pb-84" data-bohemcars-faqs>
	<div class="container mb-60">
		<h2>Frequently Asked Questions</h2>
		<div class="tf-spacing-style3"></div>
		<p class="h3 mb-20 text-center capitalize">Bohemcars Support</p>
		<div class="max-width-850 mx-auto w-full">${faqAccordion(supportFaqs.slice(0, 3), true)}</div>
	</div>
	${auxeroFaqGroups
		.map(
			(group) => `<div class="container mb-60">
				<p class="h3 mb-20 text-center capitalize">${escapeHtml(group.title)}</p>
				<div class="max-width-850 mx-auto w-full">${faqAccordion(group.items, true)}</div>
			</div>`
		)
		.join('\n')}
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyTermsData = (html: string) => {
	const nav = auxeroTermsSections
		.map(
			(section) => `<li><a href="#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a></li>`
		)
		.join('\n');
	const sections = auxeroTermsSections
		.map(
			(section) => `<div class="section" id="${escapeHtml(section.id)}">
				<p class="h4 mb-12 capitalize">${escapeHtml(section.title)}</p>
				${section.body
					.map((paragraph) => `<p class="text-body-style-2 mb-12">${sentence(paragraph)}</p>`)
					.join('\n')}
			</div>`
		)
		.join('\n');
	const body = `<section class="bg-white pb-100">
	<div class="container">
		<h2 class="capitalize">Bohemcars Terms Of Use</h2>
		<div class="tf-spacing-style3"></div>
		<div class="term-page" id="scrollContainer" data-bohemcars-terms>
			<div class="term-page--nav-container">
				<ul class="term-page--nav" id="sidebarSticky">${nav}</ul>
			</div>
			<div class="content">${sections}</div>
		</div>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const calculatorField = (field: AuxeroCalculatorField) =>
	`<div><p class="mb-8">${escapeHtml(field.label)}${field.mutedLabel ? ` <span class="text-muted">${escapeHtml(field.mutedLabel)}</span>` : ''}</p><input class="${field.active ? 'active ' : ''}input-large" name="${escapeHtml(field.name)}" type="number" value="${field.value}" min="${field.min}" step="${field.step}" data-bohemcars-calc-input="${escapeHtml(field.key)}"></div>`;

const applyCalculatorData = (html: string) => {
	const calculator = auxeroCalculatorData;
	const budgetLinks = [
		['Ready Stock', 'Under 20k EUR', 'highest-price'],
		['Canada Import', 'Under 30k EUR', 'best-match'],
		['Client Vehicles', 'Under 40k EUR', 'newest-listed'],
		['SUV Candidates', 'Under 60k EUR', 'newest-year'],
		['Premium Cars', 'Over 60k EUR', 'highest-price']
	];
	const body = `<section class="pb-100">
	<div class="tf-spacing-style3"></div>
	<div class="container">
		<h2 class="text-center mb-12">Import Cost Calculator</h2>
		<p class="mb-40 text-center text-secondary h7 line-height-28">Estimate the landed cost for a Canada-sourced vehicle before asking Bohemcars for a vehicle-specific breakdown.</p>
		<div class="grid grid-cols-2 gap-40 lg-grid-cols-1" data-bohemcars-calculator>
			<div class="border-box">
				<p class="h3 mb-28">Calculate Estimated Landed Cost</p>
				<form action="#" class="calculate-form" novalidate>
					<div class="grid grid-cols-1 gap-15">
						${calculator.fields.map(calculatorField).join('\n')}
					</div>
				</form>
			</div>
			<div class="border-box">
				<p class="h3 mb-8">${escapeHtml(calculator.title)}</p>
				<p class="mb-10"><span class="text-56 font-weight-600" data-bohemcars-calc-output="total">${formatEur(calculator.total)}</span></p>
				<p class="h5 mb-28 capitalize">${escapeHtml(calculator.totalNote)}</p>
				<div class="divider mb-28 w-full"></div>
				<p class="h4 mb-20">${escapeHtml(calculator.subtitle)}</p>
				<div class="flex flex-col gap-18 mb-28">
					${calculator.summaryRows
						.map(
							(row) =>
								`<p class="flex justify-between gap-8"><span class="h7 text-secondary">${escapeHtml(row.label)}</span><span class="h7" data-bohemcars-calc-output="${escapeHtml(row.key)}">${formatEur(row.value)}</span></p>`
						)
						.join('\n')}
				</div>
				<div class="divider mb-28 w-full"></div>
				<div class="flex justify-between gap-8 mb-16"><p class="h4">Estimated Total</p><p class="h4" data-bohemcars-calc-output="totalSmall">${formatEur(calculator.total)}</p></div>
				<a href="${escapeHtml(calculator.ctaHref)}" class="btn btn-primary btn-large font-weight-600 w-full">${escapeHtml(calculator.ctaLabel)}</a>
			</div>
		</div>
	</div>
	<div class="tf-spacing"></div>
	<h2 class="text-center mb-40 capitalize">Browse By Budget</h2>
	<div class="container">
		<div class="grid grid-cols-5 lg-grid-cols-3 md-grid-cols-2 smb-grid-cols-1 gap-20 mb-40 padding-box-20">
			${budgetLinks
				.map(
					([label, price, sort]) => `<div class="price-box">
						<a href="/inventory?sort=${escapeHtml(sort)}" class="h7 font-weight-500 mb-8 text-underline">${escapeHtml(label)}</a>
						<p class="h4">${escapeHtml(price)}</p>
					</div>`
				)
				.join('\n')}
		</div>
		<div class="flex justify-center"><a href="/inventory" class="btn btn-line-hover effect-line-primary btn-large font-weight-600 hover-fill-white">View Inventory</a></div>
	</div>
</section>
<section class="background-light py-100">
	<div class="container">
		<h2 class="mb-40 text-center">Calculator FAQ</h2>
		<div class="max-width-930 mx-auto w-full">${faqAccordion(
			supportFaqs.filter((faq) => ['Costs', 'Documents', 'Timing'].includes(faq.topic)),
			true
		)}</div>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const blogCard = (
	post: BlogPost
) => `<a href="/blog/${escapeHtml(post.slug)}" class="post-style-6 overflow-hidden">
	<div class="image"><img class="post--img flex" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}"></div>
	<div class="content">
		<div class="flex gap-12 justify-start mb-12">
			<span class="text-sm">by Bohemcars</span>
			<span class="text-sm">${escapeHtml(post.date)}</span>
			<span class="text-sm text-highlight uppercase text-underline">${escapeHtml(post.category)}</span>
		</div>
		<p class="h4 title mb-12">${escapeHtml(post.title)}</p>
		<p class="clamp clamp-2 text-secondary">${escapeHtml(post.excerpt)}</p>
	</div>
</a>`;

const applyBlogListData = (html: string) => {
	const body = `<section class="pb-100">
	<div class="container"><h2>Bohemcars Blog</h2></div>
	<div class="tf-spacing-style3"></div>
	<div class="container">
		<div class="grid grid-cols-3 md-grid-cols-1 gap-y-40 gap-x-30 mb-40" data-bohemcars-blog-grid>
			${posts.map(blogCard).join('\n')}
		</div>
		<ul class="pagination justify-center">
			<li><a href="/blog" class="pagination__link active">1</a></li>
			<li><a href="/contact" class="pagination__link">Ask</a></li>
		</ul>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const relatedPosts = (post: BlogPost) =>
	posts.filter((item) => item.slug !== post.slug).slice(0, 3);

const applyBlogDetailData = (html: string, options: AuxeroRenderOptions = {}) => {
	const slug = options.routePath?.split('/').filter(Boolean).pop() ?? posts[0]?.slug;
	const post = getPostBySlug(slug ?? '') ?? posts[0];
	const related = relatedPosts(post);
	const firstRelated = related[0] ?? post;
	const secondRelated = related[1] ?? post;
	const body = `<section class="blog-details-banner">
	<img class="overlay-image" src="/assets/images/blog/overlay-blogdetails.png" alt="blog-details-banner">
	<div class="breadcrumb-wrapper">
		<div class="container">
			<ul class="breadcrumb">
				<li><a class="text-white" href="/">Home</a></li>
				<li><img src="/assets/icons/right.svg" alt="chevron-right"></li>
				<li><a class="text-white" href="/blog">Blog</a></li>
				<li><img src="/assets/icons/right.svg" alt="chevron-right"></li>
				<li><span class="text-muted">${escapeHtml(post.title)}</span></li>
			</ul>
		</div>
	</div>
	<div class="image flex"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}"></div>
	<div class="content">
		<div class="container">
			<h1 class="mb-20 text-white letter-spacing-1">${escapeHtml(post.title)}</h1>
			<ul class="flex items-center flex-wrap gap-20">
				<li><a class="text-white" href="/agents">by Bohemcars</a></li>
				<li><a class="text-white" href="/blog">${escapeHtml(post.date)}</a></li>
				<li><a class="uppercase text-underline text-highlight" href="/blog">${escapeHtml(post.category)}</a></li>
			</ul>
		</div>
	</div>
</section>
<section>
	<div class="tf-spacing"></div>
	<div class="container innerpage-container">
		<div class="innerpage__content md-mb-30">
			<img class="post--img radius-20 flex mb-40" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">
			${post.content
				.map((paragraph, index) =>
					index === 1
						? `<div class="quote mb-28">
							<div class="content">
								<p class="h4 mb-14 capitalize">"Good import decisions start with documents, photos, history, and a clear next step."</p>
								<p class="h7 flex items-center gap-8"><img src="/assets/icons/line.svg" alt="quote">Bohemcars</p>
							</div>
							<img class="icon-quote" src="/assets/icons/quote.svg" alt="quote">
						</div><p class="text-secondary mb-40 h7 line-height-28">${sentence(paragraph)}</p>`
						: `<p class="h7 text-secondary mb-28 line-height-28">${sentence(paragraph)}</p>`
				)
				.join('\n')}
			<p class="h4 mb-12 capitalize">Next Step</p>
			<p class="text-secondary h7 line-height-28 mb-40">Send Bohemcars the exact vehicle link, VIN, budget, or sale request so the team can review the real case instead of working from a generic estimate.</p>
			<div class="flex justify-between mb-40 gap-16 md-flex-col">
				<ul class="blog-detail-tags flex gap-12">
					<li><p>Tag:</p></li>
					<li><a href="/blog">${escapeHtml(post.category)}</a></li>
					<li><a href="/services">Bohemcars</a></li>
				</ul>
				<ul class="blog-detail-social flex gap-12">
					<li><p>Share this post:</p></li>
					<li><a href="${escapeHtml(bohemcarsContact.facebookHref)}">Facebook</a></li>
				</ul>
			</div>
			<div class="divider mb-26"></div>
			<div class="flex justify-between mb-24 blog-detail-recentpost">
				<div class="previous">
					<p class="font-weight-600 text-highlight uppercase mb-4">Previous</p>
					<a href="/blog/${escapeHtml(firstRelated.slug)}" class="h5 font-weight-500 capitalize">${escapeHtml(firstRelated.title)}</a>
				</div>
				<div class="next">
					<p class="font-weight-600 text-highlight uppercase mb-4 text-right">Next</p>
					<a href="/blog/${escapeHtml(secondRelated.slug)}" class="h5 font-weight-500 text-right capitalize">${escapeHtml(secondRelated.title)}</a>
				</div>
			</div>
			<div class="divider mb-40"></div>
			<form action="#" class="blog-detail-comment-form bohemcars-blog-comment-form" novalidate>
				<p class="h3 mb-24 capitalize">Leave A Comment</p>
				<div class="grid grid-cols-2 gap-22 mb-16 md-grid-cols-1">
					<div class="md-col-span-2"><p class="mb-8">Your Name</p><input class="active input-large" name="name-review" type="text" placeholder="Your name" required></div>
					<div class="md-col-span-2"><p class="mb-8">Your Email</p><input class="input-large" name="email-comment" type="email" placeholder="${escapeHtml(bohemcarsContact.emailLabel)}" required></div>
					<div class="col-span-2 padding-0"><p class="mb-8">Comment</p><textarea placeholder="Write your comment here" rows="3" name="comment" class="message" required></textarea></div>
				</div>
				<label class="filter-checkbox style-2 style-3 mb-28"><input type="checkbox" name="save"><span>Save your name and email for next time</span></label>
				<button class="btn btn-primary-3 btn-large font-weight-600 capitalize">Post Comment</button>
				<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
			</form>
		</div>
		<div class="innerpage__sidebar">
			<form action="/blog" class="widget-search w-full mb-34">
				<input class="input-normal" type="text" name="q" placeholder="Search Bohemcars blog">
				<button type="submit" class="widget-search-btn"><img src="/assets/icons/search.svg" alt="Search"></button>
			</form>
			<div class="mb-32">
				<div class="listing-details--contact-dealer style-3 mb-20">
					<img src="${escapeHtml(agents[1]?.image ?? bohemcarsConsultants[1].image)}" alt="Bohemcars consultant">
					<div class="content"><a href="/agents/bohemcars-import" class="h4 mb-8 font-weight-600">Bohemcars Import</a><p class="text-secondary">Canada import consultant</p></div>
				</div>
				<p class="mb-16">Send a VIN, listing link, budget, or timeline and Bohemcars will review the exact case.</p>
			</div>
			<div class="divider mb-32 w-full"></div>
			<p class="h4 mb-16 capitalize">Recent Posts</p>
			<div class="mb-32">
				${related
					.map(
						(
							item
						) => `<a href="/blog/${escapeHtml(item.slug)}" class="recent-post overflow-hidden mb-16">
							<div class="image"><img class="post--img flex" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"></div>
							<div class="content">
								<div class="flex gap-12 md-gap-6 justify-start mb-6"><span class="text-xs">by Bohemcars</span><span class="text-xs">${escapeHtml(item.date)}</span></div>
								<p class="title h7">${escapeHtml(item.title)}</p>
							</div>
						</a><div class="divider mb-16 w-full"></div>`
					)
					.join('\n')}
			</div>
			<div class="divider mb-32 w-full"></div>
			<p class="h4 mb-18">Subscribe Newsletter</p>
			<form action="#" class="widget-search w-full mb-34 bohemcars-newsletter-form" novalidate>
				<input class="input-normal" type="email" name="email" placeholder="Email address" required>
				<button type="submit" class="widget-search-btn"><img src="/assets/icons/right.svg" alt="Subscribe"></button>
				<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
			</form>
		</div>
	</div>
</section>
<section class="py-100">
	<div class="container">
		<h2 class="mb-40">Related Posts</h2>
		<div class="grid grid-cols-3 md-grid-cols-1 gap-y-40 gap-x-30">${related.map(blogCard).join('\n')}</div>
	</div>
</section>`;

	return replaceFromFirstSection(html, body);
};

export const isSupportTemplate = (templateFile: string) => supportTemplates.has(templateFile);

export const applySupportTemplateData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	if (templateFile === 'sell-your-car.html') return applySellYourCarData(html);
	if (templateFile === 'services-center.html') return applyServicesData(html);
	if (templateFile === 'about-us.html') return applyAboutData(html);
	if (templateFile === 'clients-reviews.html') return applyReviewsData(html);
	if (templateFile === 'faqs.html') return applyFaqData(html);
	if (templateFile === 'terms.html') return applyTermsData(html);
	if (templateFile === 'calculator.html') return applyCalculatorData(html);
	if (templateFile === 'blog-grid-style-1.html') return applyBlogListData(html);
	if (templateFile === 'blog-details-1.html') return applyBlogDetailData(html, options);

	return html;
};
