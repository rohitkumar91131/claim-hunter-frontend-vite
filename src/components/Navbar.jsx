import { useState, useRef, useLayoutEffect } from 'react';
import { Search, Menu, X, LogOut, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const menuRef = useRef(null);
    const linksRef = useRef([]);
    const tl = useRef(null);

    // Desktop Hover Animation
    const handleMouseEnter = (e) => {
        if (window.innerWidth >= 1024) {
            gsap.to(e.target, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        }
    };

    const handleMouseLeave = (e) => {
        if (window.innerWidth >= 1024) {
            gsap.to(e.target, { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Create timeline paused initially
            tl.current = gsap.timeline({ paused: true })
                .to(menuRef.current, {
                    height: 'auto',
                    duration: 0.5,
                    ease: 'power3.out'
                })
                .from(linksRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'power2.out',
                }, "-=0.3");

            // Initial Page Load Animation
            gsap.from(containerRef.current, {
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    useLayoutEffect(() => {
        if (isOpen) {
            tl.current.play();
            document.body.style.overflow = 'hidden';
        } else {
            tl.current.reverse();
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogout = async () => {
        await logout();
        closeMenu();
        navigate('/login');
    };

    const linkClass = ({ isActive }) =>
        `block py-3 text-lg md:text-sm md:py-0 transition-colors duration-200 relative group ${isActive ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'}`;

    // Helper to add refs
    const addToRefs = (el) => {
        if (el && !linksRef.current.includes(el)) {
            linksRef.current.push(el);
        }
    };

    return (
        <nav ref={containerRef} className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border-custom transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="h-16 flex items-center justify-between relative z-20 bg-transparent">
                    {/* Logo */}
                    <NavLink to="/" onClick={closeMenu} className="flex items-center gap-2 group z-20">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground transition-colors duration-300">Claim Hunter</span>
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        <NavLink to="/" className={linkClass} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </NavLink>
                        <NavLink to="/how-it-works" className={linkClass} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            How It Works
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </NavLink>

                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-full border border-border-custom hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-all text-muted font-medium flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <NavLink to="/login" className="px-5 py-2 rounded-full border border-border-custom hover:bg-foreground/5 hover:border-foreground/20 transition-all text-foreground font-medium">
                                Sign In
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="lg:hidden flex items-center gap-4 z-20">
                        <ThemeToggle />
                        <button
                            onClick={toggleMenu}
                            className="text-foreground p-2 focus:outline-none relative"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                ref={menuRef}
                className="lg:hidden overflow-hidden h-0 bg-background/95 backdrop-blur-xl border-b border-border-custom absolute top-16 left-0 w-full z-10 transition-colors duration-300"
            >
                <div className="container mx-auto px-6 py-8 flex flex-col gap-4">
                    <div ref={addToRefs}>
                        <NavLink to="/" onClick={closeMenu} className="text-2xl font-bold text-muted hover:text-foreground block py-2 border-b border-border-custom transition-colors duration-300">
                            Home
                        </NavLink>
                    </div>
                    <div ref={addToRefs}>
                        <NavLink to="/how-it-works" onClick={closeMenu} className="text-2xl font-bold text-muted hover:text-foreground block py-2 border-b border-border-custom transition-colors duration-300">
                            How It Works
                        </NavLink>
                    </div>

                    {user ? (
                        <>
                            <div ref={addToRefs}>
                                <div className="text-lg font-medium text-foreground py-2 border-b border-border-custom">
                                    Signed in as: {user.email}
                                </div>
                            </div>
                            <div ref={addToRefs} className="pt-4">
                                <button onClick={handleLogout} className="block w-full text-center py-4 rounded-xl bg-danger/10 text-danger font-bold transition-colors border border-danger/30">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div ref={addToRefs} className="pt-4">
                            <NavLink to="/login" onClick={closeMenu} className="block w-full text-center py-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold transition-colors border border-border-custom">
                                Sign In
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
