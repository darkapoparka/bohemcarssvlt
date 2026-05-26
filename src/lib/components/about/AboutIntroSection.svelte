<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutContent } from '$lib/auxero/about';

	let { about }: { about: AuxeroAboutContent } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<div class="container">
	<h2>{about.intro.title}</h2>
	<div class="tf-spacing-style3"></div>
	<div class="row">
		<div class="col-lg-6">
			<div class="about-box">
				<img
					class="main-img radius-16 wow fadeIn"
					data-wow-delay="0.1s"
					src={about.assets.hero}
					alt={about.intro.mainImageAlt}
				/>
				<div class="sub-img wow fadeInUp" data-wow-delay="0.2s">
					<img src={about.intro.subImage} alt={about.intro.subImageAlt} />
				</div>
			</div>
		</div>
		<div class="col-lg-6">
			<div class="about-content">
				<h2 class="font-weight-600 mb-20">{about.intro.heading}</h2>
				<p class="text-secondary h7 line-height-28 mb-32">{about.intro.description}</p>
				<ul class="mb-32 flex flex-col gap-24">
					{#each about.intro.checklist as item (item)}
						<li class="flex gap-4">
							<img class="h-24 w-24" src="/assets/icons/check.svg" alt="check" />
							<p class="h5">{item}</p>
						</li>
					{/each}
				</ul>
				<div class="flex items-center gap-28">
					<a href={resolve('/contact')} class="btn btn-primary btn-large font-weight-600"
						>Contact Bohemcars</a
					>
					<a {...externalHref(about.contact.primaryPhoneHref)} class="flex gap-16">
						<img src="/assets/icons/PhoneCall-3.svg" alt="PhoneCall" />
						<div class="mt2">
							<span class="text-secondary text-sm">Have any question?</span>
							<p class="h4">{about.contact.primaryPhoneLabel}</p>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
