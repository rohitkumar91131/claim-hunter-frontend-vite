import { AlertTriangle, CheckCircle, Zap, ShieldAlert, FileText } from 'lucide-react';
import ResultCard from './ResultCard';
import RiskMeter from './RiskMeter';

export default function ResultsSection({ result }) {
    if (!result) return null;

    return (
        <div className="container mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Risk Score - Top Left (or spanned) */}
                <div className="md:col-span-1">
                    <ResultCard title="Risk Score" icon={ShieldAlert} color={result.summary_score > 50 ? "border-red-500/50" : "border-green-500/50"}>
                        <div className="flex justify-center">
                            <RiskMeter score={result.summary_score} />
                        </div>
                    </ResultCard>
                </div>

                {/* Verdict - Top Right / Middle */}
                <div className="md:col-span-2">
                    <ResultCard title="Summary Verdict" icon={FileText} color="border-primary/50">
                        <p className="text-lg text-foreground leading-relaxed font-light transition-colors duration-300">
                            <span className="font-bold block mb-2">{result.overall_risk_level} Risk</span>
                            {result.claims?.[0]?.reasoning || "No detailed reasoning available."}
                        </p>
                    </ResultCard>
                </div>

                {/* Claims */}
                <div className="md:col-span-1">
                    <ResultCard title="Extracted Claims" icon={CheckCircle}>
                        <ul className="space-y-3">
                            {result.claims?.map((claim, idx) => (
                                <li key={idx} className="flex gap-2 items-start text-foreground/90">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{typeof claim === 'object' ? claim.claim : claim}</span>
                                </li>
                            ))}
                        </ul>
                    </ResultCard>
                </div>

                {/* Emotional Triggers */}
                {/* Emotional Tone */}
                <div className="md:col-span-1">
                    <ResultCard title="Emotional Tone" icon={Zap}>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-full text-sm">
                                {result.emotional_tone || "Neutral"}
                            </span>
                            {result.manipulation_score > 0 && (
                                <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-sm">
                                    Manipulation Score: {result.manipulation_score}
                                </span>
                            )}
                        </div>
                    </ResultCard>
                </div>

                {/* Logical Fallacies */}
                {/* Logical Fallacies - Hidden if not present */}
                {result.logicalFallacies && result.logicalFallacies.length > 0 && (
                    <div className="md:col-span-1">
                        <ResultCard title="Logical Issues" icon={AlertTriangle}>
                            <ul className="space-y-2">
                                {result.logicalFallacies.map((fallacy, idx) => (
                                    <li key={idx} className="bg-foreground/5 p-3 rounded-lg border border-border-custom transition-colors duration-300">
                                        <span className="text-yellow-500 font-medium block text-sm mb-1">{fallacy.name}</span>
                                        <span className="text-muted text-xs">{fallacy.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </ResultCard>
                    </div>
                )}

            </div>
        </div>
    );
}
