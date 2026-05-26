import { auxeroResponse } from '$lib/server/auxero-template';

export function GET({ request, url }: { request: Request; url: URL }) {
	return auxeroResponse('inventory', {
		request,
		routePath: 'inventory',
		searchParams: url.searchParams
	});
}
