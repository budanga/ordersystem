export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-white block">diamond</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">LuxeCore</h1>
                </div>
                <div className="flex-1 max-w-2xl">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input className="w-full bg-slate-100 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-primary rounded-xl pl-10 pr-4 py-2 text-sm transition-all placeholder:text-slate-500" placeholder="Search premium collection..." type="text" />
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white leading-none">3</span>
                    </button>
                    <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-medium text-slate-900 dark:text-white leading-none">Alex Rivera</p>
                            <p className="text-[10px] text-slate-500 font-medium">Gold Member</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-primary/30 overflow-hidden">
                            <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnX1mcWPKB3cgFDOqVOboQPr08Kw0YMm8Jo8LX-JzRADSkOQoilqGWirQm4dE_XH7QLHW65hp3dWY3MbaQz8_yU8z1w2hUABCy32gU7mEDmUtdZsszs2ZDhDJZmvzh4OsHSSAJ_xHT-oBy7s7G9x8lkiuPPGfJPScLUNc3IVKQoyVTTks-f3ffM9duUVZWY_4rswPpHMTJRV8eqTcA2XMhHsVneKJihSlVtBo0Ll35cnYkCDfBbmcBSG5tAkqjQvP1bIF47EcJnUoJ" alt="Profile avatar" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
