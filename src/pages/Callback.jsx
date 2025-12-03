import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

function Callback() {
    const navigate = useNavigate();
    const handleCallback = useAuthStore(state => state.handleCallback);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);

    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        console.log('[Callback] Component mounted, processing callback...');

        // Timeout de segurança para evitar tela travada
        const timeout = setTimeout(() => {
            console.error('[Callback] Timeout - redirecting to profile');
            setError('Tempo esgotado. Redirecionando...');
            navigate('/profile');
        }, 10000); // 10 segundos

        // Processar callback com delay para garantir que o hash está disponível
        const processCallback = async () => {
            try {
                const result = await handleCallback(); // Added await here as well since handleCallback is async now
                clearTimeout(timeout);
                setIsProcessing(false);

                if (result.success) {
                    console.log('[Callback] Success! Redirecting to dashboard...');
                    // Pequeno delay para mostrar mensagem de sucesso
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1000);
                } else {
                    console.error('[Callback] Failed:', result.message);
                    setError(result.message);
                    // Redirecionar para profile em caso de erro
                    setTimeout(() => {
                        navigate('/profile');
                    }, 3000);
                }
            } catch (err) {
                console.error('[Callback] Exception:', err);
                clearTimeout(timeout);
                setError('Erro ao processar autenticação');
                setTimeout(() => {
                    navigate('/profile');
                }, 3000);
            }
        };

        processCallback();

        return () => clearTimeout(timeout);
    }, [handleCallback, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
            <div className="text-center max-w-md px-4">
                {isProcessing && !error && (
                    <>
                        <div className="loader mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-white">Conectando com Spotify...</h2>
                        <p className="text-dark-text-muted mt-2">Aguarde enquanto configuramos sua conta</p>
                    </>
                )}

                {!isProcessing && !error && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                            <i className="ph-fill ph-check text-4xl text-green-400"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Conectado com sucesso!</h2>
                        <p className="text-dark-text-muted mt-2">Redirecionando...</p>
                    </>
                )}

                {error && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                            <i className="ph-fill ph-warning text-4xl text-red-400"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Erro na Conexão</h2>
                        <p className="text-red-400 mt-2">{error}</p>
                        <p className="text-dark-text-muted text-sm mt-4">Redirecionando para o perfil em alguns segundos...</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Callback;
