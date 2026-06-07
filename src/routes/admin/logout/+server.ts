import { clearBohemcarsRequestSession, expiredBohemcarsSessionCookie } from '$lib/server/auth';

export function POST({ request }: { request: Request }) {
	clearBohemcarsRequestSession(request);

	return new Response(null, {
		headers: {
			location: '/admin/login',
			'set-cookie': expiredBohemcarsSessionCookie()
		},
		status: 303
	});
}
