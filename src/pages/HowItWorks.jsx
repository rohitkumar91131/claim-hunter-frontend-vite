import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Zap, ShieldAlert, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
    const containerRef = useRef(null);

    const steps = [
        {
            id: 1,
            title: "Text Input",
            description: "Paste any news article, social media post, or message. Our secure system handles large texts with ease, preserving privacy while preparing for deep analysis.",
            icon: FileText,
            image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1920&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Claim Extraction",
            description: "Advanced NLP algorithms instantly identify core factual statements, names, dates, and numbers, separating signal from noise.",
            icon: Search,
            image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1920&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Pattern Analysis",
            description: "We detect emotional manipulation, toxic language, and logical fallacies using deep learning models trained on millions of high-risk samples.",
            icon: Zap,
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop"
        },
        {
            id: 4,
            title: "Risk Scoring",
            description: "Get a comprehensive risk score and a clear verdict on the content's credibility, backed by explainable AI insights and confidence metrics.",
            icon: ShieldAlert,
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop"
        }
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.step-section');

            sections.forEach((section) => {
                const elems = section.querySelectorAll('.animate-fade');
                gsap.fromTo(elems,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 70%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-background text-foreground transition-colors duration-300 overflow-x-hidden">

            {/* Intro Header */}
            <header className="relative py-24 text-center bg-background border-b border-border-custom z-10">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent transition-colors duration-300">
                        How it Works
                    </h1>
                    <p className="text-xl text-muted font-light transition-colors duration-300 max-w-2xl mx-auto">
                        A transparent look at the Claim Hunter analysis pipeline. We break down misinformation layer by layer.
                    </p>
                </div>
            </header>

            {/* Steps - Zig Zag Layout */}
            <div className="py-12">
                {steps.map((step, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <section
                            key={step.id}
                            className="step-section py-24 border-b border-border-custom/50 last:border-0"
                        >
                            <div className="max-w-6xl mx-auto px-6">
                                <div className="grid md:grid-cols-2 gap-12 items-center">

                                    {/* Image Column */}
                                    <div className={`realtive animate-fade ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border-custom group">
                                            {/* Image overlay for better contrast/vibe if needed, or just pure image */}
                                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10" />
                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Text Column */}
                                    <div className={`space-y-6 animate-fade ${isEven ? 'md:order-2 pl-0 md:pl-12' : 'md:order-1 pr-0 md:pr-12'}`}>
                                        <div className="inline-flex items-center gap-3 text-primary font-mono font-bold tracking-widest uppercase opacity-80">
                                            <span className="w-8 h-px bg-primary"></span>
                                            Step 0{step.id}
                                        </div>

                                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground transition-colors duration-300">
                                            {step.title}
                                        </h2>

                                        <p className="text-lg text-muted font-light leading-relaxed transition-colors duration-300">
                                            {step.description}
                                        </p>

                                        <div className="flex items-center gap-3 pt-4 text-sm font-medium text-foreground/80">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <step.icon size={20} />
                                            </div>
                                            <span>Automated Analysis</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Final CTA Section */}
            <section className="relative py-32 bg-background border-t border-border-custom text-center transition-colors duration-300">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground transition-colors duration-300">
                        Ready to uncover the truth?
                    </h2>
                    <p className="text-xl text-muted mb-12 font-light">
                        Join thousands of users who trust Claim Hunter for rapid verification.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-lg hover:scale-105 hover:opacity-90 transition-all duration-300 shadow-xl"
                    >
                        <ArrowLeft size={24} />
                        Start Analyzing Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
