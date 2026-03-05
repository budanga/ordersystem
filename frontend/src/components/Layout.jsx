import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen dark">
            <Navbar />
            <div className="max-w-[1440px] mx-auto flex w-full flex-1">
                <Sidebar />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto pb-24 lg:pb-10">
                    {children}
                </main>
            </div>
            <MobileNav />
        </div>
    );
}
