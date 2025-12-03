export default function BadgeCard({ badge, unlocked }) {
    return (
        <div
            className={`p-4 rounded-lg border-2 transition-all ${unlocked
                    ? 'bg-dark-card border-accent-blue shadow-lg shadow-accent-blue/20'
                    : 'bg-dark-bg border-dark-border opacity-40'
                }`}
        >
            <div className="flex flex-col items-center text-center space-y-2">
                {/* Icon */}
                <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${unlocked
                            ? 'bg-gradient-to-br from-accent-blue to-accent-green'
                            : 'bg-dark-border'
                        }`}
                >
                    <i
                        className={`ph-fill ph-${badge.icon} text-3xl ${unlocked ? 'text-white' : 'text-dark-text-muted'
                            }`}
                    ></i>
                </div>

                {/* Name */}
                <h4
                    className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-dark-text-muted'
                        }`}
                >
                    {badge.name}
                </h4>

                {/* Description */}
                <p
                    className={`text-xs ${unlocked ? 'text-dark-text' : 'text-dark-text-muted'
                        }`}
                >
                    {badge.description}
                </p>

                {/* Locked/Unlocked Status */}
                {!unlocked && (
                    <div className="flex items-center space-x-1 text-dark-text-muted">
                        <i className="ph-fill ph-lock-simple text-xs"></i>
                        <span className="text-xs">Bloqueado</span>
                    </div>
                )}
            </div>
        </div>
    );
}
