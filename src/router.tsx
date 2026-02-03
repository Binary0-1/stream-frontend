import { createRouter } from '@tanstack/react-router';
export type AuthUser = {
    email: string;
};

export type RootLoaderData = {
    auth: AuthUser | null;
};

import { routeTree } from './routeTree.gen';

export const getRouter = () => {
    const router = createRouter({
        routeTree,
        context: ({ loaderData }: { loaderData: RootLoaderData }) => ({
            user: loaderData?.user ?? null,
            isAuthenticated: !!loaderData?.user,
        }),
        scrollRestoration: true,
        defaultPreloadStaleTime: 0,
    });

    return router;
};
