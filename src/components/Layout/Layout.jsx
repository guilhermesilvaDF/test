import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from '../Player/Player';

function Layout() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-900/80 flex flex-col">
                <Outlet />
            </main>
            <Player />
        </div>
    );
}

export default Layout;
