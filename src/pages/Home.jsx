import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import InputSection from '../components/InputSection';
import ResultsSection from '../components/ResultsSection';
import { analyzeText } from '../api/api';

export default function Home() {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null); // Add error state if needed, or use alert/toast

    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const heroRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const inputEl = inputRef.current;
            const heroEl = heroRef.current;

            // 1. Capture Final State (In-flow)
            const state = {
                parent: inputEl.parentNode,
                nextSibling: inputEl.nextSibling,
                rect: inputEl.getBoundingClientRect(),
                cssText: inputEl.style.cssText
            };

            // 2. Set Initial State (Fixed Fullscreen)
            gsap.set(inputEl, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 100,
                maxWidth: 'none',
                margin: 0,
                padding: '2rem', // Add some padding in fullscreen mode
                backgroundColor: 'var(--color-background)', // Ensure background covers everything
                borderRadius: 0
            });

            // Hide other elements initially
            gsap.set(heroEl, { opacity: 0, y: -20 });
            // Note: Navbar is handled globally/separately, but we can try to influence it if it had a ref reachable here. 
            // Since it's outside, we can target generic elements or just focus on what we have.
            // Better: Use a global class or just animate what's here.

            // 3. Animate to Final State
            const tl = gsap.timeline({
                defaults: { ease: 'power4.out' },
                onComplete: () => {
                    // Cleanup inline styles to return to pure CSS flow
                    gsap.set(inputEl, { clearProps: 'all' });
                }
            });

            tl.to(inputEl, {
                top: state.rect.top,
                left: state.rect.left,
                width: state.rect.width,
                height: state.rect.height,
                padding: '0 1.5rem', // Reset padding to match px-6 (1.5rem)
                borderRadius: '0.75rem', // Match rounded-xl
                duration: 1.2,
            })
                .to(heroEl, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, "-=0.6");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleAnalyze = async () => {
        if (!input.trim()) return;

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const data = await analyzeText(input);
            setResult(data);
            // Scroll to results
            setTimeout(() => {
                window.scrollTo({ top: 500, behavior: 'smooth' });
            }, 100);
        } catch (err) {
            console.error("Analysis failed:", err);

            if (err.status === 401) {
                // api.js might have thrown or we catch it here
                navigate('/login');
                return;
            }

            let message = "An error occurred. Please try again.";
            if (err.status === 429) {
                message = "Rate limit exceeded. Please wait a moment.";
            } else if (err.status === 503) {
                message = "AI service unavailable. Please try again later.";
            } else if (err.message) {
                message = err.message;
            }

            alert(message); // Simple alert for now as there is no Toast component visible
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef}>
            <div ref={heroRef}>
                <Hero />
            </div>

            {/* We need a specific wrapper to act as the placeholder/layout anchor if using Flip, 
          but with manual absolute/fixed calculation we just ref the element itself. */}
            <InputSection
                containerRef={inputRef}
                input={input}
                setInput={setInput}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                className="transform origin-center" // For smoother scaling if we used scale
            />

            <ResultsSection result={result} />
        </div>
    );
}
