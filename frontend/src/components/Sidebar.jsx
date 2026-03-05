export function Sidebar() {
    return (
        <aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 p-6 hidden lg:block overflow-y-auto">
            <div className="space-y-8">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Categories</h3>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input defaultChecked className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">All Collections</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">Electronics</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">Home Office</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">Wearables</span>
                        </label>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Price Range</h3>
                        <span className="text-xs font-mono text-primary">$500 - $5,000</span>
                    </div>
                    <div className="relative h-6 flex items-center">
                        <div className="absolute w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="absolute left-1/4 right-1/4 h-1 bg-primary rounded-full"></div>
                        <div className="absolute left-1/4 h-4 w-4 bg-primary border-2 border-white dark:border-background-dark rounded-full -translate-x-1/2 cursor-pointer shadow-lg shadow-primary/20"></div>
                        <div className="absolute right-1/4 h-4 w-4 bg-primary border-2 border-white dark:border-background-dark rounded-full translate-x-1/2 cursor-pointer shadow-lg shadow-primary/20"></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Status</h3>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-sm text-slate-600 dark:text-slate-300">In Stock</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input defaultChecked className="sr-only peer" type="checkbox" />
                                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Pre-order</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input className="sr-only peer" type="checkbox" />
                                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                        </label>
                    </div>
                </div>
                <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold rounded-xl hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                    Reset All Filters
                </button>
            </div>
        </aside>
    );
}
