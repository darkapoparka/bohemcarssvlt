import { clearBohemcarsRequestSession, expiredBohemcarsSessionCookie } from '$lib/server/auth';
import { okJson } from '$lib/server/api';

export function POST({ request }: { request: Request }) {
	const cleared = clearBohemcarsRequestSession(request);

	return okJson(
		{
			cleared,
			status: 'signed-out'
		},
		{
			headers: {
				'set-cookie': expiredBohemcarsSessionCookie()
			}
		}
	);
}
