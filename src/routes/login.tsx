import { createFileRoute, Link, useNavigate, redirect, useRouteContext, Router } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthHeader } from '../components/Login/AuthHeader';
import { LoginForm } from '../components/Login/LoginForm';

export const Route = createFileRoute('/login')({
    beforeLoad: ({ context }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: '/' });
        }
    },
    component: LoginComponent,
});


function LoginComponent() {
    const navigate = useNavigate();
    const { setUser, setAccessToken } = useRouteContext().auth;
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const loginPageQuery = useQuery({
        queryKey: ['loginPage'],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return {
                title: 'Welcome Back',
                subtitle: 'Sign in to your account',
            };
        },
    });

    const loginMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            if (data.email === 'error@example.com') {
                throw new Error('Invalid credentials');
            }

            const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

            return {
                success: true,
                user: { email: data.email },
                accessToken: mockAccessToken,
            };
        },
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            setUser(data.user.email);
            navigate({ to: '/' });
        },
    });

    const handleSubmit = (formData: FormData) => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        loginMutation.mutate({ email, password });
    };

    const pageData = loginPageQuery.data || { title: 'Welcome Back', subtitle: 'Sign in to your account' };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50/50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                <div className="minimal-card p-8 shadow-sm">
                    <AuthHeader title={pageData.title} subtitle={pageData.subtitle} />

                    <LoginForm
                        formData={formData}
                        setFormData={setFormData}
                        action={handleSubmit}
                        loginMutation={loginMutation}
                    />

                    <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                        <p className="text-zinc-500 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-zinc-900 font-medium hover:text-zinc-700 transition-colors"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
