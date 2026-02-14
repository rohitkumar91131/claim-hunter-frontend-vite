export default function Hero() {
    return (
        <div className="relative pt-32 pb-16 text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-foreground via-foreground to-muted bg-clip-text text-transparent transition-colors duration-300">
                    Claim Hunter.
                </h1>
                <p className="text-xl md:text-2xl text-muted font-light tracking-wide transition-colors duration-300">
                    Hunt the Truth.
                </p>
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        </div>
    );
}
