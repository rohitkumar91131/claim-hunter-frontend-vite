import { Search, Loader2 } from 'lucide-react';

export default function InputSection({ input, setInput, onAnalyze, isLoading, containerRef, className = "" }) {
    const MAX_CHARS = 5000;

    const handleChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHARS) {
            setInput(text);
        }
    };

    return (
        <div ref={containerRef} className={`w-full max-w-3xl mx-auto px-6 ${className}`}>
            <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-card rounded-xl p-4 border border-border-custom h-full flex flex-col transition-colors duration-300">
                    <textarea
                        value={input}
                        onChange={handleChange}
                        placeholder="Paste a news article, WhatsApp forward, or social media post..."
                        className="w-full flex-grow bg-transparent text-lg resize-none focus:outline-none placeholder:text-muted/60 text-foreground font-light min-h-[12rem] transition-colors duration-300"
                        disabled={isLoading}
                    />
                    <div className="flex items-center justify-between mt-4 border-t border-border-custom pt-4 transition-colors duration-300">
                        <span className="text-xs text-gray-500">
                            {input.length} / {MAX_CHARS} characters
                        </span>
                        <button
                            onClick={onAnalyze}
                            disabled={!input.trim() || isLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Analyze Text
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
