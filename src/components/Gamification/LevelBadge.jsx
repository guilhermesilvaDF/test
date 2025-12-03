export default function LevelBadge({ level, name, color, size = 'lg' }) {
    const sizes = {
        sm: 'w-12 h-12 text-lg',
        md: 'w-16 h-16 text-2xl',
        lg: 'w-24 h-24 text-4xl'
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            {/* Level Circle */}
            <div
                className={`${sizes[size]} rounded-full flex items-center justify-center font-extrabold text-white shadow-lg relative overflow-hidden`}
                style={{
                    background: `linear-gradient(135deg, ${color}, ${color}dd)`
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative z-10">{level}</span>
            </div>

            {/* Level Name */}
            <div className="text-center">
                <p className="text-xs text-dark-text-muted uppercase tracking-wide">Nível {level}</p>
                <p className="text-sm font-bold text-white">{name}</p>
            </div>
        </div>
    );
}
