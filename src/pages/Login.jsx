import { useState, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef(null);
    const formRef = useRef(null);
    const brandRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Branding Panel Animation
            gsap.fromTo(brandRef.current, 
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
            );

            // Form Items Animation (Opacity 0 se 1 forcefully)
            gsap.fromTo(".form-item", 
                { opacity: 0, y: 20 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: "power2.out",
                    delay: 0.4,
                    clearProps: "all" // Animation ke baad GSAP ki styles hata dega taaki CSS handle kare
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen grid md:grid-cols-2 bg-background text-foreground transition-colors duration-300">
            {/* LEFT SIDE - Branding */}
            <div ref={brandRef} className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden bg-card border-r border-border-custom">
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Search className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Claim Hunter</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Hunt the <span className="text-primary">Truth.</span>
                    </h1>
                    <p className="text-muted text-lg leading-relaxed">
                        Join thousands of investigators to uncover hidden connections and verify claims with precision.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-muted">
                    © 2026 Claim Hunter Inc.
                </div>
            </div>

            {/* RIGHT SIDE - Form Panel */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div ref={formRef} className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left form-item">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-muted">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {/* Email */}
                        <div className="form-item space-y-2">
                            <label className="text-sm font-medium ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-border-custom rounded-xl bg-card text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-item space-y-2">
                            <label className="text-sm font-medium ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-border-custom rounded-xl bg-card text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-danger text-sm text-center font-medium bg-danger/10 py-2 rounded-lg form-item">{error}</p>
                        )}

                        {/* Login Button with Loader */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="form-item w-full flex justify-center items-center py-3.5 px-4 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 font-semibold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm form-item pt-2">
                        <span className="text-muted">Don't have an account? </span>
                        <Link to="/signup" className="font-semibold text-primary hover:underline inline-flex items-center gap-1 group">
                            Create an account
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
