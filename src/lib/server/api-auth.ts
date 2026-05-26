import { errorJson } from './api';
import {
	canAccessBohemcarsRoute,
	resolveBohemcarsApiSession,
	type BohemcarsRole,
	type BohemcarsSession
} from './auth';
import { bohemcarsRoleLabel } from './roles';

type ApiAccessOptions = {
	allowedRoles?: BohemcarsRole[];
	fallbackRole?: BohemcarsRole | string;
	request: Request;
	routePath?: string;
};

type ApiAccessResult =
	| {
			response: Response;
			session?: never;
	  }
	| {
			response?: never;
			session: BohemcarsSession;
	  };

export const requireBohemcarsApiAccess = ({
	allowedRoles,
	fallbackRole,
	request,
	routePath = ''
}: ApiAccessOptions): ApiAccessResult => {
	const session = resolveBohemcarsApiSession(request, fallbackRole);

	if (!session) {
		return { response: errorJson('Bohemcars account session is required', 401) };
	}

	if (allowedRoles && !allowedRoles.includes(session.role)) {
		return {
			response: errorJson(
				`Bohemcars ${bohemcarsRoleLabel(session.role)} role cannot access this API`,
				403
			)
		};
	}

	if (routePath && !canAccessBohemcarsRoute(session, routePath)) {
		return {
			response: errorJson('Bohemcars account role cannot access this API route', 403)
		};
	}

	return { session };
};
