export default function ProgressBar({ current, max, percentage, showLabel = true }) {
    return (
        <div className="w-full">
            {/* Bar */}
            <div className="h-3 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div
                    className="h-full bg-gradient-to-r from-accent-blue to-accent-green transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>

            {/* Label */}
            {showLabel && (
                <div className="flex justify-between text-xs text-dark-text-muted mt-1">
                    <span>{current} pontos</span>
                    <span>{max} pontos</span>
                </div>
            )}
        </div>
    );
}
