import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg">
            <p className="text-white">Redirecting to login...</p>
        </div>
    );
}