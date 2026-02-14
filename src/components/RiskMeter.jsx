export default function RiskMeter({ score }) {
    const radius = 40;
    const validScore = Number(score) || 0;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (validScore / 100) * circumference;

    // Determine color based on score
    let colorClass = "text-green-500";
    let label = "Low Risk";

    if (validScore > 30) {
        colorClass = "text-yellow-500";
        label = "Suspicious";
    }
    if (validScore > 70) {
        colorClass = "text-red-500";
        label = "Highly Misleading";
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-800"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${colorClass} transition-all duration-1000 ease-out`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${colorClass}`}>{Math.round(validScore)}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Score</span>
                </div>
            </div>
            <div className={`mt-2 font-medium ${colorClass}`}>{label}</div>
        </div>
    );
}
