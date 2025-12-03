import { useEffect } from 'react';

export default function AchievementToast({ badge, points, onClose, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed top-8 right-8 z-50 animate-slide-in">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-white/20 min-w-[350px]">
                <div className="flex items-center space-x-4">
                    {/* Badge Icon */}
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className={`ph-fill ph-${badge.icon} text-4xl`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <i className="ph-fill ph-trophy text-yellow-300"></i>
                            <span className="text-xs font-bold uppercase tracking-wide">Conquista Desbloqueada!</span>
                        </div>
                        <h4 className="text-lg font-extrabold">{badge.name}</h4>
                        <p className="text-sm text-white/80">{badge.description}</p>
                        {points && (
                            <div className="mt-2 inline-flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                                <i className="ph-fill ph-star"></i>
                                <span>+{points} pontos</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
