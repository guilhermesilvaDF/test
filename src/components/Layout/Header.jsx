import useAuthStore from '../../stores/authStore';

function Header({ title }) {
    const user = useAuthStore(state => state.user);

    return (
        <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <span className="text-white font-medium">{user?.display_name || 'User'}</span>
                    <span className="block text-sm text-gray-400">{user?.email}</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
