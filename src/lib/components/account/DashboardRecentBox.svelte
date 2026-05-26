<script lang="ts">
	import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';

	let { recent }: { recent: AuxeroDashboardRecentData } = $props();
</script>

<div class="dashboard-box bohemcars-inquiries-box bg-white" data-bohemcars-dashboard-recent>
	<p class="h4 mb-20">{recent.heading}</p>
	<div class="comments">
		{#each recent.items as item (item.id)}
			<div class="comment-box">
				<div class="comment-box__header mb-24 gap-12">
					<div class="comment-box__avatar">
						<img src={item.avatar} alt={item.name} />
					</div>
					<div>
						<div class="text-secondary gap-4 pt-4">
							<p class="h5 mb-4">{item.name}</p>
							<p class="text-secondary text-sm">{item.dateLabel}</p>
						</div>
					</div>
				</div>
				<p class="h5 mb-12">{item.title}</p>
				<p class="h7 line-height-28">{item.body}</p>
			</div>
		{/each}
	</div>
</div>
