import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useAppContext } from '../context/AppContext';

export function Layout({ children }) {
    const { activePage } = useAppContext();

    return (
        <div className="flex flex-col min-h-screen dark">
            <Navbar />
            <div className={`max-w-[1440px] mx-auto flex w-full flex-1 ${(activePage === 'home' || activePage === 'product-details' || activePage.startsWith('profile') || activePage === 'login' || activePage === 'register' || activePage === 'checkout') ? 'justify-center w-full' : ''}`}>
                {(activePage !== 'home' && activePage !== 'product-details' && !activePage.startsWith('profile') && activePage !== 'login' && activePage !== 'register' && activePage !== 'checkout') && <Sidebar />}
                <main className={`flex-1 p-6 lg:p-10 overflow-y-auto pb-24 lg:pb-10 ${(activePage === 'home' || activePage === 'product-details' || activePage.startsWith('profile') || activePage === 'login' || activePage === 'register' || activePage === 'checkout') ? 'max-w-[1280px] w-full' : ''}`}>
                    {children}
                </main>
            </div>
            <MobileNav />
        </div>
    );
}
