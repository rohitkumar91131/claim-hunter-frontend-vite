import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const buttonRef = useRef(null);
    const iconRef = useRef(null);

    useLayoutEffect(() => {
        // Initial entrance if needed, or just state change reaction
    }, []);

    const handleToggle = () => {
        // Animate out
        gsap.to(iconRef.current, {
            rotate: 90,
            opacity: 0,
            scale: 0.5,
            duration: 0.2,
            onComplete: () => {
                toggleTheme();
                // Animate in (new icon)
                gsap.fromTo(iconRef.current,
                    { rotate: -90, opacity: 0, scale: 0.5 },
                    { rotate: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
                );
            }
        });
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleToggle}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 transition-colors text-foreground"
            aria-label="Toggle theme"
        >
            <div ref={iconRef}>
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
        </button>
    );
}
