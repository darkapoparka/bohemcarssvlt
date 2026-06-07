<script lang="ts">
	import { resolve } from '$app/paths';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import CarFront from '@lucide/svelte/icons/car-front';
	import Inbox from '@lucide/svelte/icons/inbox';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import LogOut from '@lucide/svelte/icons/log-out';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import Plus from '@lucide/svelte/icons/plus';
	import Settings from '@lucide/svelte/icons/settings';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Truck from '@lucide/svelte/icons/truck';
	import Users from '@lucide/svelte/icons/users';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	type AdminPath =
		| '/admin'
		| '/admin/agents'
		| '/admin/analytics'
		| '/admin/imports'
		| '/admin/inquiries'
		| '/admin/inventory'
		| '/admin/inventory/new'
		| '/admin/messages'
		| '/admin/posts'
		| '/admin/settings'
		| '/admin/users';

	type PrimaryAction = {
		href: AdminPath;
		label: string;
	};

	type Props = {
		activePath?: AdminPath;
		children: Snippet;
		contentClass?: string;
		eyebrow?: string;
		primaryAction?: PrimaryAction;
		sidebarVariant?: 'sidebar' | 'floating' | 'inset';
		title: string;
	};

	let {
		activePath = '/admin',
		children,
		contentClass,
		eyebrow = 'Bohemcars CMS',
		primaryAction,
		sidebarVariant = 'inset',
		title
	}: Props = $props();

	const navGroups = [
		{
			label: 'Workspace',
			items: [
				{ icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
				{ icon: CarFront, label: 'Inventory', path: '/admin/inventory' },
				{ icon: Plus, label: 'Add listing', path: '/admin/inventory/new' },
				{ icon: Inbox, label: 'Inquiries', path: '/admin/inquiries' },
				{ icon: Truck, label: 'Imports', path: '/admin/imports' },
				{ icon: MessageSquare, label: 'Messages', path: '/admin/messages' }
			]
		},
		{
			label: 'Management',
			items: [
				{ icon: Users, label: 'Agents', path: '/admin/agents' },
				{ icon: ShieldCheck, label: 'Users', path: '/admin/users' },
				{ icon: Newspaper, label: 'Posts', path: '/admin/posts' },
				{ icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
				{ icon: Settings, label: 'Settings', path: '/admin/settings' }
			]
		}
	] as const;
</script>

<main class="admin-cms dark bg-background text-foreground min-h-svh">
	<Sidebar.Provider
		style="--sidebar-width: 18rem; --header-height: 4.5rem;"
		class="bg-sidebar min-h-svh"
	>
		<Sidebar.Root collapsible="offcanvas" variant={sidebarVariant}>
			<Sidebar.Header>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg" class="data-[slot=sidebar-menu-button]:!p-1.5">
							{#snippet child({ props })}
								<a href={resolve('/admin')} {...props}>
									<span
										class="bg-primary text-primary-foreground grid size-9 place-items-center rounded-lg font-semibold"
									>
										B
									</span>
									<span class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate text-sm font-semibold">Bohemcars</span>
										<span class="text-muted-foreground truncate text-xs">Admin CMS</span>
									</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>

			<Sidebar.Content>
				{#each navGroups as group (group.label)}
					<Sidebar.Group>
						<Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each group.items as item (item.path)}
									{@const Icon = item.icon}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											isActive={item.path === activePath}
											tooltipContent={item.label}
										>
											{#snippet child({ props })}
												<a href={resolve(item.path)} {...props}>
													<Icon aria-hidden="true" />
													<span>{item.label}</span>
												</a>
											{/snippet}
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				{/each}
			</Sidebar.Content>

			<Sidebar.Footer>
				<form method="POST" action={resolve('/admin/logout')}>
					<Button variant="outline" class="w-full justify-start" type="submit">
						<LogOut data-icon="inline-start" aria-hidden="true" />
						Sign out
					</Button>
				</form>
			</Sidebar.Footer>
			<Sidebar.Rail />
		</Sidebar.Root>

		<Sidebar.Inset>
			<header
				class="bg-background/95 flex h-[var(--header-height)] shrink-0 items-center gap-3 border-b px-5 backdrop-blur lg:px-8"
			>
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-5" />
				<div class="min-w-0 flex-1">
					<p class="text-muted-foreground truncate text-xs font-medium">{eyebrow}</p>
					<h1 class="truncate text-lg font-semibold tracking-tight">{title}</h1>
				</div>
				{#if primaryAction}
					<Button href={primaryAction.href}>
						<Plus data-icon="inline-start" aria-hidden="true" />
						{primaryAction.label}
					</Button>
				{/if}
			</header>

			<div
				class={cn(
					'@container/main flex flex-1 flex-col gap-5 py-5 md:gap-7 md:py-7 [&>section]:px-5 [&>section]:lg:px-8 [&>section]:2xl:px-10',
					contentClass
				)}
			>
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</main>
