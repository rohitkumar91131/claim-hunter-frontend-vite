import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import Hero from '../components/Hero';
import InputSection from '../components/InputSection';
import ResultsSection from '../components/ResultsSection';

export default function Home() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

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

    const handleAnalyze = () => {
        setIsLoading(true);
        setResult(null);

        // Simulate AI Processing
        setTimeout(() => {
            setResult({
                riskScore: 85,
                verdict: "This text exhibits significant indicators of misinformation. The language is highly emotive and relies on several logical fallacies without providing verifiable evidence.",
                claims: [
                    "5G towers are responsible for spreading recent viruses.",
                    "Government officials are holding secret meetings to control weather.",
                    "A new study proves that water has memory."
                ],
                emotionalTriggers: ["shocking", "deadly", "secret", "catastrophe", "hidden truth"],
                logicalFallacies: [
                    { name: "False Cause", description: "Presuming that a real or perceived relationship between things means that one is the cause of the other." },
                    { name: "Appeal to Emotion", description: "Manipulating an emotional response in place of a valid or compelling argument." }
                ]
            });
            setIsLoading(false);

            // Scroll to results
            setTimeout(() => {
                window.scrollTo({ top: 500, behavior: 'smooth' });
            }, 100);
        }, 2000);
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
