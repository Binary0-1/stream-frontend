import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';
import appCss from '../styles.css?url';
const API_URL = import.meta.env.VITE_API_URL;


export const Route = createRootRoute({
    loader: async () => {
        const url = new URL('users/me', API_URL + '/');
        const res = await fetch(url, {
            credentials: 'include',
        });

        if (!res.ok) {
            return { auth: null };
        }

        return {
            auth: await res.json(),
        };
    },

    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'Stream.gg' },
        ],
        links: [{ rel: 'stylesheet', href: appCss }],
    }),

    component: RootComponent,
});

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <TanStackRouterDevtools position="bottom-right" />
                <Scripts />
            </body>
        </html>
    );
}
