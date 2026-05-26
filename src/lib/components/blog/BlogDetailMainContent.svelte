<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroBlogDetailContent } from '$lib/auxero/blog-detail';

	let { content }: { content: AuxeroBlogDetailContent } = $props();

	let post = $derived(content.post);
	let firstRelated = $derived(content.firstRelated);
	let paragraphs = $derived(content.paragraphs);
	let secondRelated = $derived(content.secondRelated);

	const externalHref = (href: string) => ({ href });
</script>

<div class="innerpage__content md-mb-30">
	<img class="post--img radius-20 mb-40 flex" src={post.image} alt={post.title} />
	{#each paragraphs as paragraph (paragraph.id)}
		{#if paragraph.quoteBefore}
			<div class="quote mb-28">
				<div class="content">
					<p class="h4 mb-14 capitalize">
						"Good import decisions start with documents, photos, history, and a clear next step."
					</p>
					<p class="h7 flex items-center gap-8">
						<img src="/assets/icons/line.svg" alt="quote" />Bohemcars
					</p>
				</div>
				<img class="icon-quote" src="/assets/icons/quote.svg" alt="quote" />
			</div>
			<p class="text-secondary h7 line-height-28 mb-40">{paragraph.text}</p>
		{:else}
			<p class="h7 text-secondary line-height-28 mb-28">{paragraph.text}</p>
		{/if}
	{/each}
	<p class="h4 mb-12 capitalize">Next Step</p>
	<p class="text-secondary h7 line-height-28 mb-40">
		Send Bohemcars the exact vehicle link, VIN, budget, or sale request so the team can review the
		real case instead of working from a generic estimate.
	</p>
	<div class="md-flex-col mb-40 flex justify-between gap-16">
		<ul class="blog-detail-tags flex gap-12">
			<li><p>Tag:</p></li>
			<li><a href={resolve('/blog')}>{post.category}</a></li>
			<li><a href={resolve('/services')}>Bohemcars</a></li>
		</ul>
		<ul class="blog-detail-social flex gap-12">
			<li><p>Share this post:</p></li>
			<li>
				<a {...externalHref(content.facebookHref)} target="_blank" rel="noreferrer">Facebook</a>
			</li>
		</ul>
	</div>
	<div class="divider mb-26"></div>
	<div class="blog-detail-recentpost mb-24 flex justify-between">
		<div class="previous">
			<p class="font-weight-600 text-highlight mb-4 uppercase">Previous</p>
			<a href={resolve(`/blog/${firstRelated.slug}`)} class="h5 font-weight-500 capitalize">
				{firstRelated.title}
			</a>
		</div>
		<div class="next">
			<p class="font-weight-600 text-highlight mb-4 text-right uppercase">Next</p>
			<a
				href={resolve(`/blog/${secondRelated.slug}`)}
				class="h5 font-weight-500 text-right capitalize"
			>
				{secondRelated.title}
			</a>
		</div>
	</div>
	<div class="divider mb-40"></div>
	<form action="#" class="blog-detail-comment-form bohemcars-blog-comment-form" novalidate>
		<p class="h3 mb-24 capitalize">Leave A Comment</p>
		<div class="md-grid-cols-1 mb-16 grid grid-cols-2 gap-22">
			<div class="md-col-span-2">
				<p class="mb-8">Your Name</p>
				<input
					class="active input-large"
					name="name-review"
					type="text"
					placeholder="Your name"
					required
				/>
			</div>
			<div class="md-col-span-2">
				<p class="mb-8">Your Email</p>
				<input
					class="input-large"
					name="email-comment"
					type="email"
					placeholder={content.emailPlaceholder}
					required
				/>
			</div>
			<div class="padding-0 col-span-2">
				<p class="mb-8">Comment</p>
				<textarea
					placeholder="Write your comment here"
					rows="3"
					name="comment"
					class="message"
					required
				></textarea>
			</div>
		</div>
		<label class="filter-checkbox style-2 style-3 mb-28">
			<input type="checkbox" name="save" /><span>Save your name and email for next time</span>
		</label>
		<button class="btn btn-primary-3 btn-large font-weight-600 capitalize">Post Comment</button>
		<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
	</form>
</div>
