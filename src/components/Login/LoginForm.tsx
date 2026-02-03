import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface LoginFormProps {
    action: (formData: FormData) => void;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    loginMutation: any;
}

export const LoginForm: React.FC<LoginFormProps> = ({ action, formData, setFormData, loginMutation }) => {
    const isLoading = loginMutation.isPending;

    return (
        <form className="space-y-6" action={action}>
            {loginMutation.isError && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg"
                >
                    {loginMutation.error.message}
                </motion.div>
            )}

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-700 block">
                    Email Address
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                        Password
                    </label>
                    <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing In...
                    </>
                ) : (
                    <>
                        Sign In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
};
