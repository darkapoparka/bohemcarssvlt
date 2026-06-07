import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	authenticateBohemcarsUser,
	bohemcarsSessionCookieName,
	type BohemcarsRole
} from '$lib/server/auth';

const safeRedirectTo = (value: string | null) => {
	if (!value || !value.startsWith('/admin') || value.startsWith('/admin/login')) return '/admin';

	return value;
};

export const load: PageServerLoad = ({ url }) => ({
	auxeroFullPage: true,
	redirectTo: safeRedirectTo(url.searchParams.get('redirectTo'))
});

export const actions: Actions = {
	default: async ({ cookies, request, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');
		const role = String(formData.get('role') ?? 'admin') as BohemcarsRole;
		const session = authenticateBohemcarsUser({ email, password, role });

		if (!session?.token) {
			return fail(400, {
				email,
				error: 'Invalid Bohemcars staff credentials.'
			});
		}

		cookies.set(bohemcarsSessionCookieName, session.token, {
			httpOnly: true,
			maxAge: 60 * 60 * 8,
			path: '/',
			sameSite: 'lax'
		});

		redirect(303, safeRedirectTo(url.searchParams.get('redirectTo')));
	}
};
