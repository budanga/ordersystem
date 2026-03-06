import { useAppContext } from '../context/AppContext';

export function ProductCard({ product, viewMode = 'grid' }) {
    const { addToCart, viewProductDetails } = useAppContext();

    const isOut = product.stock <= 0;
    const isLow = product.stock > 0 && product.stock <= 10;

    // Dynamic styling for stock
    const stockColor = isOut ? 'bg-slate-300' : isLow ? 'bg-amber-500' : 'bg-emerald-500';
    const stockStatus = isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock';

    if (viewMode === 'list') {
        return (
            <div className={`group relative bg-white dark:bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm flex flex-row h-48 ${!isOut && 'hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5'}`}>
                <div 
                    onClick={() => viewProductDetails(product)}
                    className="relative w-48 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer"
                >
                    <img
                        className={`w-full h-full object-cover transition-transform duration-500 ${!isOut ? 'group-hover:scale-110' : 'opacity-60 grayscale'}`}
                        src={product.imageUrl || "https://placehold.co/600x600/121212/F27324?text=No+Image"}
                        alt={product.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/600x600/121212/F27324?text=No+Image";
                        }}
                    />
                    {isOut && (
                        <div className="absolute top-4 left-4">
                            <span className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                {product.category || 'General'}
                            </p>
                            <div className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${stockColor}`}></div>
                                <span className="text-[10px] text-slate-500 font-medium">{stockStatus}</span>
                            </div>
                        </div>
                        <h3 
                            onClick={() => viewProductDetails(product)}
                            className="text-xl font-bold text-slate-900 dark:text-[#F2F8FC] leading-tight mb-2 cursor-pointer hover:text-primary transition-colors"
                        >
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-0.5 mb-4">
                            <span className="material-symbols-outlined text-[16px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-xs font-bold dark:text-slate-300">4.8</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <p className={`text-2xl font-black ${isOut ? 'text-slate-400' : 'text-primary'}`}>
                            ${product.price != null ? Number(product.price).toFixed(2) : '0.00'}
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group product-card relative bg-white dark:bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm ${!isOut && 'hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5'}`}>
            <div 
                onClick={() => viewProductDetails(product)}
                className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer"
            >
                <img
                    className={`w-full h-full object-cover transition-transform duration-500 ${!isOut ? 'group-hover:scale-110' : 'opacity-60 grayscale'}`}
                    src={product.imageUrl || "https://placehold.co/600x600/121212/F27324?text=No+Image"}
                    alt={product.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x600/121212/F27324?text=No+Image";
                    }}
                />

                {isOut && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                            Sold Out
                        </span>
                    </div>
                )}

                <button className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-rose-500 transition-all">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>

            </div>
            <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {product.category || 'General'}
                    </p>
                    <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${stockColor}`}></div>
                        <span className="text-[10px] text-slate-500 font-medium">{stockStatus}</span>
                    </div>
                </div>
                <h3 
                    onClick={() => viewProductDetails(product)}
                    className="text-lg font-bold text-slate-900 dark:text-[#F2F8FC] leading-tight mb-2 truncate cursor-pointer hover:text-primary transition-colors" 
                    title={product.name}
                >
                    {product.name}
                </h3>
                <div className="flex items-center justify-between">
                    <p className={`text-xl font-black ${isOut ? 'text-slate-400' : 'text-primary'}`}>
                        ${product.price != null ? Number(product.price).toFixed(2) : '0.00'}
                    </p>
                    <div className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-xs font-bold dark:text-slate-300">4.8</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
