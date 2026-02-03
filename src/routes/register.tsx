import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/register')({
    component: RegisterComponent,
})

function RegisterComponent() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50/50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                <div className="minimal-card p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Create Account</h1>
                        <p className="text-zinc-500">Join us to get started</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-zinc-700 block"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-zinc-700 block"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-zinc-700 block"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Create a password"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                                    required
                                />
                            </div>
                            <p className="text-xs text-zinc-500">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 group">
                            Create Account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                        <p className="text-zinc-500 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-zinc-900 font-medium hover:text-zinc-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
