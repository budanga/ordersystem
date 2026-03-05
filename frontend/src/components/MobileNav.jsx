export function MobileNav() {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50">
            <button className="flex flex-col items-center gap-1 text-primary">
                <span className="material-symbols-outlined">home</span>
                <span className="text-[10px] font-bold">Store</span>
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
