import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail, Lock, Check, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const containerRef = useRef(null);
    const formRef = useRef(null);
    const brandRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate branding section
            gsap.from(brandRef.current, {
                opacity: 0,
                x: -50,
                duration: 1,
                ease: "power3.out"
            });

            // Animate form section
            gsap.from(formRef.current, {
                opacity: 0,
                x: 50,
                duration: 1,
                delay: 0.2,
                ease: "power3.out"
            });

            // Stagger animation for form fields
            gsap.from(".form-item", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.5
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        // Handle login logic here
        console.log('Login:', { email, password, rememberMe });
    };

    return (
        <div ref={containerRef} className="min-h-screen grid md:grid-cols-2 bg-background">
            {/* LEFT SIDE - Branding Panel */}
            <div ref={brandRef} className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover"></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent"></div>

                {/* Logo Area */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Search className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Claim Hunter</span>
                    </div>
                </div>

                {/* Main Text */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Hunt the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Truth.</span>
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Join thousands of investigators and agencies using Claim Hunter to uncover hidden connections and verify claims with precision.
                    </p>
                </div>

                {/* Footer/Testimonial */}
                <div className="relative z-10 text-sm text-gray-500">
                    © 2024 Claim Hunter Inc.
                </div>
            </div>

            {/* RIGHT SIDE - Form Panel */}
            <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
                <div ref={formRef} className="w-full max-w-md space-y-8">
                    {/* Mobile Logo (Visible only on small screens) */}
                    <div className="md:hidden flex flex-col items-center mb-8">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                            <Search className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Claim Hunter</h2>
                        <p className="text-muted text-center">Hunt the Truth.</p>
                    </div>

                    <div className="text-center md:text-left form-item">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                        <p className="mt-2 text-muted">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {/* Email Field */}
                        <div className="form-item space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    className="block w-full pl-10 pr-3 py-3 border border-border-custom rounded-xl leading-5 bg-card text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="form-item space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full pl-10 pr-3 py-3 border border-border-custom rounded-xl leading-5 bg-card text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between form-item">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-border-custom rounded bg-card"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted">
                                    Remember for 30 days
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-blue-500 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {error && (
                            <p className="text-danger text-sm text-center form-item">{error}</p>
                        )}

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] form-item"
                        >
                            Sign in
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative form-item">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-custom"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-background text-muted">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Button */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border-custom rounded-xl shadow-sm bg-card text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors duration-200 form-item"
                    >
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M12.0003 20.4143C16.6503 20.4143 20.5503 17.2443 22.0103 12.9143H12.0003V9.7543H22.4203C22.5603 10.5543 22.6403 11.4143 22.6403 12.2943C22.6403 18.0043 17.8803 22.6543 12.0003 22.6543C6.12027 22.6543 1.35027 17.8843 1.35027 12.0043C1.35027 6.1243 6.12027 1.3543 12.0003 1.3543C14.5403 1.3543 16.8203 2.1543 18.6303 3.6543L16.2703 6.0143C15.3403 5.3043 13.8803 4.6943 12.0003 4.6943C8.07027 4.6943 4.81027 7.8443 4.81027 11.9943C4.81027 16.1443 8.07027 19.2943 12.0003 19.2943V20.4143Z"
                                fill="currentColor"
                            />
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm form-item">
                        <span className="text-muted">Don't have an account? </span>
                        <Link to="/signup" className="font-medium text-primary hover:text-blue-500 transition-colors inline-flex items-center gap-1 group">
                            Create an account
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
