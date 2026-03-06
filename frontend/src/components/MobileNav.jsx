import { useAppContext } from '../context/AppContext';

export function MobileNav() {
    const { activePage, setActivePage } = useAppContext();

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50">
            <button
                onClick={() => setActivePage('home')}
                className={`flex flex-col items-center gap-1 ${activePage === 'home' ? 'text-primary' : 'text-slate-500'}`}
            >
                <span className="material-symbols-outlined">home</span>
                <span className="text-[10px] font-bold">Home</span>
            </button>
            <button
                onClick={() => setActivePage('catalog')}
                className={`flex flex-col items-center gap-1 ${activePage === 'catalog' ? 'text-primary' : 'text-slate-500'}`}
            >
                <span className="material-symbols-outlined">grid_view</span>
                <span className="text-[10px] font-bold">Catalog</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
                <span className="text-[10px] font-bold">Filters</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">favorite</span>
                <span className="text-[10px] font-bold">Wishlist</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">person</span>
                <span className="text-[10px] font-bold">Profile</span>
            </button>
        </div>
    );
}
