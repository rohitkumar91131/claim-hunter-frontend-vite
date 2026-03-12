import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { BarChart2, Shield, TrendingUp, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { getDashboardStats } from '../api/api';
import ResultCard from '../components/ResultCard';

function RiskBadge({ level }) {
    const colors = {
        Low: 'bg-green-500/10 text-green-500 border-green-500/20',
        Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        High: 'bg-red-500/10 text-red-500 border-red-500/20',
        Unknown: 'bg-muted/10 text-muted border-border-custom',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[level] || colors.Unknown}`}>
            {level}
        </span>
    );
}

function StatCard({ Icon, label, value, color = 'text-primary' }) {
    return (
        <div className="bg-card rounded-xl p-6 border border-border-custom hover:border-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10`}>
                {Icon && <Icon className={`w-6 h-6 ${color}`} />}
            </div>
            <div>
                <p className="text-muted text-sm">{label}</p>
                <p className="text-foreground text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);

    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.dash-card', {
                opacity: 0,
                y: 24,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                clearProps: 'all',
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                setStatsError(err.message || 'Failed to load dashboard stats.');
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div ref={containerRef} className="container mx-auto px-6 py-12 space-y-10">
            {/* Page Header */}
            <div className="dash-card">
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted mt-1">Your claim analysis overview.</p>
            </div>

            {/* Stats Overview */}
            {statsLoading ? (
                <div className="dash-card flex items-center gap-3 text-muted">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading statistics…
                </div>
            ) : statsError ? (
                <div className="dash-card flex items-center gap-3 text-danger bg-danger/10 rounded-xl p-4 border border-danger/20">
                    <AlertTriangle className="w-5 h-5" />
                    {statsError}
                </div>
            ) : stats && (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="dash-card">
                            <StatCard Icon={BarChart2} label="Total Analyses" value={stats.total_analyses} />
                        </div>
                        <div className="dash-card">
                            <StatCard Icon={TrendingUp} label="Average Score" value={Number(stats.average_score).toFixed(1)} color="text-accent" />
                        </div>
                        <div className="dash-card">
                            <StatCard Icon={Shield} label="Low Risk" value={stats.risk_distribution.low} color="text-green-500" />
                        </div>
                        <div className="dash-card">
                            <StatCard Icon={AlertTriangle} label="High Risk" value={stats.risk_distribution.high} color="text-danger" />
                        </div>
                    </div>

                    {/* Risk Distribution */}
                    <div className="dash-card">
                        <ResultCard title="Risk Distribution" icon={Shield}>
                            <div className="space-y-3 mt-2">
                                {[
                                    { label: 'Low', count: stats.risk_distribution.low, color: 'bg-green-500' },
                                    { label: 'Medium', count: stats.risk_distribution.medium, color: 'bg-yellow-500' },
                                    { label: 'High', count: stats.risk_distribution.high, color: 'bg-red-500' },
                                ].map(({ label, count, color }) => {
                                    const pct = stats.total_analyses > 0
                                        ? Math.round((count / stats.total_analyses) * 100)
                                        : 0;
                                    return (
                                        <div key={label}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>{label}</span>
                                                <span>{count} ({pct}%)</span>
                                            </div>
                                            <div className="w-full bg-foreground/10 rounded-full h-2">
                                                <div
                                                    className={`${color} h-2 rounded-full transition-all duration-700`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ResultCard>
                    </div>

                    {/* Recent Analyses */}
                    {stats.recent_analyses.length > 0 && (
                        <div className="dash-card">
                            <ResultCard title="Recent Analyses" icon={Clock}>
                                <div className="space-y-3 mt-2">
                                    {stats.recent_analyses.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-foreground/5 rounded-lg border border-border-custom"
                                        >
                                            <p className="text-foreground/80 text-sm line-clamp-2 flex-1">{item.original_text}</p>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-muted text-xs">Score: {item.summary_score}</span>
                                                <RiskBadge level={item.overall_risk_level} />
                                                <span className="text-muted text-xs whitespace-nowrap">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ResultCard>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
