export default function ResultCard({ title, icon: Icon, children, color = "border-border-custom" }) {
    return (
        <div className={`bg-card rounded-xl p-6 border ${color} hover:border-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full`}>
            <div className="flex items-center gap-3 mb-4">
                {Icon && <Icon className="w-5 h-5 text-muted" />}
                <h3 className="font-semibold text-lg text-foreground transition-colors duration-300">{title}</h3>
            </div>
            <div className="text-muted text-sm space-y-2 transition-colors duration-300">
                {children}
            </div>
        </div>
    );
}
