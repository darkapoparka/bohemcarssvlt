import { auxeroResponse } from '$lib/server/auxero-template';

export function GET({
	params,
	request,
	url
}: {
	params: { slug: string };
	request: Request;
	url: URL;
}) {
	return auxeroResponse('detail', {
		request,
		routePath: `inventory/${params.slug}`,
		searchParams: url.searchParams,
		slug: params.slug
	});
}
